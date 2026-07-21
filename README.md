# AI Three.js Scene Generator 🎨⚡

> **Prompt in → Sandboxed, live-editable, self-healing Three.js scene out.**

A modern web application that dynamically generates, renders, and auto-heals interactive 3D WebGL scenes using **Three.js** and fast LLM inference powered by **Groq API**.

---

## ✨ Key Features

- ⚡ **Natural Language to 3D Scene**: Type any prompt to generate live 3D Three.js code in seconds.
- 🛡️ **Sandboxed Execution**: Generated code executes safely inside an isolated `<iframe>` sandbox via a strict `postMessage` protocol — zero risk of locking the main UI thread.
- 🩹 **Auto-Healing Controller**: Automatically captures runtime exceptions & `rAF` stalls in the sandbox and triggers LLM self-repair retries.
- 🎛️ **Dynamic Scene Controls**: Automatically generates reactive UI controls (sliders, color pickers, toggles) to tweak scene parameters on the fly without full page reloads.
- 💻 **Live Code Pane**: View, inspect, and copy generated TypeScript/JavaScript scene code powered by **CodeMirror 6**.
- ⏱️ **Perf Budget Watchdog**: Real-time FPS monitoring and automated object/particle limits to guarantee a fluid 60 FPS experience.

---

## 🛠️ Tech Stack

- **Core Framework**: Vite + Vanilla TypeScript
- **3D Graphics Engine**: Three.js (r160+)
- **Code Editor Pane**: CodeMirror 6
- **LLM Engine**: Groq REST API (JSON Mode)
- **Package Manager**: `pnpm`
- **Sandbox Security**: Sandboxed `<iframe sandbox="allow-scripts">` + postMessage RPC

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- `pnpm` (or `npm`)

### Installation & Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/koustavdatascience/Rach.git
   cd Rach/ai-threejs-generator
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Start the local development server**:
   ```bash
   pnpm dev
   ```

---

## 📁 Repository Architecture

```
ai-threejs-generator/
├── index.html            # Main host layout (Split viewport + code pane)
├── sandbox.html          # Isolated sandbox iframe
├── src/
│   ├── main.ts           # Host entry point
│   ├── sandbox/          # postMessage bridge, protocol, watchdog & runtime entry
│   ├── groq/             # Groq client, schema validator, prompts & perf budget
│   ├── healing/          # Self-healing controller & retry logic
│   ├── ui/               # Controls panel, prompt bar & CodeMirror viewer
│   ├── presets/          # Hand-written regression benchmark scenes
│   └── export/           # Standalone HTML & canvas video export tools
```

---

## 📄 License

MIT License. Built with ❤️ by [koustavdatascience](https://github.com/koustavdatascience).
