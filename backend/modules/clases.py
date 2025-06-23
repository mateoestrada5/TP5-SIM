
# todo esta clase no se usa, se puede eliminar
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
    def __init__(self, evento, reloj, id_cliente="", rnd_ll="", tiempo_ll="", hora_ll="", tiempo_descenso="", hora_fin_descenso="", id_cliente_descenso="", prox_suspension="", prox_limpieza="", fin_limpieza="", e_alfombra="", cola=""):
        self.rnd = 0
        self.evento = evento  # Evento actual
        self.reloj = reloj  # Reloj de la simulación
        self.id_cliente = id_cliente  # ID del cliente (si aplica)
        self.rnd_ll = rnd_ll  # RND de llegada del cliente
        self.tiempo_ll = tiempo_ll  # Tiempo de llegada del cliente
        self.hora_ll = hora_ll  # Hora de llegada del cliente
        self.tiempo_descenso = tiempo_descenso  # Tiempo de descenso del cliente
        self.hora_fin_descenso = hora_fin_descenso  # Hora de fin de descenso del cliente
        self.id_cliente_descenso = id_cliente_descenso  # ID del cliente
        self.prox_suspension = prox_suspension  # Hora de la próxima suspensión
        self.prox_limpieza = prox_limpieza
        self.fin_limpieza = fin_limpieza
        self.estado_alfombra = e_alfombra  # Estado de la alfombra (L, O, EL, ES)
        self.cola = cola  # Cola de clientes esperando (lista de objetos Cliente)

    def to_json(self):
        return {
            "evento": self.evento,
            "id_cliente": self.id_cliente,
            "reloj": self.reloj,
            "rnd_ll": self.rnd_ll,
            "tiempo_ll": self.tiempo_ll,
            "hora_ll": self.hora_ll,
            "tiempo_descenso": self.tiempo_descenso,
            "hora_fin_descenso": self.hora_fin_descenso,
            "id_cliente_descenso": self.id_cliente_descenso,
            "prox_suspension": self.prox_suspension,
            "prox_limpieza": self.prox_limpieza,
            "fin_limpieza": self.fin_limpieza,
            "estado_alfombra": self.estado_alfombra,
            "cola": self.cola  # Convertir objetos Cliente a dict
        }


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
    def __init__(self, tipo, reloj, cliente=""): #(..., cliente=None):
        self.tipo = tipo  # Tipo de evento (0: Inicialización, 1: Llegada Cliente, 2: Fin Descenso, 3: Inicio Suspensión, 4: Fin Suspensión, 5: Inicio Limpieza, 6: Fin Limpieza)
        self.nombre = {
            0: "Inicialización",
            1: "Llegada Cliente",
            2: "Fin Descenso",
            3: "Inicio Suspensión", # se deshabilitan las llegadas de clientes
            4: "Fin Suspensión",
            5: "Inicio Limpieza",  # se deshabilitan las llegadas de clientes
            6: "Fin Limpieza",
            7: "Fin simulacion"
        }.get(tipo, "Evento Desconocido")
        self.reloj = reloj
        self.cliente = cliente  # Cliente asociado al evento (si aplica)

    def __repr__(self):
        return f"Evento(tipo={self.tipo}, reloj={self.reloj}, nombre={self.nombre}, cliente={self.cliente})"



