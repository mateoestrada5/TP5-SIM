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
