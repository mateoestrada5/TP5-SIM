from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from modules.logica_colas import sistema_colas
from fastapi.responses import JSONResponse
from simulacion import simular


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/status")
def status():
    try:
        return {"status": "ok"}
    except:
        return {"status": "error"}

@app.post("/simular")
async def simulacion(request: Request):
    try:
        body = await request.json()
        print("Params recibidos", body)
        return simular(body)
    except Exception as e:
        return JSONResponse(content={"message": str(e)})

