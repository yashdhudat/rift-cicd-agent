from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from agents.orchestrator import run_agent_streaming
import json

ws_router = APIRouter()

@ws_router.websocket("/ws/agent")
async def agent_websocket(websocket: WebSocket):
    await websocket.accept()
    print("[WS] Client connected")

    try:
        data    = await websocket.receive_text()
        payload = json.loads(data)

        async def emit(event: dict):
            try:
                await websocket.send_text(json.dumps(event))
            except Exception:
                pass  # Client disconnected mid-stream, continue agent

        await run_agent_streaming(
            repo_url    = payload["repo_url"],
            team_name   = payload["team_name"],
            leader_name = payload["leader_name"],
            emit        = emit,
        )

    except WebSocketDisconnect:
        print("[WS] Client disconnected")
    except Exception as e:
        print(f"[WS] Error: {e}")
        try:
            await websocket.send_text(json.dumps({
                "type": "error",
                "msg":  str(e),
                "color": "#ef4444"
            }))
        except Exception:
            pass