#uvicorn main:app --reload

from fastapi import FastAPI
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from dotenv import load_dotenv
import os

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

app = FastAPI()

bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_schema = OAuth2PasswordBearer(tokenUrl="auth/login-form")

from routes.auth_routes import auth_router
from routes.eventos_routes import eventos_router
from routes.drinks_routes import drinks_router
from routes.itens_routes import itens_router
from routes.lotes_routes import lotes_router
from routes.estoque_routes import estoque_router

app.include_router(auth_router)
app.include_router(eventos_router)
app.include_router(drinks_router)
app.include_router(itens_router)
app.include_router(lotes_router)
app.include_router(estoque_router)