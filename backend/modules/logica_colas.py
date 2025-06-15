import random

class VectorEstado:
    def __init__(self, tiempo_actual, random_llegada, tiempo_llegada):
        self.tiempo_actual = tiempo_actual
        self.random_llegada = random_llegada
        self.tiempo_llegada = tiempo_llegada

    def to_dict(self):
        return self.__dict__

def sistema_colas(cantidad_eventos, tiempo_inicial=0, intervalo_max=10):
    eventos = []
    tiempo_actual = tiempo_inicial

    for _ in range(cantidad_eventos):
        random_llegada = round(random.random(), 2)
        tiempo_entre_llegadas = int(random_llegada * intervalo_max)
        tiempo_llegada = tiempo_actual + tiempo_entre_llegadas

        vector = VectorEstado(tiempo_actual, random_llegada, tiempo_llegada)
        eventos.append(vector)
        tiempo_actual = tiempo_llegada

    return eventos


