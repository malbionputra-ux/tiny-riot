import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import './Hero.css';

/* ─────────────────────────────────────────────────────────────────
   Premium 3D Spiral Background — Parametric Helix + Chrome Material
───────────────────────────────────────────────────────────────── */
const useHeroBg = (canvasRef) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    /* ── Scene ── */
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.022);

    /* ── Camera ── */
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 200);
    camera.position.set(0, 0, 14);

    /* ── Lights ── */
    // Very dim ambient so metallic shading has contrast
    scene.add(new THREE.AmbientLight(0xffffff, 0.15));

    // Key light — warm white from upper-right
    const keyLight = new THREE.DirectionalLight(0xfff4e0, 2.5);
    keyLight.position.set(6, 10, 8);
    scene.add(keyLight);

    // Fill — cool blue-tinted from left
    const fillLight = new THREE.DirectionalLight(0xd0e8ff, 1.2);
    fillLight.position.set(-8, -4, 6);
    scene.add(fillLight);

    // Accent — red Tiny Riot brand glow below the spiral
    const accentLight = new THREE.PointLight(0xfa2a0e, 6, 25);
    accentLight.position.set(0, -5, 4);
    scene.add(accentLight);

    // Rim — pure white behind
    const rimLight = new THREE.PointLight(0xffffff, 3, 20);
    rimLight.position.set(-5, 8, -3);
    scene.add(rimLight);

    // Moving orb light (will orbit)
    const orbLight = new THREE.PointLight(0xffddcc, 4, 18);
    orbLight.position.set(4, 0, 6);
    scene.add(orbLight);

    /* ── Helper: build a tube along a parametric curve ── */
    const buildSpiral = ({
      turns       = 4,
      radius      = 3,
      height      = 8,
      phaseOffset = 0,
      tubeRadius  = 0.12,
      tubeSeg     = 400,
      radialSeg   = 18,
      color       = 0xcccccc,
      metalness   = 0.95,
      roughness   = 0.08,
      emissive    = 0x000000,
      emissiveInt = 0,
    }) => {
      const points = [];
      const samples = 1000;
      for (let i = 0; i <= samples; i++) {
        const t = (i / samples) * Math.PI * 2 * turns;
        const x = radius * Math.cos(t + phaseOffset);
        const y = (i / samples - 0.5) * height;
        const z = radius * Math.sin(t + phaseOffset);
        points.push(new THREE.Vector3(x, y, z));
      }
      const curve = new THREE.CatmullRomCurve3(points);
      const geo   = new THREE.TubeGeometry(curve, tubeSeg, tubeRadius, radialSeg, false);
      const mat   = new THREE.MeshStandardMaterial({
        color, metalness, roughness, emissive, emissiveIntensity: emissiveInt,
        envMapIntensity: 1.2,
      });
      return new THREE.Mesh(geo, mat);
    };

    /* ── Helper: Lissajous knot tube ── */
    const buildLissajous = ({
      A = 3.5, B = 3.5, C = 2,
      a = 3,   b = 2,   c = 5,
      delta = Math.PI / 4,
      samples = 1200,
      tubeRadius = 0.10,
      radialSeg  = 16,
      color      = 0xd4d4d4,
      metalness  = 0.92,
      roughness  = 0.10,
    }) => {
      const points = [];
      for (let i = 0; i <= samples; i++) {
        const t = (i / samples) * Math.PI * 2;
        points.push(new THREE.Vector3(
          A * Math.sin(a * t + delta),
          B * Math.sin(b * t),
          C * Math.sin(c * t + delta * 0.5),
        ));
      }
      const curve = new THREE.CatmullRomCurve3(points, true);
      const geo   = new THREE.TubeGeometry(curve, 900, tubeRadius, radialSeg, true);
      const mat   = new THREE.MeshStandardMaterial({ color, metalness, roughness });
      return new THREE.Mesh(geo, mat);
    };

    /* ── Helper: Trefoil knot variation ── */
    const buildTrefoil = (scale = 1, tubeR = 0.13, col = 0xb8b8b8) => {
      const points = [];
      for (let i = 0; i <= 1200; i++) {
        const t = (i / 1200) * Math.PI * 2;
        const x = scale * (Math.sin(t) + 2 * Math.sin(2 * t));
        const y = scale * (Math.cos(t) - 2 * Math.cos(2 * t));
        const z = scale * -Math.sin(3 * t);
        points.push(new THREE.Vector3(x, y, z));
      }
      const curve = new THREE.CatmullRomCurve3(points, true);
      const geo   = new THREE.TubeGeometry(curve, 900, tubeR, 20, true);
      const mat   = new THREE.MeshStandardMaterial({ color: col, metalness: 0.95, roughness: 0.06 });
      return new THREE.Mesh(geo, mat);
    };

    /* ══ BUILD THE SCENE ══ */
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // -- 1. Outer double helix (DNA-like) — large, slow, dramatic
    const helix1 = buildSpiral({
      turns: 5, radius: 4.5, height: 12,
      phaseOffset: 0,
      tubeRadius: 0.09, tubeSeg: 500, radialSeg: 14,
      color: 0xe8e8e8, metalness: 0.95, roughness: 0.06,
    });
    masterGroup.add(helix1);

    const helix2 = buildSpiral({
      turns: 5, radius: 4.5, height: 12,
      phaseOffset: Math.PI,
      tubeRadius: 0.09, tubeSeg: 500, radialSeg: 14,
      color: 0xe8e8e8, metalness: 0.95, roughness: 0.06,
    });
    masterGroup.add(helix2);

    // -- 2. Middle helix — medium radius, slightly inward
    const helix3 = buildSpiral({
      turns: 6, radius: 2.8, height: 10,
      phaseOffset: Math.PI / 3,
      tubeRadius: 0.10, tubeSeg: 500, radialSeg: 14,
      color: 0xffffff, metalness: 0.98, roughness: 0.04,
    });
    masterGroup.add(helix3);

    const helix4 = buildSpiral({
      turns: 6, radius: 2.8, height: 10,
      phaseOffset: Math.PI / 3 + Math.PI,
      tubeRadius: 0.10, tubeSeg: 500, radialSeg: 14,
      color: 0xffffff, metalness: 0.98, roughness: 0.04,
    });
    masterGroup.add(helix4);

    // -- 3. Inner tight helix — acts as a central spine
    const helix5 = buildSpiral({
      turns: 8, radius: 1.2, height: 9,
      phaseOffset: Math.PI / 6,
      tubeRadius: 0.07, tubeSeg: 600, radialSeg: 12,
      color: 0xfa2a0e, metalness: 0.9, roughness: 0.15,
      emissive: 0xfa2a0e, emissiveInt: 0.15,
    });
    masterGroup.add(helix5);

    // -- 4. Lissajous knot — complex tangled shape in the center
    const lissajousMesh = buildLissajous({
      A: 2.8, B: 2.8, C: 1.6,
      a: 3, b: 2, c: 5, delta: Math.PI / 4,
      tubeRadius: 0.09, radialSeg: 14,
      color: 0xd8d0c8, metalness: 0.90, roughness: 0.12,
    });
    masterGroup.add(lissajousMesh);

    // -- 5. Trefoil knot as accent element
    const trefoilMesh = buildTrefoil(1.0, 0.11, 0xcccccc);
    trefoilMesh.position.set(0, 0, 0);
    masterGroup.add(trefoilMesh);

    // -- 6. Outer ring halos (simple tori)
    const addHalo = (r, tube, rx, ry, col = 0x999999) => {
      const g = new THREE.TorusGeometry(r, tube, 16, 200);
      const m = new THREE.MeshStandardMaterial({ color: col, metalness: 0.92, roughness: 0.08 });
      const mesh = new THREE.Mesh(g, m);
      mesh.rotation.x = rx;
      mesh.rotation.y = ry;
      masterGroup.add(mesh);
      return mesh;
    };

    const halo1 = addHalo(5.5, 0.05, Math.PI / 5,   0,              0xaaaaaa);
    const halo2 = addHalo(6.0, 0.04, -Math.PI / 4,  Math.PI / 3,    0x888888);
    const halo3 = addHalo(4.8, 0.04,  Math.PI / 2,  Math.PI / 5,    0xbbbbbb);
    const halo4 = addHalo(7.0, 0.03, -Math.PI / 6, -Math.PI / 7,    0x666666);

    /* ── Environment map — neutral grey for metallic reflections ── */
    // Build a minimal 1x1 env map so metallic materials have a base to reflect
    const pmremGen = new THREE.PMREMGenerator(renderer);
    pmremGen.compileEquirectangularShader();
    // Simple neutral equirect: solid mid-grey
    const envData = new Uint8Array(4 * 2 * 1); // 2×1 equirect
    for (let i = 0; i < envData.length; i++) envData[i] = i % 4 === 3 ? 255 : 140;
    const equirect = new THREE.DataTexture(envData, 2, 1, THREE.RGBAFormat);
    equirect.mapping = THREE.EquirectangularReflectionMapping;
    equirect.needsUpdate = true;
    const envTexture = pmremGen.fromEquirectangular(equirect).texture;
    scene.environment = envTexture;
    equirect.dispose();
    pmremGen.dispose();

    /* ── Mouse ── */
    let mx = 0, my = 0;
    const onMouse = (e) => {
      mx = (e.clientX / window.innerWidth  - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouse);

    /* ── Animation — very slow, meditative ── */
    const clock = new THREE.Clock();
    let raf;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // ── Main group: very slow continuous rotation
      masterGroup.rotation.y = t * 0.045;                       // ~2.6°/s
      masterGroup.rotation.x = Math.sin(t * 0.08) * 0.08;       // gentle tilt sway

      // ── Individual element offsets for organic feel
      helix1.rotation.y = t * 0.02;
      helix2.rotation.y = t * 0.02;
      helix3.rotation.y = -t * 0.015;
      helix4.rotation.y = -t * 0.015;
      helix5.rotation.y = t * 0.03;

      lissajousMesh.rotation.x = t * 0.025;
      lissajousMesh.rotation.z = -t * 0.018;

      trefoilMesh.rotation.x = -t * 0.028;
      trefoilMesh.rotation.y =  t * 0.020;
      trefoilMesh.rotation.z =  t * 0.015;

      // ── Halo rings orbit independently, very slow
      halo1.rotation.z += 0.0008;
      halo2.rotation.x -= 0.0006;
      halo3.rotation.y += 0.0005;
      halo4.rotation.z -= 0.0004;
      halo4.rotation.x += 0.0003;

      // ── Orb light orbits around the shape
      orbLight.position.x = 7 * Math.cos(t * 0.15);
      orbLight.position.y = 4 * Math.sin(t * 0.10);
      orbLight.position.z = 5 * Math.sin(t * 0.12);
      orbLight.intensity  = 3.5 + Math.sin(t * 0.8) * 1.2;

      // ── Accent red light breathes
      accentLight.intensity = 5 + Math.sin(t * 1.2) * 2;

      // ── Subtle mouse parallax on camera
      camera.position.x += (mx * 1.5 - camera.position.x) * 0.025;
      camera.position.y += (-my * 1.0 - camera.position.y) * 0.025;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    /* ── Resize ── */
    const onResize = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      envTexture.dispose();
    };
  }, [canvasRef]);
};

