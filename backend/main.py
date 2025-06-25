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

@app.get("/status")
def status():
    try:
        return {"status": "ok"}
    except:
        return {"status": "error"}

@app.get("/prueba")
def prueba():
    data = {
            "eventos": [
                {
                    "numero": 1,
                    "evento": "Inicialización",
                    "id_cliente": "",
                    "reloj": "0.00",
                    "rnd_ll": 0.1838,
                    "tiempo_ll": 3.1838,
                    "hora_ll": 3.1838,
                    "tiempo_descenso": "",
                    "hora_fin_descenso": "",
                    "id_cliente_descenso": "",
                    "prox_suspension": 30,
                    "prox_limpieza": 50,
                    "fin_limpieza": "",
                    "estado_alfombra": "L",
                    "cola": 0,
                    "acumulador_tiempo_espera": 0,
                    "clientes_comienzan_atencion": 0,
                    "cola_maxima_actual": 0,
                    "espera_maxima_cola": 0,
                    "clientes": []
                },
                {
                    "numero": 2,
                    "evento": "Llegada Cliente",
                    "id_cliente": 2,
                    "reloj": "6.62",
                    "rnd_ll": 0.9072,
                    "tiempo_ll": 3.9072,
                    "hora_ll": 10.5281,
                    "tiempo_descenso": "",
                    "hora_fin_descenso": 7.7958,
                    "id_cliente_descenso": 1,
                    "prox_suspension": 30,
                    "prox_limpieza": 50,
                    "fin_limpieza": "",
                    "estado_alfombra": "O",
                    "cola": 1,
                    "acumulador_tiempo_espera": 0,
                    "clientes_comienzan_atencion": 1,
                    "cola_maxima_actual": 1,
                    "espera_maxima_cola": 0,
                    "clientes": [
                        {
                            "id_cliente": 1,
                            "estado": "SA",
                            "hora_llegada": 3.1838
                        },
                        {
                            "id_cliente": 2,
                            "estado": "EA",
                            "hora_llegada": 6.6209
                        }
                    ]
                }
            ],
            "cola_maxima": 2,
            "promedio_tiempo_espera": 2.7421,
            "contador_clientes_comienzan_descenso": 17,
            "espera_cola_maxima": 6.7213,
            "runge_kutta": [
                {
                    "numero": 1,
                    "t": 0,
                    "x": 0,
                    "k1": 0.005,
                    "k2": 0.0049995001875,
                    "k3": 0.00499950023744377,
                    "k4": 0.00499900084980259,
                    "x_sig": 0.00499950028328169
                },
                {
                    "numero": 2,
                    "t": 0.001,
                    "x": 0.00499950028328169,
                    "k1": 0.00499900084979344,
                    "k2": 0.00499850188690871,
                    "k3": 0.00499850193669275,
                    "k4": 0.00499800339835746,
                    "x_sig": 0.00999800226584066
                },
                {
                    "numero": 3,
                    "t": 0.002,
                    "x": 0.00999800226584066,
                    "k1": 0.00499800339834831,
                    "k2": 0.00499750528446024,
                    "k3": 0.00499750533408488,
                    "k4": 0.00499700764443746,
                    "x_sig": 0.01499550764582
                },
                {
                    "numero": 4,
                    "t": 0.003,
                    "x": 0.01499550764582,
                    "k1": 0.00499700764442832,
                    "k2": 0.00499651037891951,
                    "k3": 0.00499651042838509,
                    "k4": 0.00499601358680876,
                    "x_sig": 0.0199920181201277
                },
                {
                    "numero": 5,
                    "t": 0.004,
                    "x": 0.0199920181201277,
                    "k1": 0.00499601358679963,
                    "k2": 0.00499551716905391,
                    "k3": 0.00499551721836076,
                    "k4": 0.00499502122423997,
                    "x_sig": 0.0249875353844392
                },
                {
                    "numero": 1016,
                    "t": 4.60799999999987,
                    "x": 118.584465605656,
                    "k1": 0.403151371368239,
                    "k2": 0.404546499911771,
                    "k3": 0.404551332067417,
                    "k4": 0.40595378116663,
                    "x_sig": 118.989015741738
                },
                {
                    "numero": 1017,
                    "t": 4.60899999999987,
                    "x": 118.989015741738,
                    "k1": 0.405953772867281,
                    "k2": 0.407363534674591,
                    "k3": 0.407368434682884,
                    "k4": 0.408785619796822,
                    "x_sig": 119.396382963635
                },
                {
                    "numero": 1018,
                    "t": 4.60999999999987,
                    "x": 119.396382963635,
                    "k1": 0.408785611351241,
                    "k2": 0.410210211784763,
                    "k3": 0.410215180839451,
                    "k4": 0.411647309139651,
                    "x_sig": 119.806596914591
                },
                {
                    "numero": 1019,
                    "t": 4.61099999999987,
                    "x": 119.806596914591,
                    "k1": 0.411647300544742,
                    "k2": 0.413086948582158,
                    "k3": 0.413091987902271,
                    "k4": 0.414539270213871,
                    "x_sig": 120.219687655212
                },
                {
                    "numero": 1020,
                    "t": 4.61199999999988,
                    "x": 120.219687655212,
                    "k1": "",
                    "k2": "",
                    "k3": "",
                    "k4": "",
                    "x_sig": ""
                }
            ]
        }

    return JSONResponse(content=data)