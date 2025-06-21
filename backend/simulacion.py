
from modulos.utilities import insertar_ordenado
from modulos.clases import Estado, Cliente, Alfombra, Evento
from random import random as r


def llegada_cliente(reloj, id_ultimo_cliente, lim_inferior, lim_superior):
    rnd = r()
    tiempo_llegada = lim_inferior + (lim_superior - lim_inferior) * rnd
    hora_llegada = reloj + tiempo_llegada
    prox_cliente = Cliente(id_ultimo_cliente + 1, Estado("C"), hora_llegada)
    return prox_cliente


def ocupar_alfombra(reloj, id_ultimo_cliente, cola, tiempo_descenso):
    if cola:
        # id_ultimo_cliente = cola[0].id_cliente

        cliente = cola.pop(0)
        fin_descenso = reloj + tiempo_descenso
    else:
        return [reloj, id_ultimo_cliente, 0]  # No hay clientes en la cola

def simular(): # deberia recibir la situacion inicial de la simulacion
    reloj = 0; cola = []
    lim_inferior = 2.25; lim_superior = 2.75

    eventos = [] # Lista de eventos a procesar, pueden ser llegada_cliente(1), fin_descenso(2), fin_limpieza(3), fin_suspension(4)

    # Estados del cliente
    e_creado = Estado("C"); e_esperando_atencion = Estado("EA"); e_siendo_atendido = Estado("SA")
    # Estados de la alfombra
    e_libre = Estado("L"); e_ocupado = Estado("O"); e_en_limpieza = Estado("EL"); e_en_suspension = Estado("ES")

    inicializacion = Evento(0, reloj)  # Evento de inicialización
    # Insertar el evento de inicialización en la lista de eventos
    eventos.append(inicializacion)

    # Creamos alfombra
    alfombra = Alfombra(e_libre)

    # Crear un cliente y agregarlo a la cola
    # prox_cliente = llegada_cliente(reloj, 0, lim_inferior, lim_superior)
    # evento = Evento(1, prox_cliente.hora_llegada)  # Evento de llegada de cliente
    # insertar_ordenado(eventos, evento)
    # evento = Evento(1, 3.4500); insertar_ordenado(eventos, evento)
    # evento = Evento(1, 6.9000); insertar_ordenado(eventos, evento)
    # evento = Evento(1, 10.350); insertar_ordenado(eventos, evento)
    # evento = Evento(2, 8.0620); insertar_ordenado(eventos, evento)

    for e in range(len(eventos)):
        # print(f'{e + 1} -> | {eventos[e].nombre}  {eventos[e].reloj:0.4f}')
        if eventos[e].tipo == 0:
            # print(f'logica de inicialización')
            # definir llegada proximo cliente
            # crear alfombra en estado libre y con cola vacia
            # definir proximo evento de suspension
            # definir proximo evento de limpieza

            cliente = llegada_cliente(reloj, 0, lim_inferior, lim_superior)
            evento = Evento(1, cliente.hora_llegada)  # Evento de llegada de cliente
            insertar_ordenado(eventos, evento)


        elif eventos[e].tipo == 1:  # Llegada de cliente solo si la bandera de suspendida es False
            print(f'logica de llegada de cliente {eventos[e].reloj:0.4f}')

            # llegada del cliente es el evento en el que el cliente intenta ocupar la alfombra

            # si alfombra esta libre, ocuparla y definir fin_descenso -> cambiar estado del cliente a SA (siendo atendido)
            # si alfombra esta ocupada, agregar cliente a la cola (no se define fin_descenso) -> cambiar estado del cliente a EA (esperando atencion)

            # todo : implementar funcion de ocupar_alfombra, ya que se repite en la logica de fin de descenso
            # ocupar alfombra (si la alfombra estaba libre, entonces ocuparla y definir fin de descenso)
            # si la alfombra estaba ocupada, entonces agregar cliente a la cola (no se define fin de descenso)


        elif eventos[e].tipo == 2: # Fin de descenso
            print(f'logica de fin de descenso {eventos[e].reloj:0.4f}')
            # fin de descenso es el evento en el que el cliente termina de descender
            # si len(cola) > 0:
            # cola.pop(0) del primero (pasa a ser atendido)
            # si len(cola) == 0:
            # cambiar estado de la alfombra a libre


        elif eventos[e].tipo == 3:
            print(f'logica de fin de limpieza {eventos[e].reloj:0.4f}')
            #  fin de limpieza es el evento en el que la alfombra termina de limpiar al cliente
            #

        #todo: VAMOS A NECESITAR AGREGAR UN EVENTO DE INICIO DE SUSPENSION Y LIMPIEZA.
        #todo: YA QUE ES UN EVENTO QUE ENCIENDE LA BANDERA <suspendido>
        #todo: Y ELIMINA DE <eventos> LOS EVENTOS SIGUEINTES DE TIPO 1:llegada_cliente
        #todo: HASTA QUE SE VACIE LA COLA (TODOS LOS EVENTOS DE TIPO 2:fin_descenso)

    for i in range(len(eventos)):
        print(f'{i + 1} -> | {eventos[i].nombre}  {eventos[i].reloj:0.4f}')


