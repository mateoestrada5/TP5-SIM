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
        "lineas": []
    }

    while x < xf:
        k1 = h * ecuacion_diferencial(x, ec_a, ec_b, ec_c)
        k2 = h * ecuacion_diferencial(x + k1 / 2, ec_a, ec_b, ec_c)
        k3 = h * ecuacion_diferencial(x + k2 / 2, ec_a, ec_b, ec_c)
        k4 = h * ecuacion_diferencial(x + k3, ec_a, ec_b, ec_c)
        x_sig = x + (k1 + 2 * k2 + 2 * k3 + k4) / 6

        # TODO-log
        # print(f"t: {(t):0.4f} | x: {x:0.4f} | k1: {k1:0.4f} | k2: {k2:0.4f} | k3: {k3:0.4f} | k4: {k4:0.4f} | x_sig: {x_sig:0.4f}")

        runge_kutta_json["lineas"].append({"t": t, "x": x, "k1": k1, "k2": k2, "k3": k3, "k4": k4, "x_sig": x_sig})
        t += h
        x = x_sig



    runge_kutta_json["lineas"].append({"t": t, "x": x, "k1": '', "k2": '', "k3": '', "k4": '', "x_sig": ''})

    t_final = t
    x_final = x

    # TODO-log
    # print(f"t: {t:0.4f} | x: {x:0.4f} ////////////// Final //////////////")

    return round(t_final,4), round(x_final, 4), runge_kutta_json

runge_kutta(h=0.001)
