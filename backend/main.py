#uvicorn main:app --reload

from fastapi import FastAPI
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os


load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))


app = FastAPI()

origins = [
    "http://localhost:5173", 
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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