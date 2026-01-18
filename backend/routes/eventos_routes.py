from fastapi import APIRouter, Depends, HTTPException
from models import Evento, Usuario, Drink, DrinksEvento, Item, UtensilioEvento, ReservaEstoque, Estoque, ListaCompra
from dependencies import pegar_sessao, verificar_token
from sqlalchemy.orm import Session
from schemas import EventoSchema, EventoUpdateSchema, DrinkEventoSchema, UtensilioSchema
from services.reserva_service import gerar_reservas_evento

eventos_router = APIRouter(prefix="/eventos", tags=["eventos"], dependencies=[Depends(verificar_token)])

@eventos_router.get("/")
async def eventos():
    return {"message": "Voce acessou a rota de eventos"}

@eventos_router.post("/cadastro")
async def cadastra_evento(evento_schema: EventoSchema, session: Session = Depends(pegar_sessao), usuario_criador: Usuario = Depends(verificar_token)):
    
    if not (usuario_criador.papel == "ADMIN" or usuario_criador.papel == "PLANEJADOR"):
        raise HTTPException(status_code=403, detail="Apenas usuários com papel de ADMIN ou PLANEJADOR podem cadastrar eventos")
    
    novo_evento = Evento(evento_schema.nome, evento_schema.dataEvento, evento_schema.numConvidados,evento_schema.tipoEvento)
    session.add(novo_evento)
    session.commit()

    return {"message": f"Evento {novo_evento.id} cadastrado com sucesso"}

@eventos_router.get("/listar")
async def listar_eventos(session: Session = Depends(pegar_sessao), usuario_criador: Usuario = Depends(verificar_token)):

    if not (usuario_criador.papel == "ADMIN" or usuario_criador.papel == "PLANEJADOR"):
        raise HTTPException(status_code=403, detail="Apenas usuários com papel de ADMIN ou PLANEJADOR podem visualizar eventos")

    eventos = session.query(Evento).all()

    return {"eventos": eventos}



@eventos_router.get("/{id_evento}")
async def listar_eventos(id_evento: int, session: Session = Depends(pegar_sessao), usuario_criador: Usuario = Depends(verificar_token)):

    if not (usuario_criador.papel == "ADMIN" or usuario_criador.papel == "PLANEJADOR"):
        raise HTTPException(status_code=403, detail="Apenas usuários com papel de ADMIN ou PLANEJADOR podem visualizar eventos")

    evento = session.query(Evento).filter(Evento.id == id_evento).first()

    if not evento:
        raise HTTPException(status_code=400, detail="Evento não encontrado")

    return {"evento": evento}

@eventos_router.post("/{id_evento}/cancelar")
async def cancelar_evento(id_evento: int, session: Session = Depends(pegar_sessao), usuario_criador: Usuario = Depends(verificar_token)):

    if not (usuario_criador.papel == "ADMIN" or usuario_criador.papel == "PLANEJADOR"):
        raise HTTPException(status_code=403, detail="Apenas usuários com papel de ADMIN ou PLANEJADOR podem cancelar eventos")

    evento = session.query(Evento).filter(Evento.id == id_evento).first()

    if not evento:
        raise HTTPException(status_code=400, detail="Evento não encontrado")

    if evento.status == "CANCELADO":
        raise HTTPException(status_code=400, detail="Evento já está cancelado")
    

    reservas = session.query(ReservaEstoque).filter(ReservaEstoque.evento_id == evento.id, ReservaEstoque.status == "ATIVA").all()
    
    for reserva in reservas:
        # devolver estoque
        estoque = session.query(Estoque).filter(Estoque.item_id == reserva.item_id).first()
        
        if estoque:
            estoque.qntAtual += reserva.quantidadeReservada
        
        reserva.status = "CANCELADA"
        session.add(reserva)

    # --- Cancelar lista de compras ---
    lista_compra = session.query(ListaCompra).filter(ListaCompra.evento_id == evento.id).all()
    
    for item in lista_compra:
        session.delete(item)


    evento.status = "CANCELADO"
    session.commit()

    return {"message": f"Evento {evento.id} cancelado", "evento": evento}

