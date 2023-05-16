import {
	Scene,
	PerspectiveCamera,
	WebGLRenderer,
	Raycaster,
	Vector2,
	SpotLight,
	AmbientLight,
	BoxGeometry,
	MeshBasicMaterial,
	MeshLambertMaterial,
	TextureLoader,
	Mesh,
	LoadingManager,
	Vector3,
	Clock,
} from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { LockedControls } from './LockedControls.js';
import { isTicketCurrentlyDisplayed, isTicketCurrentlyFlipped, toggleTicketOn } from './ticket.js';
import { loaded } from './splash.js';
import { produceFortune } from './fortunes.js';

// Load 3D scene
const scene = new Scene(); 

// Loading manager
const manager = new LoadingManager();

manager.onLoad = function ( ) {	
	loaded(controls);
};

// Load camera perspective
const camera = new PerspectiveCamera(25, window.innerWidth / window.innerHeight, 1, 2000);
let defaultCameraPos = new Vector3(-4.2, 1.7, -3.5);
camera.position.copy(defaultCameraPos);
camera.lookAt(48.3, -16.1, 79.7);

// Load renderer
const renderer = new WebGLRenderer({ alpha: false });
renderer.setClearColor(0x000000); // black
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load custom controls
const controls = new LockedControls(camera, renderer.domElement);
controls.constrainVertical = true;
controls.verticalMin = 1.67;
controls.verticalMax = 1.87;
controls.lookSpeed = 0.035;			
controls.minLon = 29;
controls.maxLon = 37;
controls.enabled = false;

// glTf 2.0 Loader
const loader = new GLTFLoader(manager);
loader.load('assets/models/fixedangle.glb', function (gltf) {
	const object = gltf.scene;				
	object.scale.set( 2, 2, 2 );			   
	object.position.x = 0;
	object.position.y = -2;
	object.position.z = 0;
	scene.add(object);
});	

// 3D event listeners
const raycaster = new Raycaster();
const pointer = new Vector2();

// Ticket dispenser hitbox
const hitboxGeo = new BoxGeometry(0.2, 0.11, 0.005); 
const hitboxMat = new MeshBasicMaterial( {color: 0xff0000} ); 
hitboxMat.opacity = 0; // set to positive value to display hitbox
hitboxMat.transparent = true;
const hitbox = new Mesh(hitboxGeo, hitboxMat); 
hitbox.position.set(-2.005, -0.02, -0.75);
hitbox.rotateY(0.5);
scene.add(hitbox);

// Ticket
const textureLoader = new TextureLoader();
const paperTexture = textureLoader.load('./assets/images/background-card-map.png');

const ticketGeo = new BoxGeometry(0.1, 0.005, 0.5);
const ticketMat = new MeshLambertMaterial( {color: 0xE0C9A6} );
ticketMat.map = paperTexture;
ticketMat.roughness = 1;
const ticket = new Mesh(ticketGeo, ticketMat);
ticket.position.set(-1.945, -0.051, -0.65);
ticket.rotateY(0.57);

let ticketSpawned = false;
window.addEventListener('keydown', (event) => {
	if (event.key === ' ' && !isTicketCurrentlyDisplayed() && controls.enabled && !ticketSpawned) {
		ticketSpawned = true;
		shake();
		setTimeout(() => {
			scene.add(ticket);
		}, 1000);
	}
});

// Flickering lights
const spotLight = new SpotLight(0xfff5b6, 3);
spotLight.position.set(-8.4, 3.4, -7);
spotLight.castShadow = true;
spotLight.penumbra = 1;
spotLight.distance = 30;
spotLight.target.position.set(-2.5, 1, -0.3);
scene.add(spotLight.target);
spotLight.angle = Math.PI / 20;
scene.add(spotLight);

const ambient = new AmbientLight(0xffffff, 0.03);
scene.add(ambient);

// Test if hitbox is clicked on
function shootRay(event) {
	pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
	pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

	raycaster.setFromCamera(pointer, camera);
	const intersects = raycaster.intersectObjects([hitbox, ticket]);
	if (intersects.length > 0 && ticketSpawned) {
		buttonAdd();
	}
}

function buttonAdd() {
	produceFortune();
	scene.remove(ticket);
	ticketSpawned = false;
	controls.enabled = false;
	toggleTicketOn();
}

// Toggle controls with ticket appearance
document.addEventListener('DOMContentLoaded', init);

function init() {
	const buttonRemove = document.querySelector('#close-ticket');
	buttonRemove.addEventListener('click', () => { controls.enabled = true; });
	window.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && isTicketCurrentlyFlipped()) {
			controls.enabled = true;
		}
	});

	window.addEventListener('click', shootRay);
}

// TODO: Fix this code by moving it into animate() and using Clock
let flickering = false;
function flicker(count) {
	if (count === undefined || count <= 0) {
		flickering = false;
		return;
	}
	flickering = true;
	scene.remove(ambient);
	setTimeout(() => { 
		scene.add(ambient); 
		setTimeout(() => { flicker(count-1); }, (Math.random() * 70) + 70);
	}, 50);
}

let shakeDuration = 0;
const shakeIntensity = new Vector3(0.03, 0.03, 0.03);
const clock = new Clock();
const tmpVector = new Vector3();

function shake() {
	shakeDuration = 1;
}

let slideTowardDefault = false;

function animate() {
	if (Math.random() < 0.005 && flickering === false) {
		flicker(Math.floor(Math.random() * 2) + 2);
	}

	const delta = clock.getDelta();
    // If there's shaking to be done
    if (shakeDuration > 0) {
        tmpVector.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
            .multiply(shakeIntensity);
        camera.position.add(tmpVector);
        shakeDuration -= delta;
        
        // If the shaking is over, reset the camera position
        if (shakeDuration <= 0) {
			slideTowardDefault = true;
        }
    }

	if (slideTowardDefault) {
		if (camera.position.equals(defaultCameraPos)) {
			slideTowardDefault = false;
		}
		const adjustment = defaultCameraPos.clone().sub(camera.position).multiplyScalar(0.05);
		camera.position.add(adjustment);
	}

	renderer.render(scene, camera);
	requestAnimationFrame( animate );
	controls.update(0.01)
}

animate();