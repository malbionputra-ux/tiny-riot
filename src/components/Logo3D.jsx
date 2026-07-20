import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import logoImg from '../assets/logo_transparent.png';
import './Logo3D.css';

const Logo3D = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 220;
    const height = container.clientHeight || 220;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 3.2;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xfa2a0e, 6, 10);
    pointLight.position.set(2, 2, 3);
    scene.add(pointLight);

    const backLight = new THREE.PointLight(0xff0055, 3, 10);
    backLight.position.set(-2, -1, -1);
    scene.add(backLight);

    // Load Transparent Logo Texture
    const textureLoader = new THREE.TextureLoader();
    const logoTexture = textureLoader.load(logoImg);
    logoTexture.colorSpace = THREE.SRGBColorSpace;

    // Create a 3D Group for multi-layer depth extrusion
    const logoGroup = new THREE.Group();

    // 1. Front Main Logo Layer
    const geometry = new THREE.PlaneGeometry(1.8, 1.8);
    const mainMaterial = new THREE.MeshStandardMaterial({
      map: logoTexture,
      transparent: true,
      alphaTest: 0.1,
      metalness: 0.5,
      roughness: 0.2,
      emissive: 0xfa2a0e,
      emissiveIntensity: 0.2,
      side: THREE.DoubleSide
    });

    const mainMesh = new THREE.Mesh(geometry, mainMaterial);
    logoGroup.add(mainMesh);

    // 2. Multi-layered 3D Depth Slices (Extrusion illusion in WebGL)
    const depthLayers = 8;
    const maxDepth = 0.12;
    for (let i = 1; i <= depthLayers; i++) {
      const zOffset = -(i / depthLayers) * maxDepth;
      const shadowMaterial = new THREE.MeshStandardMaterial({
        map: logoTexture,
        transparent: true,
        alphaTest: 0.1,
        color: 0x800500, // Darker metallic red for depth sides
        metalness: 0.8,
        roughness: 0.4,
        side: THREE.DoubleSide
      });

      const depthMesh = new THREE.Mesh(geometry, shadowMaterial);
      depthMesh.position.z = zOffset;
      logoGroup.add(depthMesh);
    }

    // 3. Back Glow Aura Mesh
    const auraGeometry = new THREE.PlaneGeometry(2.2, 2.2);
    const auraMaterial = new THREE.MeshBasicMaterial({
      map: logoTexture,
      transparent: true,
      opacity: 0.25,
      color: 0xfa2a0e,
      side: THREE.DoubleSide
    });
    const auraMesh = new THREE.Mesh(auraGeometry, auraMaterial);
    auraMesh.position.z = -0.18;
    logoGroup.add(auraMesh);

    scene.add(logoGroup);

    // Mouse Parallax & Inertia
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (e) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      mouseX = (e.clientX - windowHalfX) / windowHalfX;
      mouseY = (e.clientY - windowHalfY) / windowHalfY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth floating motion (bobbing)
      logoGroup.position.y = Math.sin(elapsedTime * 2) * 0.08;

      // Dynamic rotation lerp based on mouse movement + subtle continuous rotation
      targetRotationY = mouseX * 0.8 + Math.sin(elapsedTime * 0.7) * 0.2;
      targetRotationX = -mouseY * 0.5;

      logoGroup.rotation.y += (targetRotationY - logoGroup.rotation.y) * 0.08;
      logoGroup.rotation.x += (targetRotationX - logoGroup.rotation.x) * 0.08;

      // Pulse light effect
      pointLight.intensity = 4 + Math.sin(elapsedTime * 3) * 1.5;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      if (newWidth && newHeight) {
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      auraGeometry.dispose();
      mainMaterial.dispose();
      auraMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <div className="logo-3d-container" ref={mountRef} />;
};

export default Logo3D;
