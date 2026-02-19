import ast, os
from typing import List, Dict

def parse_python_errors(filepath: str) -> List[Dict]:
    errors = []
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            source = f.read()

        # Only check syntax errors — most important for test accuracy
        try:
            ast.parse(source)
        except SyntaxError as e:
            errors.append({
                "file": filepath, "line": e.lineno,
                "bugType": "SYNTAX", "message": str(e)
            })
            return errors

        # Check unused imports only (not in test files)
        if "test_" not in os.path.basename(filepath):
            tree = ast.parse(source)
            for node in ast.walk(tree):
                if isinstance(node, (ast.Import, ast.ImportFrom)):
                    for alias in node.names:
                        name = alias.asname or alias.name.split(".")[0]
                        rest = source.replace(
                            ast.get_source_segment(source, node) or "", ""
                        )
                        if name not in rest:
                            errors.append({
                                "file": filepath, "line": node.lineno,
                                "bugType": "LINTING",
                                "message": f"Unused import '{name}'"
                            })

    except Exception as e:
        print(f"[PARSER] Error parsing {filepath}: {e}")

    return errors

def parse_js_errors(filepath: str) -> List[Dict]:
    errors = []
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            lines = f.readlines()
        for i, line in enumerate(lines, 1):
            if "var " in line:
                errors.append({"file": filepath, "line": i,
                    "bugType": "LINTING", "message": "Use let/const instead of var"})
            if " == " in line and "===" not in line and "!==" not in line:
                errors.append({"file": filepath, "line": i,
                    "bugType": "TYPE_ERROR", "message": "Use === instead of =="})
    except Exception as e:
        print(f"[PARSER] JS parse error: {e}")
    return errors

def scan_repo(repo_path: str) -> List[Dict]:
    all_errors = []
    for root, _, files in os.walk(repo_path):
        if any(skip in root for skip in [".git", "node_modules", "__pycache__", ".venv"]):
            continue
        for fname in files:
            fpath = os.path.join(root, fname)
            rel = os.path.relpath(fpath, repo_path)
            if fname.endswith(".py"):
                errs = parse_python_errors(fpath)
                for e in errs: e["file"] = rel
                all_errors.extend(errs)
            elif fname.endswith((".js", ".ts", ".jsx", ".tsx")):
                errs = parse_js_errors(fpath)
                for e in errs: e["file"] = rel
                all_errors.extend(errs)
    return all_errors