@eventos_router.patch("/{id_evento}/atualizar")
async def atualizar_evento(id_evento: int, dados: EventoUpdateSchema, session: Session = Depends(pegar_sessao), usuario_criador: Usuario = Depends(verificar_token)):

    if not (usuario_criador.papel == "ADMIN" or usuario_criador.papel == "PLANEJADOR"):
        raise HTTPException(status_code=403, detail="Apenas usuários com papel de ADMIN ou PLANEJADOR podem atualizar eventos")

    evento = session.query(Evento).filter(Evento.id == id_evento).first()

    if not evento:
        raise HTTPException(status_code=400, detail="Evento não encontrado")
    
    
    for campo, valor in dados.model_dump(exclude_unset=True).items():
        setattr(evento, campo, valor)

    session.commit()
    session.refresh(evento)

    return {"message": f"Evento {evento.id} atualizado com sucesso", "evento": evento}



@eventos_router.post("/{id_evento}/drinks/adicionar")
async def adicionar_drink_evento(id_evento: int, drink_schema: DrinkEventoSchema, session: Session = Depends(pegar_sessao), usuario_criador: Usuario = Depends(verificar_token)):
     
    if not (usuario_criador.papel == "ADMIN" or usuario_criador.papel == "PLANEJADOR"):
        raise HTTPException(status_code=403, detail="Apenas usuários com papel de ADMIN ou PLANEJADOR podem adicionar drinks aos eventos")
    
    evento = session.query(Evento).filter(Evento.id == id_evento).first()

    if not evento:
        raise HTTPException(status_code=400, detail="Evento não encontrado")
   
    if evento.status == "CANCELADO":
        raise HTTPException(status_code=400, detail="Não é possível adicionar drinks a um evento cancelado")

    drink = session.query(Drink).filter(Drink.id == drink_schema.drink_id).first()
    
    if not drink:
        raise HTTPException(status_code=404, detail="Drink não encontrado")
    
    if not drink.ativo:
        raise HTTPException(status_code=400, detail="Drink inativo não pode ser adicionado ao evento")

    existente = session.query(DrinksEvento).filter(DrinksEvento.evento_id == id_evento, DrinksEvento.drink_id == drink_schema.drink_id).first()

    if existente:
        raise HTTPException(status_code=400,detail="Drink já foi adicionado a este evento")
    
    drink_evento = DrinksEvento(evento_id=id_evento,drink_id=drink_schema.drink_id,quantidadePrevista=drink_schema.quantidadePrevista)

    session.add(drink_evento)
    session.commit()
    session.refresh(drink_evento)

    return {"message": f"Drink {drink_evento.id} adicionado com sucesso", "drink": drink_evento}

@eventos_router.get("/{id_evento}/drinks")
async def drink_evento(id_evento: int, session: Session = Depends(pegar_sessao), usuario_criador: Usuario = Depends(verificar_token)):
     
    if not (usuario_criador.papel == "ADMIN" or usuario_criador.papel == "PLANEJADOR"):
        raise HTTPException(status_code=403, detail="Apenas usuários com papel de ADMIN ou PLANEJADOR podem visualizar drinks dos eventos")
    
    evento = session.query(Evento).filter(Evento.id == id_evento).first()

    if not evento:
        raise HTTPException(status_code=400, detail="Evento não encontrado")
   
    drinks = session.query(DrinksEvento).filter(DrinksEvento.evento_id == id_evento).all()
    
    if not drinks:
        raise HTTPException(status_code=400, detail="Nenhum drink encontrado para este evento")
    
    return {"drinks": drinks}

@eventos_router.post("/{id_drink_evento}/drinks/remover")
async def remove_drink_evento(id_drink_evento: int, session: Session = Depends(pegar_sessao), usuario_criador: Usuario = Depends(verificar_token)):
    
    if not (usuario_criador.papel == "ADMIN" or usuario_criador.papel == "PLANEJADOR"):
        raise HTTPException(status_code=403, detail="Apenas usuários com papel de ADMIN ou PLANEJADOR podem remover drinks dos eventos")
    
    
    drink_evento = session.query(DrinksEvento).filter(DrinksEvento.id == id_drink_evento).first()
    evento_id = drink_evento.evento_id

    if not drink_evento:
        raise HTTPException(status_code=400, detail="Drink do evento não encontrado")
    

    drinkNome = session.query(Drink).filter(Drink.id == drink_evento.drink_id).first().nome
    eventoNome = session.query(Evento).filter(Evento.id == evento_id).first().nome
   
    session.delete(drink_evento)
    session.commit()

    drinks = session.query(DrinksEvento).filter(DrinksEvento.evento_id == evento_id).all()
    

    return {"message": f"Drink {drinkNome} removido com sucesso do evento {eventoNome}",
            "drinks_evento": drinks}



