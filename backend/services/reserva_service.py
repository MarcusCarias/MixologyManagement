from sqlalchemy.orm import Session
from models import Evento,DrinksEvento,DrinkReceita,UtensilioEvento,ReservaEstoque,Estoque,Item, ListaCompra, ItemComposicao


from services.estoque_service import remover_estoque


def expandir_item(item_id: int, quantidade: float, session: Session):
    
    #perigo de loop infinito se o item compuser algum item que compoe ele mesmo

    item = session.query(Item).filter(Item.id == item_id).first()
    
    if not item:
        return []
    
    insumos = session.query(ItemComposicao).filter(ItemComposicao.item_resultado_id == item_id).all()
     
    if not insumos:
        return [{"id": item.id,"nome": item.nome,"quantidade": quantidade,"unidade": item.unidade}]
    

    resultado = []
    
    for insumo in insumos:
        
        qtd_insumo = insumo.quantidade * quantidade
        
        itens_expandidos = expandir_item(insumo.item_insumo_id, qtd_insumo, session)

        resultado.extend(itens_expandidos)
    
    return resultado


def gerar_reservas_evento(session: Session, evento: Evento):
    
    if evento.status == "CANCELADO":
        return {"status": "EVENTO_CANCELADO"}

    drinks_evento = session.query(DrinksEvento).filter(DrinksEvento.evento_id == evento.id).all()

    if not drinks_evento:
        return {"status": "SEM_CARTA_DE_DRINKS"}

    
    existe_lista_anterior = session.query(ListaCompra).filter(ListaCompra.evento_id == evento.id).all()

    if existe_lista_anterior:

        for item_lista in existe_lista_anterior:
            session.delete(item_lista)
        
        session.commit()


    necessidades: dict[int, float] = {} #item_id, quantidade

    for drink_evento in drinks_evento:
        receitas = session.query(DrinkReceita).filter(DrinkReceita.drink_id == drink_evento.drink_id).all()

        for receita in receitas:

            quantidade_total = receita.quantidade * drink_evento.quantidadePrevista
            necessidades[receita.item_id] = (necessidades.get(receita.item_id, 0) + quantidade_total)

            # itens_expandidos = expandir_item(receita.item_id, quantidade_total, session)

            # for item in itens_expandidos:
            #     insumo_id = item["id"]
            #     insumo_quantidade = item["quantidade"]
                # necessidades[insumo_id] = (necessidades.get(insumo_id, 0) + insumo_quantidade)


    utensilios = session.query(UtensilioEvento).filter(UtensilioEvento.evento_id == evento.id).all()

    for utensilio in utensilios:
        necessidades[utensilio.item_id] = (necessidades.get(utensilio.item_id, 0) + utensilio.quantidadePrevista)

    if not necessidades:
        return {"status": "SEM_ITENS"}
    
    lista_compras: dict[int, float] = {}
    itens_resposta: dict[int, dict] = {}
    estoque_cache: dict[int, float] = {}

    for item_id, quantidade in necessidades.items():
        
        estoque = session.query(Estoque).filter(Estoque.item_id == item_id).first()

        if not estoque:
            return {"status": "ESTOQUE_NAO_ENCONTRADO"}

        if estoque_cache.get(item_id) is None:
            estoque_cache[item_id] = estoque.qntAtual


        if estoque_cache[item_id] < quantidade:
            
            item = session.query(Item).filter(Item.id == item_id).first()

            faltante = quantidade - estoque_cache[item_id]
            
            estoque_cache[item_id] = 0

            itens_expandidos = expandir_item(item_id, faltante, session)

            for i in itens_expandidos:
                insumo_id = i["id"]
                insumo_quantidade = i["quantidade"]
                insumo_nome = i["nome"]

                estoque_insumo = session.query(Estoque).filter(Estoque.item_id == insumo_id).first()

                if estoque_cache.get(insumo_id) is None:
                    estoque_cache[insumo_id] = estoque_insumo.qntAtual

                if estoque_cache[insumo_id] < insumo_quantidade:
                    
                    lista_compras[insumo_id] = lista_compras.get(insumo_id, 0) + insumo_quantidade - estoque_cache[insumo_id]
                    estoque_cache[insumo_id] = 0
                    itens_resposta[insumo_id] = {"nome": insumo_nome,"quantidade_faltante": lista_compras[insumo_id]}

                

            # lista_compras[item_id] = lista_compras.get(item_id, 0) + faltante

            # itens_resposta[item_id] = {"nome": item.nome,"quantidade_faltante": lista_compras[item_id]}

            # item_nome = session.query(Item.nome).filter(Item.id == item_id).scalar()
            # raise HTTPException(status_code=400,detail=f"Estoque insuficiente para o item '{item_nome}'")

    if lista_compras:

        for item_id, quantidade_faltante in lista_compras.items():

            compra_existente = session.query(ListaCompra).filter(ListaCompra.evento_id == evento.id,ListaCompra.item_id == item_id).first()

            if compra_existente:
                compra_existente.quantidade += quantidade_faltante
            else:
                compra = ListaCompra(evento_id=evento.id,item_id=item_id,quantidade=quantidade_faltante)
                session.add(compra)

        session.commit()

        return {"status": "NECESSITA_COMPRA","message": "Estoque insuficiente para alguns itens","itens_para_compra": itens_resposta}

       

    for item_id, quantidade in necessidades.items():

        reserva_existente = session.query(ReservaEstoque).filter(ReservaEstoque.item_id == item_id,ReservaEstoque.evento_id == evento.id).first()

        if reserva_existente:
            return {"status": "RESERVA_JA_EXISTE"}

        reserva = ReservaEstoque(item_id=item_id, evento_id=evento.id, quantidadeReservada=quantidade)

        reserva.status = "ATIVA"

        session.add(reserva)
        remover_estoque(session, item_id, quantidade)

    session.commit()
    
    return {"status": "RESERVADO"}


