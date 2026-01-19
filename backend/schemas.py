from pydantic import BaseModel, EmailStr
from pydantic_br_validator import CPF
from typing import Optional
from datetime import date

class UsuarioSchema(BaseModel):
    cpf: CPF
    nome: str
    senha: str
    email: EmailStr
    papel: str

    class Config:
        from_attributes = True

class EventoSchema(BaseModel):
    nome: str
    dataEvento: Optional[date]
    numConvidados: int
    tipoEvento: Optional[str]

    class Config:
        from_attributes = True

class LoginSchema(BaseModel):
    email: EmailStr
    senha: str

    class Config:
        from_attributes = True

class EventoUpdateSchema(BaseModel):
    nome: Optional[str] = None
    dataEvento: Optional[date] = None
    numConvidados: Optional[int] = None
    tipoEvento: Optional[str] = None

    class Config:
        from_attributes = True

class DrinkEventoSchema(BaseModel):
    drink_id: int
    quantidadePrevista: Optional[int] = None

    class Config:
        from_attributes = True

class DrinkSchema(BaseModel):
    nome: str
    categoria: Optional[str] = None
    ativo: bool = True

    class Config:
        from_attributes = True

class DrinkUpdateSchema(BaseModel):
    nome: Optional[str] = None
    categoria: Optional[str] = None
    ativo: Optional[bool] = None

    class Config:
        from_attributes = True

class ReceitaDrinkSchema(BaseModel):

    item_id: int
    quantidade: float
    unidade: str

    class Config:
        from_attributes = True

class ItemSchema(BaseModel):
    nome: str
    tipo: str
    categoria: Optional[str] = None
    unidade: str
    ativo: bool = True

    class Config:
        from_attributes = True

class ItemUpdateSchema(BaseModel):
    nome: Optional[str] = None
    tipo: Optional[str] = None
    categoria: Optional[str] = None
    unidade: Optional[str] = None
    ativo: Optional[bool] = None

    class Config:
        from_attributes = True

class ItemCompostoSchema(BaseModel):
    
    item_insumo_id: int
    quantidade: float
    unidade: str
    
    class Config:
        from_attributes = True

class LoteSchema(BaseModel):
    
    item_id: int
    quantidade: float
    dataValidade: Optional[date] = None
    dataEntrada: Optional[date] = None
    status: Optional[str] = None
    
    class Config:
        from_attributes = True

class LoteUpdateSchema(BaseModel):
    
    quantidade: Optional[float] = None
    dataValidade: Optional[date] = None
    dataEntrada: Optional[date] = None
    status: Optional[str] = None
    
    class Config:
        from_attributes = True

class EstoqueSchema(BaseModel):
    
    item_id: int
    qntAtual: float
    estoqueMin: Optional[float] = None
    estoqueMax: Optional[float] = None

    class Config:
        from_attributes = True

class EstoqueUpdateSchema(BaseModel):
    estoqueMin: Optional[float] = None
    estoqueMax: Optional[float] = None

    class Config:
        from_attributes = True

class EstoqueQtdUpdateSchema(BaseModel):
    
    qntAtual: Optional[float] = None
    estoqueMin: Optional[float] = None
    estoqueMax: Optional[float] = None

    class Config:
        from_attributes = True


class ReservaSchema(BaseModel):
    
    item_id: int
    quantidadeReservada: float

    class Config:
        from_attributes = True

class ReservaUpdateSchema(BaseModel):
    
    quantidade: float

    class Config:
        from_attributes = True

class UtensilioSchema(BaseModel):
    
    item_id: int
    quantidadePrevista: int

    class Config:
        from_attributes = True