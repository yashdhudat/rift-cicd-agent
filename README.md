
# 🤖 CI/CD HEALING AGENT
### RIFT 2026 — AI/ML Track Submission

![CI/CD Healing Agent](https://img.shields.io/badge/RIFT_2026-AI%2FML_Track-06b6d4?style=for-the-badge&labelColor=0a0f18)
![Python](https://img.shields.io/badge/Python-3.10+-3b82f6?style=for-the-badge&logo=python&logoColor=white&labelColor=0a0f18)
![React](https://img.shields.io/badge/React-18-06b6d4?style=for-the-badge&logo=react&logoColor=white&labelColor=0a0f18)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-10b981?style=for-the-badge&logo=fastapi&logoColor=white&labelColor=0a0f18)
![LangGraph](https://img.shields.io/badge/LangGraph-Multi--Agent-8b5cf6?style=for-the-badge&labelColor=0a0f18)
![License](https://img.shields.io/badge/License-MIT-f59e0b?style=for-the-badge&labelColor=0a0f18)

<br/>

**Autonomous multi-agent system that detects, fixes, commits, and verifies bugs in GitHub repositories — fully automated, end-to-end.**

[🚀 Live Demo](#) • [📹 Demo Video](#) • [📖 Documentation](#architecture) • [⚡ Quick Start](#quick-start)

<br/>

![Dashboard Preview](https://img.shields.io/badge/Dashboard-Production_Grade-06b6d4?style=flat-square&labelColor=0a0f18)
![Score](https://img.shields.io/badge/Max_Score-110%2F110-10b981?style=flat-square&labelColor=0a0f18)
![Status](https://img.shields.io/badge/CI%2FCD-PASSING-10b981?style=flat-square&labelColor=0a0f18)

</div>

---

## 🎯 What It Does

The **CI/CD Healing Agent** is a fully autonomous DevOps AI system. Give it a broken GitHub repository — it will:

1. 🔍 **Detect** — Scans the entire codebase using AST parsing for syntax errors, linting issues, logic bugs, import errors, and type mismatches
2. 🔧 **Fix** — Uses LLM (Groq Llama3-70B) to generate intelligent, context-aware patches for each bug
3. 📝 **Commit** — Creates a new branch and commits each fix with `[AI-AGENT]` prefixed messages
4. ✅ **Verify** — Runs the full test suite and monitors CI/CD pipeline until all tests pass
5. 🔄 **Retry** — If tests still fail, loops back and fixes remaining issues (up to 5 iterations)

All of this happens **autonomously** — no human intervention required.

---

## 🏆 Hackathon Details

| Field | Details |
|---|---|
| **Event** | RIFT 2026 — AI/ML Track |
| **Challenge** | Autonomous CI/CD Healing Agent |
| **Team Name** | Ace |
| **Team Leader** | Yash Dhudat |
| **Branch Format** | `TEAM_LEADER_AI_Fix` |
| **Max Score** | 110 / 110 |

---

## ✨ Key Features

- ⚡ **Real-time WebSocket streaming** — Watch the agent work live, log by log
- 🧠 **Multi-agent LangGraph architecture** — Analyzer → Fixer → Git → Monitor pipeline
- 🔬 **AST-based precision detection** — Exact file and line number for every bug
- 🤖 **LLM-powered fixing** — Groq Llama3-70B generates context-aware fixes
- 🌿 **Auto branch management** — Creates, pushes, and manages git branches automatically
- 📊 **Production-grade dashboard** — Animated score breakdown, fix timeline, CI/CD status
- 🔁 **Retry loop** — Up to 5 iterations to achieve full test passage
- 📄 **results.json** — Auto-generated structured output after every run

---

## 🏗️ Architecture
```
┌─────────────────────────────────────────────────────────┐
│                   React Dashboard                        │
│         (Real-time WebSocket + Cyber UI)                │
└─────────────────────┬───────────────────────────────────┘
                      │ WebSocket
┌─────────────────────▼───────────────────────────────────┐
│                  FastAPI Backend                          │
│              /api/run-agent  /ws/agent                  │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│            LangGraph Multi-Agent Pipeline                │
│                                                         │
│  ┌──────────┐   ┌──────────┐   ┌────────┐   ┌───────┐ │
│  │ ANALYZER │──▶│  FIXER   │──▶│  GIT   │──▶│MONITOR│ │
│  │          │   │          │   │ AGENT  │   │       │ │
│  │ AST Parse│   │ Groq LLM │   │ Commit │   │ Test  │ │
│  │ Find bugs│   │ Fix code │   │  Push  │   │ Suite │ │
│  └──────────┘   └──────────┘   └────────┘   └───┬───┘ │
│       ▲                                          │     │
│       └──────────── RETRY (if failed) ───────────┘     │
└─────────────────────────────────────────────────────────┘
```

### Agent Descriptions

| Agent | Responsibility |
|---|---|
| **Analyzer** | AST-parses Python/JS files, detects SYNTAX, LINTING, LOGIC, TYPE_ERROR, IMPORT, INDENTATION bugs |
| **Fixer** | Reads each buggy file, prompts Groq LLM with full context, writes fixed content back |
| **Git Agent** | Stages changes, commits with `[AI-AGENT]` prefix, pushes to feature branch |
| **Monitor** | Runs pytest, checks pass/fail, decides whether to retry or finish |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite | UI framework |
| WebSocket API | Real-time log streaming |
| JetBrains Mono + Syne | Typography |
| Pure CSS animations | Cyber aesthetic UI |

### Backend
| Technology | Purpose |
|---|---|
| FastAPI | REST API + WebSocket server |
| LangGraph | Multi-agent orchestration |
| Groq (Llama3-70B) | LLM for code fixing |
| GitPython | Git operations |
| AST module | Static code analysis |
| Pytest | Test runner |

---

## ⚡ Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- Git

### 1. Clone the repo
```bash
git clone https://github.com/yashdhudat/rift-cicd-agent.git
cd rift-cicd-agent
```

### 2. Setup Backend
```bash
cd backend
pip install -r requirements.txt
cp ../.env.example .env
# Edit .env and add your API keys
```

### 3. Setup Frontend
```bash
cd frontend
npm install
```

### 4. Configure Environment
Edit `backend/.env`:
```env
GROQ_API_KEY=your_groq_api_key_here
GITHUB_TOKEN=your_github_token_here
RETRY_LIMIT=5
WORKSPACE_DIR=./workspace
```

Get your keys:
- **Groq API Key** (free): https://console.groq.com
- **GitHub Token**: GitHub → Settings → Developer Settings → Personal Access Tokens → Classic → `repo` scope

### 5. Run the Application

Terminal 1 — Backend:
```bash
cd backend
uvicorn main:app --reload --port 8000
```

Terminal 2 — Frontend:
```bash
cd frontend
npm run dev
```

### 6. Open Dashboard
Navigate to **http://localhost:5173**

---

## 🐳 Docker Setup
```bash
docker-compose up --build
```

The app will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## 🎮 How to Use

1. Open the dashboard at `http://localhost:5173`
2. Enter your **broken GitHub repository URL**
3. Enter your **Team Name** and **Team Leader Name**
4. Watch the **branch name auto-generate** in correct format
5. Click **⚡ DEPLOY HEALING AGENT**
6. Watch real-time logs stream in the **Agent Live Log**
7. View full results — fixes, score, timeline — when complete

---

## 📁 Project Structure
```
rift-cicd-agent/
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Main dashboard (single file)
│   │   ├── main.jsx             # React entry point
│   │   └── index.css            # Global styles
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── agents/
│   │   ├── orchestrator.py      # LangGraph pipeline controller
│   │   ├── analyzer.py          # Bug detection agent
│   │   ├── fixer.py             # LLM-powered fix agent
│   │   ├── git_agent.py         # Git commit/push agent
│   │   └── monitor.py           # Test runner + retry logic
│   ├── tools/
│   │   ├── ast_parser.py        # AST-based static analysis
│   │   ├── github_client.py     # Git operations wrapper
│   │   └── test_runner.py       # Pytest integration
│   ├── api/
│   │   ├── routes.py            # REST API endpoints
│   │   └── websocket.py         # WebSocket handler
│   ├── main.py                  # FastAPI app entry
│   └── requirements.txt
│
├── .env.example                 # Environment template
├── docker-compose.yml           # Container orchestration
└── README.md
```

---

## 📊 Scoring System

| Component | Points |
|---|---|
| Base Score | +100 |
| Speed Bonus (< 5 min) | +10 |
| Efficiency Penalty (> 20 commits) | -2 per extra commit |
| **Maximum Possible** | **110** |

---

## 🐛 Supported Bug Types

| Bug Type | Description | Example |
|---|---|---|
| `SYNTAX` | Missing colons, brackets, invalid syntax | `def foo(x)` → `def foo(x):` |
| `LINTING` | Unused imports, style violations | `import os` never used |
| `LOGIC` | Wrong conditions, inverted booleans | `if x = 0` → `if x == 0` |
| `TYPE_ERROR` | Type mismatches, wrong comparisons | `==` → `===` in JS |
| `IMPORT` | Missing or circular imports | Circular dependency fix |
| `INDENTATION` | Wrong indentation levels | 3-space → 4-space |

---

## 🔌 API Reference

### REST Endpoints
```
POST /api/run-agent     — Trigger agent run
GET  /api/results       — Get last run results
GET  /health            — Health check
GET  /docs              — Interactive API docs (Swagger)
```

### WebSocket
```
WS /ws/agent            — Real-time streaming connection
```

**Send:**
```json
{
  "repo_url": "https://github.com/user/repo",
  "team_name": "CodeX",
  "leader_name": "Yash Dhudat"
}
```

**Receive:**
```json
{ "type": "log", "msg": "Cloning repository...", "color": "#06b6d4" }
{ "type": "result", "data": { ... } }
{ "type": "error", "msg": "..." }
```

---

## 📄 results.json Output

Auto-generated after every run:
```json
{
  "repo": "https://github.com/user/broken-repo",
  "team": "CodeX",
  "leader": "Yash Dhudat",
  "branch": "CODEX_YASH_DHUDAT_AI_Fix",
  "totalFailures": 4,
  "totalFixes": 4,
  "ciStatus": "PASSED",
  "timeTaken": "2m 15s",
  "score": {
    "base": 100,
    "speedBonus": 10,
    "efficiencyPenalty": 0,
    "total": 110,
    "commits": 4
  },
  "fixes": [
    {
      "file": "src/calculator.py",
      "bugType": "SYNTAX",
      "line": 5,
      "commit": "[AI-AGENT] Fix SYNTAX in src/calculator.py line 5",
      "status": "fixed"
    }
  ],
  "timeline": [
    {
      "run": 1,
      "status": "passed",
      "timestamp": "14:32:01",
      "note": "All tests passing"
    }
  ]
}
```

---

## 🤝 Team

| Name | Role |
|---|---|
| **Yash Dhudat** | Team Leader — Full Stack + AI Integration |

**Team:** CodeX
**Event:** RIFT 2026 — AI/ML Track

---

## 📜 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

**Built with ❤️ for RIFT 2026**

![RIFT 2026](https://img.shields.io/badge/RIFT_2026-AI%2FML_Track-06b6d4?style=for-the-badge&labelColor=0a0f18)

*AUTONOMOUS DETECT → FIX → VERIFY → DEPLOY*

</div>

Now push it to GitHub:
bashcd "C:\Users\Death Note\rift-cicd-agent"
git add README.md
git commit -m "Add premium README for RIFT 2026 submission"
git push origin main


