// BuilderBadge — R3F physics badge, custom spring + TubeGeometry rope
import * as THREE from "three";
import { useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

// ─── DIMENSIONS ──────────────────────────────────────────────────────────────
const CW = 3.2;
const CH = 2.0;
const CD = 0.09;

// ─── SPRING ───────────────────────────────────────────────────────────────────
class Spring {
  constructor(stiffness = 0.06, damping = 0.75) {
    this.value = 0; this.velocity = 0; this.target = 0;
    this.k = stiffness; this.d = damping;
  }
  tick() {
    this.velocity = (this.velocity + (this.target - this.value) * this.k) * this.d;
    this.value += this.velocity;
    return this.value;
  }
  set(v) { this.value = v; this.velocity = 0; this.target = v; }
}

// ─── CANVAS TEXTURE ──────────────────────────────────────────────────────────
function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function makeFront() {
  const cw = Math.round(1638), ch = 1024;
  const cv = document.createElement("canvas");
  cv.width = cw; cv.height = ch;
  const c = cv.getContext("2d");

  c.fillStyle = "#0B1018";
  rr(c, 0, 0, cw, ch, 40); c.fill();

  // Blue glow
  const g1 = c.createRadialGradient(200, 80, 0, 200, 80, 800);
  g1.addColorStop(0, "rgba(59,130,246,0.10)"); g1.addColorStop(1, "rgba(0,0,0,0)");
  c.fillStyle = g1; rr(c, 0, 0, cw, ch, 40); c.fill();

  // Sheen
  const g2 = c.createLinearGradient(0, 0, 0, ch * 0.45);
  g2.addColorStop(0, "rgba(255,255,255,0.04)"); g2.addColorStop(1, "rgba(0,0,0,0)");
  c.fillStyle = g2; rr(c, 0, 0, cw, ch, 40); c.fill();

  // Top gloss line
  const ge = c.createLinearGradient(cw * 0.05, 0, cw * 0.95, 0);
  ge.addColorStop(0, "rgba(255,255,255,0)");
  ge.addColorStop(0.35, "rgba(255,255,255,0.28)");
  ge.addColorStop(0.5,  "rgba(255,255,255,0.38)");
  ge.addColorStop(0.65, "rgba(255,255,255,0.28)");
  ge.addColorStop(1, "rgba(255,255,255,0)");
  c.fillStyle = ge; c.fillRect(cw * 0.04, 0, cw * 0.92, 3);

  // Lanyard hole
  c.save(); c.globalCompositeOperation = "destination-out";
  c.beginPath(); c.arc(cw / 2, 34, 24, 0, Math.PI * 2); c.fill();
  c.restore();
  c.strokeStyle = "rgba(255,255,255,0.25)"; c.lineWidth = 2;
  c.beginPath(); c.arc(cw / 2, 34, 25, 0, Math.PI * 2); c.stroke();

  // OVRAIK
  c.font = "600 80px 'DM Mono', monospace";
  c.fillStyle = "#E2E5EC"; c.letterSpacing = "10px";
  c.fillText("OVRAIK", 80, 200);

  c.font = "400 28px 'DM Mono', monospace";
  c.fillStyle = "rgba(78,86,102,0.9)"; c.letterSpacing = "7px";
  c.fillText("BUILDER PASS", 82, 248);

  // Divider
  c.strokeStyle = "rgba(255,255,255,0.06)"; c.lineWidth = 1;
  c.beginPath(); c.moveTo(80, 290); c.lineTo(cw - 80, 290); c.stroke();

  // Avatar
  const ax = 120, ay = 416, ar = 58;
  const ag = c.createRadialGradient(ax, ay, 0, ax, ay, ar);
  ag.addColorStop(0, "rgba(59,130,246,0.22)"); ag.addColorStop(1, "rgba(80,40,200,0.08)");
  c.fillStyle = ag; c.beginPath(); c.arc(ax, ay, ar, 0, Math.PI * 2); c.fill();
  c.strokeStyle = "rgba(255,255,255,0.1)"; c.lineWidth = 1.5;
  c.beginPath(); c.arc(ax, ay, ar, 0, Math.PI * 2); c.stroke();
  c.font = "500 34px 'DM Mono', monospace"; c.fillStyle = "rgba(124,133,146,0.9)";
  c.textAlign = "center"; c.letterSpacing = "2px";
  c.fillText("AR", ax, ay + 12); c.textAlign = "left";

  // Name + role
  c.font = "700 60px 'Bricolage Grotesque', sans-serif";
  c.fillStyle = "#E2E5EC"; c.letterSpacing = "-1px";
  c.fillText("Alexey Raikov", 204, 402);
  c.font = "400 32px 'DM Sans', sans-serif";
  c.fillStyle = "rgba(124,133,146,0.85)"; c.letterSpacing = "0px";
  c.fillText("Builder", 206, 444);
  c.font = "400 24px 'DM Mono', monospace";
  c.fillStyle = "rgba(78,86,102,0.7)"; c.letterSpacing = "0.5px";
  c.fillText("Belarus · Remote", 206, 484);

  // Tags
  c.font = "400 22px 'DM Mono', monospace";
  c.letterSpacing = "0.5px";
  const tags = ["Product Systems", "Automation", "Operations"];
  let tx = 80;
  tags.forEach(tag => {
    const tw = c.measureText(tag).width + 30;
    c.strokeStyle = "rgba(255,255,255,0.07)"; c.lineWidth = 1;
    rr(c, tx, 562, tw, 38, 7); c.stroke();
    c.fillStyle = "rgba(78,86,102,0.8)";
    c.fillText(tag, tx + 15, 586);
    tx += tw + 12;
  });

  // Status
  c.beginPath(); c.arc(cw - 114, ch - 56, 5, 0, Math.PI * 2);
  c.fillStyle = "#22c55e"; c.fill();
  c.font = "400 20px 'DM Mono', monospace"; c.letterSpacing = "2px";
  c.fillStyle = "rgba(78,86,102,0.75)";
  c.fillText("ACTIVE", cw - 104, ch - 51);

  c.font = "400 20px 'DM Mono', monospace"; c.letterSpacing = "0.5px";
  c.fillStyle = "rgba(78,86,102,0.4)";
  c.fillText("ovraik.com", 80, ch - 51);

  return new THREE.CanvasTexture(cv);
}

function makeBack() {
  const cw = Math.round(1638), ch = 1024;
  const cv = document.createElement("canvas");
  cv.width = cw; cv.height = ch;
  const c = cv.getContext("2d");

  c.fillStyle = "#080C14";
  rr(c, 0, 0, cw, ch, 40); c.fill();

  // Dot grid
  c.fillStyle = "rgba(255,255,255,0.03)";
  for (let x = 56; x < cw; x += 64)
    for (let y = 56; y < ch; y += 64) {
      c.beginPath(); c.arc(x, y, 1.5, 0, Math.PI * 2); c.fill();
    }

  // Top gloss
  const ge = c.createLinearGradient(cw * 0.05, 0, cw * 0.95, 0);
  ge.addColorStop(0, "rgba(255,255,255,0)");
  ge.addColorStop(0.5, "rgba(255,255,255,0.22)");
  ge.addColorStop(1, "rgba(255,255,255,0)");
  c.fillStyle = ge; c.fillRect(cw * 0.04, 0, cw * 0.92, 3);

  c.font = "500 22px 'DM Mono', monospace"; c.letterSpacing = "4px";
  c.fillStyle = "rgba(59,130,246,0.7)";
  c.fillText("CURRENTLY BUILDING", 80, 124);

  ["Fishka", "Content Distribution Systems", "AI Workflow Experiments"].forEach((item, i) => {
    c.beginPath(); c.arc(88, 186 + i * 70, 4, 0, Math.PI * 2);
    c.fillStyle = "#22c55e"; c.fill();
    c.font = "400 32px 'DM Sans', sans-serif"; c.letterSpacing = "0px";
    c.fillStyle = "rgba(124,133,146,0.85)";
    c.fillText(item, 110, 196 + i * 70);
  });

  c.strokeStyle = "rgba(255,255,255,0.05)"; c.lineWidth = 1;
  c.beginPath(); c.moveTo(80, 418); c.lineTo(cw - 80, 418); c.stroke();

  c.font = "500 22px 'DM Mono', monospace"; c.letterSpacing = "4px";
  c.fillStyle = "rgba(78,86,102,0.65)";
  c.fillText("INTERESTS", 80, 474);

  c.font = "400 22px 'DM Mono', monospace"; c.letterSpacing = "0px";
  const ints = ["Business Operations", "Product Dev", "Automation", "Analytics"];
  let ix = 80, iy = 514;
  ints.forEach((item, i) => {
    if (i === 2) { ix = 80; iy = 570; }
    const iw = c.measureText(item).width + 28;
    c.strokeStyle = "rgba(255,255,255,0.07)"; c.lineWidth = 1;
    rr(c, ix, iy - 18, iw, 32, 5); c.stroke();
    c.fillStyle = "rgba(78,86,102,0.8)";
    c.fillText(item, ix + 14, iy + 6);
    ix += iw + 10;
  });

  c.strokeStyle = "rgba(255,255,255,0.05)";
  c.beginPath(); c.moveTo(80, 618); c.lineTo(cw - 80, 618); c.stroke();

  c.font = "500 22px 'DM Mono', monospace"; c.letterSpacing = "4px";
  c.fillStyle = "rgba(78,86,102,0.65)";
  c.fillText("CONTACT", 80, 672);

  ["Telegram  ↗", "LinkedIn  ↗", "GitHub  ↗"].forEach((label, i) => {
    c.font = "400 28px 'DM Sans', sans-serif"; c.letterSpacing = "0px";
    c.fillStyle = "rgba(124,133,146,0.72)";
    c.fillText(label, 80 + i * 500, 724);
  });

  c.font = "500 22px 'DM Mono', monospace"; c.letterSpacing = "8px";
  c.fillStyle = "rgba(78,86,102,0.18)"; c.textAlign = "center";
  c.fillText("OVRAIK", cw / 2, ch - 46);

  return new THREE.CanvasTexture(cv);
}

// ─── ROPE (TubeGeometry updated per frame, buffer reuse) ─────────────────────
const TUBE_SEGS   = 20;
const TUBE_RADIUS = 0.014;
const TUBE_SIDES  = 6;

function buildTube(curve) {
  return new THREE.TubeGeometry(curve, TUBE_SEGS, TUBE_RADIUS, TUBE_SIDES, false);
}

function Rope({ lanyardRef }) {
  const meshRef = useRef();
  const curve = useRef(new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 2.2, 0),
    new THREE.Vector3(0, 1.6, 0),
    new THREE.Vector3(0, 1.0, 0),
    new THREE.Vector3(0, 0.4, 0),
  ]));

  const mat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#4B8BF5",
    roughness: 0.35,
    metalness: 0.25,
    transparent: true,
    opacity: 0.8,
  }), []);

  // throttle geometry rebuild to every other frame
  const frameSkip = useRef(0);

  useFrame(() => {
    if (!lanyardRef.current || !meshRef.current) return;
    frameSkip.current++;
    if (frameSkip.current % 2 !== 0) return;
    const pts = lanyardRef.current.getPoints();
    curve.current.points[0].copy(pts[0]);
    curve.current.points[1].copy(pts[1]);
    curve.current.points[2].copy(pts[2]);
    curve.current.points[3].copy(pts[3]);
    const newGeo = buildTube(curve.current);
    meshRef.current.geometry.dispose();
    meshRef.current.geometry = newGeo;
  });

  const initialGeo = useMemo(() => buildTube(curve.current), []);
  return <mesh ref={meshRef} geometry={initialGeo} material={mat} />;
}

