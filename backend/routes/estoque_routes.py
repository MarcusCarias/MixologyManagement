from fastapi import APIRouter, Depends, HTTPException
from dependencies import pegar_sessao, verificar_token
from models import Estoque, Usuario, Item
from schemas import EstoqueUpdateSchema, EstoqueQtdUpdateSchema
from sqlalchemy.orm import Session, joinedload

estoque_router = APIRouter(prefix="/estoque", tags=["estoque"], dependencies=[Depends(verificar_token)])

@estoque_router.get("/")
async def lotes():
    return {"message": "Voce acessou a rota de estoques"}

@estoque_router.get("/listar")
async def listar_estoque(session: Session = Depends(pegar_sessao), usuario_criador: Usuario = Depends(verificar_token)):
    
    #estoque = session.query(Estoque).all()

    #return {"estoque": estoque}

    registros = session.query(Estoque).options(joinedload(Estoque.item)).all()

   

    lista_final = []
    for registro in registros:
        lista_final.append({
            "id": registro.item.id,
            "nome": registro.item.nome,
            "categoria": registro.item.categoria,
            "unidade": registro.item.unidade,
            "quantidade": registro.qntAtual,
            "minimo": registro.estoqueMin,
            "maximo": registro.estoqueMax
        })

    return {"estoque": lista_final}

@estoque_router.get("/{id_item}")
async def listar_item_estoque(id_item: int, session: Session = Depends(pegar_sessao), usuario_criador: Usuario = Depends(verificar_token)):
    
    estoque = session.query(Estoque).filter(Estoque.item_id == id_item).first()

    if not estoque:
        raise HTTPException(status_code=400, detail="Estoque do item não encontrado")
    

    return {"estoque": estoque}

@estoque_router.patch("/{id_item}/atualizar")
async def atualizar_estoque(id_item: int, dados: EstoqueUpdateSchema, session: Session = Depends(pegar_sessao), usuario_criador: Usuario = Depends(verificar_token)):
 
    estoque = session.query(Estoque).filter(Estoque.item_id == id_item).first()

    if not estoque:
        raise HTTPException(status_code=400, detail="Estoque do item não encontrado")
    
    if dados.estoqueMin is not None and dados.estoqueMax is not None:
        if dados.estoqueMin > dados.estoqueMax:
            raise HTTPException(status_code=400, detail="O estoque mínimo não pode ser maior que o estoque máximo")

    
    for campo, valor in dados.model_dump(exclude_unset=True).items():
        setattr(estoque, campo, valor)
    
    

    itemNome = session.query(Item).filter(Item.id == id_item).first().nome

    session.commit()
    session.refresh(estoque)

    return {"message": f"Limite(s) do item {itemNome} atualizado com sucesso"}

@estoque_router.patch("/{id_item}/atualizar-estoque")
async def atualizar_estoque(id_item: int, dados: EstoqueQtdUpdateSchema, session: Session = Depends(pegar_sessao), usuario_criador: Usuario = Depends(verificar_token)):
 

    if not usuario_criador.papel == "ADMIN":
        raise HTTPException(status_code=403, detail="Apenas usuários com papel de ADMIN podem atualizar a quantidade de itens no estoque")


    estoque = session.query(Estoque).filter(Estoque.item_id == id_item).first()

    if not estoque:
        raise HTTPException(status_code=400, detail="Estoque do item não encontrado")

    if dados.estoqueMin is not None and dados.estoqueMax is not None:
        if dados.estoqueMin > dados.estoqueMax:
            raise HTTPException(status_code=400, detail="O estoque mínimo não pode ser maior que o estoque máximo")

    
    if dados.qntAtual is not None:
        if dados.qntAtual < 0:
            raise HTTPException(status_code=400, detail="A quantidade atual do estoque não pode ser negativa")

    for campo, valor in dados.model_dump(exclude_unset=True).items():
        setattr(estoque, campo, valor)
    
    

    itemNome = session.query(Item).filter(Item.id == id_item).first().nome

    session.commit()
    session.refresh(estoque)

    return {"message": f"Limite(s) do item {itemNome} atualizado com sucesso"}

  
