import os, shutil
from git import Repo
from dotenv import load_dotenv

load_dotenv()

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
WORKSPACE    = os.getenv("WORKSPACE_DIR", "C:/Users/Death Note/rift-cicd-agent/workspace")

def clone_repo(repo_url: str, dest: str) -> Repo:
    # Always clean start
    if os.path.exists(dest):
        shutil.rmtree(dest)
    os.makedirs(os.path.dirname(dest), exist_ok=True)

    # Strip subfolder paths from URL
    parts = repo_url.split("github.com/")
    if len(parts) > 1:
        repo_path = parts[1].split("/")[:2]
        clean_url = "https://github.com/" + "/".join(repo_path)
    else:
        clean_url = repo_url

    token_url = clean_url.replace("https://", f"https://{GITHUB_TOKEN}@") if GITHUB_TOKEN else clean_url
    print(f"[GIT] Cloning: {clean_url} → {dest}")
    return Repo.clone_from(token_url, dest)

def create_branch(repo: Repo, branch_name: str):
    # Check if branch exists on remote, if so delete it first
    try:
        repo.git.push("origin", f"--delete", branch_name)
        print(f"[GIT] Deleted old remote branch: {branch_name}")
    except:
        pass  # Branch didn't exist, that's fine
    repo.git.checkout("-b", branch_name)
    print(f"[GIT] Created branch: {branch_name}")

def commit_and_push(repo: Repo, branch: str, message: str):
    repo.git.add("--all")
    try:
        repo.git.commit("-m", message)
        repo.git.push("origin", branch, "--set-upstream")
        print(f"[GIT] ✅ Pushed: {message}")
    except Exception as e:
        print(f"[GIT] Commit/push error: {e}")
        raise e

def get_branch_name(team: str, leader: str) -> str:
    def clean(s):
        return s.upper().strip().replace(" ", "_").replace("-", "_")
    return f"{clean(team)}_{clean(leader)}_AI_Fix"