/* ═══════════════════════════════
   Hero Component
═══════════════════════════════ */
const Hero = ({ setCursorVariant }) => {
  const canvasRef = useRef(null);
  const [timeStr, setTimeStr] = useState('');

  useHeroBg(canvasRef);

  useEffect(() => {
    const update = () => {
      const opt = { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
      setTimeStr(new Date().toLocaleTimeString('id-ID', opt) + ' GMT+7');
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const textVariants = {
    hidden:  { y: '110%', opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section className="hero dark-section">
      {/* 3D animated canvas — pinned behind everything */}
      <canvas ref={canvasRef} className="hero-canvas" />

      {/* Vignette overlay */}
      <div className="hero-overlay" />

      {/* Text content */}
      <motion.div
        className="hero-content"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.18, delayChildren: 0.5 } } }}
      >
        <div className="line-wrapper">
          <motion.h1 variants={textVariants} className="hero-title"
            onMouseEnter={() => setCursorVariant('hover')}
            onMouseLeave={() => setCursorVariant('default')}
          >
            We design <em>loud</em>
          </motion.h1>
        </div>
        <div className="line-wrapper">
          <motion.h1 variants={textVariants} className="hero-title"
            onMouseEnter={() => setCursorVariant('hover')}
            onMouseLeave={() => setCursorVariant('default')}
          >
            digital <em>experiences.</em>
          </motion.h1>
        </div>
        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.9 }}
          onMouseEnter={() => setCursorVariant('hover')}
          onMouseLeave={() => setCursorVariant('default')}
        >
          Kami membantu brand membangun reputasi digital yang berani dan lantang melalui kreativitas tanpa batas, teknologi mutakhir, serta strategi yang tajam.
        </motion.p>
      </motion.div>

      {/* Meta bar */}
      <div className="hero-metadata">
        <div className="meta-col">
          <span className="meta-label">OUR SERVICES</span>
          <span className="meta-value">CREATIVE / DEVELOPMENT / PRODUCTION</span>
        </div>
        <div className="meta-col">
          <span className="meta-label">HQ LOCAL TIME</span>
          <span className="meta-value">{timeStr || '17:00:00 GMT+7'}</span>
        </div>
        <div className="meta-col">
          <span className="meta-label">HQ LOCATIONS</span>
          <span className="meta-value">JAKARTA &amp; BANDUNG, INDONESIA</span>
        </div>
        <div className="meta-col">
          <span className="meta-label">AGENCY STATUS</span>
          <span className="meta-value highlight-status">OPEN FOR PROJECTS</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
