import os, time
from dotenv import load_dotenv
from langgraph.graph import StateGraph, END
from typing import TypedDict, List, Dict, Any

from tools.github_client import clone_repo, create_branch, get_branch_name
from agents.analyzer  import analyze
from agents.fixer     import fix
from agents.git_agent import git_commit
from agents.monitor   import monitor

load_dotenv()

WORKSPACE   = os.getenv("WORKSPACE_DIR", "C:/tmp/agent_workspace")
RETRY_LIMIT = int(os.getenv("RETRY_LIMIT", 5))

class AgentState(TypedDict):
    repo_url:     str
    team_name:    str
    leader_name:  str
    repo_path:    str
    branch_name:  str
    git_repo:     Any
    issues:       List[Dict]
    fixes:        List[Dict]
    commits:      List[str]
    timeline:     List[Dict]
    test_results: Dict
    ci_passed:    bool
    should_retry: bool
    iteration:    int
    retry_limit:  int

def should_continue(state: AgentState) -> str:
    if state.get("ci_passed"):
        return "end"
    if state.get("should_retry"):
        return "analyze"
    return "end"

def build_graph():
    g = StateGraph(AgentState)
    g.add_node("analyze", analyze)
    g.add_node("fix",     fix)
    g.add_node("git",     git_commit)
    g.add_node("monitor", monitor)
    g.set_entry_point("analyze")
    g.add_edge("analyze", "fix")
    g.add_edge("fix",     "git")
    g.add_edge("git",     "monitor")
    g.add_conditional_edges("monitor", should_continue, {
        "analyze": "analyze",
        "end":     END,
    })
    return g.compile()

async def run_agent(repo_url: str, team_name: str, leader_name: str) -> dict:
    branch = get_branch_name(team_name, leader_name)
    dest   = os.path.join(WORKSPACE, branch)

    os.makedirs(WORKSPACE, exist_ok=True)

    git_repo = clone_repo(repo_url, dest)
    create_branch(git_repo, branch)

    graph = build_graph()
    final = await graph.ainvoke({
        "repo_url":     repo_url,
        "team_name":    team_name,
        "leader_name":  leader_name,
        "repo_path":    dest,
        "branch_name":  branch,
        "git_repo":     git_repo,
        "issues":       [],
        "fixes":        [],
        "commits":      [],
        "timeline":     [],
        "test_results": {},
        "ci_passed":    False,
        "should_retry": True,
        "iteration":    0,
        "retry_limit":  RETRY_LIMIT,
    })

    fixes           = final.get("fixes", [])
    fixed_count     = len([f for f in fixes if f["status"] == "fixed"])
    failed_count    = len([f for f in fixes if f["status"] == "failed"])
    commit_count    = len(final.get("commits", []))
    speed_bonus     = 10  # calculated in routes.py after timing
    efficiency_pen  = max(0, commit_count - 20) * 2

    return {
        "repo":          repo_url,
        "team":          team_name,
        "leader":        leader_name,
        "branch":        branch,
        "totalFailures": fixed_count + failed_count,  # total issues found
        "totalFixes":    fixed_count,
        "ciStatus":      "PASSED" if final.get("ci_passed") else "FAILED",
        "fixes":         fixes,
        "timeline":      final.get("timeline", []),
        "score": {
            "base":              100,
            "speedBonus":        speed_bonus,
            "efficiencyPenalty": -efficiency_pen,
            "total":             100 + speed_bonus - efficiency_pen,
            "commits":           commit_count,
        },
    }

async def run_agent_streaming(repo_url: str, team_name: str, leader_name: str, emit) -> None:
    import datetime

    async def log(msg: str, color: str = "#94a3b8"):
        await emit({"type": "log", "msg": msg, "color": color})

    await log("🔗 Initializing agent cluster...", "#06b6d4")
    await log(f"📦 Dispatching agent for: {repo_url}", "#f59e0b")

    branch = get_branch_name(team_name, leader_name)
    dest   = os.path.join(WORKSPACE, branch)
    os.makedirs(WORKSPACE, exist_ok=True)

    await log(f"⬇️  Cloning repository...", "#94a3b8")
    git_repo = clone_repo(repo_url, dest)
    await log(f"✅ Cloned to workspace", "#10b981")

    await log(f"🌿 Creating branch: {branch}", "#06b6d4")
    create_branch(git_repo, branch)
    await log(f"✅ Branch created", "#10b981")

    graph = build_graph()

    start = time.time()
    final = await graph.ainvoke({
        "repo_url":     repo_url,
        "team_name":    team_name,
        "leader_name":  leader_name,
        "repo_path":    dest,
        "branch_name":  branch,
        "git_repo":     git_repo,
        "issues":       [],
        "fixes":        [],
        "commits":      [],
        "timeline":     [],
        "test_results": {},
        "ci_passed":    False,
        "should_retry": True,
        "iteration":    0,
        "retry_limit":  RETRY_LIMIT,
    })

    elapsed = time.time() - start
    mins = int(elapsed // 60)
    secs = int(elapsed % 60)

    fixes        = final.get("fixes", [])
    fixed_count  = len([f for f in fixes if f["status"] == "fixed"])
    failed_count = len([f for f in fixes if f["status"] == "failed"])
    commit_count = len(final.get("commits", []))
    efficiency_pen = max(0, commit_count - 20) * 2

    for fix_item in fixes:
        color = "#10b981" if fix_item["status"] == "fixed" else "#ef4444"
        icon  = "✅" if fix_item["status"] == "fixed" else "❌"
        await log(
            f"{icon} {fix_item['commit']}",
            color
        )

    ci_status = "PASSED" if final.get("ci_passed") else "FAILED"
    await log(
        f"🏁 CI/CD Final Status: {ci_status} — {mins}m {secs}s",
        "#10b981" if final.get("ci_passed") else "#ef4444"
    )

    result = {
        "repo":          repo_url,
        "team":          team_name,
        "leader":        leader_name,
        "branch":        branch,
        "totalFailures": fixed_count + failed_count,
        "totalFixes":    fixed_count,
        "ciStatus":      ci_status,
        "timeTaken":     f"{mins}m {secs}s",
        "fixes":         fixes,
        "timeline":      final.get("timeline", []),
        "score": {
            "base":              100,
            "speedBonus":        10,
            "efficiencyPenalty": -efficiency_pen,
            "total":             100 + 10 - efficiency_pen,
            "commits":           commit_count,
        },
    }

    # Save results.json here too for WebSocket path
    os.makedirs("outputs", exist_ok=True)
    import json
    with open("outputs/results.json", "w") as f:
        json.dump(result, f, indent=2)

    await emit({"type": "result", "data": result})