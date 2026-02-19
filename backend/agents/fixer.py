import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def call_llm(prompt: str) -> str:
    response = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=4096,
    )
    content = response.choices[0].message.content
    if content and content.strip():
        print(f"[FIXER] Using Groq llama3-70b ✅")
        return content.strip()
    raise Exception("Groq returned empty response")


async def fix(state: dict) -> dict:
    issues    = state.get("issues", [])
    repo_path = state["repo_path"]
    fixes_applied = []

    for issue in issues:
        filepath = os.path.join(repo_path, issue["file"])
        if not os.path.exists(filepath):
            continue

        with open(filepath, "r", encoding="utf-8") as f:
            original = f.read()

        prompt = f"""You are an expert code fixer. Fix ONLY the specific bug described below.
Return ONLY the complete fixed file content, no explanations, no markdown fences.

File: {issue['file']}
Bug Type: {issue['bugType']}
Line: {issue.get('line', '?')}
Issue: {issue.get('message', 'Fix the bug')}

Original file content:
{original}

Return the complete fixed file only:"""

        try:
            fixed_content = call_llm(prompt)

            # Strip markdown fences if present
            if fixed_content.startswith("```"):
                lines = fixed_content.split("\n")
                fixed_content = "\n".join(lines[1:-1])

            if not fixed_content.strip():
                raise Exception("Empty response from LLM")

            with open(filepath, "w", encoding="utf-8") as f:
                f.write(fixed_content)

            fixes_applied.append({
                "file":    issue["file"],
                "bugType": issue["bugType"],
                "line":    issue.get("line", 0),
                "commit":  f"[AI-AGENT] Fix {issue['bugType']} in {issue['file']} line {issue.get('line','?')}",
                "status":  "fixed"
            })
            print(f"[FIXER] ✅ Fixed {issue['bugType']} in {issue['file']}")

        except Exception as e:
            fixes_applied.append({
                "file":    issue["file"],
                "bugType": issue["bugType"],
                "line":    issue.get("line", 0),
                "commit":  f"[AI-AGENT] Attempted fix {issue['bugType']} in {issue['file']}",
                "status":  "failed"
            })
            print(f"[FIXER] ❌ Failed: {e}")

    return {**state, "fixes": state.get("fixes", []) + fixes_applied}