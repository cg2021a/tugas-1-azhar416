import * as THREE from '../JS/three.module.js';
import {OrbitControls} from '../JS/OrbitControls.js';

// scene
const scene = new THREE.Scene();

// setting renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Objects
// donut
const geometryDonut = new THREE.TorusGeometry( .2, .05, 16, 50 );
// sphere
const geometrySphere = new THREE.SphereGeometry(.3, 32 , 16);
// torus knot
const geometryTorusKnot = new THREE.TorusKnotGeometry(.3, .1, 100, 16);
// kotak
const geometryCube = new THREE.BoxGeometry(3, .2, 3);
// cylinder
const geometryCylinder = new THREE.CylinderGeometry(.2, .2, 2, 32, 32);

// Materials
// donut
const materialDonut = new THREE.MeshBasicMaterial( {wireframe: true} );
materialDonut.color = new THREE.Color(0xff0000);
// sphere
const materialSphere = new THREE.MeshPhysicalMaterial( {wireframe: true} );
materialSphere.color = new THREE.Color(0x77c0f7);
// torus knot
const materialTKnot = new THREE.MeshStandardMaterial( {wireframe:false} );
materialTKnot.color = new THREE.Color(0xaa32cf);
// cube
const materialCube = new THREE.MeshToonMaterial( {wireframe: false, color: 'gray'} );
// cylinder
const materialCylinder = new THREE.MeshNormalMaterial( {wireframe: true} );

// Mesh
// donut
const donut = new THREE.Mesh(geometryDonut, materialDonut);
scene.add(donut);
// sphere
const sphere = new THREE.Mesh(geometrySphere, materialSphere);
scene.add(sphere);
// Torus Knot
const TKnot = new THREE.Mesh(geometryTorusKnot, materialTKnot);
scene.add(TKnot);
// kotak
const cube = new THREE.Mesh(geometryCube, materialCube);
scene.add(cube);
// cylinder
const cylinder = new THREE.Mesh(geometryCylinder, materialCylinder);
scene.add(cylinder);

// Start Position
// donut
donut.position.y = 1;
// sphere
sphere.position.y = 0;
// torus knot
TKnot.position.y = -.3;
TKnot.position.x = 1;
// kotak
cube.position.y = -1.0
// cylinder
cylinder.position.z = 1;
cylinder.position.y = .2;

// Lights
// ambient
const ambientLight = new THREE.AmbientLight(0x5c5c5c, 1)
scene.add(ambientLight);

// point
const pointLight = new THREE.PointLight(0xffffff, .5);
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 0
scene.add(pointLight);

// hemisphere
const hemiSphereLight = new THREE.HemisphereLightProbe(0x00ffff, 0.5)
scene.add(hemiSphereLight);

// directional
const directionalLight = new THREE.DirectionalLight(0xffff00, 1);
scene.add(directionalLight);

// spotlight
const spotLight = new THREE.SpotLight(0x000000, 1);
spotLight.position.set(100, 100, 100);
scene.add(spotLight);

// Camera
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 4;
scene.add(camera);

// Control
const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true
controls.autoRotate = true;
// controls.autoRotateSpeed = 4;

const clock = new THREE.Clock();
let speed = 0.01;
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime();

    // Update objects
    // Update Orbital Controls
    controls.update()

    // DONUT
    if (donut.position.x >=1 || donut.position.x <=-1) 
        speed = -speed;
    donut.position.x += speed;
    donut.position.y += speed;
    donut.position.z += speed;
    // donut.rotation.x += 0.01;
    donut.rotation.y += 0.01;

    // SPHERE
    sphere.rotation.y += 0.02;
    sphere.rotation.x += 0.02;

    // torus knot
    TKnot.rotation.x += .01;
    TKnot.rotation.y += .01;

    // kotak
    // cube.rotation.y += 0.005;

    // cylinder
    cylinder.rotation.z += .01;

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
}
tick();
// let speed = 0.01;
// // renderer.render(scene, camera);
// function animate() {
//     requestAnimationFrame( animate );

//     if (cube.position.x >=5 || cube.position.x <=-5) 
//         speed = -speed;
//     cube.position.x += speed;
    
//     cube.rotation.x += 0.01;
//     cube.rotation.y += 0.01;
//     renderer.render( scene, camera );
// }
// animate();