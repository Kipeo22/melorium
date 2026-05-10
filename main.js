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
camera.position.set(0,2.6,0);

//レンダラー(プロジェクターとスクリーン)
const renderer = new THREE.WebGLRenderer({antialias: true, powerPreference: "high-performance" });
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
plate.position.y =0.009; // 厚みの半分だけ上に
scene.add(plate);

//浮島の作成
const floor1 = new THREE.Mesh(floor_geometry, floor_material);
floor1.position.set(30, 0.04, 10);
scene.add(floor1);
floor1.receiveShadow = true;
floor1.castShadow = false;

const floor2 = new THREE.Mesh(floor_geometry, floor_material);
floor2.position.set(10, 0.04, 25);
scene.add(floor2);
floor2.receiveShadow = true;
floor2.castShadow = false;

const floor3 = new THREE.Mesh(floor_geometry, floor_material);
floor3.position.set(-25, 0.04, -80);
scene.add(floor3);
floor3.receiveShadow = true;
floor3.castShadow = false;

const floor4 = new THREE.Mesh(floor_geometry, floor_material);
floor4.position.set(-20, 0.04, -20);
scene.add(floor4);
floor4.receiveShadow = true;
floor4.castShadow = false;


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
  -size,  0, -1,   size,  0, -1,   // 横線
   0, -size, -1,   0,  size, -1    // 縦線
]);
crosshairGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

 // 2. LineSegments で十字を描く
const crosshair = new THREE.LineSegments(crosshairGeometry, crossfair_material);

 // 3. カメラに add して、シーンにも camera を add
camera.add(crosshair);

// ---------- GLB の読み込み ----------
const loader = new GLTFLoader()

const glbPath1 = "./models/table.glb"
const glbPath2 = "./models/yuutu.glb"
const glbPath3 = "./models/puranetes.glb"
const glbPath4 = "./models/setuna.glb" 
const glbPath5 = "./models/table.glb"
const glbPath6 = "./models/dec.glb"
const glbPath7 = "./models/tuki.glb"

