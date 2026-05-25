import * as THREE from "three";

const BG = "#f4f6f8";
const EMERALD = "#10b981";
const BLUE = "#3b82f6";
const NAVY = "#0f172a";

type ContainerState = {
  lane: number;
  z: number;
  speed: number;
  phase: number;
};

type PacketState = {
  mesh: THREE.Mesh;
  curve: THREE.Vector3[];
  t: number;
  speed: number;
};

export class DeploymentCorridorScene {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private root: THREE.Group;
  private core: THREE.Group;
  private rings: THREE.Mesh[] = [];
  private innerCore!: THREE.Mesh;
  private neuralLines: THREE.Line[] = [];
  private containerMesh!: THREE.InstancedMesh;
  private containerStates: ContainerState[] = [];
  private packets: PacketState[] = [];
  private nodes: THREE.Group[] = [];
  private laneLights: THREE.PointLight[] = [];
  private clock = new THREE.Clock();
  private frameId = 0;
  private disposed = false;
  private pointerX = 0;
  private pointerY = 0;
  private disposables: (THREE.Material | THREE.BufferGeometry)[] = [];

  constructor(container: HTMLElement) {
    this.container = container;
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(BG);
    this.scene.fog = new THREE.FogExp2(BG, 0.02);

    this.camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 120);
    this.camera.position.set(0, 5.5, 16);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;
    container.appendChild(this.renderer.domElement);

    this.root = new THREE.Group();
    this.scene.add(this.root);

    this.setupLights();
    this.buildFloor();
    this.buildCorridorLanes();
    this.buildStageMarkers();
    this.buildInfrastructureNodes();
    this.buildContainerPipeline();
    this.core = this.buildAICore();
    this.root.add(this.core);

    this.onPointerMove = this.onPointerMove.bind(this);
    container.addEventListener("pointermove", this.onPointerMove);

