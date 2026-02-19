import subprocess, os, tempfile, shutil

def safe_run(command: list, cwd: str, timeout: int = 60) -> dict:
    """Run command in isolated subprocess (Docker optional)"""
    try:
        result = subprocess.run(
            command, cwd=cwd, capture_output=True,
            text=True, timeout=timeout,
            env={**os.environ, "PYTHONDONTWRITEBYTECODE": "1"}
        )
        return {
            "stdout": result.stdout,
            "stderr": result.stderr,
            "returncode": result.returncode,
            "success": result.returncode == 0
        }
    except subprocess.TimeoutExpired:
        return {"stdout": "", "stderr": "Timeout", "returncode": -1, "success": False}
    except Exception as e:
        return {"stdout": "", "stderr": str(e), "returncode": -1, "success": False}