// import * as THREE from "three"; // unused in Milestone 2 host
import { EditorState } from "@codemirror/state";
import { EditorView, lineNumbers, highlightActiveLineGutter } from "@codemirror/view";
import { javascript } from "@codemirror/lang-javascript";
import { PRESETS, type PresetScene } from "./presets/presets";
import "./style.css";

// DOM references
const viewportContainer = document.getElementById("viewport")!;
const editorContainer = document.getElementById("editor-container")!;
const presetButtonsContainer = document.getElementById("preset-buttons")!;
const fpsValueElement = document.getElementById("fps-value")!;
const fpsBadgeElement = document.getElementById("fps-badge")!;
const presetActiveTag = document.getElementById("preset-active-tag")!;

// Create and append sandbox iframe (Milestone 2, Part 1)
const iframe = document.createElement("iframe");
iframe.src = "/sandbox.html";
iframe.sandbox.add("allow-scripts");
iframe.style.cssText = "width:100%;height:100%;border:0;display:block;";
viewportContainer.appendChild(iframe);

// State variables
let activePresetIndex = 0;
let currentSceneInstance: { dispose(): void; updateControl?(name: string, value: unknown): void } | null = null;
let editorView: EditorView | null = null;

// FPS Monitor state (Rolling 30-frame window)
const frameTimes: number[] = [];
let lastFrameTime = performance.now();
let fpsRafId: number | null = null;

function initFpsMonitor() {
  function measureFps() {
    const now = performance.now();
    const delta = now - lastFrameTime;
    lastFrameTime = now;

    frameTimes.push(delta);
    if (frameTimes.length > 30) {
      frameTimes.shift();
    }

    const averageDelta = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
    const fps = Math.round(1000 / (averageDelta || 16.6));

    fpsValueElement.textContent = `${fps} FPS`;

    fpsBadgeElement.classList.remove("warning", "low");
    if (fps < 30) {
      fpsBadgeElement.classList.add("low");
    } else if (fps < 50) {
      fpsBadgeElement.classList.add("warning");
    }

    fpsRafId = requestAnimationFrame(measureFps);
  }

  if (fpsRafId !== null) {
    cancelAnimationFrame(fpsRafId);
  }
  lastFrameTime = performance.now();
  fpsRafId = requestAnimationFrame(measureFps);
}

// CodeMirror Editor Setup
function initCodeEditor(initialCode: string) {
  editorContainer.innerHTML = "";

  const state = EditorState.create({
    doc: initialCode.trim(),
    extensions: [
      lineNumbers(),
      highlightActiveLineGutter(),
      javascript(),
      EditorView.editable.of(false),
      EditorView.theme({
        "&": { height: "100%", outline: "none" },
        ".cm-content": { fontFamily: "var(--font-mono)", fontSize: "13px" },
        ".cm-line": { padding: "0 12px" },
      }),
    ],
  });

  editorView = new EditorView({
    state,
    parent: editorContainer,
  });
}

function updateCodeEditor(code: string) {
  if (!editorView) return;
  editorView.dispatch({
    changes: {
      from: 0,
      to: editorView.state.doc.length,
      insert: code.trim(),
    },
  });
}

// Scene Runner for Milestone 1
function loadPreset(preset: PresetScene) {
  // 1. Dispose previous scene cleanly
  if (currentSceneInstance) {
    try {
      currentSceneInstance.dispose();
    } catch (err) {
      console.warn("Error disposing scene:", err);
    }
    currentSceneInstance = null;
  }

  // 2. Clear lingering DOM elements & error toasts from viewport
  const oldCanvases = viewportContainer.querySelectorAll("canvas, .error-toast");
  oldCanvases.forEach((el) => el.remove());

  // 3. Update Code Editor & Title Tag
  presetActiveTag.textContent = preset.title;
  updateCodeEditor(preset.code);

  // 4. Direct preset execution disabled in Milestone 2, Part 1
  // (Rendering will be restored via postMessage in Part 2)
}

// Render Preset Selector Buttons
function initPresetButtons() {
  presetButtonsContainer.innerHTML = "";
  PRESETS.forEach((preset, index) => {
    const btn = document.createElement("button");
    btn.className = `preset-btn ${index === activePresetIndex ? "active" : ""}`;
    btn.textContent = preset.title;
    btn.addEventListener("click", () => {
      if (activePresetIndex === index) return;
      activePresetIndex = index;

      const allBtns = presetButtonsContainer.querySelectorAll(".preset-btn");
      allBtns.forEach((b, i) => {
        b.classList.toggle("active", i === index);
      });

      loadPreset(PRESETS[activePresetIndex]);
    });
    presetButtonsContainer.appendChild(btn);
  });
}

// Application Initialization
function main() {
  initPresetButtons();
  initCodeEditor(PRESETS[activePresetIndex].code);
  loadPreset(PRESETS[activePresetIndex]);
  initFpsMonitor();
}

main();
