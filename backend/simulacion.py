import time

from pandas.core.interchange.from_dataframe import primitive_column_to_ndarray

from modules.runge_kutta import runge_kutta
from modules.utilities import buscar_cliente_por_id, eliminar_cliente_por_id
from modules.utilities import insertar_ordenado, paginar_simulacion
from modules.clases import Estado, Cliente, Alfombra, Evento, Vector_estado
import random as r
import pandas as pd
from tabulate import tabulate


def llegada_cliente(rnd, lim_inferior, lim_superior):
    tiempo_llegada = round(lim_inferior + (lim_superior - lim_inferior) * rnd,4)
    return tiempo_llegada

def seguir_simulando(reloj, e, id_ultimo_cliente_descendido, id_cliente_fin_simulacion, n_eventos_fin, hora_fin):
    if hora_fin != '':
        return reloj < hora_fin
    elif id_cliente_fin_simulacion != '':
        return id_cliente_fin_simulacion != id_ultimo_cliente_descendido
    elif n_eventos_fin != '':
        return e <= n_eventos_fin
    return False



# def simular(semilla='', hora_inicial=0, hora_limite_espera_maxima=100, hora_limite_cola_maxima=10, hora_fin=10, n_eventos_fin='', id_cliente_fin_simulacion=''):
def simular(parametros):

    # Parametros de la simulación
    p_simulacion = parametros['config']

    semilla = p_simulacion['semilla']
    hora_fin = p_simulacion['tiempoLimite']
    id_cliente_fin_simulacion = p_simulacion['clienteX']
    n_eventos_fin = p_simulacion['cantidadEventos']
    hora_inicial = p_simulacion['hora_inicial']
    lim_inferior = p_simulacion['frecuenciaLlegadaMin']
    lim_superior = p_simulacion['frecuenciaLlegadaMax']
    periodo_suspension = p_simulacion['periodoSuspension']
    periodo_limpieza = p_simulacion['periodoLimpieza']
    duracion_limpieza = p_simulacion['duracionLimpieza']
    hora_limite_cola_espera_maxima = p_simulacion['colaEsperaMaximaHoras'] # falta

    desde_evento = p_simulacion['desdeEvento']
    cantidad_eventos_visualizar = p_simulacion['cantidadEventosVisualizar']

    # Parametros del Runge-Kutta
    p_runge_kutta = parametros['rungeKutta']

    t0 = p_runge_kutta['t0']  # Tiempo inicial
    x0 = p_runge_kutta['x0']
    h = p_runge_kutta['h']
    ec_a = p_runge_kutta['ecuacionA'] # Coeficiente A de la ecuacion diferencial
    ec_b = p_runge_kutta['ecuacionB'] # Coeficiente B de la ecuacion diferencial
    ec_c = p_runge_kutta['ecuacionC'] # Coeficiente C de la ecuacion diferencial (término independiente)
    xf = p_runge_kutta['xFinal'] # Largo de la alfombra




    tiempo_ejecucion_total = 0


    acumulador_tiempos_ejecucion = [0,0,0,0,0,0,0]




    reloj = hora_inicial; cola = []

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
    prox_limpieza = ''
    prox_suspension = ''  # Proximo evento de limpieza
    ult_inicio_suspension = 0  # Último inicio de suspensión
    id_ultimo_cliente_descendido = 0
    n_evento = 0
    matriz_vectores_estado = []  # Lista para almacenar los vectores de estado


    if semilla != '':
        r.seed(semilla)  # Fijar semilla para reproducibilidad

    # Estados del cliente
    e_creado = Estado("C"); e_esperando_atencion = Estado("EA"); e_siendo_atendido = Estado("SA")
    # Estados de la alfombra
    e_libre = Estado("L"); e_ocupado = Estado("O"); e_en_limpieza = Estado("EL"); e_en_suspension = Estado("ES")


    tiempo_descenso_rk, distancia, runge_kutta_json = runge_kutta(t0=t0, x0=x0, h=h, ec_a=ec_a, ec_b=ec_b, ec_c=ec_c, xf=xf)  # Ejecutar Runge-Kutta para obtener el tiempo de descenso y distancia recorrida

    eventos = [] # Lista de eventos a procesar, pueden ser llegada_cliente(1), fin_descenso(2), fin_limpieza(3), fin_suspension(4)

    inicializacion = Evento(0, reloj)  # Evento de inicialización
    eventos.append(inicializacion)

    clientes_en_sistema = []  # Contador de clientes en el sistema

    espera_cola_maxima = 0
    cola_maxima = 0
    cola_maxima_actual = 0
    contador_clientes_comienzan_descenso = 0
    acumulador_tiempos_espera = 0  # Acumulador de tiempos de espera de los clientes atendidos

    contador_clientes_que_llegaron = 0






    while seguir_simulando(reloj, n_evento, id_ultimo_cliente_descendido, id_cliente_fin_simulacion, n_eventos_fin, hora_fin):
        reloj = eventos[e].reloj  # Actualizar el reloj al tiempo del evento actual
        id_cliente_atendido = ''
          # Guardar el ID del último cliente procesado antes de actualizarlo

        # llegada_cliente --
        rnd_ll = ''
        # tiempo_llegada = ''
        tiempo_ll_prox_cliente = ''

        # fin_descenso --
        tiempo_descenso = ''

        # servicios --
        fin_limpieza = ''

        t_inicial_log = time.time()  # Iniciar el cronómetro para medir el tiempo de ejecución del evento actual





        #todo=================================================================================================================================================
        if eventos[e].tipo == 0:
            if hora_fin != '':
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

            contador_clientes_que_llegaron += 1
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

                alfombra.cliente_descendiendo = cliente_que_llego  # Cliente que está siendo atendido

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
                    if reloj < hora_limite_cola_espera_maxima * 60:
                        cola_maxima = cola_maxima_actual

            id_cliente_atendido = cliente_que_llego.id_cliente
            id_ultimo_cliente += 1  # Actualizar el ID del último cliente procesado


        #todo=================================================================================================================================================
        elif eventos[e].tipo == 2: # Fin de descenso
            cliente_atendido = alfombra.cliente_descendiendo
            id_cliente_atendido = cliente_atendido.id_cliente

            clientes_en_sistema.remove(cliente_atendido)  # Eliminar cliente del sistema
            id_ultimo_cliente_descendido = id_cliente_atendido


            # if cola:
            if cola:
                cliente_a_ser_atendido = cola[0]
                cliente_a_ser_atendido.estado = e_siendo_atendido  # Cambiar estado del primer cliente de la cola a siendo atendido
                tiempo_descenso = tiempo_descenso_rk
                fin_descenso = round(eventos[e].reloj + tiempo_descenso_rk, 4)
                id_fin_descenso = cliente_a_ser_atendido.id_cliente  # ID del cliente que está siendo atendido
                contador_clientes_comienzan_descenso += 1


                alfombra.cliente_descendiendo = cliente_a_ser_atendido  # Actualizar el cliente que está siendo atendido


                tiempo_espera_cliente = cliente_a_ser_atendido.calcular_tiempo_espera(reloj)
                acumulador_tiempos_espera += round(tiempo_espera_cliente, 4)

                if tiempo_espera_cliente > espera_cola_maxima and reloj <= hora_limite_cola_espera_maxima * 60:
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
            if en_suspension:
                en_suspension = False  # Desactivar la bandera de suspensión
                prox_suspension = ult_inicio_suspension + periodo_suspension  # Proxima suspensión después de la limpieza
                evento_prox_suspension = Evento(3, prox_suspension)  # Evento de fin de suspensión
                insertar_ordenado(eventos, evento_prox_suspension)

            if alfombra.estado.es_libre():
                en_limpieza = True
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

        vector_estado = Vector_estado(
            n_evento, f'{eventos[e].nombre}', f'{eventos[e].reloj:0.2f}', id_cliente=id_cliente_atendido, rnd_ll=rnd_ll, tiempo_ll=tiempo_ll_prox_cliente,
            hora_ll=hora_ll, tiempo_descenso=tiempo_descenso, hora_fin_descenso=fin_descenso, id_cliente_descenso=id_fin_descenso, prox_suspension=prox_suspension,
            prox_limpieza=prox_limpieza, fin_limpieza=fin_limpieza, e_alfombra=alfombra.estado.nombre, cola=len(cola), acumulador_tiempo_espera=round(acumulador_tiempos_espera, 4),
            clientes_comienzan_atencion=contador_clientes_comienzan_descenso, cola_maxima_actual=cola_maxima_actual, espera_maxima_cola=espera_cola_maxima, clientes=clientes_en_sistema
        )
        n_evento += 1

        matriz_vectores_estado.append(vector_estado.to_json())  # Agregar el vector de estado a la lista de vectores de estado

        ve = vector_estado.to_json()
        eventos_json.append(ve)

        acumulador_tiempos_ejecucion[eventos[e].tipo] += time.time() - t_inicial_log  # Acumular tiempo de ejecución del evento de inicialización

        e += 1

    promedio_tiempo_espera = round(acumulador_tiempos_espera / contador_clientes_comienzan_descenso, 4) if contador_clientes_comienzan_descenso > 0 else 0

    pd.set_option('display.max_rows', None)      # Mostrar todas las filas
    pd.set_option('display.max_columns', None)   # Mostrar todas las columnas
    pd.set_option('display.width', None)         # No limitar el ancho del display
    pd.set_option('display.max_colwidth', None)  # Mostrar contenido completo de las celdas
    salida = pd.DataFrame(eventos_json)
    # print(tabulate(salida, headers='keys', tablefmt='github', stralign='right', numalign='right'))


    # print("Tiempo de ejecución:", time.time() - log_tiempo_inicio, "segundos")
    for t in range(len(acumulador_tiempos_ejecucion)):
        print(f"Tiempo de ejecución del evento {t}: {acumulador_tiempos_ejecucion[t]:.4f} segundos")



    eventos_json = paginar_simulacion(matriz_vectores_estado, desde_evento, cantidad_eventos_visualizar)  # Paginación de eventos para visualización
    # print(f"Cantidad de eventos procesados: {len(eventos_json)}")


    salida_json = {
        "eventos": eventos_json,
        "contador_clientes_que_llegaron": contador_clientes_que_llegaron,
        "cola_maxima": cola_maxima,
        "acumulador_tiempos_espera": acumulador_tiempos_espera,
        "contador_clientes_comienzan_descenso": contador_clientes_comienzan_descenso,
        "promedio_tiempo_espera": promedio_tiempo_espera,
        "espera_cola_maxima": espera_cola_maxima,
        "runge_kutta": runge_kutta_json  # Retornar solo las primeras y últimas 5 líneas del Runge-Kutta
    }

    # print(f'{salida_json["eventos"]}\n'
    #       f'contador_clientes_que_llegaron: {salida_json["contador_clientes_que_llegaron"]}\n'
    #       f'cola_maxima: {salida_json["cola_maxima"]}\n'
    #       f'acumulador_tiempos_espera: {salida_json["acumulador_tiempos_espera"]}\n'
    #       f'contador_clientes_comienzan_descenso: {salida_json["contador_clientes_comienzan_descenso"]}\n'
    #       f'promedio_tiempo_espera: {salida_json["promedio_tiempo_espera"]}\n'
    #       f'espera_cola_maxima: {salida_json["espera_cola_maxima"]}\n'
    #       f'runge_kutta: {salida_json["runge_kutta"]}\n'
    #       )



    return salida_json  # Retornar los eventos procesados en formato JSON


parametros_guia = {
    "config": {
        "semilla": 10,
        "tiempoLimite": "",
        "clienteX": "",
        "cantidadEventos": 100000,
        "frecuenciaLlegadaMin": 3,
        "frecuenciaLlegadaMax": 10.5,
        "periodoSuspension": 20,
        "periodoLimpieza": 25,
        "duracionLimpieza": 20,
        "colaEsperaMaximaHoras": 10,
        "desdeEvento": 200,
        "cantidadEventosVisualizar": 50,
        "hora_inicial": 0
    },
    "rungeKutta": {
        "t0": 9,
        "x0": 0,
        "h": 0.001,
        "ecuacionA": 0.5,
        "ecuacionB": -0.2,
        "ecuacionC": 5,
        "xFinal": 120
    }
}

simular(parametros_guia)

