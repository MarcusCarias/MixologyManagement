from fastapi import APIRouter, Depends, HTTPException
from dependencies import pegar_sessao, verificar_token
from models import Drink, Usuario, DrinkReceita, Item
from schemas import DrinkSchema, DrinkUpdateSchema, ReceitaDrinkSchema
from sqlalchemy.orm import Session


drinks_router = APIRouter(prefix="/drinks", tags=["drinks"], dependencies=[Depends(verificar_token)])


@drinks_router.get("/")
async def drinks():
    return {"message": "Voce acessou a rota de drinks"}

@drinks_router.post("/cadastro")
async def cadastra_drink(drink_schema: DrinkSchema, session: Session = Depends(pegar_sessao), usuario_criador: Usuario = Depends(verificar_token)):
    
    if not (usuario_criador.papel == "ADMIN" or usuario_criador.papel == "PLANEJADOR"):
        raise HTTPException(status_code=403, detail="Apenas usuários com papel de ADMIN ou PLANEJADOR podem cadastrar eventos")
    
    
    drink = session.query(Drink).filter(Drink.nome == drink_schema.nome).first()

    if drink:
        raise HTTPException(status_code=400, detail="Drink já cadastrado")
    

    novo_drink = Drink(drink_schema.nome, drink_schema.categoria, drink_schema.ativo)
    session.add(novo_drink)
    session.commit()

    return {"message": f"Drink {novo_drink.id, novo_drink.nome} cadastrado com sucesso"}

@drinks_router.get("/listar")
async def listar_drinks(session: Session = Depends(pegar_sessao), usuario_criador: Usuario = Depends(verificar_token)):

    if not (usuario_criador.papel == "ADMIN" or usuario_criador.papel == "PLANEJADOR"):
        raise HTTPException(status_code=403, detail="Apenas usuários com papel de ADMIN ou PLANEJADOR podem visualizar drinks")

    drinks = session.query(Drink).all()

    return {"drinks": drinks}

@drinks_router.get("/{id_drink}")
async def listar_drink(id_drink: int, session: Session = Depends(pegar_sessao), usuario_criador: Usuario = Depends(verificar_token)):

    if not (usuario_criador.papel == "ADMIN" or usuario_criador.papel == "PLANEJADOR"):
        raise HTTPException(status_code=403, detail="Apenas usuários com papel de ADMIN ou PLANEJADOR podem visualizar drinks")

    drink = session.query(Drink).filter(Drink.id == id_drink).first()

    if not drink:
        raise HTTPException(status_code=400, detail="Drink não encontrado")

    return {"drink": drink}

@drinks_router.patch("/{id_drink}/atualizar")
async def atualizar_drink(id_drink: int, dados: DrinkUpdateSchema, session: Session = Depends(pegar_sessao), usuario_criador: Usuario = Depends(verificar_token)):

    if not (usuario_criador.papel == "ADMIN" or usuario_criador.papel == "PLANEJADOR"):
        raise HTTPException(status_code=403, detail="Apenas usuários com papel de ADMIN ou PLANEJADOR podem atualizar drinks")

    drink = session.query(Drink).filter(Drink.id == id_drink).first()

    if not drink:
        raise HTTPException(status_code=400, detail="Drink não encontrado")
    
    
    for campo, valor in dados.model_dump(exclude_unset=True).items():
        setattr(drink, campo, valor)

    session.commit()
    session.refresh(drink)

    return {"message": f"Drink {drink.id} atualizado com sucesso", "drink": drink}

@drinks_router.post("/{id_drink}/receita/adicionar")
async def cadastra_item_receita(id_drink: int, receita_drink_schema: ReceitaDrinkSchema, session: Session = Depends(pegar_sessao), usuario_criador: Usuario = Depends(verificar_token)):
    
    if not (usuario_criador.papel == "ADMIN" or usuario_criador.papel == "PLANEJADOR"):
        raise HTTPException(status_code=403, detail="Apenas usuários com papel de ADMIN ou PLANEJADOR podem cadastrar receitas de drinks")
    
    
    drink = session.query(Drink).filter(Drink.id == id_drink).first()

    if not drink:
        raise HTTPException(status_code=400, detail="Drink não encontrado")
    
    item = session.query(Item).filter(Item.id == receita_drink_schema.item_id).first()

    if not item:
        raise HTTPException(status_code=400, detail="Item não encontrado")

    novo_drink = session.query(DrinkReceita).filter(DrinkReceita.drink_id == id_drink, DrinkReceita.item_id == receita_drink_schema.item_id).first()

    if novo_drink:
        raise HTTPException(status_code=400, detail="Item da receita já cadastrado para este drink")
    

    novo_drink = DrinkReceita(id_drink, receita_drink_schema.item_id, receita_drink_schema.quantidade, receita_drink_schema.unidade)
    session.add(novo_drink)
    session.commit()


    return {"message": f"Item {novo_drink.item_id} adicionado a receita de {novo_drink.drink_id} com sucesso"}

@drinks_router.get("/{id_drink}/receita")
async def busca_receita(id_drink: int, session: Session = Depends(pegar_sessao), usuario_criador: Usuario = Depends(verificar_token)):
    
    if not (usuario_criador.papel == "ADMIN" or usuario_criador.papel == "PLANEJADOR" or usuario_criador.papel == "OPERADOR_COZINHA"):
        raise HTTPException(status_code=403, detail="Apenas usuários com papel de ADMIN, PLANEJADOR ou OPERADOR_COZINHA podem visualizar receitas de drinks")

    
    drink = session.query(Drink).filter(Drink.id == id_drink).first()

    if not drink:
        raise HTTPException(status_code=400, detail="Drink não encontrado")
    
    receita = session.query(DrinkReceita).filter(DrinkReceita.drink_id == id_drink).all()

    receita_ajustada = []

    for item_receita in receita:
        item = session.query(Item).filter(Item.id == item_receita.item_id).first()
        receita_ajustada.append({
            "item_nome": item.nome,
            "quantidade": item_receita.quantidade,
            "unidade": item_receita.unidade
        })

    return {"message": f"Receita do drink {drink.nome}:", "receita": receita_ajustada}

@drinks_router.post("/{id_item_receita}/receita/remover")
async def remove_item_receita(id_item_receita: int, session: Session = Depends(pegar_sessao), usuario_criador: Usuario = Depends(verificar_token)):
    
    if not (usuario_criador.papel == "ADMIN" or usuario_criador.papel == "PLANEJADOR"):
        raise HTTPException(status_code=403, detail="Apenas usuários com papel de ADMIN ou PLANEJADOR podem cadastrar receitas de drinks")
    
    
    drink_receita = session.query(DrinkReceita).filter(DrinkReceita.id == id_item_receita).first()

    if not drink_receita:
        raise HTTPException(status_code=400, detail="Item da receita não encontrado")
    

    itemNome = session.query(Item).filter(Item.id == drink_receita.item_id).first().nome
    drinkNome = session.query(Drink).filter(Drink.id == drink_receita.drink_id).first().nome

    session.delete(drink_receita)
    session.commit()


    return {"message": f"Item {itemNome} removido da receita com sucesso do {drinkNome}",
            "drink_receita": drink_receita}
