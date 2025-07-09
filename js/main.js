import * as THREE from "https://cdn.skypack.dev/three@0.129.0";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";


let scene, camera, renderer, skybox, controls;
let sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();


let mercury_orbit_radius = 50
let venus_orbit_radius = 65
let earth_orbit_radius = 75
let mars_orbit_radius = 85
let jupiter_orbit_radius = 110
let saturn_orbit_radius = 125
let uranus_orbit_radius = 145
let neptune_orbit_radius = 170

let mercury_revolution_speed = 1.8
let venus_revolution_speed = 1.5
let earth_revolution_speed = 1
let mars_revolution_speed = 0.9
let jupiter_revolution_speed = 0.5
let saturn_revolution_speed = 0.4
let uranus_revolution_speed = 0.35
let neptune_revolution_speed = 0.3

function createMaterialArray() {
  const skyboxImagepaths = ['../img/skybox/space_ft.png', '../img/skybox/space_bk.png', '../img/skybox/space_up.png', '../img/skybox/space_dn.png', '../img/skybox/space_rt.png', '../img/skybox/space_lf.png']
  const materialArray = skyboxImagepaths.map((image) => {
    let texture = new THREE.TextureLoader().load(image);
    return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
  });
  return materialArray;
}

function setSkyBox() {
  const materialArray = createMaterialArray();
  let skyboxGeo = new THREE.BoxGeometry(1000, 1000, 1000);
  skybox = new THREE.Mesh(skyboxGeo, materialArray);
  scene.add(skybox);
}
function loadPlanetTexture(texture, radius, widthSegments, heightSegments, meshType) {
  const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
  const loader = new THREE.TextureLoader();
  const planetTexture = loader.load(texture);
  const material = meshType == 'standard' ? new THREE.MeshStandardMaterial({ map: planetTexture }) : new THREE.MeshBasicMaterial({ map: planetTexture });

  const planet = new THREE.Mesh(geometry, material);

  return planet
}

function createRing(innerRadius) {
  let outerRadius = innerRadius - 0.1
  let thetaSegments = 100
  const geometry = new THREE.RingGeometry(innerRadius, outerRadius, thetaSegments);
  const material = new THREE.MeshBasicMaterial({ color: '#ffffff', side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh)
  mesh.rotation.x = Math.PI / 2
  return mesh;

}

function addSaturnRing() {
  const ringGeometry = new THREE.RingGeometry(9, 12, 64);  // Adjust sizes for realism
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0xaaaaaa,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.6,
  });
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.rotation.x = Math.PI / 2;
  saturn.add(ring); // attaches ring to Saturn so it moves with it
}


function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    85,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  setSkyBox();
  earth = loadPlanetTexture("img/earth_hd.jpg", 4, 100, 100, 'standard');
  sun = loadPlanetTexture("img/sun_hd.jpg", 20, 100, 100, 'basic');
  mercury = loadPlanetTexture("img/mercury_hd.jpg", 2, 100, 100, 'standard');
  venus = loadPlanetTexture("img/venus_hd.jpg", 3, 100, 100, 'standard');
  mars = loadPlanetTexture("img/mars_hd.jpg", 3.5, 100, 100, 'standard');
  jupiter = loadPlanetTexture("img/jupiter_hd.jpg", 10, 100, 100, 'standard');
  saturn = loadPlanetTexture("img/saturn_hd.jpg", 8, 100, 100, 'standard');
  uranus = loadPlanetTexture("img/uranus_hd.jpg", 6, 100, 100, 'standard');
  neptune = loadPlanetTexture("img/neptune_hd.jpg", 5, 100, 100, 'standard');

   scene.add(earth);
  scene.add(sun);
  scene.add(mercury);
  scene.add(venus);
  scene.add(mars);
  scene.add(jupiter);
  scene.add(saturn);
  addSaturnRing();
  scene.add(uranus);
  scene.add(neptune);

  const sunLight = new THREE.PointLight(0xffffff, 1, 0); 
  sunLight.position.copy(sun.position); 
  scene.add(sunLight);

 
  createRing(mercury_orbit_radius)
  createRing(venus_orbit_radius)
  createRing(earth_orbit_radius)
  createRing(mars_orbit_radius)
  createRing(jupiter_orbit_radius)
  createRing(saturn_orbit_radius)
  createRing(uranus_orbit_radius)
  createRing(neptune_orbit_radius)

 renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  renderer.domElement.id = "c";
  controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 12;
  controls.maxDistance = 1000;

  camera.position.z = 100;
}

function planetRevolver(time, speed, planet, orbitRadius, planetName) {

  let orbitSpeedMultiplier = 0.001;
  const planetAngle = time * orbitSpeedMultiplier * speed;
  planet.position.x = sun.position.x + orbitRadius * Math.cos(planetAngle);
  planet.position.z = sun.position.z + orbitRadius * Math.sin(planetAngle);
}

function animate(time) {
  requestAnimationFrame(animate);

  // Rotate the planets
  const rotationSpeed = 0.005;
  earth.rotation.y += rotationSpeed;
  sun.rotation.y += rotationSpeed;
  mercury.rotation.y += rotationSpeed;
  venus.rotation.y += rotationSpeed;
  mars.rotation.y += rotationSpeed;
  jupiter.rotation.y += rotationSpeed;
  saturn.rotation.y += rotationSpeed;
  uranus.rotation.y += rotationSpeed;
  neptune.rotation.y += rotationSpeed;


  planetRevolver(time, mercury_revolution_speed, mercury, mercury_orbit_radius, 'mercury')
  planetRevolver(time, venus_revolution_speed, venus, venus_orbit_radius, 'venus')
  planetRevolver(time, earth_revolution_speed, earth, earth_orbit_radius, 'earth')
  planetRevolver(time, mars_revolution_speed, mars, mars_orbit_radius, 'mars')
  planetRevolver(time, jupiter_revolution_speed, jupiter, jupiter_orbit_radius, 'jupiter')
  planetRevolver(time, saturn_revolution_speed, saturn, saturn_orbit_radius, 'saturn')
  planetRevolver(time, uranus_revolution_speed, uranus, uranus_orbit_radius, 'uranus')
  planetRevolver(time, neptune_revolution_speed, neptune, neptune_orbit_radius, 'neptune')




  controls.update();
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onWindowResize, false);

init();
animate(0); 

