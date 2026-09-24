"use client";

// A 3D robot on a turntable, drawn with three.js in a flat, inked "illustrated" style:
// toon shading with a few hard light bands, and a dark outline around every part.

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

const colors = {
  wall: "#e8dcc2",
  floor: "#d3c19f",
  wood: "#b3946a",
  woodEdge: "#8b6b47",
  main: "#7fa3b0",
  dark: "#5d8593",
  panel: "#e6e1d6",
  eye: "#f2c14e",
  red: "#e8806b",
  ink: "#3b2f2a",
};

const outlineWidth = 0.05;

// Three hard light bands instead of smooth shading.
function toonGradient(): THREE.DataTexture {
  const tones = new Uint8Array([90, 170, 255]);
  const texture = new THREE.DataTexture(tones, tones.length, 1, THREE.RedFormat);
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.needsUpdate = true;
  return texture;
}

// Builds robot parts with a toon material and an "inverted hull" outline:
// a slightly larger copy of the shape, drawn inside-out in ink.
function partMaker(gradientMap: THREE.Texture) {
  const outlineMaterial = new THREE.MeshBasicMaterial({ color: colors.ink, side: THREE.BackSide });
  return function part(
    geometry: THREE.BufferGeometry,
    color: string,
    position: [number, number, number],
    options: { rotation?: [number, number, number]; emissive?: string; outline?: boolean } = {},
  ): THREE.Mesh {
    const material = new THREE.MeshToonMaterial({ color, gradientMap });
    if (options.emissive) material.emissive = new THREE.Color(options.emissive);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    if (options.rotation) mesh.rotation.set(...options.rotation);
    if (options.outline !== false) {
      geometry.computeBoundingBox();
      const size = new THREE.Vector3();
      geometry.boundingBox!.getSize(size);
      const hull = new THREE.Mesh(geometry, outlineMaterial);
      hull.scale.set(
        (size.x + 2 * outlineWidth) / size.x,
        (size.y + 2 * outlineWidth) / size.y,
        (size.z + 2 * outlineWidth) / size.z,
      );
      mesh.add(hull);
    }
    return mesh;
  };
}

function buildRobot(part: ReturnType<typeof partMaker>) {
  const robot = new THREE.Group();
  const box = (w: number, h: number, d: number, r = 0.08) => new RoundedBoxGeometry(w, h, d, 3, r);
  const add = (...meshes: THREE.Mesh[]) => meshes.forEach((m) => robot.add(m));
  const flat: [number, number, number] = [Math.PI / 2, 0, 0];
  let chestLight: THREE.Mesh | null = null;

  // Legs and feet (toes point forward, towards +z). Each leg pivots at the hip.
  const legs: THREE.Group[] = [];
  for (const x of [-0.5, 0.5]) {
    const hip = new THREE.Group();
    hip.position.set(x, 0.94, 0);
    hip.add(part(box(0.38, 0.72, 0.38, 0.05), colors.dark, [0, -0.36, 0]));
    hip.add(part(box(0.6, 0.22, 0.82, 0.08), colors.main, [0, -0.83, 0.12]));
    robot.add(hip);
    legs.push(hip);
  }

  // Body, with a chest panel on the front and a battery pack on the back.
  add(part(box(2.2, 1.5, 1.5, 0.14), colors.main, [0, 1.67, 0]));
  add(part(box(1.1, 0.9, 0.06, 0.03), colors.panel, [0, 1.72, 0.77]));
  chestLight = part(new THREE.SphereGeometry(0.15, 24, 16), colors.red, [0, 1.9, 0.8], { emissive: "#000000" });
  add(chestLight);
  for (const x of [-0.25, 0, 0.25]) {
    add(part(new THREE.CylinderGeometry(0.08, 0.08, 0.06, 20), colors.eye, [x, 1.5, 0.81], { rotation: flat }));
  }
  add(part(box(1.2, 0.95, 0.3, 0.06), colors.dark, [0, 1.67, -0.88]));
  for (const x of [-0.3, 0, 0.3]) {
    add(part(new THREE.BoxGeometry(0.05, 0.6, 0.04), colors.ink, [x, 1.67, -1.04], { outline: false }));
  }

  // Arms and hands. Each arm pivots at the shoulder.
  const arms: THREE.Group[] = [];
  for (const x of [-1.32, 1.32]) {
    const shoulder = new THREE.Group();
    shoulder.position.set(x, 2.22, 0);
    shoulder.add(part(new THREE.CapsuleGeometry(0.2, 0.8, 6, 16), colors.dark, [0, -0.5, 0]));
    shoulder.add(part(new THREE.SphereGeometry(0.22, 24, 16), colors.main, [0, -1.17, 0]));
    robot.add(shoulder);
    arms.push(shoulder);
  }

  // Neck and head.
  add(part(new THREE.CylinderGeometry(0.22, 0.22, 0.3, 20), colors.dark, [0, 2.55, 0]));
  add(part(box(1.9, 0.95, 1.4, 0.14), colors.main, [0, 3.13, 0]));

  // Face: eyes with pupils, and a mouth grille.
  for (const x of [-0.42, 0.42]) {
    add(part(new THREE.CylinderGeometry(0.2, 0.2, 0.08, 28), colors.eye, [x, 3.22, 0.72], { rotation: flat, emissive: "#3a2a00" }));
    add(part(new THREE.SphereGeometry(0.07, 16, 12), colors.ink, [x, 3.22, 0.77], { outline: false }));
  }
  add(part(box(0.7, 0.16, 0.05, 0.02), colors.panel, [0, 2.9, 0.71]));
  for (const x of [-0.17, 0, 0.17]) {
    add(part(new THREE.BoxGeometry(0.03, 0.16, 0.03), colors.ink, [x, 2.9, 0.74], { outline: false }));
  }

  // Ear dials on both sides.
  for (const x of [-0.97, 0.97]) {
    add(part(new THREE.CylinderGeometry(0.26, 0.26, 0.1, 28), colors.dark, [x, 3.13, 0], { rotation: [0, 0, Math.PI / 2] }));
  }

  // Vents on the back of the head.
  for (const y of [3.0, 3.13, 3.26]) {
    add(part(new THREE.BoxGeometry(1.0, 0.04, 0.03), colors.ink, [0, y, -0.71], { outline: false }));
  }

  // Antenna.
  add(part(new THREE.CylinderGeometry(0.03, 0.03, 0.4, 10), colors.ink, [0, 3.8, 0], { outline: false }));
  add(part(new THREE.SphereGeometry(0.11, 20, 14), colors.red, [0, 4.02, 0]));

  return { robot, chestLight: chestLight!, arms, legs };
}

