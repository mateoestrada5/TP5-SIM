
class gestor_simulacion():
    def __init__(self):
        self.simulaciones = []

    def agregar_simulacion(self, simulacion):
        self.simulaciones.append(simulacion)

    def obtener_simulaciones(self):
        return self.simulaciones

    def eliminar_simulacion(self, simulacion):
        if simulacion in self.simulaciones:
            self.simulaciones.remove(simulacion)


class Vector_estado():
    def __init__(self):
        self.rnd = 0

class Estado():
    def __init__(self, nombre):
        self.nombre = nombre

    # Estados del cliente
    def es_esperando_atencion(self): return self.nombre == "EA"
    def es_siendo_atendido(self): return self.nombre == "SA"
    def es_creado(self): return self.nombre == "C"

    # Estados de la alfombra
    def es_limpieza(self): return self.nombre == "EL"
    def es_suspension(self): return self.nombre == "ES"
    def es_libre(self): return self.nombre == "L"
    def es_ocupado(self): return self.nombre == "O"

class Cliente():
    def __init__(self, id_cliente, estado, hora_llegada):
        self.id_cliente = id_cliente
        self.estado = estado  # Estado del cliente (EA, SA)
        self.hora_llegada = hora_llegada

    def calcular_tiempo_espera(self, reloj):
        return reloj - self.hora_llegada if self.hora_llegada else 0

class Alfombra():
    def __init__(self, estado):
        self.estado = estado
        self.cola = []

class Evento():
    def __init__(self, tipo, reloj): #(..., cliente=None):
        self.tipo = tipo  # Tipo de evento (0: Inicialización, 1: Llegada Cliente, 2: Fin Descenso, 3: Inicio Suspensión, 4: Fin Suspensión, 5: Inicio Limpieza, 6: Fin Limpieza)
        self.nombre = {
            0: "Inicialización",
            1: "Llegada Cliente",
            2: "Fin Descenso",
            3: "Inicio Suspensión", # se deshabilitan las llegadas de clientes
            4: "Fin Suspensión",
            5: "Inicio Limpieza",  # se deshabilitan las llegadas de clientes
            6: "Fin Limpieza"
        }.get(tipo, "Evento Desconocido")
        self.reloj = reloj
        #self.cliente = cliente  # Cliente asociado al evento (si aplica)

    def __repr__(self):
        return f"Evento(tipo={self.tipo}, reloj={self.reloj}, nombre={self.nombre})"


