from tools.github_client import commit_and_push
import datetime

async def git_commit(state: dict) -> dict:
    repo      = state["git_repo"]
    branch    = state["branch_name"]
    fixes     = state.get("fixes", [])
    committed = state.get("commits", [])
    iteration = state.get("iteration", 1)

    new_fixes = fixes[len(committed):]
    newly_committed = []

    # Stage ALL changes first
    repo.git.add("--all")

    if repo.is_dirty(index=True, working_tree=False):
        fixed_files = [f["file"] for f in new_fixes if f["status"] == "fixed"]
        
        # One bulk commit per iteration
        bulk_msg = f"[AI-AGENT] Iteration {iteration}: Fix {len(fixed_files)} issue(s) — {', '.join(fixed_files[:3])}"
        try:
            repo.git.commit("-m", bulk_msg)
            repo.git.push("origin", branch)
            # Mark all new fixed items as committed
            for fix in new_fixes:
                if fix["status"] == "fixed":
                    newly_committed.append(fix["commit"])
            print(f"[GIT] ✅ Bulk committed {len(fixed_files)} fixes")
        except Exception as e:
            print(f"[GIT] Commit failed: {e}")
    else:
        print(f"[GIT] ⚠️ No file changes to commit this iteration")

    return {**state, "commits": committed + newly_committed}