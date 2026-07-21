/**
 * Every generated scene module must match this exact runtime shape.
 * This string is injected verbatim into the Groq system prompt in Milestone 3 —
 * keep it in sync with runtime-entry.ts's expectations.
 */
export const SCENE_CONTRACT_DOC = `
export function init(container, THREE, controlValues) {
  // build scene, camera, renderer, animation loop here
  // controlValues is an object keyed by each control's "name"
  return {
    dispose() {
      // cancel requestAnimationFrame, call .dispose() on every geometry,
      // material, texture, and the renderer, remove the canvas from container
    },
    updateControl(name, value) {
      // apply a single changed control to the live scene without a full rebuild
    }
  };
}
`;