function buildTurntable(part: ReturnType<typeof partMaker>) {
  const table = new THREE.Group();
  table.add(part(new THREE.CylinderGeometry(2.1, 2.1, 0.16, 64), colors.wood, [0, -0.08, 0]));
  // A darker ring and marker so you can see the turntable turning.
  table.add(part(new THREE.TorusGeometry(1.7, 0.025, 8, 64), colors.woodEdge, [0, 0.005, 0], { rotation: [Math.PI / 2, 0, 0], outline: false }));
  table.add(part(new THREE.BoxGeometry(0.12, 0.02, 0.3), colors.woodEdge, [0, 0.01, 1.85], { outline: false }));
  return table;
}

interface Props {
  // How many quarter turns the robot has made: +1 per spin right, -1 per spin left.
  quarterTurns: number;
  // How many times the robot has jumped; each increase starts a new jump.
  jumps: number;
  // How many press-ups the robot has done; each increase starts a new one.
  pressUps: number;
  label: string;
}

const jumpSeconds = 0.8;
const jumpHeight = 0.5;
// How far the arms swing up and out, and the legs kick out, at the top of a jump (radians).
const armRaise = 2.5;
const legKick = 0.4;

// Press-up: the robot tips forward from its toes into a plank, lowers, pushes up, then stands.
const pressUpSeconds = 2.6;
// Where the toes are, in front of the robot's centre; the robot tips forward about this point.
const toeZ = 0.53;
const shoulderY = 2.22;
// From the shoulder pivot to the bottom of the hand.
const armReach = 1.39;
// Forward tilt in the "up" and "down" plank positions (radians from upright).
const plankUp = 1.15;
const plankDown = 1.36;
// The robot shuffles back while in the plank, so it stays over the turntable.
const shuffleBack = 1.3;

const smooth = (x: number) => x * x * (3 - 2 * x);

// Forward tilt and how far shuffled back (0 to 1), t going from 0 to 1 over one press-up.
function pressUpPose(t: number): { tilt: number; shuffle: number } {
  if (t < 0.2) {
    const k = smooth(t / 0.2);
    return { tilt: plankUp * k, shuffle: k };
  }
  if (t < 0.5) return { tilt: plankUp + (plankDown - plankUp) * smooth((t - 0.2) / 0.3), shuffle: 1 };
  if (t < 0.8) return { tilt: plankDown + (plankUp - plankDown) * smooth((t - 0.5) / 0.3), shuffle: 1 };
  const k = smooth((t - 0.8) / 0.2);
  return { tilt: plankUp * (1 - k), shuffle: 1 - k };
}