@eventos_router.post("/{id_evento}/utensilios/adicionar")
async def adicionar_utensilio_evento(id_evento: int, utensilio_schema: UtensilioSchema, session: Session = Depends(pegar_sessao), usuario_criador: Usuario = Depends(verificar_token)):
     
    if not (usuario_criador.papel == "ADMIN" or usuario_criador.papel == "PLANEJADOR"):
        raise HTTPException(status_code=403, detail="Apenas usuários com papel de ADMIN ou PLANEJADOR podem adicionar utensilios aos eventos")
    
    evento = session.query(Evento).filter(Evento.id == id_evento).first()

    if not evento:
        raise HTTPException(status_code=400, detail="Evento não encontrado")
   
    if evento.status == "CANCELADO":
        raise HTTPException(status_code=400, detail="Não é possível adicionar utensilios a um evento cancelado")


    utensilio = session.query(Item).filter(Item.id == utensilio_schema.item_id).first()
    
    if not utensilio:
        raise HTTPException(status_code=404, detail="Item não encontrado")

    if not utensilio.ativo:
        raise HTTPException(status_code=400, detail="Item inativo não pode ser adicionado ao evento")

    existente = session.query(UtensilioEvento).filter(UtensilioEvento.evento_id == id_evento, UtensilioEvento.item_id == utensilio_schema.item_id).first()

    if existente:
        raise HTTPException(status_code=400,detail="Utensílio já foi adicionado a este evento")
    
    utensilio_evento = UtensilioEvento(evento_id=id_evento,item_id=utensilio_schema.item_id,quantidadePrevista=utensilio_schema.quantidadePrevista)

    session.add(utensilio_evento)
    session.commit()
    session.refresh(utensilio_evento)

    return {"message": f"Utensílio {utensilio_evento.id} adicionado com sucesso", "utensilio": utensilio_evento}



@eventos_router.post("/{id_evento}/reservas/criar")
async def reserva_itens(id_evento: int, session: Session = Depends(pegar_sessao), usuario_criador: Usuario = Depends(verificar_token)):
     
    if not (usuario_criador.papel == "ADMIN" or usuario_criador.papel == "PLANEJADOR"):
        raise HTTPException(status_code=403, detail="Apenas usuários com papel de ADMIN ou PLANEJADOR podem gerar reservas no estoque")
    
    evento = session.query(Evento).filter(Evento.id == id_evento).first()

    if not evento:
        raise HTTPException(status_code=400, detail="Evento não encontrado")

    if evento.status == "CANCELADO":
        raise HTTPException(status_code=400, detail="Não é possível gerar reservas para um evento cancelado")
    

    reserva = gerar_reservas_evento(session, evento)

    if reserva["status"] == "SEM_ITENS":
        raise HTTPException(status_code=400, detail="Evento não possui itens para reserva")

    if reserva["status"] == "RESERVA_JA_EXISTE":
        raise HTTPException(status_code=400, detail="Já existem reservas para este evento")
    
    if reserva["status"] == "ESTOQUE_NAO_ENCONTRADO":
        raise HTTPException(status_code=400, detail="Estoque do item não encontrado")

    if reserva["status"] == "NECESSITA_COMPRA":
        return reserva

    return {"message": "Reservas criadas com sucesso"}

@eventos_router.get("/{id_evento}/reservas")
async def visualizar_reservas(id_evento: int, session: Session = Depends(pegar_sessao), usuario_criador: Usuario = Depends(verificar_token)):
     
    if not (usuario_criador.papel == "ADMIN" or usuario_criador.papel == "PLANEJADOR"):
        raise HTTPException(status_code=403, detail="Apenas usuários com papel de ADMIN ou PLANEJADOR podem visualizar reservas no estoque")
    
    evento = session.query(Evento).filter(Evento.id == id_evento).first()

    if not evento:
        raise HTTPException(status_code=400, detail="Evento não encontrado")

    if evento.status == "CANCELADO":
        raise HTTPException(status_code=400, detail="Não é possível visualizar reservas para um evento cancelado")
    

    reserva = session.query(ReservaEstoque).filter(ReservaEstoque.evento_id == evento.id).all()

    if not reserva:
        raise HTTPException(status_code=400, detail="Nenhuma reserva encontrada para este evento")
    

    return {"message": "Reservas encontradas com sucesso", "reservas": reserva}

    
    
  
   
   