import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import './Projects.css';

const projectsList = [
  {
    id: 1,
    title: 'Qiana Mineral Water',
    category: 'Social Media Strategy',
    year: '2024',
    img: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 2,
    title: 'Dunia Games',
    category: 'Creative Production',
    year: '2024',
    img: 'https://images.unsplash.com/photo-1558655146-d09347e92766?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 3,
    title: 'Nunothemes',
    category: 'UI/UX Design & Dev',
    year: '2023',
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 4,
    title: 'Yellow Truck Coffee',
    category: 'Brand Photoshoot',
    year: '2023',
    img: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 5,
    title: 'Aether Studio',
    category: 'Immersive Web',
    year: '2024',
    img: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 6,
    title: 'Vortex Dynamics',
    category: '3D Art & Motion',
    year: '2024',
    img: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
  },
];

const Projects = ({ setCursorVariant }) => {
  const [viewMode, setViewMode] = useState('spiral'); // 'spiral' or 'list'
  const [activeProject, setActiveProject] = useState(projectsList[0]);
  const [hoveredProject, setHoveredProject] = useState(null);

  const containerRef = useRef(null);
  const mountRef = useRef(null);
  const targetScrollRef = useRef(0);

  // Scroll tracking across sticky section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => {
      targetScrollRef.current = v;
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // THREE.JS 3D SPIRAL SCENE SETUP
  useEffect(() => {
    if (viewMode !== 'spiral' || !mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x181717, 0.035);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 10.5);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    // Clear previous canvas
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.2);
    dirLight1.position.set(6, 12, 8);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xfa2a0e, 1.8); // Red brand glow light
    dirLight2.position.set(-6, -6, -6);
    scene.add(dirLight2);

    // 4. Spiral Group Setup
    const spiralGroup = new THREE.Group();
    scene.add(spiralGroup);

    // Create 3D Ambient Dust Particles (Active Theory sci-fi vibe)
    const particleCount = 500;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 22;
      particlePos[i + 1] = (Math.random() - 0.5) * 25;
      particlePos[i + 2] = (Math.random() - 0.5) * 22;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.055,
      color: 0xaaaaaa,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // HELIX GEOMETRY MATH CONSTANTS
    const radius = 3.9;
    const heightStep = 1.35; // Compact spacing so cards always fill the view
    const thetaStep = Math.PI * 0.42; // Spiral angle per card
    const totalCards = projectsList.length;
    const centerIndex = (totalCards - 1) / 2; // 2.5 for 6 cards (centered at y=0)

    // Create Spiral Backbone Wireframe Tube (Extended so it reaches top and bottom infinitely)
    const curvePoints = [];
    const extraNodes = 12; // Extend 12 items above and below
    
    for (let i = -extraNodes; i <= totalCards + extraNodes; i++) {
      const theta = i * thetaStep;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      const y = (i - centerIndex) * heightStep;
      curvePoints.push(new THREE.Vector3(x, y, z));

      // Draw glowing nodes for positions outside the active cards to fill empty space
      if (i < 0 || i >= totalCards) {
        const nodeGeo = new THREE.SphereGeometry(0.12, 16, 16);
        const nodeMat = new THREE.MeshBasicMaterial({ color: 0xfa2a0e, transparent: true, opacity: 0.5 });
        const node = new THREE.Mesh(nodeGeo, nodeMat);
        node.position.set(x, y, z);
        spiralGroup.add(node);
      }
    }
    const catmullCurve = new THREE.CatmullRomCurve3(curvePoints);
    const tubeGeo = new THREE.TubeGeometry(catmullCurve, 600, 0.018, 8, false);
    const tubeMat = new THREE.MeshBasicMaterial({ color: 0xfa2a0e, transparent: true, opacity: 0.4, wireframe: true });
    const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
    spiralGroup.add(tubeMesh);

    // 5. Load Project Textures & Create 3D Cards
    const textureLoader = new THREE.TextureLoader();
    const cardMeshes = [];
    const cardGeometry = new THREE.PlaneGeometry(3.3, 2.1, 32, 32);

    projectsList.forEach((project, idx) => {
      const texture = textureLoader.load(project.img);
      texture.colorSpace = THREE.SRGBColorSpace;

      const material = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        roughness: 0.25,
        metalness: 0.15,
      });

      const cardMesh = new THREE.Mesh(cardGeometry, material);

      // Spiral Helix Position: centered vertically around y=0
      const theta = idx * thetaStep;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      const y = (idx - centerIndex) * heightStep;

      cardMesh.position.set(x, y, z);
      // Make card face outward from spiral center
      cardMesh.rotation.y = -theta + Math.PI / 2;
      cardMesh.rotation.x = 0.04;

      cardMesh.userData = {
        project,
        index: idx,
        basePos: new THREE.Vector3(x, y, z),
        baseRotY: -theta + Math.PI / 2,
        theta,
      };

      spiralGroup.add(cardMesh);
      cardMeshes.push(cardMesh);
    });

    // 6. Raycasting for Mouse Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);
    let hoveredMesh = null;

    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    window.addEventListener('pointermove', onPointerMove);

    // 7. Responsive Resize
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // 8. Animation Loop
    let animationFrameId;
    let currentScroll = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth scroll lerp
      currentScroll += (targetScrollRef.current - currentScroll) * 0.08;

      // Calculate progress index (0 to 5)
      const maxScrollIndex = totalCards - 1;
      const activeProgressIndex = currentScroll * maxScrollIndex;

      // Perfectly offset Y and Rotation so active card is centered at y=0 (eye level)
      // At scroll 0 -> Card 0 (y = -2.5*heightStep) is brought to y = 0
      // At scroll 1 -> Card 5 (y = +2.5*heightStep) is brought to y = 0
      // Cards always fill both top and bottom halves of viewport — NO EMPTY SPACE EVER!
      spiralGroup.rotation.y = -activeProgressIndex * thetaStep;
      spiralGroup.position.y = -(activeProgressIndex - centerIndex) * heightStep;

      // Mouse Parallax for Scene
      currentMouseX += (mouse.x - currentMouseX) * 0.05;
      currentMouseY += (mouse.y - currentMouseY) * 0.05;
      camera.position.x = currentMouseX * 0.7;
      camera.position.y = currentMouseY * 0.4;
      camera.lookAt(0, 0, 0);

      // Rotate Particles slowly
      particleSystem.rotation.y = elapsedTime * 0.025;

      // Raycasting check for hovered card
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(cardMeshes);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (hoveredMesh !== hit) {
          hoveredMesh = hit;
          setHoveredProject(hit.userData.project);
          if (setCursorVariant) setCursorVariant('hover');
        }
      } else {
        if (hoveredMesh !== null) {
          hoveredMesh = null;
          setHoveredProject(null);
          if (setCursorVariant) setCursorVariant('default');
        }
      }

      // Determine Front-most card relative to camera
      let closestDist = Infinity;
      let frontProject = projectsList[0];

      cardMeshes.forEach((mesh) => {
        const worldPos = new THREE.Vector3();
        mesh.getWorldPosition(worldPos);

        const distToCam = worldPos.distanceTo(camera.position);

        // Scale lerp on hover
        const isHovered = mesh === hoveredMesh;
        const targetScale = isHovered ? 1.15 : 1;
        mesh.scale.setScalar(THREE.MathUtils.lerp(mesh.scale.x, targetScale, 0.1));

        if (distToCam < closestDist) {
          closestDist = distToCam;
          frontProject = mesh.userData.project;
        }
      });

      if (!hoveredMesh) {
        setActiveProject(frontProject);
      } else {
        setActiveProject(hoveredMesh.userData.project);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      cardGeometry.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      tubeGeo.dispose();
      tubeMat.dispose();
    };
  }, [viewMode, setCursorVariant]);

  // Classic List Preview Mouse Motion
  const listMouseX = useRef(0);
  const listMouseY = useRef(0);
  const [listHovered, setListHovered] = useState(null);

  return (
    <section className="projects-container dark-section" id="projects">
      {viewMode === 'spiral' ? (
        /* ═══ THREE.JS WEBGL 3D SPIRAL HELIX VIEW ═══ */
        <div className="projects-scroll-track" ref={containerRef}>
          <div className="projects-sticky-wrapper">

            {/* UI Overlay */}
            <div className="projects-interface-overlay">
              <div className="projects-section-header">
                <div className="header-meta">
                  <span className="meta-eyebrow">PORTFOLIO</span>
                  <h2 className="projects-title-main">Karya <em>Terpilih</em></h2>
                </div>
                <div className="view-toggle-container">
                  <button
                    className={`toggle-btn ${viewMode === 'spiral' ? 'active' : ''}`}
                    onClick={() => setViewMode('spiral')}
                  >
                    3D SPIRAL
                  </button>
                  <button
                    className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    CLASSIC LIST
                  </button>
                  <div className={`toggle-indicator ${viewMode}`} />
                </div>
              </div>

              {/* Active Project Title Overlay at Bottom Center */}
              <div className="spiral-title-overlay">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeProject ? activeProject.id : 'default'}
                    className="spiral-overlay-content"
                    initial={{ opacity: 0, y: 30, rotateX: 10 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    exit={{ opacity: 0, y: -30, rotateX: -10 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span className="overlay-category">
                      → {activeProject ? activeProject.category : ''} · {activeProject ? activeProject.year : ''}
                    </span>
                    <h2 className="overlay-title">{activeProject ? activeProject.title : ''}</h2>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Three.js Canvas Container */}
            <div className="three-spiral-mount" ref={mountRef} />

            {/* Scroll Indicator */}
            <div className="spiral-scroll-hint">
              <span>SCROLL TO ROTATE 3D SPIRAL</span>
              <div className="scroll-line" />
            </div>

          </div>
        </div>
      ) : (
        /* ═══ CLASSIC LIST VIEW ═══ */
        <div className="projects-list-wrapper">
          <div className="projects-section-header no-sticky">
            <div className="header-meta">
              <span className="meta-eyebrow">PORTFOLIO</span>
              <h2 className="projects-title-main">Karya <em>Terpilih</em></h2>
            </div>
            <div className="view-toggle-container">
              <button
                className={`toggle-btn ${viewMode === 'spiral' ? 'active' : ''}`}
                onClick={() => setViewMode('spiral')}
              >
                3D SPIRAL
              </button>
              <button
                className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                CLASSIC LIST
              </button>
              <div className={`toggle-indicator ${viewMode}`} />
            </div>
          </div>

          <div className="classic-list-content">
            {projectsList.map((project, index) => (
              <div
                key={project.id}
                className="list-row"
                onMouseEnter={() => {
                  setListHovered(project);
                  if (setCursorVariant) setCursorVariant('project');
                }}
                onMouseLeave={() => {
                  setListHovered(null);
                  if (setCursorVariant) setCursorVariant('default');
                }}
              >
                <div className="list-row-index">0{index + 1}</div>
                <div className="list-row-details">
                  <h2 className="list-row-title">{project.title}</h2>
                  <span className="list-row-category">{project.category}</span>
                </div>
                <div className="list-row-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          <AnimatePresence>
            {listHovered && (
              <motion.div
                className="list-hover-preview"
                initial={{ scale: 0.6, opacity: 0, rotate: -4 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.6, opacity: 0, rotate: 4 }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                style={{
                  position: 'fixed',
                  left: listMouseX.current,
                  top: listMouseY.current,
                  x: '-50%',
                  y: '-50%',
                  pointerEvents: 'none',
                  zIndex: 999,
                }}
              >
                <div className="preview-image-container">
                  <img src={listHovered.img} alt={listHovered.title} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
};

export default Projects;
