from fastapi import HTTPException
from sqlalchemy.orm import Session
from models import Estoque

def adicionar_estoque(session: Session, item_id: int, quantidade: float):
    
    estoque = session.query(Estoque).filter(Estoque.item_id == item_id).first()

    if not estoque:
        raise HTTPException(status_code=404,detail="Estoque do item não encontrado")

    estoque.qntAtual += quantidade
    return estoque


def remover_estoque(session: Session, item_id: int, quantidade: float):

    estoque = session.query(Estoque).filter(Estoque.item_id == item_id).first()

    if not estoque:
        raise HTTPException(status_code=404,detail="Estoque do item não encontrado")

    if estoque.qntAtual >= quantidade:
        estoque.qntAtual -= quantidade
        return {"status": True, "faltante": 0}

    faltante = quantidade - estoque.qntAtual
    estoque.qntAtual = 0

    return {"status": False,"faltante": faltante}
