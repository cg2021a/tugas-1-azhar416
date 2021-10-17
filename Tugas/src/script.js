import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { Texture } from 'three'

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
// const geometry = new THREE.TorusGeometry( .7, .2, 16, 100 );

// Materials
// const material = new THREE.MeshBasicMaterial()
// material.color = new THREE.Color(0x000000)

// Init
let objects = [];
const colorList = [
    'white',
    'green',
    'yellow',
    'red',
    'blue',
]

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

const maxArea = 10;
const minArea = -10;
const rangeArea = maxArea - minArea;

function addObjects(){
    // color object
    const color = colorList[Math.floor(Math.random() * (colorList.length))];
    
    // geometry object
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    
    // material geometry
    const material = new THREE.MeshPhongMaterial({
        color: color
    })

    // mesh geometry
    const mesh = new THREE.Mesh(geometry, material);
    
    // position
    let x = clamp((Math.random() * rangeArea) - rangeArea/2, minArea, maxArea);
    let y = clamp((Math.random() * rangeArea) - rangeArea/2, minArea, maxArea);
    let z = clamp((Math.random() * rangeArea) - rangeArea/2, minArea, maxArea);
    mesh.position.set(x, y, z);

    objects.push(mesh);
    scene.add(mesh);
    
}


// addObject
for(let i = 0; i < 40; i++){
    addObjects();
}

// Lights
const skyColor = 0xB1E1FF;  // light blue
const groundColor = 0xB97A20;  // brownish orange
const intensity = 1;
const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
scene.add(light);

/**
 * Sizes Window
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 9
camera.position.y = 3
camera.position.z = 20
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Raycast
 */

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseMove(event){
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('click', selectObject);

/**
 * Animate
 */

let hovered;
let selected;
let score = 0;

function hover(){
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, false);
    
    if(intersects.length > 0){
        if(hovered != intersects[0].object){
            if(hovered){
                hovered.material.emissive.setHex(hovered.currentHex);
            }

            hovered = intersects[0].object;
            hovered.currentHex = hovered.material.emissive.getHex();
            hovered.material.emissive.setHex(0xff0000);
        }
    }
    else{
        if(hovered){
            hovered.material.emissive.setHex(hovered.currentHex);
        }

        hovered = null;
    }
}

function animateSelect(){
    selected.rotation.x += 0.1;
    selected.rotation.y += 0.1;
    selected.rotation.z += 0.1;
}

function selectObject(){
    const intersects = raycaster.intersectObjects(scene.children, false);
    if(selected){
        if(selected === intersects[0].object){
            selected = null;
            return;
        }
        const first = selected.material.color.getHex();
        const second = intersects[0].object.material.color.getHex();
        if(matchColor(first, second)){
            disposeObject(selected);
            disposeObject(intersects[0].object);

        }
        score += 10;
        document.getElementById('score').textContent = score;
        selected = null;
    }
    else{
        selected = intersects[0].object;
    }
}

function matchColor(col1, col2){
    if(col1 === col2){
        return true;
    }
    return false;
}

function disposeObject(obj){
    objects = objects.filter((v) => v !== obj)
    obj.geometry.dispose();
    obj.material.dispose();
    scene.remove(obj);
    renderer.renderLists.dispose();
    console.log(objects.length);
}

const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    // Update Orbital Controls
    controls.update()

    if(objects.length < 40){
        setTimeout(addObjects, 500);
    }
    // Render
    hover()
    if(selected){
        animateSelect(elapsedTime);
    }
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
