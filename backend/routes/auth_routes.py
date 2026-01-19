from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from models import Usuario
from dependencies import pegar_sessao, verificar_token
from sqlalchemy import or_
from sqlalchemy.orm import Session
from main import bcrypt_context, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES, SECRET_KEY
from schemas import UsuarioSchema, LoginSchema
from jose import jwt, JWTError
from datetime import datetime, timedelta, timezone



auth_router = APIRouter(prefix="/auth", tags=["auth"])

def criar_token(cpf, duracao_token=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)):

    data_expiracao = datetime.now(timezone.utc) + duracao_token
    dic_info = {"sub": str(cpf), "exp": data_expiracao}

    jwt_token = jwt.encode(dic_info, SECRET_KEY, algorithm=ALGORITHM)

    return jwt_token

def autenticar_usuario(email, senha, session):
    usuario = session.query(Usuario).filter( Usuario.email == email).first()

    if not usuario:
        return False
    elif not bcrypt_context.verify(senha, usuario.senha):
        return False

    return usuario

@auth_router.get("/")
async def home():
    return {"message": "Rota padrão de autenticação"}

@auth_router.post("/cadastro")
async def cadastra_usuario(usuario_schema: UsuarioSchema, session: Session = Depends(pegar_sessao)):
    
    # if not (usuario_criador.papel == "ADMIN"):
    #     raise HTTPException(status_code=403, detail="Apenas usuários com papel de ADMIN podem cadastrar novos usuários")

    usuario = session.query(Usuario).filter(or_(Usuario.cpf == usuario_schema.cpf, Usuario.email == usuario_schema.email)).first()

    if usuario:
        raise HTTPException(status_code=400, detail="Usuário já cadastrado")
    
    else:
        senha_segura = bcrypt_context.hash(usuario_schema.senha)

        novo_usuario = Usuario(usuario_schema.cpf, usuario_schema.nome, senha_segura, usuario_schema.email, usuario_schema.papel)
        session.add(novo_usuario)
        session.commit()
        return{"message": f"Usuário {novo_usuario.nome} cadastrado com sucesso"}
    
@auth_router.post("/login")
async def login(login_schema: LoginSchema, session: Session = Depends(pegar_sessao)):
    
    usuario = autenticar_usuario(login_schema.email, login_schema.senha, session)

    if not usuario:
        raise HTTPException(status_code=400, detail="Email ou senha incorretos")
    else:
        acess_token = criar_token(usuario.cpf)
        refresh_token = criar_token(usuario.cpf, duracao_token=timedelta(days=15))
        
        return {"access_token": acess_token,"refresh_token": refresh_token, "token_type": "bearer"}

@auth_router.post("/login-form")
async def login_form(dados_formulario: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(pegar_sessao)):
    
    usuario = autenticar_usuario(dados_formulario.username, dados_formulario.password, session)

    if not usuario:
        raise HTTPException(status_code=400, detail="Email ou senha incorretos")
    else:
        acess_token = criar_token(usuario.cpf)
        
        return {"access_token": acess_token, 
                "token_type": "bearer",
                "usuario": {
                "nome": usuario.nome,
                "email": usuario.email,
                "papel": usuario.papel}
            }


@auth_router.get("/refresh")
async def use_refresh_token(usuario: Usuario = Depends(verificar_token)):

    acess_token = criar_token(usuario.cpf)

    return {"access_token": acess_token, "token_type": "bearer"}

@auth_router.get("/me")
async def retorna(usuario: Usuario = Depends(verificar_token)):
    return {
        "nome": usuario.nome,
        "email": usuario.email,
        "papel": usuario.papel,
        "cpf": usuario.cpf
    }