    this.animate();
  }

  private track(
    geo?: THREE.BufferGeometry,
    mat?: THREE.Material
  ): void {
    if (geo) this.disposables.push(geo);
    if (mat) this.disposables.push(mat);
  }

  private setupLights() {
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const key = new THREE.DirectionalLight(0xffffff, 0.95);
    key.position.set(6, 14, 10);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    this.scene.add(key);

    const fill = new THREE.DirectionalLight(0xe2e8f0, 0.35);
    fill.position.set(-8, 6, 6);
    this.scene.add(fill);

    const rim = new THREE.DirectionalLight(0x34d399, 0.25);
    rim.position.set(0, 4, -12);
    this.scene.add(rim);
  }

  private buildFloor() {
    const floorGeo = new THREE.PlaneGeometry(50, 70, 1, 1);
    const floorMat = new THREE.MeshStandardMaterial({
      color: "#e8ecf1",
      metalness: 0.65,
      roughness: 0.25,
    });
    this.track(floorGeo, floorMat);
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, -8);
    floor.receiveShadow = true;
    this.root.add(floor);

    const grid = new THREE.GridHelper(50, 40, "#cbd5e1", "#e2e8f0");
    grid.position.set(0, 0.01, -8);
    (grid.material as THREE.Material).opacity = 0.35;
    (grid.material as THREE.Material).transparent = true;
    this.root.add(grid);
  }

  private buildCorridorLanes() {
    const laneXs = [-4.2, -1.4, 1.4, 4.2];
    const colors = [BLUE, EMERALD, "#8b5cf6", "#06b6d4"];

    laneXs.forEach((x, i) => {
      const trackGeo = new THREE.BoxGeometry(1.1, 0.06, 48);
      const trackMat = new THREE.MeshStandardMaterial({
        color: "#1e293b",
        emissive: colors[i],
        emissiveIntensity: 0.12,
        metalness: 0.5,
        roughness: 0.4,
      });
      this.track(trackGeo, trackMat);
      const track = new THREE.Mesh(trackGeo, trackMat);
      track.position.set(x, 0.04, -10);
      track.receiveShadow = true;
      this.root.add(track);

      const railGeo = new THREE.BoxGeometry(0.08, 0.2, 48);
      const railMat = new THREE.MeshStandardMaterial({
        color: colors[i],
        emissive: colors[i],
        emissiveIntensity: 0.35,
        metalness: 0.6,
        roughness: 0.3,
      });
      this.track(railGeo, railMat);
      [-0.52, 0.52].forEach((ox) => {
        const rail = new THREE.Mesh(railGeo, railMat);
        rail.position.set(x + ox, 0.1, -10);
        this.root.add(rail);
      });

      const light = new THREE.PointLight(colors[i], 0.35, 12);
      light.position.set(x, 1.5, -4);
      this.laneLights.push(light);
      this.root.add(light);
    });
  }

  private buildStageMarkers() {
    const stages = [
      { z: -18, color: BLUE, label: "dev" },
      { z: -10, color: EMERALD, label: "cicd" },
      { z: -2, color: "#8b5cf6", label: "k8s" },
      { z: 6, color: "#06b6d4", label: "prod" },
    ];

    stages.forEach(({ z, color }) => {
      const g = new THREE.Group();
      const pillarGeo = new THREE.BoxGeometry(0.12, 2.8, 0.5);
      const pillarMat = new THREE.MeshStandardMaterial({
        color: NAVY,
        emissive: color,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.85,
      });
      this.track(pillarGeo, pillarMat);
      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      pillar.position.y = 1.4;
      g.add(pillar);

      const cap = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 12, 12),
        new THREE.MeshBasicMaterial({ color })
      );
      cap.position.y = 2.85;
      g.add(cap);

      g.position.set(-7.5, 0, z);
      this.root.add(g);

      const g2 = g.clone();
      g2.position.x = 7.5;
      this.root.add(g2);
    });
  }

  private buildInfrastructureNodes() {
    const positions: [number, number, number][] = [
      [-7, 0, -14],
      [7, 0, -12],
      [-7.5, 0, -4],
      [7.5, 0, -2],
      [-7, 0, 4],
      [7, 0, 6],
    ];

    positions.forEach((pos, i) => {
      const g = new THREE.Group();
      const baseGeo = new THREE.CylinderGeometry(0.5, 0.65, 1.2, 6);
      const baseMat = new THREE.MeshStandardMaterial({
        color: "#64748b",
        metalness: 0.55,
        roughness: 0.35,
      });
      this.track(baseGeo, baseMat);
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.position.y = 0.6;
      base.castShadow = true;
      g.add(base);

      const coreGeo = new THREE.OctahedronGeometry(0.35, 0);
      const coreMat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? EMERALD : BLUE,
        emissive: i % 2 === 0 ? EMERALD : BLUE,
        emissiveIntensity: 0.7,
        metalness: 0.3,
        roughness: 0.2,
      });
      this.track(coreGeo, coreMat);
      const core = new THREE.Mesh(coreGeo, coreMat);
      core.position.y = 1.55;
      g.add(core);

      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.55, 0.03, 8, 24),
        new THREE.MeshBasicMaterial({
          color: i % 2 === 0 ? EMERALD : BLUE,
          transparent: true,
          opacity: 0.6,
        })
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 1.2;
      g.add(ring);

      g.position.set(...pos);
      this.root.add(g);
      this.nodes.push(g);
    });

    const links: [number, number][] = [
      [0, 1],
      [0, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [1, 3],
    ];

    links.forEach(([a, b]) => {
      const path = [
        this.nodes[a].position.clone().add(new THREE.Vector3(0, 1.5, 0)),
        new THREE.Vector3(
          (this.nodes[a].position.x + this.nodes[b].position.x) / 2,
          2.8,
          (this.nodes[a].position.z + this.nodes[b].position.z) / 2
        ),
        this.nodes[b].position.clone().add(new THREE.Vector3(0, 1.5, 0)),
      ];

      const curve = new THREE.CatmullRomCurve3(path);
      const points = curve.getPoints(32);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: EMERALD,
        transparent: true,
        opacity: 0.45,
      });
      this.track(lineGeo, lineMat);
      const line = new THREE.Line(lineGeo, lineMat);
      this.root.add(line);

      const packetGeo = new THREE.SphereGeometry(0.07, 8, 8);
      const packetMat = new THREE.MeshBasicMaterial({ color: BLUE });
      const packet = new THREE.Mesh(packetGeo, packetMat);
      this.root.add(packet);
      this.packets.push({
        mesh: packet,
        curve: points,
        t: Math.random(),
        speed: 0.06 + Math.random() * 0.04,
      });
    });
  }

  private buildContainerPipeline() {
    const geo = new THREE.BoxGeometry(0.75, 0.55, 0.75);
    const mat = new THREE.MeshStandardMaterial({
      color: NAVY,
      metalness: 0.55,
      roughness: 0.35,
    });
    this.track(geo, mat);

    const count = 36;
    this.containerMesh = new THREE.InstancedMesh(geo, mat, count);
    this.containerMesh.castShadow = true;
    this.containerMesh.receiveShadow = true;

    const laneXs = [-4.2, -1.4, 1.4, 4.2];
    const dummy = new THREE.Object3D();

    for (let i = 0; i < count; i++) {
      const lane = i % 4;
      this.containerStates.push({
        lane,
        z: -22 + (i / count) * 28,
        speed: 0.04 + (lane + 1) * 0.012,
        phase: Math.random() * Math.PI * 2,
      });

      dummy.position.set(laneXs[lane], 0.45, this.containerStates[i].z);
      dummy.updateMatrix();
      this.containerMesh.setMatrixAt(i, dummy.matrix);
    }
    this.containerMesh.instanceMatrix.needsUpdate = true;
    this.root.add(this.containerMesh);
  }

  private buildAICore() {
    const g = new THREE.Group();
    g.position.set(0, 3.2, -6);

    const shellGeo = new THREE.SphereGeometry(1.65, 48, 48);
    const shellMat = new THREE.MeshPhysicalMaterial({
      color: "#ffffff",
      metalness: 0.05,
      roughness: 0.05,
      transmission: 0.88,
      thickness: 1.5,
      transparent: true,
      opacity: 0.35,
      ior: 1.4,
      clearcoat: 1,
    });
    this.track(shellGeo, shellMat);
    const shell = new THREE.Mesh(shellGeo, shellMat);
    g.add(shell);

    const innerGeo = new THREE.IcosahedronGeometry(0.85, 1);
    const innerMat = new THREE.MeshStandardMaterial({
      color: EMERALD,
      emissive: EMERALD,
      emissiveIntensity: 0.85,
      wireframe: true,
      transparent: true,
      opacity: 0.75,
    });
    this.track(innerGeo, innerMat);
    this.innerCore = new THREE.Mesh(innerGeo, innerMat);
    g.add(this.innerCore);

    const ringConfigs = [
      { r: 2.1, tube: 0.03, rot: [Math.PI / 2, 0, 0] },
      { r: 2.35, tube: 0.025, rot: [0.4, 0, 0.3] },
      { r: 2.55, tube: 0.02, rot: [0.8, 0.3, 0] },
    ];

    ringConfigs.forEach(({ r, tube, rot }) => {
      const ringGeo = new THREE.TorusGeometry(r, tube, 12, 64);
      const ringMat = new THREE.MeshStandardMaterial({
        color: BLUE,
        emissive: BLUE,
        emissiveIntensity: 0.55,
        transparent: true,
        opacity: 0.7,
      });
      this.track(ringGeo, ringMat);
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.set(rot[0], rot[1], rot[2]);
      g.add(ring);
      this.rings.push(ring);
    });

    for (let i = 0; i < 12; i++) {
      const pts: THREE.Vector3[] = [];
      for (let j = 0; j < 5; j++) {
        const theta = (i / 12) * Math.PI * 2 + j * 0.4;
        const phi = j * 0.35;
        pts.push(
          new THREE.Vector3(
            Math.cos(theta) * Math.sin(phi) * 1.2,
            Math.sin(theta) * Math.sin(phi) * 1.2,
            Math.cos(phi) * 1.2
          )
        );
      }
      const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const lineMat = new THREE.LineBasicMaterial({
        color: i % 2 === 0 ? EMERALD : "#67e8f9",
        transparent: true,
        opacity: 0.5,
      });
      this.track(lineGeo, lineMat);
      const line = new THREE.Line(lineGeo, lineMat);
      g.add(line);
      this.neuralLines.push(line);
    }

    const coreLight = new THREE.PointLight(EMERALD, 1.2, 14);
    coreLight.position.set(0, 0, 0);
    g.add(coreLight);
    const coreLight2 = new THREE.PointLight(BLUE, 0.6, 10);
    coreLight2.position.set(0.5, 0.3, 0);
    g.add(coreLight2);

    const pedestalGeo = new THREE.CylinderGeometry(1.8, 2.4, 0.35, 32);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: "#cbd5e1",
      metalness: 0.7,
      roughness: 0.2,
      emissive: EMERALD,
      emissiveIntensity: 0.08,
    });
    this.track(pedestalGeo, pedestalMat);
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -2.1;
    pedestal.receiveShadow = true;
    g.add(pedestal);

    return g;
  }

  private onPointerMove(e: PointerEvent) {
    const rect = this.container.getBoundingClientRect();
    this.pointerX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointerY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  }

  private sampleCurve(points: THREE.Vector3[], t: number) {
    const total = points.length - 1;
    const f = t * total;
    const i = Math.min(Math.floor(f), total - 1);
    return points[i].clone().lerp(points[i + 1], f - i);
  }

  private animate = () => {
    if (this.disposed) return;
    this.frameId = requestAnimationFrame(this.animate);
    const t = this.clock.getElapsedTime();
    const laneXs = [-4.2, -1.4, 1.4, 4.2];
    const dummy = new THREE.Object3D();

    this.containerStates.forEach((state, i) => {
      state.z += state.speed;
      if (state.z > 8) state.z = -24;

      const y =
        0.45 +
        Math.sin(t * 2.5 + state.phase) * 0.04 +
        Math.sin(state.z * 0.15) * 0.02;

      dummy.position.set(laneXs[state.lane], y, state.z);
      dummy.rotation.y = t * 0.5 + state.phase;
      dummy.updateMatrix();
      this.containerMesh.setMatrixAt(i, dummy.matrix);
    });
    this.containerMesh.instanceMatrix.needsUpdate = true;

    this.packets.forEach((p) => {
      p.t = (p.t + p.speed * 0.01) % 1;
      const pos = this.sampleCurve(p.curve, p.t);
      p.mesh.position.copy(pos);
      const scale = 0.85 + Math.sin(t * 4 + p.t * 10) * 0.15;
      p.mesh.scale.setScalar(scale);
    });

    this.innerCore.rotation.x = t * 0.35;
    this.innerCore.rotation.y = t * 0.55;
    const pulse = 0.75 + Math.sin(t * 2) * 0.25;
    (this.innerCore.material as THREE.MeshStandardMaterial).emissiveIntensity =
      pulse;

    this.rings.forEach((ring, i) => {
      ring.rotation.z += 0.003 + i * 0.001;
      ring.rotation.x += 0.001;
    });

    this.neuralLines.forEach((line, i) => {
      line.rotation.y = t * 0.2 + i * 0.1;
      const mat = line.material as THREE.LineBasicMaterial;
      mat.opacity = 0.35 + Math.sin(t * 3 + i) * 0.2;
    });

    this.laneLights.forEach((light, i) => {
      light.intensity = 0.28 + Math.sin(t * 2 + i * 1.2) * 0.12;
    });

    this.nodes.forEach((node, i) => {
      const core = node.children[1] as THREE.Mesh;
      if (core) {
        core.rotation.y = t * 0.8 + i;
        core.position.y = 1.55 + Math.sin(t * 1.5 + i) * 0.06;
      }
    });

    const driftX = Math.sin(t * 0.12) * 1.2 + this.pointerX * 0.6;
    const driftY = 5.5 + Math.sin(t * 0.08) * 0.25 + this.pointerY * 0.25;
    const driftZ = 16 + Math.cos(t * 0.1) * 0.5;

    this.camera.position.x += (driftX - this.camera.position.x) * 0.02;
    this.camera.position.y += (driftY - this.camera.position.y) * 0.02;
    this.camera.position.z += (driftZ - this.camera.position.z) * 0.015;
    this.camera.lookAt(this.pointerX * 0.8, 2.2 + this.pointerY * 0.3, -6);

    this.renderer.render(this.scene, this.camera);
  };

  resize() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    if (w === 0 || h === 0) return;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.frameId);
    this.container.removeEventListener("pointermove", this.onPointerMove);
    if (this.renderer.domElement.parentNode === this.container) {
      this.container.removeChild(this.renderer.domElement);
    }
    this.renderer.dispose();
    this.disposables.forEach((d) => d.dispose());
    this.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh && !this.disposables.includes(obj.geometry)) {
        obj.geometry?.dispose();
      }
    });
  }
}
