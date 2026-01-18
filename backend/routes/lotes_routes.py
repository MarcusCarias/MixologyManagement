from fastapi import APIRouter, Depends, HTTPException
from dependencies import pegar_sessao, verificar_token
from models import Lote, Usuario
from schemas import LoteSchema, LoteUpdateSchema
from sqlalchemy.orm import Session
from datetime import date
from services.estoque_service import adicionar_estoque, remover_estoque

lotes_router = APIRouter(prefix="/lotes", tags=["lotes"], dependencies=[Depends(verificar_token)])

@lotes_router.get("/")
async def lotes():
    return {"message": "Voce acessou a rota de lotes"}

@lotes_router.post("/cadastro")
async def cadastra_lote(lote_schema: LoteSchema, session: Session = Depends(pegar_sessao), usuario_criador: Usuario = Depends(verificar_token)):
    
    if not (usuario_criador.papel == "ADMIN" or usuario_criador.papel == "ESTOQUISTA" or usuario_criador.papel == "COMPRADOR"):
        raise HTTPException(status_code=403, detail="Apenas usuários com papel de ADMIN, ESTOQUISTA ou COMPRADOR podem cadastrar lotes")

    lote = session.query(Lote).filter(Lote.item_id == lote_schema.item_id, Lote.dataEntrada == lote_schema.dataEntrada).first()
    
    if lote:
        raise HTTPException(status_code=400, detail="Lote já cadastrado")


    data_entrada_efetiva = lote_schema.dataEntrada if lote_schema.dataEntrada else date.today()

    if lote_schema.dataValidade is not None and lote_schema.dataValidade < data_entrada_efetiva:
        raise HTTPException(status_code=400, detail="Data de validade não pode ser anterior à data de entrada")
    

    novo_lote = Lote(lote_schema.item_id, lote_schema.quantidade, lote_schema.dataValidade, data_entrada_efetiva, lote_schema.status)
    session.add(novo_lote)
    
    adicionar_estoque(session, novo_lote.item_id, novo_lote.quantidade)
    
    session.commit()

    return {"message": f"Lote {novo_lote.id} cadastrado com sucesso"}




@lotes_router.get("/listar")
async def listar_lotes(session: Session = Depends(pegar_sessao), usuario_criador: Usuario = Depends(verificar_token)):

    if not (usuario_criador.papel == "ADMIN" or usuario_criador.papel == "ESTOQUISTA" or usuario_criador.papel == "COMPRADOR"):
        raise HTTPException(status_code=403, detail="Apenas usuários com papel de ADMIN, ESTOQUISTA ou COMPRADOR podem visualizar lotes")

    lotes = session.query(Lote).all()

    return {"lotes": lotes}

@lotes_router.get("/{id_lote}")
async def busca_lote(id_lote: int, session: Session = Depends(pegar_sessao), usuario_criador: Usuario = Depends(verificar_token)):

    if not (usuario_criador.papel == "ADMIN" or usuario_criador.papel == "ESTOQUISTA" or usuario_criador.papel == "COMPRADOR"):
        raise HTTPException(status_code=403, detail="Apenas usuários com papel de ADMIN, ESTOQUISTA ou COMPRADOR podem visualizar lotes")

    lote = session.query(Lote).filter(Lote.id == id_lote).first()

    if not lote:
        raise HTTPException(status_code=400, detail="Lote não encontrado")
    
    return {"lote": lote}

@lotes_router.patch("/{id_lote}/atualizar")
async def atualizar_lote(id_lote: int, dados: LoteUpdateSchema, session: Session = Depends(pegar_sessao), usuario_criador: Usuario = Depends(verificar_token)):

    if not (usuario_criador.papel == "ADMIN" or usuario_criador.papel == "ESTOQUISTA" or usuario_criador.papel == "COMPRADOR"):
        raise HTTPException(status_code=403, detail="Apenas usuários com papel de ADMIN, ESTOQUISTA ou COMPRADOR podem visualizar lotes")

    lote = session.query(Lote).filter(Lote.id == id_lote).first()

    if not lote:
        raise HTTPException(status_code=400, detail="Lote não encontrado")
    
    validade = dados.dataValidade if dados.dataValidade is not None else lote.dataValidade
    entrada = dados.dataEntrada if dados.dataEntrada is not None else lote.dataEntrada

    
    if validade < entrada:
        raise HTTPException(status_code=400, detail="Data de validade não pode ser anterior à data de entrada")


    quantidade_nova = dados.quantidade if dados.quantidade is not None else lote.quantidade

    if quantidade_nova != lote.quantidade:

        diferenca = quantidade_nova - lote.quantidade

        if diferenca > 0:
            adicionar_estoque(session, lote.item_id, diferenca)
        else:
            resultado_remocao = remover_estoque(session, lote.item_id, abs(diferenca))
            if not resultado_remocao["status"]:
                raise HTTPException(status_code=400, detail=f"Não há estoque suficiente para reduzir a quantidade do lote. Faltam {resultado_remocao['faltante']} unidades no estoque.")


    for campo, valor in dados.model_dump(exclude_unset=True).items():
        setattr(lote, campo, valor)   

    session.commit()
    session.refresh(lote)

    return {"message": f"Lote {lote.id} atualizado com sucesso", "lote": lote}