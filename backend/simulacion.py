from modules.runge_kutta import runge_kutta
from modules.utilities import insertar_ordenado, paginar_simulacion, eliminar_cliente_por_id
from modules.clases import Estado, Cliente, Alfombra, Evento, Vector_estado
import random as r
import time


# Llegada de clientes por distribución Uniforme
def llegada_cliente(rnd, lim_inferior, lim_superior):
    tiempo_llegada = round(lim_inferior + (lim_superior - lim_inferior) * rnd,4)
    return tiempo_llegada

# Validaciones para comprobar si se debe continuar la simulación
def seguir_simulando(reloj, e, id_ultimo_cliente_descendido, id_cliente_fin_simulacion, n_eventos_fin, hora_fin):
    if hora_fin != '':
        return reloj < hora_fin
    elif id_cliente_fin_simulacion != '':
        return id_cliente_fin_simulacion != id_ultimo_cliente_descendido
    elif n_eventos_fin != '':
        return e <= n_eventos_fin
    return False


def simular(parametros):

    tt_inicio_simulacion = time.time()  # Tiempo de inicio de la simulación

    # Parametros de la simulación
    p_simulacion = parametros['config']

    semilla = p_simulacion['semilla']

    # Condiciones de Corte
    hora_fin = p_simulacion['tiempoLimite']                 # La simulacion dura hasta un tiempo maximo en el reloj
    id_cliente_fin_simulacion = p_simulacion['clienteX']    # La simulacion termina cuando el cliente X desciende
    n_eventos_fin = p_simulacion['cantidadEventos']         # La simulacion dura N eventos

    hora_inicial = p_simulacion['horaInicio']               # Hora en que empieza la simulacion

    # Intervalo de llegada
    lim_inferior = p_simulacion['frecuenciaLlegadaMin']
    lim_superior = p_simulacion['frecuenciaLlegadaMax']

    periodo_suspension = p_simulacion['periodoSuspension']

    periodo_limpieza = p_simulacion['periodoLimpieza']
    duracion_limpieza = p_simulacion['duracionLimpieza']

    hora_limite_cola_espera_maxima = p_simulacion['colaEsperaMaximaHoras']

    desde_evento = p_simulacion['eventoInicial']
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


    reloj = hora_inicial

    cola = [] # -> clientes en cola
    e = 0 # Índice del evento actual
    hora_ll = ''  # Hora de llegada del próximo cliente

    # banderas y valores de contexto
    en_suspension = False  # Bandera para indicar si la alfombra está suspendida
    en_limpieza = False  # Bandera para indicar si la alfombra está en limpieza
    id_ultimo_cliente = 0  # ID del último cliente procesado
    fin_descenso = ''
    id_fin_descenso = ''
    prox_limpieza = ''          # Proximo evento de limpieza
    prox_suspension = ''        # Proximo evento de suspesión
    ult_inicio_suspension = 0   # Último inicio de suspensión
    id_ultimo_cliente_descendido = 0
    n_evento = 0
    matriz_vectores_estado = []  # Lista para almacenar los vectores de estado


    # En caso de recibir un valor de semilla como parametro se asigna.
    if semilla != '':
        r.seed(semilla)  # Fijar semilla para reproducibilidad

    # Instancias de Estado
    # Estados del cliente
    e_creado = Estado("C"); e_esperando_atencion = Estado("EA"); e_siendo_atendido = Estado("SA")
    # Estados de la alfombra
    e_libre = Estado("L"); e_ocupado = Estado("O"); e_en_limpieza = Estado("EL"); e_en_suspension = Estado("ES")


    tiempo_descenso_rk, distancia, runge_kutta_json = runge_kutta(t0=t0, x0=x0, h=h, ec_a=ec_a, ec_b=ec_b, ec_c=ec_c, xf=xf)  # Ejecutar Runge-Kutta para obtener el tiempo de descenso y distancia recorrida

    eventos = [] # Lista de eventos a procesar, pueden ser llegada_cliente(1), fin_descenso(2), fin_limpieza(3), fin_suspension(4)

    # SE CREA EL EVENTO INICIALIZACIÓN
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
        # Valores que deben ser reiniciados en cada fila del vector estado.
        reloj = eventos[e].reloj  # Actualizar el reloj al tiempo del evento actual
        id_cliente_atendido = ''
        rnd_ll = ''
        tiempo_ll_prox_cliente = ''
        tiempo_descenso = ''
        fin_limpieza = ''

        #todo=================================================================================================================================================
        # INICIALIZACIÓN
        if eventos[e].tipo == 0: # ¿El evento actual es Inicialización?

            if hora_fin != '':  # ¿El evento de corte es por hora limite?
                e_fin_simulacion = Evento(7, hora_fin)  # Evento de fin de simulación
                insertar_ordenado(eventos, e_fin_simulacion, pos_actual=e)  # Insertar el evento de fin de simulación en la lista de eventos

            alfombra = Alfombra(e_libre) # Creación del objeto alfombra, inicializada en Libre

            # Llegada Cliente
            rnd_ll = round(r.random(),4)
            tiempo_ll_prox_cliente = llegada_cliente(rnd_ll, lim_inferior, lim_superior)
            hora_ll = round(reloj + tiempo_ll_prox_cliente, 4)

            # Crea el primer evento de llegada
            evento_llegada_cliente = Evento(1, hora_ll, cliente=id_ultimo_cliente + 1)  # Evento de llegada de cliente  # Agregar cliente a la lista de clientes del sistema
            insertar_ordenado(eventos, evento_llegada_cliente, pos_actual=e)

            # Crea el proximo evento de suspensión
            prox_suspension = round(reloj + periodo_suspension, 4)
            evento_suspension = Evento(3, prox_suspension)
            insertar_ordenado(eventos, evento_suspension, pos_actual=e)

            # Crea el proximo evento de limpieza
            prox_limpieza = reloj + periodo_limpieza
            evento_limpieza = Evento(5, prox_limpieza)
            insertar_ordenado(eventos, evento_limpieza, pos_actual=e)

            id_ultimo_cliente += 1  # Actualizar el ID del último cliente procesado

        #todo=================================================================================================================================================
        # LLEGADA DE CLIENTE
        elif eventos[e].tipo == 1:  # Llegada de cliente solo si la bandera de suspendida es False
            if en_suspension or en_limpieza:
                hora_ll = ''
                e += 1
                continue

            id_ultimo_cliente = eventos[e].cliente  # ID del último cliente procesado
            # Creación de Cliente = {id, estado creado, hora de llegada}
            cliente_que_llego = Cliente(eventos[e].cliente, e_creado, eventos[e].reloj)  # Crear cliente con el ID del evento y el reloj actual
            contador_clientes_que_llegaron += 1

            # Proxima Llegada
            rnd_ll = round(r.random(), 4)
            tiempo_ll_prox_cliente = llegada_cliente(rnd_ll, lim_inferior, lim_superior)
            hora_ll = round(eventos[e].reloj + tiempo_ll_prox_cliente, 4)  # Hora de llegada del próximo cliente
            e_llegada_cliente_prox = Evento(1, hora_ll, cliente=(id_ultimo_cliente+1))  # Evento de llegada de cliente
            insertar_ordenado(eventos, e_llegada_cliente_prox, pos_actual=e)

            clientes_en_sistema.append(cliente_que_llego)  # Agregar cliente a la lista de clientes en el sistema

            # si alfombra esta libre, ocuparla y definir fin_descenso -> cambiar estado del cliente a SA (siendo atendido)
            if alfombra.estado.es_libre():
                alfombra.estado = e_ocupado
                cliente_que_llego.estado = e_siendo_atendido
                tiempo_descenso = tiempo_descenso_rk

                alfombra.cliente_descendiendo = cliente_que_llego  # Cliente que está siendo atendido

                fin_descenso = round(eventos[e].reloj + tiempo_descenso, 4)
                id_fin_descenso = cliente_que_llego.id_cliente

                # Crear e insertar evento de Fin Descenso
                evento_fin_descenso = Evento(2, fin_descenso, cliente=id_fin_descenso)
                insertar_ordenado(eventos, evento_fin_descenso, pos_actual=e)
                contador_clientes_comienzan_descenso += 1

            else: # Si la alfombra esta ocupada, añadir el cliente a la  cola
                cola.append(cliente_que_llego)  # Agregar cliente a la cola
                cliente_que_llego.estado = e_esperando_atencion  # Cambiar el estado del cliente a esperando atención

                # CALCULO DE TAMAÑO MAXIMO EN LA COLA
                if len(cola) > cola_maxima:
                    cola_maxima_actual = len(cola)
                    if reloj < hora_limite_cola_espera_maxima * 60:
                        cola_maxima = cola_maxima_actual

            id_cliente_atendido = cliente_que_llego.id_cliente
            id_ultimo_cliente += 1  # Actualizar el ID del último cliente procesado

        #todo=================================================================================================================================================
        # FIN DE DESCENSO
        elif eventos[e].tipo == 2:

            cliente_atendido = alfombra.cliente_descendiendo
            id_cliente_atendido = cliente_atendido.id_cliente

            id_ultimo_cliente_descendido = id_cliente_atendido
            clientes_en_sistema.remove(cliente_atendido)  # Eliminar cliente del sistema

            # Comprueba si hay alguien en la cola
            if cola:
                cliente_a_ser_atendido = cola[0]
                cliente_a_ser_atendido.estado = e_siendo_atendido  # Cambiar estado del primer cliente de la cola a siendo atendido
                tiempo_descenso = tiempo_descenso_rk
                fin_descenso = round(eventos[e].reloj + tiempo_descenso, 4)
                id_fin_descenso = cliente_a_ser_atendido.id_cliente  # ID del cliente que está siendo atendido
                contador_clientes_comienzan_descenso += 1

                alfombra.cliente_descendiendo = cliente_a_ser_atendido  # Actualizar el cliente que está siendo atendido

                # CALCULO DE TIEMPO DE ESPERA DE UN CLIENTE
                tiempo_espera_cliente = cliente_a_ser_atendido.calcular_tiempo_espera(reloj)
                acumulador_tiempos_espera += round(tiempo_espera_cliente, 4)

                # CALCULO DE TIEMPO DE ESPERA EN COLA MAXIMO
                if tiempo_espera_cliente > espera_cola_maxima and reloj <= hora_limite_cola_espera_maxima * 60:
                    espera_cola_maxima = round(tiempo_espera_cliente, 4)

                # Crea el evento Fin de Descenso para el nuevo cliente que comenzo a ser atentido
                evento_fin_descenso = Evento(2, fin_descenso, cliente=cola[0].id_cliente)
                cola.pop(0)
                insertar_ordenado(eventos, evento_fin_descenso, pos_actual=e)

            else:
                tiempo_descenso = ''
                id_fin_descenso = ''
                fin_descenso = ''

                # En caso de que la cola se haya vaciado por una suspensión
                if en_suspension:
                    # Genera evento fin de suspensión
                    e_fin_suspension = Evento(4, reloj)  # Evento de fin de suspensión ocurre ahora
                    insertar_ordenado(eventos, e_fin_suspension, pos_actual=e)

                # En caso de que la cola se haya vaciado por una limpieza
                elif en_limpieza:
                    # Genera evento fin de limpieza
                    fin_limpieza = round(reloj + duracion_limpieza, 4)
                    e_fin_limpieza = Evento(6, reloj + duracion_limpieza)  # Evento de fin de limpieza luego del tiempo de limpieza
                    insertar_ordenado(eventos, e_fin_limpieza, pos_actual=e)

                # Define el estado de la alfombra como Libre
                else: alfombra.estado = e_libre


        #todo=================================================================================================================================================
        # SUSPENSIÓN

        #todo
        # INICIO SUSPENSIÓN (EVENTO LÓGICO)
        elif eventos[e].tipo == 3:
            ult_inicio_suspension = prox_suspension  # Actualizar el último inicio de suspensión

            # Comprueba qué ocurre cuando se intenta hacer una suspensión cuando la alfombra está Libre
            if alfombra.estado.es_libre():
                en_suspension = False  # Desactivar la bandera de suspensión
                # Genera el evento fin de suspensión en ese momento.
                evento_fin_suspension = Evento(4, reloj)  # Evento de fin de suspensión
                insertar_ordenado(eventos, evento_fin_suspension, pos_actual=e)

            # Comprueba qué ocurre cuando se intenta hacer una suspensión cuando la alfombra está En Limpieza
            elif en_limpieza:
                prox_suspension = ult_inicio_suspension + periodo_suspension  # Proxima suspensión después de la limpieza
                # Posterga el evento de fin de suspensión.
                evento_prox_suspension = Evento(3, prox_suspension)
                insertar_ordenado(eventos, evento_prox_suspension, pos_actual=e)

            # Caso de una suspensión
            elif cola or alfombra.estado.es_ocupado():
                en_suspension = True  # Activar la bandera de suspensión
                ult_inicio_suspension = reloj  # Actualizar el último inicio de suspensión
                alfombra.estado = e_en_suspension  # Cambiar el estado de la alfombra a en suspensión
            e+=1
            continue # Continuar al siguiente evento sin procesar más eventos de llegada de clientes

        #todo
        # FIN DE SUSPENSIÓN
        elif eventos[e].tipo == 4:
            en_suspension = False  # Desactivar la bandera de suspensión

            # ¿Ya habia una hora de llegada y se terminó la suspensión antes?
            if hora_ll == '':
                # Habilita denuevo las llegadas y se define la proxima llegada
                rnd_ll = round(r.random(),4)
                tiempo_ll_prox_cliente = llegada_cliente(rnd_ll, lim_inferior, lim_superior)
                hora_ll = round(tiempo_ll_prox_cliente + reloj, 4)
                # Se crea el evento de la proxima llegada
                evento_llegada_cliente = Evento(1, hora_ll, cliente=id_ultimo_cliente) # Evento de llegada de cliente
                insertar_ordenado(eventos, evento_llegada_cliente, pos_actual=e)

            # Se genera el siguiente evento de suspensión
            prox_suspension = round(reloj + periodo_suspension,4)
            evento_prox_suspension = Evento(3, prox_suspension)  # Evento de inicio de suspensión
            insertar_ordenado(eventos, evento_prox_suspension, pos_actual=e)
            alfombra.estado = e_libre

        #todo=================================================================================================================================================
        # LIMPIEZA

        #todo
        # INICIO LIMPIEZA (EVENTO LÓGICO)
        elif eventos[e].tipo == 5:
            # Cancela la suspensión y prioriza las operaciones de limpieza
            if en_suspension:
                en_suspension = False  # Desactivar la bandera de suspensión
                # Posterga la suspensión
                prox_suspension = ult_inicio_suspension + periodo_suspension  # Proxima suspensión después de la limpieza
                evento_prox_suspension = Evento(3, prox_suspension)  # Evento de fin de suspensión
                insertar_ordenado(eventos, evento_prox_suspension, pos_actual=e)

            # Comprueba qué ocurre cuando intenta realizar una limpieza y la alfombra esta Libre
            if alfombra.estado.es_libre():
                en_limpieza = True
                fin_limpieza = round(reloj + duracion_limpieza, 4)  # Hora de finalización de la limpieza
                # Genera el evento fin de limpieza
                e_fin_limpieza = Evento(6,fin_limpieza)  # Evento de fin de limpieza
                insertar_ordenado(eventos, e_fin_limpieza, pos_actual=e)

            # Caso de una limpieza
            if cola or alfombra.estado.es_ocupado():
                alfombra.estado = e_en_limpieza
                en_limpieza = True
            prox_limpieza = ''
            e += 1
            continue  # Continuar al siguiente evento sin procesar más eventos de llegada de clientes

        #todo
        # FIN DE LIMPIEZA
        elif eventos[e].tipo == 6:  # Fin de limpieza
            en_limpieza = False  # Desactivar la bandera de limpieza

            # ¿Qué ocurre cuando hay una proxima llegada luego de que termine la limpieza?
            if hora_ll == '':
                rnd_ll = round(r.random(),4)
                tiempo_ll_prox_cliente = llegada_cliente(rnd_ll, lim_inferior, lim_superior)
                # Genera la proxima llegada de cliente
                hora_ll = round(reloj + tiempo_ll_prox_cliente, 4)  # Hora de llegada del próximo cliente
                evento_llegada_cliente = Evento(1, hora_ll , cliente=id_ultimo_cliente)  # Evento de llegada de cliente
                insertar_ordenado(eventos, evento_llegada_cliente, pos_actual=e)

            # Genera la proxima limpieza
            prox_limpieza = round(reloj + periodo_limpieza, 9)
            evento_prox_limpieza = Evento(5, prox_limpieza)
            insertar_ordenado(eventos, evento_prox_limpieza, pos_actual=e)
            alfombra.estado = e_libre

        #todo=================================================================================================================================================

        # Objeto Vector Estado
        vector_estado = Vector_estado(
            # ENCABEZADO - VALOR
            n_evento,
            f'{eventos[e].nombre}',
            f'{eventos[e].reloj:0.2f}',
            id_cliente=id_cliente_atendido,
            rnd_ll=rnd_ll,
            tiempo_ll=tiempo_ll_prox_cliente,
            hora_ll=hora_ll,
            tiempo_descenso=tiempo_descenso,
            hora_fin_descenso=fin_descenso,
            id_cliente_descenso=id_fin_descenso,
            prox_suspension=round(prox_suspension,4),
            prox_limpieza=prox_limpieza,
            fin_limpieza=fin_limpieza,
            e_alfombra=alfombra.estado.nombre,
            cola=len(cola),
            acumulador_tiempo_espera=round(acumulador_tiempos_espera, 4),
            clientes_comienzan_atencion=contador_clientes_comienzan_descenso,
            cola_maxima_actual=cola_maxima_actual,
            espera_maxima_cola=espera_cola_maxima,
            clientes=clientes_en_sistema
        )

        n_evento += 1
        matriz_vectores_estado.append(vector_estado.to_json())  # Agregar el vector de estado a la lista de vectores de estado
        e += 1


        #todo
        # PORCENTAJE DE PROGRESO
        if n_eventos_fin != '':
            print(f'Progreso: {((n_evento-1) / n_eventos_fin) * 100:.2f}%')
        elif hora_fin != '':
            print(f'Progreso: {((reloj - hora_inicial) / (hora_fin - hora_inicial)) * 100:.2f}%')
        elif id_cliente_fin_simulacion != '':
            print(f'Progreso: {((id_ultimo_cliente_descendido) / id_cliente_fin_simulacion) * 100:.2f}%')


    # FIN DEL WHILE

    #todo
    # CALCULO DE ESTADISTICAS
    promedio_tiempo_espera = round(acumulador_tiempos_espera / contador_clientes_comienzan_descenso, 4) if contador_clientes_comienzan_descenso > 0 else 0
    eventos_json = paginar_simulacion(matriz_vectores_estado, desde_evento, cantidad_eventos_visualizar)  # Paginación de eventos para visualización

    # CALCULO DE TIEMPO DE SIMULACIÓN
    tiempo_simulacion = (time.time()-tt_inicio_simulacion)

    # DEFINICIÓN JSON PARA EL FRONTEND
    salida_json = {
        "eventos": eventos_json,
        "contador_clientes_que_llegaron": contador_clientes_que_llegaron,
        "cola_maxima": cola_maxima,
        "acumulador_tiempos_espera": acumulador_tiempos_espera,
        "contador_clientes_comienzan_descenso": contador_clientes_comienzan_descenso,
        "promedio_tiempo_espera": promedio_tiempo_espera,
        "espera_cola_maxima": espera_cola_maxima,
        "runge_kutta": runge_kutta_json,  # Retornar solo las primeras y últimas 5 líneas del Runge-Kutta
        "tiempo_simulacion": round(tiempo_simulacion, 4),
    }

    return salida_json  # Retornar los eventos procesados en formato JSON



