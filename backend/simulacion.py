from backend.modules.runge_kutta import runge_kutta
from backend.modules.utilities import buscar_cliente_por_id, eliminar_cliente_por_id
from modules.utilities import insertar_ordenado
from modules.clases import Estado, Cliente, Alfombra, Evento, Vector_estado
import random as r
import pandas as pd


def llegada_cliente(reloj, rnd, id_ultimo_cliente, lim_inferior, lim_superior):

    tiempo_llegada = round(lim_inferior + (lim_superior - lim_inferior) * rnd,4)
    hora_llegada = round(reloj + tiempo_llegada, 4)
    prox_cliente = Cliente(id_ultimo_cliente + 1, Estado("C"), hora_llegada)
    return tiempo_llegada, prox_cliente


def ocupar_alfombra(reloj, id_ultimo_cliente, cola, tiempo_descenso):
    if cola:
        # id_ultimo_cliente = cola[0].id_cliente

        cliente = cola.pop(0)
        fin_descenso = reloj + tiempo_descenso
    else:
        return [reloj, id_ultimo_cliente, 0]  # No hay clientes en la cola

def simular(semilla=None): # deberia recibir la situacion inicial de la simulacion
    reloj = 0; cola = []
    lim_inferior = 2.25; lim_superior = 2.75
    cola = [] # -> clientes en cola
    clientes = [] # -> clientes del sistema
    eventos_json = []
    e = 0 # Índice del evento actual
    hora_ll = ''  # Hora de llegada del próximo cliente

    # banderas y valores de contexto
    en_suspension = False  # Bandera para indicar si la alfombra está suspendida
    en_limpieza = False  # Bandera para indicar si la alfombra está en limpieza
    id_ultimo_cliente = 0  # ID del último cliente procesado
    fin_descenso = ''
    id_fin_descenso = ''
    periodo_suspension = 30  # Periodo de suspensión de la alfombra
    periodo_limpieza = 90
    duracion_limpieza = 10



    if semilla is not None:
        r.seed(semilla)  # Fijar semilla para reproducibilidad

    # Estados del cliente
    e_creado = Estado("C"); e_esperando_atencion = Estado("EA"); e_siendo_atendido = Estado("SA")
    # Estados de la alfombra
    e_libre = Estado("L"); e_ocupado = Estado("O"); e_en_limpieza = Estado("EL"); e_en_suspension = Estado("ES")


    tiempo_descenso_rk, distancia, runge_kutta_json = runge_kutta(ec_a=0.03)

    eventos = [] # Lista de eventos a procesar, pueden ser llegada_cliente(1), fin_descenso(2), fin_limpieza(3), fin_suspension(4)


    inicializacion = Evento(0, reloj)  # Evento de inicialización
    eventos.append(inicializacion)


    print(f'{"Evento":<30} {"Reloj":<10} - {"RND LL":<10} - {"Tiempo LL":<10} - {"Hora LL":<10} - {"Tiempo Descenso":<15} - {"Hora Fin Descenso":<20} - {"ID Cliente":<10} - {"Estado Alfombra":<15} - {"Cola":<10}')

    while e < len(eventos) and eventos[e].tipo != 7 and reloj < 160:  # Mientras no sea el evento de fin de simulación o no se hayan procesado todos los eventos

        # print(f'evento {e} -> len(eventos) = {len(eventos)}')

        reloj = eventos[e].reloj  # Actualizar el reloj al tiempo del evento actual
        id_cliente_atendido = ''

        # llegada_cliente --
        rnd_ll = ''
        tiempo_llegada = ''

        # fin_descenso --
        tiempo_descenso = ''


        #todo=================================================================================================================================================
        if eventos[e].tipo == 0:
            # definir llegada proximo cliente - crear alfombra en estado libre y con cola vacia - definir proximo evento de suspension - definir proximo evento de limpieza
            alfombra = Alfombra(e_libre)
            rnd_ll = round(r.random(),4)
            tiempo_llegada, prox_cliente = llegada_cliente(reloj, rnd_ll, id_ultimo_cliente, lim_inferior, lim_superior)
            evento_inicializacion = Evento(1, prox_cliente.hora_llegada, cliente=prox_cliente.id_cliente)  # Evento de llegada de cliente
            clientes.append(prox_cliente)  # Agregar cliente a la lista de clientes del sistema
            insertar_ordenado(eventos, evento_inicializacion)

            evento_suspension = Evento(3, reloj + periodo_suspension)
            evento_limpieza = Evento(5, reloj + periodo_limpieza)
            insertar_ordenado(eventos, evento_suspension)
            insertar_ordenado(eventos, evento_limpieza)

            hora_ll = prox_cliente.hora_llegada  # Hora de llegada del próximo cliente

            id_ultimo_cliente += 1  # Actualizar el ID del último cliente procesado


        #todo=================================================================================================================================================
        elif eventos[e].tipo == 1:  # Llegada de cliente solo si la bandera de suspendida es False
            if en_suspension or en_limpieza:
                e += 1
                continue

            cliente_que_llego = buscar_cliente_por_id(clientes, eventos[e].cliente)
            rnd_ll = round(r.random(), 4)
            tiempo_llegada, prox_cliente = llegada_cliente(eventos[e].reloj, rnd_ll, id_ultimo_cliente, lim_inferior, lim_superior)
            e_llegada_cliente_prox = Evento(1, prox_cliente.hora_llegada, cliente=prox_cliente.id_cliente)  # Evento de llegada de cliente
            insertar_ordenado(eventos, e_llegada_cliente_prox)
            clientes.append(prox_cliente)  # Agregar cliente a la lista de clientes del sistema

            # si alfombra esta libre, ocuparla y definir fin_descenso -> cambiar estado del cliente a SA (siendo atendido)
            if alfombra.estado.es_libre():
                # print(f'La alfombra está libre, ocupándola con el cliente {eventos[e].cliente}')
                alfombra.estado = e_ocupado
                cliente_que_llego.estado = e_siendo_atendido
                tiempo_descenso = tiempo_descenso_rk

                fin_descenso = round(eventos[e].reloj + tiempo_descenso, 4)
                id_fin_descenso = cliente_que_llego.id_cliente
                evento_fin_descenso = Evento(2, fin_descenso, cliente=id_fin_descenso)

                insertar_ordenado(eventos, evento_fin_descenso)
            else: cola.append(cliente_que_llego)  # Agregar cliente a la cola

            id_cliente_atendido = cliente_que_llego.id_cliente
            hora_ll = prox_cliente.hora_llegada


            id_ultimo_cliente += 1  # Actualizar el ID del último cliente procesado

        #todo=================================================================================================================================================
        elif eventos[e].tipo == 2: # Fin de descenso
            cliente_atendido = buscar_cliente_por_id(clientes, eventos[e].cliente)
            id_cliente_atendido = cliente_atendido.id_cliente
            if cola:
                cola[0].estado = e_siendo_atendido  # Cambiar estado del primer cliente de la cola a siendo atendido
                tiempo_descenso = tiempo_descenso_rk
                fin_descenso = round(eventos[e].reloj + tiempo_descenso_rk, 4)
                id_fin_descenso = cola[0].id_cliente  # ID del cliente que está siendo atendido

                evento_fin_descenso = Evento(2, fin_descenso, cliente=cola[0].id_cliente)
                cola.pop(0)
                insertar_ordenado(eventos, evento_fin_descenso)

            else:
                tiempo_descenso = ''
                id_fin_descenso = ''
                fin_descenso = ''
                alfombra.estado = e_libre

                if en_suspension:
                    e_fin_suspension = Evento(4, reloj)  # Evento de fin de suspensión
                    insertar_ordenado(eventos, e_fin_suspension)
                elif en_limpieza:
                    e_fin_limpieza = Evento(6, reloj + duracion_limpieza)  # Evento de fin de limpieza
                    insertar_ordenado(eventos, e_fin_limpieza)

        #todo=================================================================================================================================================
        elif eventos[e].tipo == 3: # Inicio de suspensión
            if cola or alfombra.estado.es_ocupado():
                hora_ll = ''
                en_suspension = True  # Activar la bandera de suspensión
                alfombra.estado = e_en_suspension  # Cambiar el estado de la alfombra a en suspensión
                e += 1
            continue # Continuar al siguiente evento sin procesar más eventos de llegada de clientes

        elif eventos[e].tipo == 4: # Fin de suspensión
            en_suspension = False  # Desactivar la bandera de suspensión

            rnd_ll = round(r.random(),4)
            tiempo_llegada, prox_cliente = llegada_cliente(reloj, rnd_ll, id_ultimo_cliente, lim_inferior, lim_superior)
            clientes.append(prox_cliente)  # Agregar cliente a la lista de clientes del sistema
            evento_llegada_cliente = Evento(1, prox_cliente.hora_llegada, cliente=prox_cliente.id_cliente)  # Evento de llegada de cliente
            insertar_ordenado(eventos, evento_llegada_cliente)
            hora_ll = prox_cliente.hora_llegada  # Hora de llegada del próximo cliente

        #todo=================================================================================================================================================
        elif eventos[e].tipo == 5:
            # print(f'Evento de limpieza: {eventos[e].reloj} -------------------------------------------------------------')
            # Inicio de limpieza
            if not en_limpieza:
                en_limpieza = True
                alfombra.estado = e_en_limpieza
                # Eliminar eventos de llegada de clientes hasta que se vacíe la cola
            e += 1
            continue  # Continuar al siguiente evento sin procesar más eventos de llegada de clientes

        elif eventos[e].tipo == 6:  # Fin de limpieza
            # print(f'Evento de fin de limpieza: {eventos[e].reloj} -------------------------------------------------------------')
            en_limpieza = False  # Desactivar la bandera de limpieza
            rnd_ll = round(r.random(),4)
            tiempo_llegada, prox_cliente = llegada_cliente(reloj, rnd_ll, id_ultimo_cliente, lim_inferior, lim_superior)
            clientes.append(prox_cliente)  # Agregar cliente a la lista de clientes del sistema
            evento_llegada_cliente = Evento(1, prox_cliente.hora_llegada, cliente=prox_cliente.id_cliente)  # Evento de llegada de cliente
            insertar_ordenado(eventos, evento_llegada_cliente)
            hora_ll = prox_cliente.hora_llegada  # Hora de llegada del próximo cliente






        #todo: VAMOS A NECESITAR AGREGAR UN EVENTO DE INICIO DE SUSPENSION Y LIMPIEZA.
        #todo: YA QUE ES UN EVENTO QUE ENCIENDE LA BANDERA <suspendido>
        #todo: Y ELIMINA DE <eventos> LOS EVENTOS SIGUEINTES DE TIPO 1:llegada_cliente
        #todo: HASTA QUE SE VACIE LA COLA (TODOS LOS EVENTOS DE TIPO 2:fin_descenso)

        #todo son eventos que no se ven en los vectores_estado

        vector_estado = Vector_estado(
            f'{eventos[e].nombre} _ {id_cliente_atendido}', f'{eventos[e].reloj:0.2f}', rnd_ll=rnd_ll, tiempo_ll=tiempo_llegada,
            hora_ll=hora_ll, tiempo_descenso=tiempo_descenso, hora_fin_descenso=fin_descenso, id_cliente=id_fin_descenso, e_alfombra=alfombra.estado.nombre, cola=len(cola)
        )

        ve = vector_estado.to_json()
        eventos_json.append(ve)
        # print(ve)
        # print(f'{ve["evento"]:<30} {ve["reloj"]:<10} | {ve["rnd_ll"]:<10} | {ve["tiempo_ll"]:<10} | {ve["hora_ll"]:<10} | {ve["tiempo_descenso"]:<15} | {ve["hora_fin_descenso"]:<20} | {ve["id_cliente"]:<10} | {ve["estado_alfombra"]:<15} | {ve["cola"]:<10}')

        e += 1

    for ejson in eventos_json:
        print(ejson)

    return eventos_json  # Retornar los eventos procesados en formato JSON

simular()
