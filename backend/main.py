from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from modules.logica_colas import sistema_colas
from fastapi.responses import JSONResponse
from modules.clases import Evento, Estado, Cliente, Alfombra
from random import random as r
from modules.utilities import insertar_ordenado

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def datos_tabla():
    eventos = sistema_colas(10, 0, 10)
    datos = [evento.to_dict() for evento in eventos]
    return JSONResponse(content=datos)