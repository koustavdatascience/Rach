export interface PresetScene {
  id: string;
  title: string;
  description: string;
  code: string;
}

export const PRESETS: PresetScene[] = [
  {
    id: "spinning-cube",
    title: "Spinning Cube",
    description: "Classic neon rotating cube with dynamic lighting and color control",
    code: `
export function init(container, THREE, controlValues) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#0a0a10");

  const camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );
  camera.position.set(2, 2, 4);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const geo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
  const mat = new THREE.MeshStandardMaterial({
    color: controlValues.color ?? "#44aaff",
    roughness: 0.2,
    metalness: 0.8,
  });
  const cube = new THREE.Mesh(geo, mat);
  scene.add(cube);

  const grid = new THREE.GridHelper(10, 10, 0x444466, 0x222233);
  grid.position.y = -1.5;
  scene.add(grid);

  const dirLight = new THREE.DirectionalLight(0xffffff, 2);
  dirLight.position.set(5, 8, 5);
  scene.add(dirLight);

  const ambientLight = new THREE.AmbientLight(0x223344, 1.5);
  scene.add(ambientLight);

  let rafId;
  function tick() {
    cube.rotation.x += 0.008;
    cube.rotation.y += 0.012;
    renderer.render(scene, camera);
    rafId = requestAnimationFrame(tick);
  }
  tick();

  const handleResize = () => {
    if (!container.clientWidth || !container.clientHeight) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  };
  window.addEventListener("resize", handleResize);

  return {
    dispose() {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
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
}
`,
  },
  {
    id: "particle-field",
    title: "Particle Nebula",
    description: "5,000 animated floating particles in a glowing swirling vortex",
    code: `
export function init(container, THREE, controlValues) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#05050d");

  const camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 7);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

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
    size: 0.05,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  let rafId;
  let time = 0;
  function tick() {
    time += 0.005;
    particles.rotation.y = time * 0.5;
    particles.rotation.x = Math.sin(time * 0.3) * 0.2;
    renderer.render(scene, camera);
    rafId = requestAnimationFrame(tick);
  }
  tick();

  const handleResize = () => {
    if (!container.clientWidth || !container.clientHeight) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  };
  window.addEventListener("resize", handleResize);

  return {
    dispose() {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    },
    updateControl(name, value) {
      if (name === "speed") {
        // dynamic parameter update
      }
    }
  };
}
`,
  },
  {
    id: "torus-knot",
    title: "Metallic Torus Knot",
    description: "Complex geometrical sculpture with metallic sheen and ambient reflections",
    code: `
export function init(container, THREE, controlValues) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#0d0a14");

  const camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 5);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const geo = new THREE.TorusKnotGeometry(1, 0.35, 128, 32);
  const mat = new THREE.MeshStandardMaterial({
    color: controlValues.color ?? "#9050ff",
    roughness: 0.15,
    metalness: 0.9,
  });
  const knot = new THREE.Mesh(geo, mat);
  scene.add(knot);

  const light1 = new THREE.PointLight(0x00ffff, 3, 10);
  light1.position.set(3, 3, 3);
  scene.add(light1);

  const light2 = new THREE.PointLight(0xff00aa, 3, 10);
  light2.position.set(-3, -3, 2);
  scene.add(light2);

  const ambient = new THREE.AmbientLight(0x111122, 1);
  scene.add(ambient);

  let rafId;
  let time = 0;
  function tick() {
    time += 0.01;
    knot.rotation.x = time * 0.4;
    knot.rotation.y = time * 0.6;

    light1.position.x = Math.sin(time) * 4;
    light1.position.z = Math.cos(time) * 4;

    renderer.render(scene, camera);
    rafId = requestAnimationFrame(tick);
  }
  tick();

  const handleResize = () => {
    if (!container.clientWidth || !container.clientHeight) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  };
  window.addEventListener("resize", handleResize);

  return {
    dispose() {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
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
}
`,
  },
];
