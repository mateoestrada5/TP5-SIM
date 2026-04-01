# TP5-SIM

Proyecto de simulación con:
- Backend en FastAPI (Python)
- Frontend en React + Vite

## Requisitos

- Python 3.10+
- Node.js 18+ y npm

## Ejecutar el proyecto (dos terminales)

### Shell 1: Backend (FastAPI)

Desde la carpeta `backend`:

```bash
$ cd TP5-SIM/backend
$ python -m venv .venv
$ source .venv/Scripts/activate (windows)
$ source .venv/bin/activate (windows)
$ pip install fastapi uvicorn
$ uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

El backend quedará disponible en `http://localhost:8000`.

Endpoints principales:
- `GET /status`: verificación de estado del backend.
- `POST /simular`: recibe parámetros de simulación y devuelve resultados (incluye eventos y salida de Runge-Kutta).

### Shell 2: Frontend (React + Vite)

Desde la carpeta `frontend`:

```bash
$ cd TP5-SIM/frontend
$ npm install
$ npm run dev
```

El frontend se levanta normalmente en `http://localhost:5173`.

## Cómo funciona

- Al iniciar, el frontend consulta `GET http://localhost:8000/status` para verificar que el backend esté activo.
- Al ejecutar la simulación desde la UI, envía un `POST http://localhost:8000/simular` con dos bloques:
	- `config`: parámetros generales de la simulación.
	- `rungeKutta`: parámetros del método de Runge-Kutta.
- El backend procesa esos datos en `simulacion.py` y devuelve:
	- eventos simulados,
	- métricas de cola/espera,
	- resultados de Runge-Kutta.

## Notas

- Si abrís el frontend y aparece error de backend no disponible, confirmá que el comando de `uvicorn` siga corriendo en la Shell 1.
- Si usás entorno virtual de Python, activalo antes de instalar dependencias y correr `uvicorn`.