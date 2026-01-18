from sqlalchemy import create_engine, Column, Integer, String, Date, ForeignKey, Boolean, UniqueConstraint, Float
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy_utils.types import ChoiceType
from sqlalchemy.sql import func
from enum import Enum

db = create_engine('sqlite:///banco.db', echo=True)
print(db.url)

Base = declarative_base()


# class Role(Enum):
#     OPERADOR_COZINHA = 'Operador_Cozinha'
#     PLANEJADOR = 'Planejador'
#     ESTOQUISTA = 'Estoquista'
#     COMPRADOR = 'Comprador'
#     ADMIN = 'Admin'


class Usuario(Base):
    __tablename__ = 'usuario'

    cpf = Column("cpf", Integer, primary_key=True)  
    nome = Column("nome", String)
    senha = Column("senha", String)
    email = Column("email", String)

    papel = Column("papel", String, nullable=False)
#    papel = Column("papel", Enum(Role), nullable=False)


    def __init__(self, cpf, nome, senha, email, papel):
        self.cpf = cpf
        self.nome = nome
        self.senha = senha
        self.email = email
        self.papel = papel

class Evento(Base):
    __tablename__ = 'evento'

    # STATUS_EVENTO = (
    #     ("Em preparacao","Em preparacao"),
    #     ("Em andamento","Em andamento"),
    #     ("Finalizado","Finalizado"),
    #     ("Cancelado","Cancelado"),
    # )
    
    # status = Column("status", ChoiceType(choices = STATUS_EVENTO), default="Em preparacao", nullable=False)


    id = Column("id", Integer, primary_key=True, autoincrement=True)
    
    nome = Column("nome", String)
    dataEvento = Column("dataEvento", Date, nullable=True)                                     #DateTime se quiser com horas
    numConvidados = Column("numConvidados", Integer)
    tipoEvento = Column("tipoEvento", String, nullable=True)                                   #colocar como choice type?
    status = Column("status", String, default="EM PREPARACAO", nullable=False)
    
    drinks_evento = relationship("DrinksEvento", cascade = "all, delete-orphan", back_populates="evento")
    utensilios_evento = relationship("UtensilioEvento", cascade = "all, delete-orphan", back_populates="evento")

    def __init__(self, nome, dataEvento, numConvidados, tipoEvento, status="EM PREPARACAO"):
        self.nome = nome
        self.dataEvento = dataEvento
        self.numConvidados = numConvidados
        self.tipoEvento = tipoEvento
        self.status = status

    def geraCartaDrinks(self):
        carta = []

        for de in self.drinks_evento:
            carta.append({"drink_id": de.drink_id,"quantidade_prevista": de.quantidadePrevista})
        
        return carta
    
    def geraFichaTecnica(self):
        ficha = []

        for ue in self.utensilios_evento:
            ficha.append({"item_id": ue.item_id, "quantidade": ue.quantidadePrevista})

        return ficha
    
class Drink(Base):
    __tablename__ = "drink"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(String, nullable=False)
    categoria = Column(String)
    ativo = Column(Boolean, default=True)

    receita = relationship("DrinkReceita", cascade="all, delete-orphan")

    def __init__(self, nome, categoria=None, ativo=True):
        self.nome = nome
        self.categoria = categoria
        self.ativo = ativo

class DrinksEvento(Base):
    __tablename__ = "drinks_evento"

    id = Column(Integer, primary_key=True, autoincrement=True)

    evento_id = Column(Integer, ForeignKey("evento.id"), nullable=False)
    drink_id = Column(Integer, ForeignKey("drink.id"), nullable=False)

    quantidadePrevista = Column(Integer)

    evento = relationship("Evento", back_populates="drinks_evento")

    __table_args__ = (UniqueConstraint("evento_id", "drink_id"),)

    def __init__(self, evento_id, drink_id, quantidadePrevista):
        self.evento_id = evento_id
        self.drink_id = drink_id
        self.quantidadePrevista = quantidadePrevista

class Item(Base):
    __tablename__ = "item"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(String, nullable=False)
    tipo = Column(String)        # insumo | produzido | ambos
    categoria = Column(String, nullable=True)
    unidade = Column(String)     # L, ML, G, UN
    ativo = Column(Boolean, default=True)

    estoque = relationship("Estoque", uselist=False, back_populates="item")

    def __init__(self, nome, tipo, categoria, unidade, ativo=True):
        self.nome = nome
        self.tipo = tipo
        self.categoria = categoria
        self.unidade = unidade
        self.ativo = ativo

