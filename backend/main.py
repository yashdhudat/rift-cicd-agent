from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router
from api.websocket import ws_router

app = FastAPI(title="CI/CD Healing Agent", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")
app.include_router(ws_router)

@app.get("/health")
def health():
    return {"status": "online", "agent": "CI/CD Healing Agent v1.0"}