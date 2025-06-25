from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from modules.logica_colas import sistema_colas
from fastapi.responses import JSONResponse
from simulacion import simular


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

    parametros_guia = {
        "config": {
            "semilla": "",
            "tiempoLimite": "",
            "clienteX": "",
            "cantidadEventos": 1000,
            "frecuenciaLlegadaMin": 3,
            "frecuenciaLlegadaMax": 4.5,
            "periodoSuspension": 40,
            "periodoLimpieza": 4,
            "duracionLimpieza": 20,
            "colaEsperaMaximaHoras": 10,
            "cantidadEventosVisualizar": 300,
            "hora_inicial": 1
        },
        "rungeKutta": {
            "t0": 0,
            "x0": 0,
            "h": 0.001,
            "ecuacionA": 0.5,
            "ecuacionB": -0.2,
            "ecuacionC": 5,
            "xFinal": 120
        }
    }


    # eventos = sistema_colas(10, 0, 10)
    # datos = [evento.to_dict() for evento in eventos]
    # print(datos)
    datos = simular(parametros_guia)
    return JSONResponse(content=datos)