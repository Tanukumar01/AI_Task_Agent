# 🤖 AI Task Agent

AI Task Agent is a smart command-line and browser-based assistant that takes user-defined tasks via chat, generates execution plans using the OpenRouter API, and performs those tasks locally. It supports user approval, execution feedback, and intelligent retry logic.

---

## 🚀 Features

- 🧠 AI-generated task plans (via OpenRouter API)
- ✅ User approval before execution
- 💻 Executes tasks locally
- 🔁 Retry with plan refinement if task fails
- 💬 Chat interface for input and feedback
- 🌐 Frontend + Backend integration
- 🧩 Optional VS Code Extension support

---
## 📽 Demo

> 🌐 **Live Website:** [ai-task-agent-oqf0.onrender.com](https://ai-task-agent-oqf0.onrender.com/)  

## 🛠 Tech Stack

- **Frontend**: HTML, CSS, JavaScript  
- **Backend**: Node.js, Express.js  
- **AI API**: OpenRouter API  
- **Optional**: VS Code Extension

---


## 🧪 How It Works

1. User enters a task through the chat interface
2. Agent generates a plan using OpenRouter API
3. User approves or rejects the plan
4. If approved, the agent runs the task locally
5. If the task fails, the agent refines the plan and retries

---

## 🖥️ Running the Project

1. **Clone the repo:**

```bash
git clone https://github.com/Tanukumar01/Ai-agent.git
cd Ai-agent
```

2. **Install dependencies:**

```bash
npm install
```

3. **Start the server:**

```bash
node backend/server.js
```

4. **Open `index.html` in your browser**

---

## ✨ Future Enhancements

- Voice command support
- Context memory across tasks
- Docker support
- Full VS Code extension integration

---

## 📜 License

MIT License © 2025 [Tanukumar01](https://github.com/Tanukumar01)
