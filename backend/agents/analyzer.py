from tools.ast_parser import scan_repo
from tools.test_runner import run_tests

async def analyze(state: dict) -> dict:
    repo_path = state["repo_path"]
    iteration = state.get("iteration", 0) + 1

    # Static analysis
    static_errors = scan_repo(repo_path)

    # Run tests to find runtime failures
    test_results = run_tests(repo_path)
    test_errors  = test_results.get("errors", [])

    # Deduplicate by file+line+bugType so we don't fix same issue twice
    seen   = set()
    merged = []
    for issue in static_errors + test_errors:
        key = (issue.get("file"), issue.get("line"), issue.get("bugType"))
        if key not in seen:
            seen.add(key)
            merged.append(issue)

    print(f"[ANALYZER] Iteration {iteration} — Found {len(merged)} unique issues")

    return {
        **state,
        "issues":       merged,
        "test_results": test_results,
        "iteration":    iteration,
    }