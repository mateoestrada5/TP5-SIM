def ecuacion_diferencial(x, a, b, c):
    return a * x**2 + b * x + c

def runge_kutta(t0=0, x0=0, h=0.001, xf=120, ec_a=0.5, ec_b=-0.2, ec_c=5):

    t = t0
    x = x0

    runge_kutta_json = {
        "t0": t0,
        "x0": x0,
        "h": h,
        "xf": xf,
        "t_final": None,
        "x_final": None,
        "lineas": []
    }

    lineas_rk = []

    n = 0

    while x < xf:

        k1 = h * ecuacion_diferencial(x, ec_a, ec_b, ec_c)
        k2 = h * ecuacion_diferencial(x + k1 / 2, ec_a, ec_b, ec_c)
        k3 = h * ecuacion_diferencial(x + k2 / 2, ec_a, ec_b, ec_c)
        k4 = h * ecuacion_diferencial(x + k3, ec_a, ec_b, ec_c)
        x_sig = x + (k1 + 2 * k2 + 2 * k3 + k4) / 6

        lineas_rk.append({"n":n, "t": t, "x": x, "k1": k1, "k2": k2, "k3": k3, "k4": k4, "x_sig": x_sig})
        t += h
        x = x_sig
        n += 1

    lineas_rk.append({"n":n, "t": t, "x": x, "k1": '', "k2": '', "k3": '', "k4": '', "x_sig": ''})

    t_final = round(t,4)
    x_final = round(x,4)

    runge_kutta_json["lineas"] = lineas_rk[:5] + lineas_rk[-5:]  # Enviar las primeras 5 y ultimas 5 lineas del calculo de Runge-Kutta
    runge_kutta_json["t_final"] = t_final
    runge_kutta_json["x_final"] = x_final

    return t_final, x_final, runge_kutta_json