class DrinkReceita(Base):
    __tablename__ = "drink_receita"

    id = Column(Integer, primary_key=True, autoincrement=True)

    drink_id = Column(Integer, ForeignKey("drink.id"), nullable=False)
    item_id = Column(Integer, ForeignKey("item.id"), nullable=False)

    quantidade = Column(Float, nullable=False)
    unidade = Column(String, nullable=False)

    __table_args__ = (UniqueConstraint("drink_id", "item_id"),)

    def __init__(self, drink_id, item_id, quantidade, unidade):
        self.drink_id = drink_id
        self.item_id = item_id
        self.quantidade = quantidade
        self.unidade = unidade

class ItemComposicao(Base):
    __tablename__ = "item_composicao"

    id = Column(Integer, primary_key=True, autoincrement=True)

    item_resultado_id = Column(Integer, ForeignKey("item.id"), nullable=False)
    item_insumo_id = Column(Integer, ForeignKey("item.id"), nullable=False)

    quantidade = Column(Float, nullable=False)
    unidade = Column(String, nullable=False)

    item_resultado = relationship("Item", foreign_keys=[item_resultado_id])

    item_insumo = relationship("Item", foreign_keys=[item_insumo_id])

    __table_args__ = (UniqueConstraint("item_resultado_id", "item_insumo_id"),)

    def __init__(self, item_resultado_id, item_insumo_id, quantidade, unidade):
        self.item_resultado_id = item_resultado_id
        self.item_insumo_id = item_insumo_id
        self.quantidade = quantidade
        self.unidade = unidade

class UtensilioEvento(Base):
    __tablename__ = "utensilios_evento"

    id = Column(Integer, primary_key=True, autoincrement=True)

    evento_id = Column(Integer, ForeignKey("evento.id"), nullable=False)
    item_id = Column(Integer, ForeignKey("item.id"), nullable=False)

    quantidadePrevista = Column(Integer, nullable=False)

    evento = relationship("Evento", back_populates="utensilios_evento")

    __table_args__ = (UniqueConstraint("evento_id", "item_id"),)

    def __init__(self, evento_id, item_id, quantidadePrevista):
        self.evento_id = evento_id
        self.item_id = item_id
        self.quantidadePrevista = quantidadePrevista

class Estoque(Base):
    __tablename__ = "estoque"

    id = Column(Integer, primary_key=True, autoincrement=True)

    item_id = Column(Integer, ForeignKey("item.id"), nullable=False, unique=True)

    qntAtual = Column(Float, nullable=False, default = 0)

    estoqueMin = Column(Float, nullable=True)
    estoqueMax = Column(Float, nullable=True)

    item = relationship("Item", back_populates="estoque")

    def __init__(self, item_id, estoqueMin=None, estoqueMax=None):
        self.item_id = item_id
        self.qntAtual = 0
        self.estoqueMin = estoqueMin
        self.estoqueMax = estoqueMax

class Lote(Base):
    __tablename__ = "lote"

    id = Column(Integer, primary_key=True, autoincrement=True)

    item_id = Column(Integer, ForeignKey("item.id"), nullable=False)

    quantidade = Column(Float, nullable=False)
    dataValidade = Column(Date, nullable=True)
    dataEntrada = Column(Date, nullable=False, default=func.now())
    status = Column(String, default="RECEBIDO", nullable=False) #RECEBIDO, AGENDADO

    def __init__(self, item_id, quantidade, dataValidade=None, dataEntrada=None,  status="RECEBIDO"):
        self.item_id = item_id
        self.quantidade = quantidade
        self.dataValidade = dataValidade
      
        if dataEntrada:
            self.dataEntrada = dataEntrada

        self.status = status

class ReservaEstoque(Base):
    __tablename__ = "reserva_estoque"

    id = Column(Integer, primary_key=True, autoincrement=True)

    item_id = Column(Integer, ForeignKey("item.id"), nullable=False)
    evento_id = Column(Integer, ForeignKey("evento.id"), nullable=False)

    quantidadeReservada = Column(Integer, nullable=False)
    status = Column(String)

    __table_args__ = (UniqueConstraint("item_id", "evento_id"),)

    def __init__(self, item_id, evento_id, quantidadeReservada):
        self.item_id = item_id
        self.evento_id = evento_id
        self.quantidadeReservada = quantidadeReservada

class ListaCompra(Base):
    __tablename__ = "lista_compra"

    id = Column(Integer, primary_key=True, autoincrement=True)

    evento_id = Column(Integer, ForeignKey("evento.id"), nullable=False)
    item_id = Column(Integer, ForeignKey("item.id"), nullable=False)

    quantidade = Column(Float, nullable=False)
    status = Column(String, default="PENDENTE")  # PENDENTE | COMPRADO | CANCELADO


    __table_args__ = (UniqueConstraint("evento_id", "item_id"),)