// ─── LANYARD SIMULATION ───────────────────────────────────────────────────────
class Lanyard {
  constructor() {
    this.anchor = new THREE.Vector3(0, 2.2, 0);
    this.p = [
      new THREE.Vector3(0, 1.6, 0),
      new THREE.Vector3(0, 1.0, 0),
      new THREE.Vector3(0, 0.4, 0),
    ];
    this.prev = this.p.map(v => v.clone());
    this.seg = 0.65;
  }
  update(cardPos, dt) {
    const grav = new THREE.Vector3(0, -12 * dt * dt, 0);
    for (let i = 0; i < 2; i++) {
      const vel = this.p[i].clone().sub(this.prev[i]).multiplyScalar(0.9);
      this.prev[i].copy(this.p[i]);
      this.p[i].add(vel).add(grav);
    }
    // pin p[2] to card top
    this.p[2].copy(cardPos).add(new THREE.Vector3(0, CH / 2 + 0.04, 0));
    // constraint relax
    for (let iter = 0; iter < 6; iter++) {
      const d0 = this.p[0].clone().sub(this.anchor);
      if (d0.length() > this.seg) { d0.setLength(this.seg); this.p[0].copy(this.anchor).add(d0); }
      for (let i = 1; i <= 2; i++) {
        const d = this.p[i].clone().sub(this.p[i - 1]);
        if (d.length() > this.seg) { d.setLength(this.seg); this.p[i].copy(this.p[i - 1]).add(d); }
      }
    }
  }
  getPoints() {
    return [this.anchor, ...this.p];
  }
}

