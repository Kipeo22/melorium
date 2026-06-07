//インポートから始まるのは全部ここ
import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

console.log('aaa')

//シーンを作る
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xadadad);

//カメラを作る
const camera = new THREE.PerspectiveCamera(
  65, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.set(0, 2.6, 0);

//レンダラー(プロジェクターとスクリーン)
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//レンダラーを整える
renderer.outputColorSpace = THREE.SRGBColorSpace;  // three r152+ の場合
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.physicallyCorrectLights = true;          // 物理ベースライティング


//影をつける
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

//床の作成
const floor_geometry = new THREE.CylinderGeometry(
  6.2,    // 上の半径
  6.2,    // 下の半径（同じ＝円柱）
  0.3,  // 厚み（高さ）
  64     // 円のなめらかさ（多いほど丸い）
);

const floor_material = new THREE.MeshStandardMaterial({
  color: 0x7d7d7d,
  roughness: 1,
  metalness: 0
});

const plate = new THREE.Mesh(floor_geometry, floor_material);
plate.position.y = 0.009; // 厚みの半分だけ上に
scene.add(plate);

//床に影を落す
plate.receiveShadow = true;
plate.castShadow = false;
scene.add(plate);

//クロスヘア

//1.クロスヘアを設置
const size = 0.02;  // crosshair の長さを調整
const crossfair_material = new THREE.LineBasicMaterial({ color: 0xffffff });

const crosshairGeometry = new THREE.BufferGeometry();
const vertices = new Float32Array([
  -size, 0, -1, size, 0, -1,   // 横線
  0, -size, -1, 0, size, -1    // 縦線
]);
crosshairGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

// 2. LineSegments で十字を描く
const crosshair = new THREE.LineSegments(crosshairGeometry, crossfair_material);

// 3. カメラに add して、シーンにも camera を add
camera.add(crosshair);

// ---------- GLB の読み込み ----------

//本を追加
const textureLoader = new THREE.TextureLoader();

function createBook() {
  const book = new THREE.Group();
  const coverWidth = 1.35;
  const coverHeight = coverWidth * (790 / 569);
  const bookDepth = coverHeight * (153 / 790);
  const boardDepth = 0.045;
  const coverOverhang = 0.035;
  const spineWidth = 0.095;
};

function loadBookTexture(path) {
  const texture = textureLoader.load(path);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return texture;
}

const frontTexture = loadBookTexture("./images/red-ura.jpg");
const frontGoldTexture = loadBookTexture("./images/陽だまりのセツナ.png");
const backTexture = loadBookTexture("./images/red-ura.jpg");
const spineTexture = loadBookTexture("./images/1red-se.jpg");
const spineGoldTexture = loadBookTexture("./images/陽だまりのセツナ1背.png");

const frontMaterial = new THREE.MeshStandardMaterial({
  map: frontTexture,
  roughness: 0.7,
  metalness: 0
});

const frontGoldMaterial = new THREE.MeshPhysicalMaterial({
  map: frontGoldTexture,
  color: 0xffedb0,
  metalness: 0.35,
  roughness: 0.22,
  clearcoat: 0.8,
  clearcoatRoughness: 0.08,
  emissive: 0x8a5a18,
  emissiveMap: frontGoldTexture,
  emissiveIntensity: 0.35,
  transparent: true,
  alphaTest: 0.08,
  depthWrite: false,
  side: THREE.FrontSide
});


const frontGold = new THREE.Mesh(
  new THREE.PlaneGeometry(coverWidth + coverOverhang, coverHeight +
    coverOverhang * 2),
  frontGoldMaterial
);
frontGold.position.z = frontSurfaceZ;
frontGold.castShadow = false;
frontGold.receiveShadow = true;
book.add(frontGold);

const frontSurfaceZ = bookDepth / 2 + boardDepth + 0.004;

const spineDepth = bookDepth + boardDepth * 2 - 0.018;

const spine = new THREE.Mesh(
  new THREE.BoxGeometry(spineWidth, coverHeight + coverOverhang * 2,
    spineDepth),
  [
    coverEdgeMaterial,
    spineMaterial,
    coverEdgeMaterial,
    coverEdgeMaterial,
    coverEdgeMaterial,
    coverEdgeMaterial
  ]
);

const pageLines = new THREE.Group();
const lineCount = 28;
for (let i = 0; i < lineCount; i++) {
  const y = -coverHeight * 0.43 + (coverHeight * 0.86 * i) / (lineCount -
    1);
  const points = [
    new THREE.Vector3(pageSideX, y, -bookDepth / 2 + 0.012),
    new THREE.Vector3(pageSideX, y + Math.sin(i * 1.7) * 0.004, bookDepth /
      2 - 0.012)
  ];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  pageLines.add(new THREE.Line(geometry, pageLineMaterial));
}
book.add(pageLines);

const bookHighlight = new THREE.PointLight(0xffe1a3, 1.2, 5);
bookHighlight.position.set(0.2, 2.3, -1.4);
scene.add(bookHighlight);

//ドアを読み込む

const loader = new GLTFLoader()

const glbPath1 = "./models/fdoor.glb"
const glbPath2 = "./models/mdoor.glb"
const glbPath3 = "./models/pdoor.glb"

//fdoorの読み込み
loader.load(
  glbPath1,
  function (gltf) {
    const model1 = gltf.scene; //<-ここの変数を増やす

    // モデルのサイズや位置を調整
    model1.scale.set(0.5, 0.5, 0.5); //モデルの大きさを調整
    model1.rotation.set(0, Math.PI, 0); // モデルの回転を調整
    model1.position.set(5.8, 1.95, 0);//モデルの位置を調整
    model1.receiveShadow = true;//影を付ける

    // 子要素にも影の設定を適用
    model1.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    scene.add(model1);
    addGLBCollider(model1, "モデル1");

    console.log("モデル1が正常に読み込まれました。");
  })

//mdoorのオブジェクトを読み込み
loader.load(
  glbPath2,
  function (gltf) {
    const model2 = gltf.scene; //<-ここの変数を増やす

    // モデルのサイズや位置を調整
    model2.scale.set(0.5, 0.5, 0.5); //モデルの大きさを調整
    model2.rotation.set(0, Math.PI / 3, 0); // モデルの回転を調整
    model2.position.set(-2.9, 1.95, 5.023);//モデルの位置を調整
    model2.receiveShadow = true;//影を付ける

    // 子要素にも影の設定を適用
    model2.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    scene.add(model2);
    addGLBCollider(model2, "モデル2");
    console.log("モデル2が正常に読み込まれました。");
  })

//pdoorオブジェクトを読み込み
loader.load(
  glbPath3,
  function (gltf) {
    const model3 = gltf.scene; //<-ここの変数を増やす

    // モデルのサイズや位置を調整
    model3.scale.set(0.5, 0.5, 0.5); //モデルの大きさを調整
    model3.rotation.set(0, Math.PI * -1 / 3, 0); // モデルの回転を調整
    model3.position.set(-2.9, 1.95, -5.023);//モデルの位置を調整
    model3.receiveShadow = true;//影を付ける

    // 子要素にも影の設定を適用
    model3.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    scene.add(model3);
    addGLBCollider(model3, "モデル3");
    console.log("モデル3が正常に読み込まれました。");
  })

//光  

//環境光
const ambientLight = new THREE.AmbientLight(0xffffff, 1); // 色、強度
scene.add(ambientLight);
ambientLight.castShadow = false;

//ライトの調整
const sun = new THREE.DirectionalLight(0xffffff, 3.0);
sun.position.set(5, 10, 7.5);
sun.castShadow = true;//影を落とす
scene.add(sun);
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.normalBias = 0.02;
sun.shadow.bias = -0.0001;
sun.shadow.camera.near = 1;
sun.shadow.camera.far = 50;

const fill = new THREE.HemisphereLight(0xffffff, 0x444444, 0.5);
scene.add(fill);

//プレイヤー用の当たり判定素材

const glbColliders = [];
const playerRadius = 0.35;
const playerHeight = 1.8;

//オブジェクトの当たり判定素材

function addGLBCollider(model, name) {
  model.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(model);
  glbColliders.push({ name, box });
  console.log(`${name} の当たり判定を追加しました。`, box);
}




//fps設定

// カメラをマウスで操作できるようにする
const controls = new PointerLockControls(camera, document.body);
scene.add(controls.getObject());

document.addEventListener("click", () => {
  controls.lock()
})

// キーボードのキーが押されたかチェックする
const keys = {};
document.addEventListener('keydown', (e) => keys[e.code] = true);
document.addEventListener('keyup', (e) => keys[e.code] = false);

// 動く方向と速さのデータ
const direction = new THREE.Vector3();
const velocity = new THREE.Vector3();

//透明の壁を作成
const groundRadius = 6.2;
const groundCenter = new THREE.Vector3(0, 0, 0);

function isInsideGround(position) {
  playerXZ.set(position.x, 0, position.z);
  return playerXZ.distanceTo(groundCenter) <= groundRadius - playerRadius;
}

function isPlayerCollidingWithGLB(position) {
  const playerBottom = position.y - playerHeight;
  const playerTop = position.y;
  for (const collider of glbColliders) {
    const box = collider.box;
    if (playerTop < box.min.y || playerBottom > box.max.y) {
      continue;
    }
    const closestX = THREE.MathUtils.clamp(position.x, box.min.x,
      box.max.x);
    const closestZ = THREE.MathUtils.clamp(position.z, box.min.z,
      box.max.z);
    const dx = position.x - closestX;
    const dz = position.z - closestZ;
    if (dx * dx + dz * dz < playerRadius * playerRadius) {
      return true;
    }
  }
  return false;
}

function canPlayerStandAt(position) {
  return isInsideGround(position) && !isPlayerCollidingWithGLB(position);
}
function movePlayerWithCollision(rightAmount, forwardAmount) {
  const player = controls.getObject();
  const beforeMove = player.position.clone();
  if (rightAmount !== 0) {
    controls.moveRight(rightAmount);
    if (!canPlayerStandAt(player.position)) {
      player.position.copy(beforeMove);
    } else {
      beforeMove.copy(player.position);
    }
  }
  if (forwardAmount !== 0) {
    controls.moveForward(forwardAmount);
    if (!canPlayerStandAt(player.position)) {
      player.position.copy(beforeMove);
    }
  }
}

// 毎フレーム（60回/秒）動かす関数
function animate() {
  requestAnimationFrame(animate);

  if (controls.isLocked) {
    direction.set(0, 0, 0); // 方向を初期化

    // 押されたキーに応じて方向を設定
    if (keys['KeyS']) direction.z -= 0.5;
    if (keys['KeyW']) direction.z += 0.5;
    if (keys['KeyA']) direction.x -= 0.5;
    if (keys['KeyD']) direction.x += 0.5;

    direction.normalize(); // 斜めでも速さを一定に

    velocity.copy(direction).multiplyScalar(0.04); // 移動の速さを調整

    // 実際にカメラを動かす
    controls.moveRight(velocity.x);
    controls.moveForward(velocity.z);
    movePlayerWithCollision(velocity.x, velocity.z);

    // --- 円形制限 ---

    const player = controls.getObject();
    const playerPos = player.position.clone();
    playerPos.y = 0;

    const distance = playerPos.distanceTo(groundCenter);

    if (distance > groundRadius - 0.2) { // 少し内側に余裕を持たせる
      playerPos.normalize().multiplyScalar(groundRadius - 0.2);
      player.position.x = playerPos.x;
      player.position.z = playerPos.z;
    }
  }

  renderer.render(scene, camera);

}



animate()

// ---------- リサイズ対応 ----------
window.addEventListener('resize', () => {
  const { innerWidth, innerHeight } = window;
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});