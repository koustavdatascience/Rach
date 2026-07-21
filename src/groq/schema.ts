import type { SceneControl } from "../sandbox/protocol";

export interface SceneMetadata {
  title: string;
  description: string;
  estimatedTriangleCount?: number;
  usesInstancing?: boolean;
}

export interface SceneResponse {
  code: string;
  controls: SceneControl[];
  metadata: SceneMetadata;
}

export function validateSceneResponse(obj: unknown): obj is SceneResponse {
  if (typeof obj !== "object" || obj === null) return false;
  const r = obj as Record<string, unknown>;
  if (typeof r.code !== "string" || r.code.length === 0) return false;
  if (!Array.isArray(r.controls)) return false;
  for (const c of r.controls) {
    if (typeof c !== "object" || c === null) return false;
    const cc = c as Record<string, unknown>;
    if (typeof cc.name !== "string") return false;
    if (!["slider", "color", "toggle", "select"].includes(cc.type as string)) return false;
    if (!("default" in cc)) return false;
  }
  if (typeof r.metadata !== "object" || r.metadata === null) return false;
  const m = r.metadata as Record<string, unknown>;
  if (typeof m.title !== "string" || typeof m.description !== "string") return false;
  return true;
}
