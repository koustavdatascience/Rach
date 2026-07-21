import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EditorState } from "@codemirror/state";
import { EditorView, lineNumbers, highlightActiveLineGutter } from "@codemirror/view";
import { javascript } from "@codemirror/lang-javascript";
import { PRESETS, type PresetScene } from "./presets/presets";
import "./style.css";

// Make OrbitControls globally accessible on THREE for dynamic evaluation
(THREE as any).OrbitControls = OrbitControls;

// DOM references
const viewportContainer = document.getElementById("viewport")!;
const editorContainer = document.getElementById("editor-container")!;
const presetButtonsContainer = document.getElementById("preset-buttons")!;
const fpsValueElement = document.getElementById("fps-value")!;
const fpsBadgeElement = document.getElementById("fps-badge")!;
const presetActiveTag = document.getElementById("preset-active-tag")!;

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

// Scene Runner for Milestone 1 (Direct Bootstrap Execution)
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

  // 4. Defer execution to next frame so container dimensions settle
  requestAnimationFrame(() => {
    try {
      const sanitizedCode = preset.code.replace(/^\s*export\s+/gm, "");
      const moduleRunner = new Function(
        "THREE",
        "OrbitControls",
        `${sanitizedCode}\nreturn init;`
      );
      const initFn = moduleRunner(THREE, OrbitControls);
      currentSceneInstance = initFn(viewportContainer, THREE, {});
    } catch (err: any) {
      console.error("Failed to initialize scene:", err);

      // Render visible error toast in viewport
      const toast = document.createElement("div");
      toast.className = "error-toast";
      toast.style.cssText = `
        position: absolute; top: 70px; left: 16px; right: 16px; z-index: 20;
        padding: 12px 16px; background: rgba(239, 68, 68, 0.9); backdrop-filter: blur(8px);
        color: white; border-radius: 8px; font-family: var(--font-mono); font-size: 12px;
      `;
      toast.textContent = `Runtime Error: ${err?.message || String(err)}`;
      viewportContainer.appendChild(toast);
    }
  });
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
