from fastapi import APIRouter, Depends, HTTPException
from dependencies import pegar_sessao, verificar_token
from models import Item, Usuario, ItemComposicao, Estoque
from schemas import ItemSchema, ItemUpdateSchema, ItemCompostoSchema
from sqlalchemy.orm import Session


itens_router = APIRouter(prefix="/itens", tags=["itens"], dependencies=[Depends(verificar_token)])


@itens_router.get("/")
async def itens():
    return {"message": "Voce acessou a rota de itens"}

@itens_router.post("/cadastrar")
async def cadastra_item(item_schema: ItemSchema, session: Session = Depends(pegar_sessao)):
    
    
    item = session.query(Item).filter(Item.nome == item_schema.nome, Item.unidade == item_schema.unidade).first()
    
    if item:
        raise HTTPException(status_code=400, detail="Item já cadastrado")
    

    novo_item = Item(item_schema.nome, item_schema.tipo, item_schema.categoria, item_schema.unidade, item_schema.ativo)
    session.add(novo_item)
    session.flush() 

   
    novo_estoque = Estoque(item_id=novo_item.id)
    session.add(novo_estoque)



    session.commit()

    return {"message": f"Item {novo_item.id, novo_item.nome} cadastrado com sucesso"}

@itens_router.get("/listar")
async def listar_itens(session: Session = Depends(pegar_sessao)):

    
    itens = session.query(Item).all()

    return {"itens": itens}

@itens_router.get("/{id_item}")
async def listar_item(id_item: int, session: Session = Depends(pegar_sessao)):

    
    item = session.query(Item).filter(Item.id == id_item).first()

    if not item:
        raise HTTPException(status_code=400, detail="Item não encontrado")

    return {"item": item}

@itens_router.patch("/{id_item}/atualizar")
async def atualizar_item(id_item: int, dados: ItemUpdateSchema, session: Session = Depends(pegar_sessao), usuario_criador: Usuario = Depends(verificar_token)):

    if not (usuario_criador.papel == "ADMIN" or usuario_criador.papel == "PLANEJADOR"):
        raise HTTPException(status_code=403, detail="Apenas usuários com papel de ADMIN ou PLANEJADOR podem atualizar itens")
    
    item = session.query(Item).filter(Item.id == id_item).first()

    if not item:
        raise HTTPException(status_code=400, detail="Item não encontrado")
    
    
    for campo, valor in dados.model_dump(exclude_unset=True).items():
        setattr(item, campo, valor)

    session.commit()
    session.refresh(item)

    return {"message": f"Item {item.id} atualizado com sucesso", "item": item}

@itens_router.get("/{id_item}/receita")
async def itens_receita(id_item: int, session: Session = Depends(pegar_sessao)):
    

    item = session.query(Item).filter(Item.id == id_item).first()

    if not item:
        raise HTTPException(status_code=400, detail="Item não encontrado")

    receita = session.query(ItemComposicao).filter(ItemComposicao.item_resultado_id == id_item).all()

    receita_ajustada = []

    for item_receita in receita:
        item_base = session.query(Item).filter(Item.id == item_receita.item_insumo_id).first()
       
        receita_ajustada.append({
        "item_nome": item_base.nome,
        "quantidade": item_receita.quantidade,
        "unidade": item_receita.unidade
        })

    return {"message": f"Receita do item {item.nome}:", "receita": receita_ajustada}

@itens_router.post("/{id_item}/receita/adicionar")
async def cadastra_item_receita(id_item: int, receita_item_schema: ItemCompostoSchema, session: Session = Depends(pegar_sessao), usuario_criador: Usuario = Depends(verificar_token)):
    
    if not (usuario_criador.papel == "ADMIN" or usuario_criador.papel == "PLANEJADOR"):
        raise HTTPException(status_code=403, detail="Apenas usuários com papel de ADMIN ou PLANEJADOR podem cadastrar receitas de itens")
    
    
    item_composto = session.query(Item).filter(Item.id == id_item).first()

    if not item_composto:
        raise HTTPException(status_code=400, detail="Item não encontrado")
    
    item_base = session.query(Item).filter(receita_item_schema.item_insumo_id == Item.id).first()

    if not item_base:
        raise HTTPException(status_code=400, detail="Item base não encontrado")
    
    novo_item = session.query(ItemComposicao).filter(ItemComposicao.item_insumo_id == receita_item_schema.item_insumo_id, ItemComposicao.item_resultado_id == id_item).first()

    if novo_item:
        raise HTTPException(status_code=400, detail ="Item já adicionado previamente")

    novo_item = ItemComposicao(id_item, receita_item_schema.item_insumo_id, receita_item_schema.quantidade, receita_item_schema.unidade)
    session.add(novo_item)
    session.commit()


    return {"message": f"Item {item_base.nome} adicionado a receita de {item_composto.nome} com sucesso"}


@itens_router.post("/{id_item_insumo}/receita/remover")
async def remove_item_receita(id_item_insumo: int, session: Session = Depends(pegar_sessao), usuario_criador: Usuario = Depends(verificar_token)):
    
    if not (usuario_criador.papel == "ADMIN" or usuario_criador.papel == "PLANEJADOR"):
        raise HTTPException(status_code=403, detail="Apenas usuários com papel de ADMIN ou PLANEJADOR podem cadastrar receitas de itens")
    
    
    item_composto = session.query(ItemComposicao).filter(ItemComposicao.id == id_item_insumo).first()

    if not item_composto:
        raise HTTPException(status_code=400, detail="Item da receita não encontrado")
    

    itemNome = session.query(Item).filter(Item.id == item_composto.item_insumo_id).first().nome
    itemFinalNome = session.query(Item).filter(Item.id == item_composto.item_resultado_id).first().nome

    session.delete(item_composto)
    session.commit()


    return {"message": f"Item {itemNome} removido da receita com sucesso do {itemFinalNome}",
            "composicao do item": item_composto}