// ─── BADGE SCENE ─────────────────────────────────────────────────────────────
function BadgeScene() {
  const meshRef   = useRef();
  const lanyardRef = useRef(new Lanyard());

  const cardPos = useRef(new THREE.Vector3(0, -0.5, 0));
  const cardVel = useRef(new THREE.Vector3(0, 0, 0));

  const rxS = useRef(new Spring(0.055, 0.78));
  const ryS = useRef(new Spring(0.055, 0.78));
  const rzS = useRef(new Spring(0.055, 0.78));

  const RX0 = -0.08, RY0 = 0.14, RZ0 = -0.04;

  const tilt   = useRef({ rx: RX0, ry: RY0, rz: RZ0 });
  const drag   = useRef(false);
  const dOff   = useRef(new THREE.Vector3());
  const dVel   = useRef(new THREE.Vector3());
  const floatT = useRef(0);
  const [flipped, setFlipped] = useState(false);

  const [frontTex] = useState(() => makeFront());
  const [backTex]  = useState(() => makeBack());

  const mats = useMemo(() => [
    new THREE.MeshStandardMaterial({ color: "#0E1828", metalness: 0.6, roughness: 0.3 }),
    new THREE.MeshStandardMaterial({ color: "#0E1828", metalness: 0.6, roughness: 0.3 }),
    new THREE.MeshStandardMaterial({ color: "#1A2840", metalness: 0.7, roughness: 0.2 }),
    new THREE.MeshStandardMaterial({ color: "#08101C", metalness: 0.3, roughness: 0.6 }),
    new THREE.MeshStandardMaterial({ map: frontTex, metalness: 0.12, roughness: 0.2 }),
    new THREE.MeshStandardMaterial({ map: backTex,  metalness: 0.10, roughness: 0.25 }),
  ], [frontTex, backTex]);

  useEffect(() => {
    rxS.current.set(RX0); ryS.current.set(RY0); rzS.current.set(RZ0);
  }, []);

  useFrame(({ raycaster }, delta) => {
    if (!meshRef.current) return;
    const dt = Math.min(delta, 0.05);

    if (drag.current) {
      const ray = raycaster.ray;
      const t   = -ray.origin.z / ray.direction.z;
      const wp  = ray.origin.clone().addScaledVector(ray.direction, t).sub(dOff.current);
      dVel.current.copy(wp).sub(cardPos.current).multiplyScalar(0.3);
      cardPos.current.copy(wp);
      tilt.current.rx = RX0 - dVel.current.y * 1.2;
      tilt.current.ry = (flipped ? Math.PI : 0) + RY0 + dVel.current.x * 1.6;
      tilt.current.rz = RZ0 - dVel.current.x * 0.9;
    } else {
      cardVel.current.multiplyScalar(0.88);
      cardPos.current.add(cardVel.current);
      cardPos.current.x *= 0.95;
      cardPos.current.y  = cardPos.current.y * 0.95 + (-0.5) * 0.05;
      cardPos.current.z *= 0.93;

      floatT.current += dt * 0.5;
      const fy = Math.sin(floatT.current) * 0.07;
      const fx = Math.sin(floatT.current * 0.7) * 0.03;
      tilt.current.rx = RX0 + fx * 0.3;
      tilt.current.ry = (flipped ? Math.PI : 0) + RY0;
      tilt.current.rz = RZ0 + fx * 0.2;
      cardPos.current.y += fy;
    }

    rxS.current.target = tilt.current.rx;
    ryS.current.target = tilt.current.ry;
    rzS.current.target = tilt.current.rz;

    meshRef.current.position.copy(cardPos.current);
    meshRef.current.rotation.x = rxS.current.tick();
    meshRef.current.rotation.y = ryS.current.tick();
    meshRef.current.rotation.z = rzS.current.tick();

    lanyardRef.current.update(cardPos.current, dt);
  });

  const onDown = (e) => {
    e.stopPropagation();
    e.target.setPointerCapture(e.pointerId);
    drag.current = true;
    dOff.current.copy(e.point).sub(cardPos.current); dOff.current.z = 0;
    document.body.style.cursor = "grabbing";
  };
  const onUp = (e) => {
    e.target.releasePointerCapture(e.pointerId);
    if (!drag.current) return;
    drag.current = false;
    cardVel.current.copy(dVel.current).multiplyScalar(0.5);
    document.body.style.cursor = "grab";
  };
  const onClick = (e) => {
    if (dVel.current.length() > 0.015) return;
    const next = !flipped;
    setFlipped(next);
    tilt.current.ry = (next ? Math.PI : 0) + RY0;
    ryS.current.target = tilt.current.ry;
  };

  return (
    <>
      <mesh
        ref={meshRef}
        material={mats}
        onPointerDown={onDown}
        onPointerUp={onUp}
        onPointerOver={() => { document.body.style.cursor = "grab"; }}
        onPointerOut={() => { if (!drag.current) document.body.style.cursor = "auto"; }}
        onClick={onClick}
      >
        <boxGeometry args={[CW, CH, CD]} />
      </mesh>
      <Rope lanyardRef={lanyardRef} />
    </>
  );
}

// ─── SCENE ───────────────────────────────────────────────────────────────────
function Scene() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 10, 8]}  intensity={1.6} />
      <directionalLight position={[-4, 2, -5]} intensity={0.4} color="#3366ff" />
      <directionalLight position={[0, -3, 4]}  intensity={0.2} />
      <pointLight       position={[2, 6, 5]}   intensity={0.8} color="#ddeeff" />
      <BadgeScene />
    </>
  );
}

// ─── EXPORT ──────────────────────────────────────────────────────────────────
export default function BuilderBadge({ style = {} }) {
  return (
    <div style={{ width: "100%", height: "560px", position: "relative", ...style }}>
      <Canvas
        camera={{ position: [0, 0.35, 8], fov: 34 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
        dpr={[1, 2]}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
