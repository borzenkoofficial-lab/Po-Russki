import React from "react";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const clamp01 = (value) => Math.min(1, Math.max(0, value));
const lerp = (from, to, amount) => from + (to - from) * amount;

export default function Scene3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer;
    let failed = false;

    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.setSize(mount.clientWidth, mount.clientHeight, false);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setClearColor(0x000000, 0);
    } catch (error) {
      mount.dataset.webglFailed = "true";
      return undefined;
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x191918, 0.045);

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(5.8, 4.2, 8.6);

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

    const wallLeft = new THREE.Mesh(new THREE.BoxGeometry(1.35, 3.45, 0.48), concrete);
    wallLeft.position.set(-1.36, 0.45, -0.92);
    group.add(wallLeft);

    const wallRight = new THREE.Mesh(new THREE.BoxGeometry(1.35, 3.45, 0.48), concrete);
    wallRight.position.set(1.36, 0.45, -0.92);
    group.add(wallRight);

    const lintel = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.62, 0.48), concrete);
    lintel.position.set(0, 1.86, -0.92);
    group.add(lintel);

    const side = new THREE.Mesh(new THREE.BoxGeometry(0.62, 2.75, 2.85), darkConcrete);
    side.position.set(1.74, 0.08, 0.25);
    side.rotation.z = -0.035;
    group.add(side);

    const column = new THREE.Mesh(new THREE.BoxGeometry(0.42, 2.85, 0.54), darkConcrete);
    column.position.set(-1.75, 0.05, -0.48);
    group.add(column);

    const slab = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.28, 2.1), darkConcrete);
    slab.position.set(-1.0, 1.8, 0.15);
    slab.rotation.z = -0.08;
    slab.rotation.x = -0.05;
    group.add(slab);

    const ceiling = new THREE.Mesh(new THREE.BoxGeometry(4.25, 0.18, 2.7), darkConcrete);
    ceiling.position.set(0, 2.0, 0.35);
    ceiling.rotation.z = -0.035;
    group.add(ceiling);

    const edge = new THREE.Mesh(new THREE.BoxGeometry(1.95, 0.035, 0.035), accent);
    edge.position.set(-0.98, 1.95, 1.0);
    edge.rotation.z = -0.08;
    group.add(edge);

    const doorFrameMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b8981,
      roughness: 0.82,
      metalness: 0.12,
    });

    const doorFrameLeft = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.72, 0.08), doorFrameMaterial);
    doorFrameLeft.position.set(-0.72, 0.18, -0.63);
    group.add(doorFrameLeft);

    const doorFrameRight = doorFrameLeft.clone();
    doorFrameRight.position.x = 0.72;
    group.add(doorFrameRight);

    const doorHeader = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.08, 0.08), doorFrameMaterial);
    doorHeader.position.set(0, 1.0, -0.63);
    group.add(doorHeader);

    const pipeMaterial = new THREE.MeshStandardMaterial({
      color: 0x444440,
      roughness: 0.68,
      metalness: 0.28,
    });

    const pipeGeometry = new THREE.CylinderGeometry(0.035, 0.035, 2.5, 12);
    for (let i = 0; i < 3; i += 1) {
      const pipe = new THREE.Mesh(pipeGeometry, pipeMaterial);
      pipe.rotation.z = Math.PI * 0.5;
      pipe.position.set(-0.8 + i * 0.42, 1.16 + i * 0.1, 0.62);
      group.add(pipe);
    }

    const fragmentGeometry = new THREE.BoxGeometry(0.18, 0.18, 0.18);
    const fragments = [];
    for (let i = 0; i < 28; i += 1) {
      const angle = (i / 28) * Math.PI * 2;
      const radius = 2.0 + (i % 4) * 0.16;
      const baseY = -0.92 + (i % 6) * 0.08;
      const shard = new THREE.Mesh(fragmentGeometry, i % 5 === 0 ? accent : concrete);

      shard.position.set(
        Math.cos(angle) * radius,
        baseY,
        Math.sin(angle) * radius * 0.55
      );

      shard.rotation.set(i * 0.4, i * 0.23, i * 0.31);
      shard.userData = {
        angle,
        radius,
        baseY,
        offset: i * 0.37,
        index: i,
      };

      group.add(shard);
      fragments.push(shard);
    }

    const grid = new THREE.GridHelper(14, 28, 0x4a4a46, 0x343431);
    grid.position.y = -1.55;
    group.add(grid);

    const ringMaterial = new THREE.LineBasicMaterial({
      color: 0xd8ff32,
      transparent: true,
      opacity: 0.33,
    });

    const ring = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(
        Array.from({ length: 96 }, (_, i) => {
          const a = (i / 96) * Math.PI * 2;
          return new THREE.Vector3(
            Math.cos(a) * 3.0,
            0.25 + Math.sin(a * 3) * 0.04,
            Math.sin(a) * 1.35
          );
        })
      ),
      ringMaterial
    );
    ring.rotation.x = Math.PI * 0.42;
    group.add(ring);

    const targetRotation = new THREE.Vector2();
    const currentRotation = new THREE.Vector2();
    const targetScroll = { value: 0 };
    const currentScroll = { value: 0 };
    const hero = mount.closest(".hero");

    const onPointerMove = (event) => {
      const rect = mount.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotation.set(y * 0.16, x * 0.2);
    };

    const onPointerLeave = () => {
      targetRotation.set(0, 0);
    };

    mount.addEventListener("pointermove", onPointerMove);
    mount.addEventListener("pointerleave", onPointerLeave);

    const media = typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : { matches: false };
    let frame = 0;
    let last = performance.now();

    const animate = (now) => {
      if (failed) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (!media.matches) {
        if (hero) {
          const rect = hero.getBoundingClientRect();
          targetScroll.value = clamp01(-rect.top / Math.max(rect.height * 0.92, 1));
        }

        currentScroll.value += (targetScroll.value - currentScroll.value) * 0.045;
        currentRotation.lerp(targetRotation, 0.055);

        const scroll = currentScroll.value;
        const floatY = Math.sin(now * 0.0011) * 0.065;
        group.rotation.x += (-0.1 + currentRotation.x + scroll * 0.17 - group.rotation.x) * 0.025;
        group.rotation.y += (-0.38 + currentRotation.y - scroll * 0.42 - group.rotation.y) * 0.025;
        group.rotation.z += (0.03 + scroll * 0.08 - group.rotation.z) * 0.02;
        group.position.y += (floatY + scroll * 0.28 - group.position.y) * 0.035;
        group.position.x += (scroll * 0.52 - group.position.x) * 0.025;
        group.scale.lerp(
          new THREE.Vector3(lerp(1, 0.92, scroll), lerp(1, 0.92, scroll), lerp(1, 0.92, scroll)),
          0.035
        );

        camera.position.z += (lerp(8.6, 10.0, scroll) - camera.position.z) * 0.025;
        camera.position.y += (lerp(4.2, 4.7, scroll) - camera.position.y) * 0.025;

        wall.position.x = lerp(0, -2.55, scroll);
        wall.position.y = lerp(0.45, 0.74, scroll);
        side.position.x = lerp(1.74, 3.1, scroll);
        side.position.y = lerp(0.08, 0.55, scroll);
        cutout.position.x = lerp(-0.22, -1.22, scroll);
        slab.position.x = lerp(-1.0, -2.65, scroll);
        slab.position.y = lerp(1.8, 2.55, scroll);
        edge.position.x = lerp(-0.98, -2.62, scroll);
        edge.position.y = lerp(1.95, 2.74, scroll);

        fragments.forEach((shard, index) => {
          const { angle, radius, baseY, offset } = shard.userData;
          const spread = 1 + scroll * 0.85;
          shard.position.x = Math.cos(angle + scroll * 0.3) * radius * spread;
          shard.position.y = baseY + Math.sin(now * 0.0014 + offset) * 0.075 + scroll * (index % 3) * 0.11;
          shard.position.z = Math.sin(angle + scroll * 0.3) * radius * 0.55 * spread;
          shard.rotation.x += dt * (0.05 + (index % 3) * 0.018);
          shard.rotation.z += dt * 0.035;
        });

        ring.rotation.z += dt * (0.28 + scroll * 0.6);
        ring.scale.setScalar(1 + scroll * 0.28);
        ringMaterial.opacity = 0.33 - scroll * 0.12;
      }

      camera.lookAt(0, 0.35 + currentScroll.value * 0.35, 0);
      try {
        renderer.render(scene, camera);
      } catch (error) {
        failed = true;
        mount.dataset.webglFailed = "true";
        renderer?.dispose();
        renderer?.domElement.remove();
        return;
      }
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
      mount.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", resize);

      renderer?.dispose();
      renderer?.domElement.remove();

      base.geometry.dispose();
      wallLeft.geometry.dispose();
      wallRight.geometry.dispose();
      lintel.geometry.dispose();
      side.geometry.dispose();
      column.geometry.dispose();
      cutout.geometry.dispose();
      slab.geometry.dispose();
      ceiling.geometry.dispose();
      edge.geometry.dispose();
      doorFrameLeft.geometry.dispose();
      doorFrameRight.geometry.dispose();
      doorHeader.geometry.dispose();
      pipeGeometry.dispose();
      doorFrameMaterial.dispose();
      pipeMaterial.dispose();
      fragmentGeometry.dispose();
      grid.geometry.dispose();
      ring.geometry.dispose();

      concrete.dispose();
      darkConcrete.dispose();
      accent.dispose();
      ringMaterial.dispose();
    };
  }, []);

  return (
    <div className="scene3d" ref={mountRef} aria-hidden="true">
      <div className="scene3d-fallback">
        <div className="fallback-plane" />
        <div className="fallback-wall" />
        <div className="fallback-cut" />
      </div>
    </div>
  );
}
