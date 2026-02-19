from fastapi import APIRouter
from pydantic import BaseModel
import json, os, time
from agents.orchestrator import run_agent

router = APIRouter()

class AgentRequest(BaseModel):
    repo_url: str
    team_name: str
    leader_name: str

@router.post("/run-agent")
async def trigger_agent(req: AgentRequest):
    start = time.time()

    result = await run_agent(
        repo_url=req.repo_url,
        team_name=req.team_name,
        leader_name=req.leader_name,
    )

    # Fix: capture elapsed ONCE right after agent finishes
    elapsed = time.time() - start
    mins = int(elapsed // 60)
    secs = int(elapsed % 60)
    result["timeTaken"] = f"{mins}m {secs}s"
    result["startTime"] = time.strftime(
        "%Y-%m-%dT%H:%M:%SZ", time.gmtime(start)
    )

    # Save mandatory results.json
    os.makedirs("outputs", exist_ok=True)
    with open("outputs/results.json", "w") as f:
        json.dump(result, f, indent=2)

    print(f"[API] ✅ results.json saved — {result['timeTaken']}")
    return result

@router.get("/results")
def get_results():
    try:
        with open("outputs/results.json") as f:
            return json.load(f)
    except FileNotFoundError:
        return {"error": "No results yet. Run the agent first."}