# def insertar_ordenado(lista, key, elemento):
#     if not lista or key >= lista[-1]:
#         lista.append(key)
#     else:
#         for i in range(len(lista)):
#             if key < lista[i].reloj:
#                 lista.insert(i, elemento)
#                 break

def insertar_ordenado(eventos, evento):
    if not eventos or evento.reloj >= eventos[-1].reloj:
        eventos.append(evento)
    else:
        for i in range(len(eventos)):
            if evento.reloj < eventos[i].reloj:
                eventos.insert(i, evento)
                break

def buscar_cliente_por_id(clientes, id_cliente):
    for cliente in clientes:
        if cliente.id_cliente == id_cliente:
            return cliente
    return None


def eliminar_cliente_por_id(clientes, id_cliente):
    for i, cliente in enumerate(clientes):
        if cliente.id_cliente == id_cliente:
            del clientes[i]
            return True
    return False

def paginar_simulacion(vectores_estado, linea_inicial, cantidad_lineas):
    # devuelve los primeros 2, los solicitados, y los ultimos 2

    vector_final = []
    if linea_inicial + cantidad_lineas >= len(vectores_estado) - 2:
        cantidad_lineas -= (linea_inicial + cantidad_lineas) - (len(vectores_estado) - 2)

    if linea_inicial > 2:
        vector_final = vectores_estado[:2] + vectores_estado[linea_inicial:linea_inicial + cantidad_lineas] + vectores_estado[-2:]

    for e in vector_final:
        print(e.to_json())






