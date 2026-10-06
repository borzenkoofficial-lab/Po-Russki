import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Scene3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return undefined;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(mount.clientWidth, mount.clientHeight, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x191918, 0.045);

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(5.8, 4.2, 8.6);
    camera.lookAt(0, 0.35, 0);

    const group = new THREE.Group();
    group.rotation.set(-0.1, -0.38, 0.03);
    scene.add(group);

    const hemi = new THREE.HemisphereLight(0xd8ff32, 0x151514, 1.2);
    scene.add(hemi);

    const key = new THREE.DirectionalLight(0xffffff, 2.8);
    key.position.set(4, 7, 6);
    scene.add(key);

    const rim = new THREE.DirectionalLight(0xd8ff32, 1.8);
    rim.position.set(-5, 2, -3);
    scene.add(rim);

    const concrete = new THREE.MeshStandardMaterial({
      color: 0x686660,
      roughness: 0.91,
      metalness: 0.02,
    });
    const darkConcrete = new THREE.MeshStandardMaterial({
      color: 0x262624,
      roughness: 0.95,
      metalness: 0.02,
    });
    const accent = new THREE.MeshBasicMaterial({ color: 0xd8ff32 });

    const base = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.55, 3.1), concrete);
    base.position.set(0, -1.25, 0);
    group.add(base);

    const wall = new THREE.Mesh(new THREE.BoxGeometry(4.1, 3.45, 0.48), concrete);
    wall.position.set(0, 0.45, -0.92);
    group.add(wall);

    const side = new THREE.Mesh(new THREE.BoxGeometry(0.62, 2.75, 2.85), darkConcrete);
    side.position.set(1.74, 0.08, 0.25);
    side.rotation.z = -0.035;
    group.add(side);

    const cutout = new THREE.Mesh(new THREE.BoxGeometry(1.65, 1.55, 0.7), darkConcrete);
    cutout.position.set(-0.22, 0.05, -0.65);
    group.add(cutout);

    const slab = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.28, 2.1), darkConcrete);
    slab.position.set(-1.0, 1.8, 0.15);
    slab.rotation.z = -0.08;
    slab.rotation.x = -0.05;
    group.add(slab);

    const edge = new THREE.Mesh(new THREE.BoxGeometry(1.95, 0.035, 0.035), accent);
    edge.position.set(-0.98, 1.95, 1.0);
    edge.rotation.z = -0.08;
    group.add(edge);

    const fragments = [];
    const fragmentGeometry = new THREE.BoxGeometry(0.18, 0.18, 0.18);
    for (let i = 0; i < 28; i += 1) {
      const shard = new THREE.Mesh(fragmentGeometry, i % 5 === 0 ? accent : concrete);
      const angle = (i / 28) * Math.PI * 2;
      const radius = 2.0 + (i % 4) * 0.16;
      shard.position.set(
        Math.cos(angle) * radius,
        -0.92 + (i % 6) * 0.08,
        Math.sin(angle) * radius * 0.55
      );
      shard.rotation.set(i * 0.4, i * 0.23, i * 0.31);
      shard.userData.offset = i * 0.37;
      group.add(shard);
      fragments.push(shard);
    }

    const grid = new THREE.GridHelper(14, 28, 0x4a4a46, 0x343431);
    grid.position.y = -1.55;
    grid.rotation.x = 0;
    group.add(grid);

    const ringMaterial = new THREE.LineBasicMaterial({ color: 0xd8ff32, transparent: true, opacity: 0.33 });
    const ring = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(
      Array.from({ length: 96 }, (_, i) => {
        const a = (i / 96) * Math.PI * 2;
        return new THREE.Vector3(Math.cos(a) * 3.0, 0.25 + Math.sin(a * 3) * 0.04, Math.sin(a) * 1.35);
      })
    ), ringMaterial);
    ring.rotation.x = Math.PI * 0.42;
    group.add(ring);

    const pointer = new THREE.Vector2();
    const targetRotation = new THREE.Vector2();
    const currentRotation = new THREE.Vector2();
    const clock = new THREE.Timer ? null : null;

    const onPointerMove = (event) => {
      const rect = mount.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotation.set(pointer.y * 0.16, pointer.x * 0.2);
    };

    mount.addEventListener("pointermove", onPointerMove);

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let last = performance.now();

    const animate = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (!media.matches) {
        currentRotation.lerp(targetRotation, 0.055);
        group.rotation.x += (-0.1 + currentRotation.x - group.rotation.x) * 0.025;
        group.rotation.y += (-0.38 + currentRotation.y - group.rotation.y) * 0.025;
        group.position.y = Math.sin(now * 0.0011) * 0.065;
        ring.rotation.z += dt * 0.28;
        fragments.forEach((shard, index) => {
          shard.position.y += Math.sin(now * 0.0014 + shard.userData.offset) * 0.00075;
          shard.rotation.x += dt * (0.05 + (index % 3) * 0.018);
          shard.rotation.z += dt * 0.035;
        });
      }

      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", resize);
    resize();
    mount.appendChild(renderer.domElement);
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      mount.removeEventListener("pointermove", onPointerMove);
      renderer?.dispose();
      renderer?.domElement.remove();
      base.geometry.dispose();
      wall.geometry.dispose();
      side.geometry.dispose();
      cutout.geometry.dispose();
      slab.geometry.dispose();
      edge.geometry.dispose();
      fragmentGeometry.dispose();
      grid.geometry.dispose();
      concrete.dispose();
      darkConcrete.dispose();
      accent.dispose();
      ring.geometry.dispose();
      ringMaterial.dispose();
    };
  }, []);

  return <div className="scene3d" ref={mountRef} aria-hidden="true" />;
}
