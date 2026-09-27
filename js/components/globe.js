// Decorative hero globe: a point-cloud Earth behind the hero terminal, desktop only (>1024px).
// It lazy-loads the local Three.js build (js/vendor) and the land mask with import() at idle
// time; any failure (no WebGL, blocked module, lost context) leaves the hero untouched.
const GLOBE_SCRIPT_URL = document.currentScript ? document.currentScript.src : document.baseURI;

function initHeroGlobe() {
  const container = document.querySelector('.hero-globe');
  if (!container || container.dataset.globe) return;
  container.dataset.globe = 'init';

  // Motion (radians, seconds)
  const TILT_X = 0.30;                     // shows a bit more of the northern hemisphere
  const TILT_Z = 0.16;                     // slight axial tilt
  const SPIN_START = 0.88;                 // Guatemala (-90.5°) starts about 40° left of center
  const SPIN_SPEED = (Math.PI * 2) / 64;   // one turn every ~64 s, west to east
  const PARALLAX_YAW = 0.045;
  const PARALLAX_PITCH = 0.022;
  const PARALLAX_EASE = 2.5;
  const MAX_FRAME_DT = 0.1;

  // Look
  const CAMERA_FOV = 30;
  const SPHERE_FILL = 0.8;                 // silhouette radius / canvas radius (the CSS halo assumes it)
  const DOT_SIZE_PX = 2.1;
  const NODE_SIZE_PX = 7;
  const DOT_OPACITY = 0.9;
  const OCEAN_KEEP = 1 / 7;                // sparse ocean dots keep the silhouette when the Pacific faces us
  const ARC_SEGMENTS = 64;
  const NODE_RADIUS = 1.004;
  const RANDOM_SEED = 20260927;            // fixed, so the dot pattern looks the same on every visit

  const CITIES = {
    guatemala: [14.63, -90.51],
    sanFrancisco: [37.77, -122.42],
    ashburn: [39.04, -77.49],
    toronto: [43.65, -79.38],
    mexicoCity: [19.43, -99.13],
    bogota: [4.71, -74.07],
    saoPaulo: [-23.55, -46.63],
    madrid: [40.42, -3.70],
    london: [51.51, -0.13],
    frankfurt: [50.11, 8.68],
    singapore: [1.35, 103.82],
    tokyo: [35.68, 139.69],
    sydney: [-33.87, 151.21],
  };
  const HOME = 'guatemala';
  // Low-end devices keep only the first five arcs.
  const ARCS = [
    ['guatemala', 'ashburn'], ['guatemala', 'sanFrancisco'], ['guatemala', 'saoPaulo'],
    ['guatemala', 'madrid'], ['ashburn', 'london'], ['london', 'frankfurt'],
    ['sanFrancisco', 'tokyo'], ['frankfurt', 'singapore'],
  ];

  // Shared by the three shaders: 1 facing the camera, 0 at the limb, negative on the back.
  const FACING_GLSL = `
    float facingOf(vec3 normal, vec4 mvPosition) {
      return dot(normalize(normalMatrix * normal), normalize(-mvPosition.xyz));
    }
    float frontOf(float facing) { return smoothstep(-0.35, 0.75, facing); }
  `;

  const DOTS_VERTEX = `
    uniform float uSize;
    attribute float aSize;
    attribute float aBright;
    varying float vAlpha;
    varying float vFront;
    ${FACING_GLSL}
    void main() {
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      float facing = facingOf(position, mv);
      float front = frontOf(facing);
      vAlpha = aBright * mix(0.07, 1.0, front);
      vFront = smoothstep(-0.2, 0.9, facing);
      gl_PointSize = uSize * aSize * mix(0.7, 1.0, front);
      gl_Position = projectionMatrix * mv;
    }
  `;
  const DOTS_FRAGMENT = `
    uniform vec3 uColorFront;
    uniform vec3 uColorBack;
    uniform float uOpacity;
    varying float vAlpha;
    varying float vFront;
    void main() {
      float d = length(gl_PointCoord - 0.5);
      if (d > 0.5) discard;
      float edge = 1.0 - smoothstep(0.3, 0.5, d);
      gl_FragColor = vec4(mix(uColorBack, uColorFront, vFront), edge * vAlpha * uOpacity);
    }
  `;

  const ARCS_VERTEX = `
    attribute float aT;
    attribute float aSeed;
    varying float vT;
    varying float vSeed;
    varying float vFade;
    ${FACING_GLSL}
    void main() {
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      vFade = mix(0.07, 1.0, frontOf(facingOf(normalize(position), mv)));
      vT = aT;
      vSeed = aSeed;
      gl_Position = projectionMatrix * mv;
    }
  `;
  const ARCS_FRAGMENT = `
    uniform vec3 uColor;
    uniform float uTime;
    uniform float uFlow;
    varying float vT;
    varying float vSeed;
    varying float vFade;
    void main() {
      // The highlight travels from -0.2 to 1.2, so it enters and leaves each arc without a jump.
      float head = fract(uTime * 0.07 + vSeed) * 1.4 - 0.2;
      float glow = (1.0 - smoothstep(0.0, 0.14, abs(vT - head))) * uFlow;
      gl_FragColor = vec4(uColor, (0.10 + 0.22 * glow) * vFade);
    }
  `;

  const NODES_VERTEX = `
    uniform float uSize;
    uniform float uTime;
    uniform float uPulse;
    attribute float aSize;
    attribute float aPhase;
    varying float vAlpha;
    ${FACING_GLSL}
    void main() {
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      float front = frontOf(facingOf(position, mv));
      float breath = mix(1.0, 0.75 + 0.25 * sin(uTime * 1.2 + aPhase), uPulse);
      vAlpha = mix(0.07, 1.0, front) * breath;
      gl_PointSize = uSize * aSize * mix(0.7, 1.0, front);
      gl_Position = projectionMatrix * mv;
    }
  `;
  const NODES_FRAGMENT = `
    uniform vec3 uColor;
    varying float vAlpha;
    void main() {
      float d = length(gl_PointCoord - 0.5);
      if (d > 0.5) discard;
      float core = 1.0 - smoothstep(0.06, 0.16, d);
      float halo = 1.0 - smoothstep(0.0, 0.5, d);
      vec3 color = mix(uColor, vec3(1.0), core * 0.3);
      gl_FragColor = vec4(color, (core * 0.85 + halo * halo * 0.3) * vAlpha);
    }
  `;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  function mulberry32(seed) {
    let state = seed >>> 0;
    return () => {
      state = (state + 0x6d2b79f5) >>> 0;
      let t = Math.imul(state ^ (state >>> 15), 1 | state);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // x = cos(lat)·sin(lon), y = sin(lat), z = cos(lat)·cos(lon): longitude 0 faces the camera (+z).
  function latLonToVec3(latDeg, lonDeg, radius = 1) {
    const lat = latDeg * Math.PI / 180;
    const lon = lonDeg * Math.PI / 180;
    return [radius * Math.cos(lat) * Math.sin(lon), radius * Math.sin(lat), radius * Math.cos(lat) * Math.cos(lon)];
  }

  // The mask (js/components/globe-land.js) is 1 bit per cell, rows from 90N, columns from 180W.
  function createLandLookup(land) {
    const bytes = Uint8Array.from(atob(land.LAND_MASK), (char) => char.charCodeAt(0));
    const width = land.LAND_MASK_WIDTH;
    const height = land.LAND_MASK_HEIGHT;
    return (latDeg, lonDeg) => {
      const row = clamp(Math.floor((90 - latDeg) * height / 180), 0, height - 1);
      const col = ((Math.floor((lonDeg + 180) * width / 360) % width) + width) % width;
      const i = row * width + col;
      return (bytes[i >> 3] >> (7 - (i & 7))) & 1;
    };
  }

  // ShaderMaterial skips color management, so the CSS hex token becomes raw sRGB channels.
  function tokenColor(THREE, styles, name, fallback) {
    const raw = styles.getPropertyValue(name).trim();
    let hex = (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(raw) ? raw : fallback).slice(1);
    if (hex.length === 3) hex = hex.replace(/./g, '$&$&');
    const value = parseInt(hex, 16);
    return new THREE.Color().setRGB((value >> 16 & 255) / 255, (value >> 8 & 255) / 255, (value & 255) / 255);
  }

  function makeGeometry(THREE, attributes) {
    const geometry = new THREE.BufferGeometry();
    Object.entries(attributes).forEach(([name, [array, itemSize]]) => {
      geometry.setAttribute(name, new THREE.BufferAttribute(array, itemSize));
    });
    return geometry;
  }

  // Fibonacci sphere: land cells keep every point, the ocean keeps a faint sparse sample.
  function buildDots(THREE, isLand, count, rand) {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const brightness = new Float32Array(count);
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    let kept = 0;
    for (let i = 0; i < count; i++) {
      const y = 1 - 2 * (i + 0.5) / count;
      const ring = Math.sqrt(1 - y * y);
      const x = Math.cos(goldenAngle * i) * ring;
      const z = Math.sin(goldenAngle * i) * ring;
      const land = isLand(Math.asin(y) * 180 / Math.PI, Math.atan2(x, z) * 180 / Math.PI);
      // Two draws per point, so the pattern never depends on which branch ran before.
      const a = rand();
      const b = rand();
      if (!land && a >= OCEAN_KEEP) continue;
      positions.set([x, y, z], kept * 3);
      sizes[kept] = land ? 0.9 + 0.4 * b : 0.8;
      brightness[kept] = land ? 0.72 + 0.28 * a : 0.16;
      kept++;
    }
    return makeGeometry(THREE, {
      position: [positions.slice(0, kept * 3), 3],
      aSize: [sizes.slice(0, kept), 1],
      aBright: [brightness.slice(0, kept), 1],
    });
  }

  // Great-circle arcs lifted off the surface, merged into one LineSegments geometry.
  function buildArcs(THREE, pairs) {
    const vertexCount = pairs.length * ARC_SEGMENTS * 2;
    const positions = new Float32Array(vertexCount * 3);
    const progress = new Float32Array(vertexCount);
    const seeds = new Float32Array(vertexCount);
    let v = 0;
    pairs.forEach(([from, to], index) => {
      const a = latLonToVec3(...CITIES[from]);
      const b = latLonToVec3(...CITIES[to]);
      const angle = Math.acos(clamp(a[0] * b[0] + a[1] * b[1] + a[2] * b[2], -1, 1));
      const sinAngle = Math.sin(angle) || 1;
      const lift = 0.05 + 0.18 * (angle / Math.PI);   // longer arcs fly higher
      const seed = (index * 0.618034) % 1;           // spreads the highlight phases
      for (let s = 0; s < ARC_SEGMENTS; s++) {
        for (let end = 0; end < 2; end++) {
          const t = (s + end) / ARC_SEGMENTS;
          const wa = Math.sin((1 - t) * angle) / sinAngle;
          const wb = Math.sin(t * angle) / sinAngle;
          const height = 1 + lift * Math.sin(Math.PI * t);
          for (let axis = 0; axis < 3; axis++) positions[v * 3 + axis] = (wa * a[axis] + wb * b[axis]) * height;
          progress[v] = t;
          seeds[v] = seed;
          v++;
        }
      }
    });
    return makeGeometry(THREE, { position: [positions, 3], aT: [progress, 1], aSeed: [seeds, 1] });
  }

  function buildNodes(THREE, rand) {
    const names = Object.keys(CITIES);
    const positions = new Float32Array(names.length * 3);
    const sizes = new Float32Array(names.length);
    const phases = new Float32Array(names.length);
    names.forEach((name, i) => {
      positions.set(latLonToVec3(...CITIES[name], NODE_RADIUS), i * 3);
      sizes[i] = name === HOME ? 1.5 : 1;
      phases[i] = rand() * Math.PI * 2;
    });
    return makeGeometry(THREE, { position: [positions, 3], aSize: [sizes, 1], aPhase: [phases, 1] });
  }

  // One requestAnimationFrame loop; start()/stop() are idempotent and dt is in seconds.
  function makeLoop(tick) {
    let frameId = 0;
    let last = 0;
    const frame = (now) => {
      const dt = last ? Math.min((now - last) / 1000, MAX_FRAME_DT) : 0;
      last = now;
      tick(dt);
      if (frameId) frameId = requestAnimationFrame(frame);
    };
    return {
      start() {
        if (frameId) return;
        last = 0;
        frameId = requestAnimationFrame(frame);
      },
      stop() {
        if (!frameId) return;
        cancelAnimationFrame(frameId);
        frameId = 0;
      },
      isRunning: () => frameId !== 0,
    };
  }

  function mount(THREE, land) {
    const hero = container.closest('.hero') || container.parentElement;
    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    container.appendChild(canvas);

    const lowEnd = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4;
    const pixelRatio = () => Math.min(window.devicePixelRatio || 1, lowEnd ? 1.5 : 2);
    const contextOptions = { alpha: true, antialias: true, powerPreference: 'low-power' };

    let renderer;
    try {
      // Probing the context first keeps a browser without WebGL 2 silent (Three.js would log an error).
      const context = canvas.getContext('webgl2', contextOptions);
      if (!context) throw new Error('WebGL 2 unavailable');
      renderer = new THREE.WebGLRenderer({ canvas, context, ...contextOptions });
    } catch (error) {
      canvas.remove();
      return;
    }
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(pixelRatio());

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(CAMERA_FOV, 1, 0.1, 20);
    // Distance at which the unit sphere's silhouette fills SPHERE_FILL of the canvas radius.
    const halfFov = CAMERA_FOV * Math.PI / 360;
    camera.position.set(0, 0, 1 / Math.sin(Math.atan(SPHERE_FILL * Math.tan(halfFov))));

    const root = new THREE.Group();   // tilt + parallax
    root.rotation.set(TILT_X, 0, TILT_Z);
    const spin = new THREE.Group();   // rotation around the (tilted) axis
    spin.rotation.y = SPIN_START;
    root.add(spin);
    scene.add(root);

    const styles = getComputedStyle(document.documentElement);
    const accent = tokenColor(THREE, styles, '--accent', '#1fe0b0');
    const cyan = tokenColor(THREE, styles, '--accent-secondary', '#3cc8e8');

    // Uniform objects shared by reference between the materials.
    const uTime = { value: 0 };
    const uFlow = { value: 1 };
    const uPulse = { value: 1 };
    const dotSize = { value: 1 };
    const nodeSize = { value: 1 };

    const material = (vertexShader, fragmentShader, uniforms) => new THREE.ShaderMaterial({
      vertexShader, fragmentShader, uniforms, transparent: true, depthWrite: false, depthTest: false,
    });

    const rand = mulberry32(RANDOM_SEED);
    const baseCount = canvas.clientWidth >= 700 ? 36000 : 26000;
    const dots = new THREE.Points(
      buildDots(THREE, createLandLookup(land), Math.round(baseCount * (lowEnd ? 0.65 : 1)), rand),
      material(DOTS_VERTEX, DOTS_FRAGMENT, {
        uSize: dotSize,
        uColorFront: { value: cyan.clone().lerp(accent, 0.35) },
        uColorBack: { value: cyan.clone().multiplyScalar(0.45) },
        uOpacity: { value: DOT_OPACITY },
      }),
    );
    const arcs = new THREE.LineSegments(
      buildArcs(THREE, lowEnd ? ARCS.slice(0, 5) : ARCS),
      material(ARCS_VERTEX, ARCS_FRAGMENT, { uColor: { value: cyan }, uTime, uFlow }),
    );
    const nodes = new THREE.Points(
      buildNodes(THREE, rand),
      material(NODES_VERTEX, NODES_FRAGMENT, { uColor: { value: accent }, uSize: nodeSize, uTime, uPulse }),
    );
    // Without depth testing the draw order decides what sits on top.
    [dots, arcs, nodes].forEach((object, order) => {
      object.renderOrder = order;
      spin.add(object);
    });

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    let visible = !('IntersectionObserver' in window);
    let ready = false;
    let elapsed = 0;
    let targetYaw = 0;
    let targetPitch = TILT_X;

    const render = () => {
      renderer.render(scene, camera);
      if (ready) return;
      ready = true;
      container.classList.add('is-ready');
    };

    const loop = makeLoop((dt) => {
      elapsed += dt;
      spin.rotation.y = SPIN_START + elapsed * SPIN_SPEED;
      const k = 1 - Math.exp(-dt * PARALLAX_EASE);
      root.rotation.y += (targetYaw - root.rotation.y) * k;
      root.rotation.x += (targetPitch - root.rotation.x) * k;
      uTime.value = elapsed;
      render();
    });

    const sync = () => {
      if (visible && !document.hidden && !reducedMotion.matches) loop.start();
      else loop.stop();
    };

    // The CSS decides the canvas size; display:none (<=1024px) reports 0 and is skipped.
    const onResize = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (!width || !height) return;
      const ratio = pixelRatio();
      if (renderer.getPixelRatio() !== ratio) renderer.setPixelRatio(ratio);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      const scale = clamp(width / 760, 0.75, 1.1);
      dotSize.value = DOT_SIZE_PX * ratio * scale;
      nodeSize.value = NODE_SIZE_PX * ratio * scale;
      if (!loop.isRunning()) render();
    };

    const resetParallax = () => {
      targetYaw = 0;
      targetPitch = TILT_X;
    };
    const onPointerMove = (event) => {
      if (!finePointer.matches || reducedMotion.matches) return;
      const viewport = document.documentElement;
      targetYaw = (event.clientX / viewport.clientWidth * 2 - 1) * PARALLAX_YAW;
      targetPitch = TILT_X + (event.clientY / viewport.clientHeight * 2 - 1) * PARALLAX_PITCH;
    };

    const applyMotionPreference = () => {
      const still = reducedMotion.matches;
      uFlow.value = still ? 0 : 1;
      uPulse.value = still ? 0 : 1;
      if (still) {
        resetParallax();
        root.rotation.set(TILT_X, 0, TILT_Z);
      }
    };
    const onMotionChange = () => {
      applyMotionPreference();
      sync();
      if (!loop.isRunning() && canvas.clientWidth) render();
    };

    const io = 'IntersectionObserver' in window
      ? new IntersectionObserver((entries) => {
        visible = entries[entries.length - 1].isIntersecting;
        sync();
      })
      : null;
    const ro = 'ResizeObserver' in window ? new ResizeObserver(onResize) : null;

    function destroy() {
      loop.stop();
      if (io) io.disconnect();
      if (ro) ro.disconnect();
      else window.removeEventListener('resize', onResize);
      hero.removeEventListener('pointermove', onPointerMove);
      hero.removeEventListener('pointerleave', resetParallax);
      document.removeEventListener('visibilitychange', sync);
      reducedMotion.removeEventListener('change', onMotionChange);
      canvas.removeEventListener('webglcontextlost', destroy);
      [dots, arcs, nodes].forEach((object) => {
        object.geometry.dispose();
        object.material.dispose();
      });
      renderer.dispose();
      canvas.remove();
      container.classList.remove('is-ready');
    }

    applyMotionPreference();
    onResize();
    if (io) io.observe(container);
    if (ro) ro.observe(canvas);
    else window.addEventListener('resize', onResize);
    hero.addEventListener('pointermove', onPointerMove, { passive: true });
    hero.addEventListener('pointerleave', resetParallax, { passive: true });
    document.addEventListener('visibilitychange', sync);
    reducedMotion.addEventListener('change', onMotionChange);
    // No pagehide teardown: the page may come back from the back/forward cache.
    canvas.addEventListener('webglcontextlost', destroy);
    sync();
  }

  function load() {
    const threeUrl = new URL('../vendor/three.globe.min.js?v=1', GLOBE_SCRIPT_URL).href;
    const landUrl = new URL('globe-land.js?v=1', GLOBE_SCRIPT_URL).href;
    Promise.all([import(threeUrl), import(landUrl)])
      .then(([THREE, land]) => mount(THREE, land))
      .catch(() => {
        // Decorative only: without the globe the hero keeps working as before.
        const canvas = container.querySelector('canvas');
        if (canvas) canvas.remove();
        container.classList.remove('is-ready');
      });
  }

  // Never download Three.js while the hero is a single column (<=1024px).
  const desktop = window.matchMedia('(min-width: 1025px)');
  if (desktop.matches) {
    load();
    return;
  }
  const onDesktopChange = () => {
    if (!desktop.matches) return;
    desktop.removeEventListener('change', onDesktopChange);
    load();
  };
  desktop.addEventListener('change', onDesktopChange);
}