//tableのオブジェクトを読み込み
  loader.load(
  glbPath1,
  function (gltf) {
    const model1 = gltf.scene; //<-ここの変数を増やす
    
    // モデルのサイズや位置を調整
    model1.scale.set(0.7, 0.7, 0.7); //モデルの大きさを調整
    model1.rotation.set(0, Math.PI/2, 0); // モデルの回転を調整
    model1.position.set(0, -0.4, 0.1);//モデルの位置を調整
    model1.receiveShadow = true;//影を付ける
    
        // 子要素にも影の設定を適用
    model1.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
   
    scene.add(model1);
    console.log("モデル1が正常に読み込まれました。");
  })

  //ふたつめtableのオブジェクトを読み込み
  loader.load(
  glbPath1,
  function (gltf) {
    const model5 = gltf.scene; //<-ここの変数を増やす
    
    // モデルのサイズや位置を調整
    model5.scale.set(0.7, 0.7, 0.7); //モデルの大きさを調整
    model5.rotation.set(0,-Math.PI/2,0); // モデルの回転を調整
    model5.position.set(0, -0.4,-0.1);//モデルの位置を調整
    model5.receiveShadow = true;//影を付ける
    
        // 子要素にも影の設定を適用
    model5.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
   
    scene.add(model5);
    console.log("モデル5が正常に読み込まれました。");
  })

  //メアリー・スーの憂鬱のオブジェクトを読み込み
  loader.load(
    glbPath2,
    function (gltf) {
      const model2 = gltf.scene; //<-ここの変数を増やす
    
      // モデルのサイズや位置を調整
      model2.scale.set(0.01, 0.01, 0.01); //モデルの大きさを調整
      model2.rotation.set(Math.PI,0, Math.PI); // モデルの回転を調整
      model2.position.set(0, 1.8,4.85);//モデルの位置を調整
      model2.receiveShadow = true;//影を付ける
    
            // 子要素にも影の設定を適用
      model2.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
   
      scene.add(model2);
      console.log("モデル2が正常に読み込まれました。");
    })

     //プラネテスのオブジェクトを読み込み
  loader.load(
    glbPath3,
    function (gltf) {
      const model3 = gltf.scene; //<-ここの変数を増やす
    
      // モデルのサイズや位置を調整
      model3.scale.set(0.01, 0.01, 0.01); //モデルの大きさを調整
      model3.rotation.set(Math.PI,Math.PI/2.8, Math.PI); // モデルの回転を調整
      model3.position.set(-3.65,1.8,1.3);//モデルの位置を調整
      model3.receiveShadow = true;//影を付ける
    
            // 子要素にも影の設定を適用
      model3.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
   
      scene.add(model3);
      console.log("モデル3が正常に読み込まれました。");
    })

    //陽だまりのセツナのオブジェクトを読み込み
  loader.load(
    glbPath4,
    function (gltf) {
      const model4 = gltf.scene; //<-ここの変数を増やす
    
      // モデルのサイズや位置を調整
      model4.scale.set(0.01, 0.01, 0.01); //モデルの大きさを調整
      model4.rotation.set(Math.PI,-Math.PI/2.5, Math.PI); // モデルの回転を調整
      model4.position.set(2.7, 1.8,3.5);//モデルの位置を調整
      model4.receiveShadow = true;//影を付ける
    
            // 子要素にも影の設定を適用
      model4.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
   
      scene.add(model4);
      console.log("モデル4が正常に読み込まれました。");
    })

     //Dec.のオブジェクトを読み込み
  loader.load(
    glbPath6,
    function (gltf) {
      const model6 = gltf.scene; //<-ここの変数を増やす
    
      // モデルのサイズや位置を調整
      model6.scale.set(0.01, 0.01, 0.01); //モデルの大きさを調整
      model6.rotation.set(Math.PI,Math.PI/1.4, Math.PI); // モデルの回転を調整
      model6.position.set(-1.2, 1.83,-5.2);//モデルの位置を調整
      model6.receiveShadow = true;//影を付ける
    
         // 子要素にも影の設定を適用
      model6.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
   
      scene.add(model6);
      console.log("モデル6が正常に読み込まれました。");
    })

     //ツキアカリのオブジェクトを読み込み
  loader.load(
    glbPath7,
    function (gltf) {
      const model7 = gltf.scene; //<-ここの変数を増やす
    
      // モデルのサイズや位置を調整
      model7.scale.set(0.01, 0.01, 0.01); //モデルの大きさを調整
      model7.rotation.set(Math.PI,-Math.PI/1.4, Math.PI); // モデルの回転を調整
      model7.position.set(1.9,1.85,-4.35);//モデルの位置を調整
      model7.receiveShadow = true;//影を付ける
    
           // 子要素にも影の設定を適用
      model7.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
   
      scene.add(model7);
      console.log("モデル7が正常に読み込まれました。");
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

  // 点光源を作成

  // スポットライト光源を作成
// new THREE.SpotLight(色, 光の強さ, 距離, 照射角, ボケ具合, 減衰率)
const light1 = new THREE.SpotLight(0Xffe9b3, 15, 2, Math.PI, 4, 0.5);
scene.add(light1);
light1.position.set(0, 3, 4.7);
light1.castShadow = false;

const light2 = new THREE.SpotLight(0Xffe9b3, 15, 2, Math.PI, 4, 0.5);
scene.add(light2);
light2.position.set(-3.1, 3, 2.7);
light2.castShadow = false;

const light3 = new THREE.SpotLight(0Xffe9b3, 15, 2, Math.PI, 4, 0.5);
scene.add(light3);
light3.position.set(3.1, 3, 2.7);
light3.castShadow = false;

// light4は冊数的に削除

const light5 = new THREE.SpotLight(0Xffe9b3, 15, 2, Math.PI, 4, 0.5);
scene.add(light5);
light5.position.set(-2.5,3,-4.1);
light5.castShadow = false;

const light6 = new THREE.SpotLight(0Xffe9b3, 15, 2, Math.PI, 4, 0.5);
scene.add(light6);
light6.position.set(2.5,3,-4.1);
light6.castShadow = false;

//fps設定

 // カメラをマウスで操作できるようにする
const controls = new PointerLockControls(camera, document.body);
scene.add(controls.getObject());

document.addEventListener("click", () =>{
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