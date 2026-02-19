import subprocess, os, json, re
from typing import Dict

def run_tests(repo_path: str) -> Dict:
    results = {"passed": 0, "failed": 0, "errors": [], "output": ""}
    
    # Try pytest first
    py_tests = []
    for root, _, files in os.walk(repo_path):
        for f in files:
            if f.startswith("test_") and f.endswith(".py"):
                py_tests.append(os.path.join(root, f))
    
    if py_tests:
        try:
            r = subprocess.run(
                ["python", "-m", "pytest", "--tb=short", "-q", repo_path],
                capture_output=True, text=True, timeout=120, cwd=repo_path
            )
            results["output"] = r.stdout + r.stderr
            
            # Parse pytest output
            match = re.search(r"(\d+) passed", r.stdout)
            if match: results["passed"] = int(match.group(1))
            match = re.search(r"(\d+) failed", r.stdout)
            if match: results["failed"] = int(match.group(1))
            
            # Extract failure details
            fail_pattern = re.finditer(r"FAILED ([\w/\.]+)::(\w+)", r.stdout)
            for m in fail_pattern:
                results["errors"].append({
                    "file": m.group(1), "test": m.group(2),
                    "bugType": "LOGIC", "line": 0
                })
        except subprocess.TimeoutExpired:
            results["errors"].append({"message": "Test timeout"})
        except Exception as e:
            results["errors"].append({"message": str(e)})

    return results