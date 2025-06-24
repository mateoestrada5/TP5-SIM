from pandas.core.interchange.from_dataframe import primitive_column_to_ndarray

from modules.runge_kutta import runge_kutta
from modules.utilities import buscar_cliente_por_id, eliminar_cliente_por_id
from modules.utilities import insertar_ordenado
from modules.clases import Estado, Cliente, Alfombra, Evento, Vector_estado
import random as r
import pandas as pd
from tabulate import tabulate


def llegada_cliente(rnd, lim_inferior, lim_superior):
    tiempo_llegada = round(lim_inferior + (lim_superior - lim_inferior) * rnd,4)
    return tiempo_llegada

def simular(semilla=None, hora_inicial=0, hora_fin=100, n_eventos_fin=10, hora_limite_espera_maxima=10, hora_limite_cola_maxima=10):
    reloj = hora_inicial; cola = []
    lim_inferior = 3; lim_superior = 4

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
    periodo_limpieza = 50
    duracion_limpieza = 10
    prox_limpieza = ''
    prox_suspension = ''  # Proximo evento de limpieza
    ult_inicio_suspension = 0  # Último inicio de suspensión




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

    clientes_en_sistema = []  # Contador de clientes en el sistema

    espera_cola_maxima = 0  # Tiempo máximo de espera en cola
    cola_maxima = 0
    cola_maxima_actual = 0  # Cola máxima actual
    contador_clientes_comienzan_descenso = 0
    acumulador_tiempos_espera = 0  # Acumulador de tiempos de espera de los clientes atendidos



    while (n_eventos_fin != 0 and e < n_eventos_fin) or (hora_fin != 0 and reloj < hora_fin):  # Mientras no sea el evento de fin de simulación o no se hayan procesado todos los eventos
        reloj = eventos[e].reloj  # Actualizar el reloj al tiempo del evento actual
        id_cliente_atendido = ''

        # llegada_cliente --
        rnd_ll = ''
        # tiempo_llegada = ''
        tiempo_ll_prox_cliente = ''

        # fin_descenso --
        tiempo_descenso = ''

        # servicios --
        fin_limpieza = ''



        #todo=================================================================================================================================================
        if eventos[e].tipo == 0:
            if hora_fin != 0:
                e_fin_simulacion = Evento(7, hora_fin)  # Evento de fin de simulación
                insertar_ordenado(eventos, e_fin_simulacion)  # Insertar el evento de fin de simulación en la lista de eventos

            # definir llegada proximo cliente - crear alfombra en estado libre y con cola vacia - definir proximo evento de suspension - definir proximo evento de limpieza
            alfombra = Alfombra(e_libre)

            rnd_ll = round(r.random(),4)
            tiempo_ll_prox_cliente = llegada_cliente(rnd_ll, lim_inferior, lim_superior)
            hora_ll = round(reloj + tiempo_ll_prox_cliente, 4)

            evento_llegada_cliente = Evento(1, hora_ll, cliente=id_ultimo_cliente + 1)  # Evento de llegada de cliente  # Agregar cliente a la lista de clientes del sistema
            insertar_ordenado(eventos, evento_llegada_cliente)

            prox_suspension = round(reloj + periodo_suspension, 4)
            evento_suspension = Evento(3, prox_suspension)
            prox_limpieza = reloj + periodo_limpieza
            evento_limpieza = Evento(5, prox_limpieza)
            insertar_ordenado(eventos, evento_suspension)
            insertar_ordenado(eventos, evento_limpieza)

            id_ultimo_cliente += 1  # Actualizar el ID del último cliente procesado


        #todo=================================================================================================================================================
        elif eventos[e].tipo == 1:  # Llegada de cliente solo si la bandera de suspendida es False
            if en_suspension or en_limpieza:
                hora_ll = ''
                e += 1
                continue

            id_ultimo_cliente = eventos[e].cliente  # ID del último cliente procesado
            cliente_que_llego = Cliente(eventos[e].cliente, e_creado, eventos[e].reloj)  # Crear cliente con el ID del evento y el reloj actual

            rnd_ll = round(r.random(), 4)

            tiempo_ll_prox_cliente = llegada_cliente(rnd_ll, lim_inferior, lim_superior)
            hora_ll = round(eventos[e].reloj + tiempo_ll_prox_cliente, 4)  # Hora de llegada del próximo cliente
            e_llegada_cliente_prox = Evento(1, hora_ll, cliente=(id_ultimo_cliente+1))  # Evento de llegada de cliente
            insertar_ordenado(eventos, e_llegada_cliente_prox)

            clientes.append(cliente_que_llego)  # Agregar cliente a la lista de clientes del sistema
            clientes_en_sistema.append(cliente_que_llego)  # Agregar cliente a la lista de clientes en el sistema

            # si alfombra esta libre, ocuparla y definir fin_descenso -> cambiar estado del cliente a SA (siendo atendido)
            if alfombra.estado.es_libre():
                alfombra.estado = e_ocupado
                cliente_que_llego.estado = e_siendo_atendido
                tiempo_descenso = tiempo_descenso_rk

                fin_descenso = round(eventos[e].reloj + tiempo_descenso, 4)
                id_fin_descenso = cliente_que_llego.id_cliente
                evento_fin_descenso = Evento(2, fin_descenso, cliente=id_fin_descenso)

                insertar_ordenado(eventos, evento_fin_descenso)
                contador_clientes_comienzan_descenso += 1



            else:
                cola.append(cliente_que_llego)  # Agregar cliente a la cola
                cliente_que_llego.estado = e_esperando_atencion  # Cambiar el estado del cliente a esperando atención

                if len(cola) > cola_maxima:
                    cola_maxima_actual = len(cola)
                    if reloj < hora_limite_cola_maxima * 60:
                        cola_maxima = cola_maxima_actual

            id_cliente_atendido = cliente_que_llego.id_cliente
            id_ultimo_cliente += 1  # Actualizar el ID del último cliente procesado

        #todo=================================================================================================================================================
        elif eventos[e].tipo == 2: # Fin de descenso
            cliente_atendido = buscar_cliente_por_id(clientes, eventos[e].cliente)
            id_cliente_atendido = cliente_atendido.id_cliente

            clientes_en_sistema.remove(cliente_atendido)  # Eliminar cliente del sistema

            if cola:
                cliente_a_ser_atendido = cola[0]
                cliente_a_ser_atendido.estado = e_siendo_atendido  # Cambiar estado del primer cliente de la cola a siendo atendido
                tiempo_descenso = tiempo_descenso_rk
                fin_descenso = round(eventos[e].reloj + tiempo_descenso_rk, 4)
                id_fin_descenso = cliente_a_ser_atendido.id_cliente  # ID del cliente que está siendo atendido
                contador_clientes_comienzan_descenso += 1

                tiempo_espera_cliente = cliente_a_ser_atendido.calcular_tiempo_espera(reloj)
                acumulador_tiempos_espera += round(tiempo_espera_cliente, 4)

                if tiempo_espera_cliente > espera_cola_maxima and reloj <= hora_limite_espera_maxima * 60:
                    espera_cola_maxima = round(tiempo_espera_cliente, 4)


                evento_fin_descenso = Evento(2, fin_descenso, cliente=cola[0].id_cliente)
                cola.pop(0)
                insertar_ordenado(eventos, evento_fin_descenso)

            else:
                tiempo_descenso = ''
                id_fin_descenso = ''
                fin_descenso = ''


                if en_suspension:
                    e_fin_suspension = Evento(4, reloj)  # Evento de fin de suspensión
                    insertar_ordenado(eventos, e_fin_suspension)
                elif en_limpieza:
                    fin_limpieza = round(reloj + duracion_limpieza, 4)
                    e_fin_limpieza = Evento(6, reloj + duracion_limpieza)  # Evento de fin de limpieza
                    insertar_ordenado(eventos, e_fin_limpieza)

                else: alfombra.estado = e_libre

        #todo=================================================================================================================================================
        elif eventos[e].tipo == 3: # Inicio de suspensión
            ult_inicio_suspension = prox_suspension  # Actualizar el último inicio de suspensión

            if alfombra.estado.es_libre():
                en_suspension = False  # Desactivar la bandera de suspensión
                evento_fin_suspension = Evento(4, reloj)  # Evento de fin de suspensión
                insertar_ordenado(eventos, evento_fin_suspension)

            elif en_limpieza:
                prox_suspension = ult_inicio_suspension + periodo_suspension  # Proxima suspensión después de la limpieza
                evento_prox_suspension = Evento(3, prox_suspension)
                insertar_ordenado(eventos, evento_prox_suspension)

            elif cola or alfombra.estado.es_ocupado():
                en_suspension = True  # Activar la bandera de suspensión
                ult_inicio_suspension = reloj  # Actualizar el último inicio de suspensión
                alfombra.estado = e_en_suspension  # Cambiar el estado de la alfombra a en suspensión
            e+=1
            continue # Continuar al siguiente evento sin procesar más eventos de llegada de clientes


        elif eventos[e].tipo == 4: # Fin de suspensión
            en_suspension = False  # Desactivar la bandera de suspensión

            if hora_ll == '':
                rnd_ll = round(r.random(),4)
                tiempo_ll_prox_cliente = llegada_cliente(rnd_ll, lim_inferior, lim_superior)

                hora_ll = round(tiempo_ll_prox_cliente + reloj, 4)  # Hora de llegada del próximo cliente
                evento_llegada_cliente = Evento(1, hora_ll, cliente=id_ultimo_cliente) # restar uno  # Evento de llegada de cliente
                insertar_ordenado(eventos, evento_llegada_cliente)

            prox_suspension = round(reloj + periodo_suspension,4)
            evento_prox_suspension = Evento(3, prox_suspension)  # Evento de inicio de suspensión
            insertar_ordenado(eventos, evento_prox_suspension)
            alfombra.estado = e_libre


        #todo=================================================================================================================================================
        elif eventos[e].tipo == 5:
            # Inicio de limpieza
            if en_suspension:
                en_suspension = False  # Desactivar la bandera de suspensión
                prox_suspension = ult_inicio_suspension + periodo_suspension  # Proxima suspensión después de la limpieza
                evento_prox_suspension = Evento(3, prox_suspension)  # Evento de fin de suspensión
                insertar_ordenado(eventos, evento_prox_suspension)


            if alfombra.estado.es_libre():
                fin_limpieza = round(reloj + duracion_limpieza, 4)  # Hora de finalización de la limpieza
                e_fin_limpieza = Evento(6,fin_limpieza)  # Evento de fin de limpieza
                insertar_ordenado(eventos, e_fin_limpieza)


            if cola or alfombra.estado.es_ocupado():
                alfombra.estado = e_en_limpieza
                en_limpieza = True
            prox_limpieza = ''
            # Eliminar eventos de llegada de clientes hasta que se vacíe la cola
            e += 1
            continue  # Continuar al siguiente evento sin procesar más eventos de llegada de clientes

        elif eventos[e].tipo == 6:  # Fin de limpieza
            en_limpieza = False  # Desactivar la bandera de limpieza

            if hora_ll == '':
                rnd_ll = round(r.random(),4)
                tiempo_ll_prox_cliente = llegada_cliente(rnd_ll, lim_inferior, lim_superior)

                hora_ll = round(reloj + tiempo_ll_prox_cliente, 4)  # Hora de llegada del próximo cliente
                evento_llegada_cliente = Evento(1, hora_ll , cliente=id_ultimo_cliente)  # Evento de llegada de cliente
                insertar_ordenado(eventos, evento_llegada_cliente)

            prox_limpieza = round(reloj + periodo_limpieza, 9)
            evento_prox_limpieza = Evento(5, prox_limpieza)
            insertar_ordenado(eventos, evento_prox_limpieza)
            alfombra.estado = e_libre

        #todo=================================================================================================================================================
        elif eventos[e].tipo == 7:  # Fin de simulación
            # Evento de fin de simulación
            hora_ll = ''
            rnd_ll = ''
            tiempo_ll_prox_cliente = ''
            tiempo_descenso = ''
            fin_descenso = ''
            id_fin_descenso = ''
            prox_suspension = ''
            prox_limpieza = ''


        vector_estado = Vector_estado(
            f'{eventos[e].nombre}', f'{eventos[e].reloj:0.2f}', id_cliente=id_cliente_atendido, rnd_ll=rnd_ll, tiempo_ll=tiempo_ll_prox_cliente,
            hora_ll=hora_ll, tiempo_descenso=tiempo_descenso, hora_fin_descenso=fin_descenso, id_cliente_descenso=id_fin_descenso, prox_suspension=prox_suspension,
            prox_limpieza=prox_limpieza, fin_limpieza=fin_limpieza, e_alfombra=alfombra.estado.nombre, cola=len(cola), acumulador_tiempo_espera=round(acumulador_tiempos_espera, 4),
            clientes_comienzan_atencion=contador_clientes_comienzan_descenso, cola_maxima_actual=cola_maxima_actual, espera_maxima_cola=espera_cola_maxima, clientes=clientes_en_sistema
        )

        ve = vector_estado.to_json()
        eventos_json.append(ve)
        if eventos[e].tipo == 7:
            break
        e += 1

    # print(contador_clientes_comienzan_descenso)
    # print(acumulador_tiempos_espera)
    # print(espera_cola_maxima)
    promedio_tiempo_espera = round(acumulador_tiempos_espera / contador_clientes_comienzan_descenso, 4) if contador_clientes_comienzan_descenso > 0 else 0
    # print(f'\nCantidad de clientes atendidos: {contador_clientes_comienzan_descenso}')
    # print(f'promedio tiempo de espera en cola: {promedio_tiempo_espera} segundos')
    # print(f'Cola maxima de clientes: {cola_maxima} clientes')

    pd.set_option('display.max_rows', None)      # Mostrar todas las filas
    pd.set_option('display.max_columns', None)   # Mostrar todas las columnas
    pd.set_option('display.width', None)         # No limitar el ancho del display
    pd.set_option('display.max_colwidth', None)  # Mostrar contenido completo de las celdas
    salida = pd.DataFrame(eventos_json)
    print(tabulate(salida, headers='keys', tablefmt='github', stralign='right', numalign='right'))

    salida_json = {
        "eventos": eventos_json,
        "cola_maxima": cola_maxima,
        "promedio_tiempo_espera": promedio_tiempo_espera,
        "contador_clientes_comienzan_descenso": contador_clientes_comienzan_descenso,
        "espera_cola_maxima": espera_cola_maxima,
        "runge_kutta": runge_kutta_json["lineas"][:5] + runge_kutta_json["lineas"][-5:]  # Retornar solo las primeras y últimas 5 líneas del Runge-Kutta
    }

    print(f"Salida json: "
          f"{salida_json['eventos']}"
          f"\ncola_maxima: {salida_json['cola_maxima']}"
          f"\npromedio_tiempo_espera: {salida_json['promedio_tiempo_espera']}"
          f"\ncontador_clientes_comienzan_descenso: {salida_json['contador_clientes_comienzan_descenso']}"
          f"\nespera_cola_maxima en las primeras: {salida_json['espera_cola_maxima']}"
          f"\nrunge_kutta: {salida_json['runge_kutta']}")



    return salida_json  # Retornar los eventos procesados en formato JSON

simular()

