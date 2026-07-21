export interface SceneControl {
  name: string;
  type: "slider" | "color" | "toggle" | "select";
  min?: number;
  max?: number;
  step?: number;
  default: number | string | boolean;
  options?: string[];
}

export type HostToSandboxMessage =
  | { type: "LOAD_SCENE"; code: string; controls: SceneControl[] }
  | { type: "UPDATE_CONTROL"; name: string; value: number | string | boolean }
  | { type: "DISPOSE" }
  | { type: "PING" };

export type SandboxToHostMessage =
  | { type: "READY" }
  | { type: "SCENE_LOADED" }
  | { type: "RUNTIME_ERROR"; message: string; stack: string }
  | { type: "FPS_REPORT"; fps: number }
  | { type: "DISPOSED" };