export default function Robot3D({ quarterTurns, jumps, pressUps, label }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef(0);
  const jumpStartRef = useRef<number | null>(null);
  const pressUpStartRef = useRef<number | null>(null);

  // Starting a jump or a press-up cancels the other.
  useEffect(() => {
    if (jumps === 0) return;
    jumpStartRef.current = performance.now();
    pressUpStartRef.current = null;
  }, [jumps]);

  useEffect(() => {
    if (pressUps === 0) return;
    pressUpStartRef.current = performance.now();
    jumpStartRef.current = null;
  }, [pressUps]);

  // Spinning right brings the robot's right side (its -x side) round to face the camera,
  // which is a positive turn about the vertical axis.
  useEffect(() => {
    targetRef.current = (quarterTurns * Math.PI) / 2;
  }, [quarterTurns]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(colors.wall);

    const camera = new THREE.PerspectiveCamera(30, 16 / 9, 0.1, 100);
    camera.position.set(0, 3.3, 11.2);
    camera.lookAt(0, 2.05, 0);

    scene.add(new THREE.HemisphereLight("#fff8ec", "#8a7a60", 1.4));
    const sun = new THREE.DirectionalLight("#ffffff", 2.2);
    sun.position.set(-4, 7, 6);
    scene.add(sun);

    const gradientMap = toonGradient();
    const part = partMaker(gradientMap);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(60, 30),
      new THREE.MeshToonMaterial({ color: colors.floor, gradientMap }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.16;
    scene.add(floor);

    const spinner = new THREE.Group();
    const { robot, chestLight, arms, legs } = buildRobot(part);
    // The robot hangs from a hinge at its toes so it can tip forward for press-ups.
    const hinge = new THREE.Group();
    hinge.position.z = toeZ;
    robot.position.z = -toeZ;
    hinge.add(robot);
    spinner.add(buildTurntable(part), hinge);
    scene.add(spinner);

    const chestMaterial = chestLight.material as THREE.MeshToonMaterial;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();

    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      const target = targetRef.current;
      if (reduceMotion) spinner.rotation.y = target;
      else spinner.rotation.y += (target - spinner.rotation.y) * Math.min(1, dt * 7);
      // Jump: one smooth arc up and down, with arms and legs spreading into a star at the top.
      let lift = 0;
      if (jumpStartRef.current !== null && !reduceMotion) {
        const t = (now - jumpStartRef.current) / 1000 / jumpSeconds;
        if (t >= 1) jumpStartRef.current = null;
        else lift = Math.sin(Math.PI * t);
      }
      robot.position.y = lift * jumpHeight;
      // The robot's left side is +x: its left arm and leg swing towards +x, its right ones towards -x.
      arms[0].rotation.z = -armRaise * lift;
      arms[1].rotation.z = armRaise * lift;
      legs[0].rotation.z = -legKick * lift;
      legs[1].rotation.z = legKick * lift;

      // Press-up: tip forward from the toes, with the arms reaching straight down to the floor.
      let pose = { tilt: 0, shuffle: 0 };
      if (pressUpStartRef.current !== null && !reduceMotion) {
        const t = (now - pressUpStartRef.current) / 1000 / pressUpSeconds;
        if (t >= 1) pressUpStartRef.current = null;
        else pose = pressUpPose(t);
      }
      hinge.rotation.x = pose.tilt;
      hinge.position.z = toeZ - shuffleBack * pose.shuffle;
      // With no elbows, the arms squash shorter as the chest lowers so the hands stay on the floor.
      const shoulderHeight = shoulderY * Math.cos(pose.tilt) + toeZ * Math.sin(pose.tilt);
      for (const arm of arms) {
        arm.rotation.x = -pose.tilt;
        arm.scale.y = Math.min(1, shoulderHeight / armReach);
      }

      // The chest light blinks slowly.
      const on = Math.sin(now / 450) > 0;
      chestMaterial.emissive.set(on ? "#7a2a1a" : "#000000");
      renderer.render(scene, camera);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((m) => m.dispose());
        }
      });
      gradientMap.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={containerRef} className="stage" role="img" aria-label={label} />;
}
