import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export interface PresetScene {
  id: string;
  title: string;
  description: string;
  code: string;
  init: (
    container: HTMLElement,
    three: typeof THREE,
    controlValues: Record<string, any>
  ) => { dispose(): void; updateControl(name: string, value: unknown): void };
}

export const PRESETS: PresetScene[] = [
  {
    id: "spinning-cube",
    title: "Spinning Cube",
    description: "Classic neon rotating cube with dynamic lighting and color control",
    code: `export function init(container, THREE, controlValues) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#0d0e18");

  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;

  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
  camera.position.set(3, 2.5, 4);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  // Main vibrant cube
  const geo = new THREE.BoxGeometry(1.6, 1.6, 1.6);
  const mat = new THREE.MeshStandardMaterial({
    color: controlValues.color ?? "#00f0ff",
    roughness: 0.2,
    metalness: 0.1,
    emissive: "#003344",
    emissiveIntensity: 0.5,
  });
  const cube = new THREE.Mesh(geo, mat);
  scene.add(cube);

  // Wireframe accent overlay
  const wireGeo = new THREE.BoxGeometry(1.62, 1.62, 1.62);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true,
    transparent: true,
    opacity: 0.25,
  });
  const wireCube = new THREE.Mesh(wireGeo, wireMat);
  scene.add(wireCube);

  // Ground grid helper
  const grid = new THREE.GridHelper(12, 12, 0x00f0ff, 0x223355);
  grid.position.y = -1.4;
  scene.add(grid);

  // Dynamic lights
  const mainLight = new THREE.DirectionalLight(0xffffff, 3.0);
  mainLight.position.set(5, 8, 5);
  scene.add(mainLight);

  const fillLight = new THREE.DirectionalLight(0xff00aa, 2.0);
  fillLight.position.set(-5, -2, -5);
  scene.add(fillLight);

  const ambientLight = new THREE.AmbientLight(0x223355, 2.0);
  scene.add(ambientLight);

  let rafId;
  function tick() {
    cube.rotation.x += 0.008;
    cube.rotation.y += 0.012;
    wireCube.rotation.x = cube.rotation.x;
    wireCube.rotation.y = cube.rotation.y;

    controls.update();
    renderer.render(scene, camera);
    rafId = requestAnimationFrame(tick);
  }
  tick();

  const handleResize = () => {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  window.addEventListener("resize", handleResize);

  return {
    dispose() {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      controls.dispose();
      geo.dispose();
      mat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      grid.geometry.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    },
    updateControl(name, value) {
      if (name === "color" && mat.color) {
        mat.color.set(value);
      }
    }
  };
}`,
    init(container, three, controlValues) {
      const scene = new three.Scene();
      scene.background = new three.Color("#0d0e18");

      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;

      const camera = new three.PerspectiveCamera(60, width / height, 0.1, 100);
      camera.position.set(3, 2.5, 4);

      const renderer = new three.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;

      const geo = new three.BoxGeometry(1.6, 1.6, 1.6);
      const mat = new three.MeshStandardMaterial({
        color: controlValues.color ?? "#00f0ff",
        roughness: 0.2,
        metalness: 0.1,
        emissive: "#003344",
        emissiveIntensity: 0.5,
      });
      const cube = new three.Mesh(geo, mat);
      scene.add(cube);

      const wireGeo = new three.BoxGeometry(1.62, 1.62, 1.62);
      const wireMat = new three.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.25,
      });
      const wireCube = new three.Mesh(wireGeo, wireMat);
      scene.add(wireCube);

      const grid = new three.GridHelper(12, 12, 0x00f0ff, 0x223355);
      grid.position.y = -1.4;
      scene.add(grid);

      const mainLight = new three.DirectionalLight(0xffffff, 3.0);
      mainLight.position.set(5, 8, 5);
      scene.add(mainLight);

      const fillLight = new three.DirectionalLight(0xff00aa, 2.0);
      fillLight.position.set(-5, -2, -5);
      scene.add(fillLight);

      const ambientLight = new three.AmbientLight(0x223355, 2.0);
      scene.add(ambientLight);

      let rafId: number;
      function tick() {
        cube.rotation.x += 0.008;
        cube.rotation.y += 0.012;
        wireCube.rotation.x = cube.rotation.x;
        wireCube.rotation.y = cube.rotation.y;

        controls.update();
        renderer.render(scene, camera);
        rafId = requestAnimationFrame(tick);
      }
      tick();

      const handleResize = () => {
        const w = container.clientWidth || window.innerWidth;
        const h = container.clientHeight || window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", handleResize);

      return {
        dispose() {
          cancelAnimationFrame(rafId);
          window.removeEventListener("resize", handleResize);
          controls.dispose();
          geo.dispose();
          mat.dispose();
          wireGeo.dispose();
          wireMat.dispose();
          grid.geometry.dispose();
          renderer.dispose();
          if (renderer.domElement.parentNode) {
            renderer.domElement.parentNode.removeChild(renderer.domElement);
          }
        },
        updateControl(name: string, value: unknown) {
          if (name === "color" && mat.color && typeof value === "string") {
            mat.color.set(value);
          }
        },
      };
    },
  },
  {
    id: "particle-field",
    title: "Particle Nebula",
    description: "5,000 animated floating particles in a glowing swirling vortex",
    code: `export function init(container, THREE, controlValues) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#050512");

  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;

  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
  camera.position.set(0, 0, 7);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  const particleCount = 5000;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const color1 = new THREE.Color("#ff0077");
  const color2 = new THREE.Color("#00f0ff");

  for (let i = 0; i < particleCount; i++) {
    const r = (Math.random() - 0.5) * 8;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);

    const mixedColor = color1.clone().lerp(color2, Math.random());
    colors[i * 3] = mixedColor.r;
    colors[i * 3 + 1] = mixedColor.g;
    colors[i * 3 + 2] = mixedColor.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.1,
    vertexColors: true,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  let rafId;
  let time = 0;
  function tick() {
    time += 0.005;
    particles.rotation.y = time * 0.5;
    particles.rotation.x = Math.sin(time * 0.3) * 0.2;
    controls.update();
    renderer.render(scene, camera);
    rafId = requestAnimationFrame(tick);
  }
  tick();

  const handleResize = () => {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  window.addEventListener("resize", handleResize);

  return {
    dispose() {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      controls.dispose();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    },
    updateControl(name, value) {}
  };
}`,
    init(container, three, _controlValues) {
      const scene = new three.Scene();
      scene.background = new three.Color("#050512");

      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;

      const camera = new three.PerspectiveCamera(60, width / height, 0.1, 100);
      camera.position.set(0, 0, 7);

      const renderer = new three.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;

      const particleCount = 5000;
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      const color1 = new three.Color("#ff0077");
      const color2 = new three.Color("#00f0ff");

      for (let i = 0; i < particleCount; i++) {
        const r = (Math.random() - 0.5) * 8;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);

        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);

        const mixedColor = color1.clone().lerp(color2, Math.random());
        colors[i * 3] = mixedColor.r;
        colors[i * 3 + 1] = mixedColor.g;
        colors[i * 3 + 2] = mixedColor.b;
      }

      const geometry = new three.BufferGeometry();
      geometry.setAttribute("position", new three.BufferAttribute(positions, 3));
      geometry.setAttribute("color", new three.BufferAttribute(colors, 3));

      const material = new three.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        blending: three.AdditiveBlending,
        depthWrite: false,
      });

      const particles = new three.Points(geometry, material);
      scene.add(particles);

      let rafId: number;
      let time = 0;
      function tick() {
        time += 0.005;
        particles.rotation.y = time * 0.5;
        particles.rotation.x = Math.sin(time * 0.3) * 0.2;
        controls.update();
        renderer.render(scene, camera);
        rafId = requestAnimationFrame(tick);
      }
      tick();

      const handleResize = () => {
        const w = container.clientWidth || window.innerWidth;
        const h = container.clientHeight || window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", handleResize);

      return {
        dispose() {
          cancelAnimationFrame(rafId);
          window.removeEventListener("resize", handleResize);
          controls.dispose();
          geometry.dispose();
          material.dispose();
          renderer.dispose();
          if (renderer.domElement.parentNode) {
            renderer.domElement.parentNode.removeChild(renderer.domElement);
          }
        },
        updateControl(_name: string, _value: unknown) {},
      };
    },
  },
  {
    id: "torus-knot",
    title: "Metallic Torus Knot",
    description: "Complex geometrical sculpture with metallic sheen and ambient reflections",
    code: `export function init(container, THREE, controlValues) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#0c091a");

  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;

  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
  camera.position.set(0, 0, 4.5);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  const geo = new THREE.TorusKnotGeometry(1, 0.35, 128, 32);
  const mat = new THREE.MeshStandardMaterial({
    color: controlValues.color ?? "#b066ff",
    roughness: 0.2,
    metalness: 0.1,
    emissive: "#330066",
    emissiveIntensity: 0.4,
  });
  const knot = new THREE.Mesh(geo, mat);
  scene.add(knot);

  const light1 = new THREE.PointLight(0x00ffff, 5, 10);
  light1.position.set(3, 3, 3);
  scene.add(light1);

  const light2 = new THREE.PointLight(0xff00aa, 5, 10);
  light2.position.set(-3, -3, 2);
  scene.add(light2);

  const ambient = new THREE.AmbientLight(0x332255, 2.0);
  scene.add(ambient);

  let rafId;
  let time = 0;
  function tick() {
    time += 0.01;
    knot.rotation.x = time * 0.4;
    knot.rotation.y = time * 0.6;

    light1.position.x = Math.sin(time) * 4;
    light1.position.z = Math.cos(time) * 4;

    controls.update();
    renderer.render(scene, camera);
    rafId = requestAnimationFrame(tick);
  }
  tick();

  const handleResize = () => {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  window.addEventListener("resize", handleResize);

  return {
    dispose() {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      controls.dispose();
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    },
    updateControl(name, value) {
      if (name === "color" && mat.color) {
        mat.color.set(value);
      }
    }
  };
}`,
    init(container, three, controlValues) {
      const scene = new three.Scene();
      scene.background = new three.Color("#0c091a");

      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;

      const camera = new three.PerspectiveCamera(60, width / height, 0.1, 100);
      camera.position.set(0, 0, 4.5);

      const renderer = new three.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;

      const geo = new three.TorusKnotGeometry(1, 0.35, 128, 32);
      const mat = new three.MeshStandardMaterial({
        color: controlValues.color ?? "#b066ff",
        roughness: 0.2,
        metalness: 0.1,
        emissive: "#330066",
        emissiveIntensity: 0.4,
      });
      const knot = new three.Mesh(geo, mat);
      scene.add(knot);

      const light1 = new three.PointLight(0x00ffff, 5, 10);
      light1.position.set(3, 3, 3);
      scene.add(light1);

      const light2 = new three.PointLight(0xff00aa, 5, 10);
      light2.position.set(-3, -3, 2);
      scene.add(light2);

      const ambient = new three.AmbientLight(0x332255, 2.0);
      scene.add(ambient);

      let rafId: number;
      let time = 0;
      function tick() {
        time += 0.01;
        knot.rotation.x = time * 0.4;
        knot.rotation.y = time * 0.6;

        light1.position.x = Math.sin(time) * 4;
        light1.position.z = Math.cos(time) * 4;

        controls.update();
        renderer.render(scene, camera);
        rafId = requestAnimationFrame(tick);
      }
      tick();

      const handleResize = () => {
        const w = container.clientWidth || window.innerWidth;
        const h = container.clientHeight || window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", handleResize);

      return {
        dispose() {
          cancelAnimationFrame(rafId);
          window.removeEventListener("resize", handleResize);
          controls.dispose();
          geo.dispose();
          mat.dispose();
          renderer.dispose();
          if (renderer.domElement.parentNode) {
            renderer.domElement.parentNode.removeChild(renderer.domElement);
          }
        },
        updateControl(name: string, value: unknown) {
          if (name === "color" && mat.color && typeof value === "string") {
            mat.color.set(value);
          }
        },
      };
    },
  },
];
