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

    # banderas y valores de contexto
    en_suspension = False  # Bandera para indicar si la alfombra está suspendida
    en_limpieza = False  # Bandera para indicar si la alfombra está en limpieza
    id_ultimo_cliente = 0  # ID del último cliente procesado
    fin_descenso = ''
    id_fin_descenso = ''



    if semilla is not None:
        r.seed(semilla)  # Fijar semilla para reproducibilidad

    # Estados del cliente
    e_creado = Estado("C"); e_esperando_atencion = Estado("EA"); e_siendo_atendido = Estado("SA")
    # Estados de la alfombra
    e_libre = Estado("L"); e_ocupado = Estado("O"); e_en_limpieza = Estado("EL"); e_en_suspension = Estado("ES")


    tiempo_descenso, distancia, runge_kutta_json = runge_kutta(ec_a=0.03)

    eventos = [] # Lista de eventos a procesar, pueden ser llegada_cliente(1), fin_descenso(2), fin_limpieza(3), fin_suspension(4)


    inicializacion = Evento(0, reloj)  # Evento de inicialización
    eventos.append(inicializacion)


    print(f'{"Evento":<30} {"Reloj":<10} - {"RND LL":<10} - {"Tiempo LL":<10} - {"Hora LL":<10} - {"Tiempo Descenso":<15} - {"Hora Fin Descenso":<20} - {"ID Cliente":<10} - {"Estado Alfombra":<15} - {"Cola":<10}')

    while eventos[e].tipo != 7 and e < len(eventos) and reloj < 30:  # Mientras no sea el evento de fin de simulación o no se hayan procesado todos los eventos
    # for e in range(len(eventos)):

        # print(f'{e + 1} -> | {eventos[e].nombre}  {eventos[e].reloj:0.4f}')
        reloj = eventos[e].reloj  # Actualizar el reloj al tiempo del evento actual
        if eventos[e].tipo == 0:
            # print(f'logica de inicialización') - definir llegada proximo cliente - crear alfombra en estado libre y con cola vacia - definir proximo evento de suspension - definir proximo evento de limpieza

            # Creamos alfombra
            alfombra = Alfombra(e_libre)

            rnd_ll = round(r.random(),4)

            tiempo_llegada, prox_cliente = llegada_cliente(reloj, rnd_ll, id_ultimo_cliente, lim_inferior, lim_superior)

            evento = Evento(1, prox_cliente.hora_llegada, cliente=prox_cliente.id_cliente)  # Evento de llegada de cliente
            clientes.append(prox_cliente)  # Agregar cliente a la lista de clientes del sistema

            insertar_ordenado(eventos, evento)

            vector_estado = Vector_estado(inicializacion.nombre, inicializacion.reloj, rnd_ll=rnd_ll, tiempo_ll=tiempo_llegada, hora_ll=prox_cliente.hora_llegada, e_alfombra=alfombra.estado.nombre, cola=len(cola))
            eventos_json.append(vector_estado.to_json())

            id_ultimo_cliente += 1  # Actualizar el ID del último cliente procesado

        #todo=================================================================================================================================================
        elif eventos[e].tipo == 1:  # Llegada de cliente solo si la bandera de suspendida es False
            # llegada del cliente es el evento en el que el cliente intenta ocupar la alfombra
            rnd_ll = round(r.random(), 4)

            cliente_que_llego = buscar_cliente_por_id(clientes, eventos[e].cliente)

            tiempo_llegada, prox_cliente = llegada_cliente(eventos[e].reloj, rnd_ll, id_ultimo_cliente, lim_inferior, lim_superior)
            e_llegada_cliente_prox = Evento(1, prox_cliente.hora_llegada, cliente=prox_cliente.id_cliente)  # Evento de llegada de cliente
            insertar_ordenado(eventos, e_llegada_cliente_prox)
            clientes.append(prox_cliente)  # Agregar cliente a la lista de clientes del sistema




            # si alfombra esta libre, ocuparla y definir fin_descenso -> cambiar estado del cliente a SA (siendo atendido)
            if alfombra.estado.es_libre():
                # print(f'La alfombra está libre, ocupándola con el cliente {eventos[e].cliente}')
                alfombra.estado = e_ocupado
                cliente_que_llego.estado = e_siendo_atendido

                fin_descenso = round(eventos[e].reloj + tiempo_descenso, 4)
                id_fin_descenso = cliente_que_llego.id_cliente
                evento_fin_descenso = Evento(2, fin_descenso, cliente=id_fin_descenso)

                insertar_ordenado(eventos, evento_fin_descenso)




            else:
                cola.append(cliente_que_llego)  # Agregar cliente a la cola


            vector_estado = Vector_estado(
                f'{eventos[e].nombre} ({cliente_que_llego.id_cliente})', eventos[e].reloj, rnd_ll=rnd_ll, tiempo_ll=tiempo_llegada,
                hora_ll=prox_cliente.hora_llegada, tiempo_descenso=tiempo_descenso, hora_fin_descenso=fin_descenso, id_cliente=id_fin_descenso, e_alfombra=alfombra.estado.nombre, cola=len(cola)
            )

            eventos_json.append(vector_estado.to_json())


            cat_cola = ''
            for c in cola:
                cat_cola += f'{c.id_cliente} '

            ve = vector_estado.to_json()
            print(f'{ve["evento"]:<30} {ve["reloj"]:<10} - {ve["rnd_ll"]:<10} - {ve["tiempo_ll"]:<10} - {ve["hora_ll"]:<10} - {ve["tiempo_descenso"]:<15} - {ve["hora_fin_descenso"]:<20} - {ve["id_cliente"]:<10} - {ve["estado_alfombra"]:<15} - {ve["cola"]:<10} | {cat_cola:<10}')



            # si alfombra esta ocupada, agregar cliente a la cola (no se define fin_descenso) -> cambiar estado del cliente a EA (esperando atencion)

            # todo : implementar funcion de ocupar_alfombra, ya que se repite en la logica de fin de descenso
            # ocupar alfombra (si la alfombra estaba libre, entonces ocuparla y definir fin de descenso)
            # si la alfombra estaba ocupada, entonces agregar cliente a la cola (no se define fin de descenso)



            id_ultimo_cliente += 1  # Actualizar el ID del último cliente procesado

        #todo=================================================================================================================================================
        elif eventos[e].tipo == 2: # Fin de descenso
            # fin de descenso es el evento en el que el cliente termina de descender
            # si len(cola) > 0:
            # cola.pop(0) del primero (pasa a ser atendido)
            # si len(cola) == 0:
            # cambiar estado de la alfombra a libre

            cliente_atendido = buscar_cliente_por_id(clientes, eventos[e].cliente)
            if cola:
                cola[0].estado = e_siendo_atendido  # Cambiar estado del primer cliente de la cola a siendo atendido
                fin_descenso = round(eventos[e].reloj + tiempo_descenso, 4)
                id_fin_descenso = cola[0].id_cliente  # ID del cliente que está siendo atendido

                evento_fin_descenso = Evento(2, fin_descenso, cliente=cola[0].id_cliente)
                cola.pop(0)
                insertar_ordenado(eventos, evento_fin_descenso)

            else:
                alfombra.estado = e_libre


            vector_estado = Vector_estado(
                f'{eventos[e].nombre} ({cliente_atendido.id_cliente})', f'{eventos[e].reloj:0.2f}', rnd_ll=' ', tiempo_ll=' ',
                hora_ll=prox_cliente.hora_llegada, tiempo_descenso=tiempo_descenso, hora_fin_descenso=fin_descenso, id_cliente=id_fin_descenso, e_alfombra=alfombra.estado.nombre, cola=len(cola)
            )

            cat_cola = ''
            for c in cola:
                cat_cola += f'{c.id_cliente} '

            ve = vector_estado.to_json()
            print(f'{ve["evento"]:<30} {ve["reloj"]:<10} - {ve["rnd_ll"]:<10} - {ve["tiempo_ll"]:<10} - {ve["hora_ll"]:<10} - {ve["tiempo_descenso"]:<15} - {ve["hora_fin_descenso"]:<20} - {ve["id_cliente"]:<10} - {ve["estado_alfombra"]:<15} - {ve["cola"]:<10} | {cat_cola:<10}')

            eventos_json.append(vector_estado.to_json())


        #todo=================================================================================================================================================
        elif eventos[e].tipo == 3:
            print(f'logica de fin de limpieza {eventos[e].reloj:0.4f}')
            #  fin de limpieza es el evento en el que la alfombra termina de limpiar al cliente
            #


        #todo: VAMOS A NECESITAR AGREGAR UN EVENTO DE INICIO DE SUSPENSION Y LIMPIEZA.
        #todo: YA QUE ES UN EVENTO QUE ENCIENDE LA BANDERA <suspendido>
        #todo: Y ELIMINA DE <eventos> LOS EVENTOS SIGUEINTES DE TIPO 1:llegada_cliente
        #todo: HASTA QUE SE VACIE LA COLA (TODOS LOS EVENTOS DE TIPO 2:fin_descenso)

        e += 1

    # print(f'{"Evento":<30} {"Reloj":<10} - {"RND LL":<10} - {"Tiempo LL":<10} - {"Hora LL":<10} - {"Tiempo Descenso":<15} - {"Hora Fin Descenso":<20} - {"ID Cliente":<10} - {"Estado Alfombra":<15} - {"Cola":<10}')
    #
    # for ejson in eventos_json:
    #
    #     print(f'{ejson["evento"]:<30} {ejson["reloj"]:<10} - {ejson["rnd_ll"]:<10} - {ejson["tiempo_ll"]:<10} - {ejson["hora_ll"]:<10} - {ejson["tiempo_descenso"]:<15} - {ejson["hora_fin_descenso"]:<20} - {ejson["id_cliente"]:<10} - {ejson["estado_alfombra"]:<15}')
    #     #print(f'{ejson["evento"]} {ejson["reloj"]:0.4f} - {ejson["rnd_ll"]} - {ejson["tiempo_ll"]} - {ejson["hora_ll"]} - {ejson["tiempo_descenso"]} - {ejson["hora_fin_descenso"]} - {ejson["id_cliente"]} - {ejson["estado_alfombra"]} - {ejson["cola"]}')



    return eventos_json  # Retornar los eventos procesados en formato JSON

simular()
