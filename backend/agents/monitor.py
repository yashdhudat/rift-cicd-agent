import datetime
from tools.test_runner import run_tests

async def monitor(state: dict) -> dict:
    repo_path   = state["repo_path"]
    retry_limit = state.get("retry_limit", 5)
    iteration   = state.get("iteration", 1)

    test_results = run_tests(repo_path)
    failed_count = test_results.get("failed", 0)
    passed       = failed_count == 0

    status_str = "PASSED ✅" if passed else "FAILED ❌"
    print(f"[MONITOR] Iteration {iteration}/{retry_limit} — {status_str}")

    note = "All tests passing" if passed else f"{failed_count} failure{'s' if failed_count != 1 else ''} remaining"

    return {
        **state,
        "ci_passed":    passed,
        "should_retry": not passed and iteration < retry_limit,
        "test_results": test_results,
        "timeline": state.get("timeline", []) + [{
            "run":       iteration,
            "status":    "passed" if passed else "failed",
            "timestamp": datetime.datetime.now().strftime("%H:%M:%S"),
            "note":      note,
        }],
    }