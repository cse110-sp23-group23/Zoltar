import {
	AmbientLight,
	BoxGeometry,
	Clock,
	LoadingManager,
	Mesh,
	MeshBasicMaterial,
	MeshLambertMaterial,
	PerspectiveCamera,
	Raycaster,
	Scene,
	SpotLight,
	TextureLoader,
	Vector2,
	Vector3,
	WebGLRenderer,
} from 'three'; // eslint-disable-line import/no-unresolved
// eslint-disable-next-line import/no-unresolved
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import LockedControls from './LockedControls.js';
import { isTicketCurrentlyDisplayed, isTicketCurrentlyFlipped, toggleTicketOn } from './ticket.js';
import { tellPageLoaded } from './splash.js';
import { createFortuneOnTicket } from './fortunes.js';

const options = {
	camera: {
		defaultPosition: new Vector3(-4.2, 1.7, -3.5),
		defaultLookAt: new Vector3(48.3, -16.1, 79.7),
	},
	shake: {
		intensity: new Vector3(0.03, 0.03, 0.03),
		durationMS: 1000,
	},
	flicker: {
		startProbability: 0.005,
		onInterval: 0.1,
		timingFunc: () => (Math.floor(Math.random() * 0.07) + 0.07),
		countFunc: () => (Math.floor(Math.random() * 2) + 2),
	},
	cameraSlide: {
		speed: 0.05,
	},
	ticketSlide: {
		speed: 0.05,
		initialPosition: new Vector3(-1.82, -0.051, -0.45),
		finalPosition: new Vector3(-1.945, -0.051, -0.65),
		framesToEnd: 70,
	},
};

const state = {
	currentShakeDuration: 0,
	currentFlickerCount: 0,
	slideCameraTowardDefault: false,
	ticketFramesLeft: 0,
	ticketSpawned: false,
	flickerOn: false,
	flickerTime: 0,
	curFlickerOffInterval: options.flicker.timingFunc(), // changes each iteration
	shakeDeltaVec: new Vector3(),
};

// Load 3D scene and necesary objects
const scene = new Scene();
const clock = new Clock();
const manager = new LoadingManager();
const raycaster = new Raycaster();
const pointer = new Vector2();
const textureLoader = new TextureLoader();
const loader = new GLTFLoader(manager);
const renderer = new WebGLRenderer({ alpha: false });
const camera = new PerspectiveCamera(25, window.innerWidth / window.innerHeight, 1, 2000);

// Light creation
const spotLight = new SpotLight(0xfff5b6, 3);
const ambient = new AmbientLight(0xffffff, 0.03);

// Load camera perspective
camera.position.copy(options.camera.defaultPosition);
camera.lookAt(options.camera.defaultLookAt);

// Load renderer
renderer.setClearColor(0x000000);
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
loader.load('assets/models/fixedangle.glb', (gltf) => {
	const object = gltf.scene;
	object.scale.set(2, 2, 2);
	object.position.x = 0;
	object.position.y = -2;
	object.position.z = 0;
	scene.add(object);
});

// Ticket dispenser hitbox
const hitboxGeo = new BoxGeometry(0.2, 0.11, 0.005);
const hitboxMat = new MeshBasicMaterial({ color: 0xff0000 });
hitboxMat.opacity = 0; // set to positive value to display hitbox
hitboxMat.transparent = true;
const hitbox = new Mesh(hitboxGeo, hitboxMat);
hitbox.position.set(-2.005, -0.02, -0.75);
hitbox.rotateY(0.5);
scene.add(hitbox);

// Ticket
const paperTexture = textureLoader.load('./assets/images/background-card-map.png');
const ticketGeo = new BoxGeometry(0.1, 0.005, 0.5);
const ticketMat = new MeshLambertMaterial({ color: 0xE0C9A6 });
ticketMat.map = paperTexture;
ticketMat.roughness = 1;
const ticket = new Mesh(ticketGeo, ticketMat);
ticket.rotateY(0.57);

/**
 * Returns whether or not ticket can currently be dispensed; tests all edge cases
 * @param none
 * @return { Boolean }
 */
function canTriggerTicket() {
	return !isTicketCurrentlyDisplayed() && controls.enabled && !state.ticketSpawned
		&& document.querySelector('.cover').classList.contains('hidden');
} /* canTriggerTicket */

window.addEventListener('keydown', (event) => {
	if (event.key === ' ' && canTriggerTicket()) {
		state.ticketSpawned = true;
		state.currentShakeDuration = options.shake.durationMS / 1000;
		setTimeout(() => {
			ticket.position.copy(options.ticketSlide.initialPosition);
			scene.add(ticket);
			state.ticketFramesLeft = options.ticketSlide.framesToEnd;
		}, options.shake.durationMS);
	}
});

// Light placement
spotLight.position.set(-8.4, 3.4, -7);
spotLight.target.position.set(-2.5, 1, -0.3);
spotLight.angle = Math.PI / 20;
spotLight.penumbra = 1;
spotLight.distance = 30;
spotLight.castShadow = true;
scene.add(spotLight.target);
scene.add(spotLight);
scene.add(ambient);

function addCardToScene() {
	createFortuneOnTicket();
	toggleTicketOn();
	scene.remove(ticket);
	state.ticketSpawned = false;
	controls.enabled = false;
}

// Test if hitbox is clicked on
function shootRay(event) {
	pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
	pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

	raycaster.setFromCamera(pointer, camera);
	const intersects = raycaster.intersectObjects([hitbox, ticket]);
	if (intersects.length > 0 && state.ticketSpawned) {
		addCardToScene();
	}
}

// When loaded, tell splash
manager.onLoad = () => { tellPageLoaded(controls); };

function animate() {
	const delta = clock.getDelta();

	if (state.currentShakeDuration > 0) {
		state.shakeDeltaVec.random().subScalar(0.5).multiply(options.shake.intensity);
		camera.position.add(state.shakeDeltaVec);
		state.currentShakeDuration -= delta;
		if (state.currentShakeDuration <= 0) {
			state.slideCameraTowardDefault = true;
		}
	}

	state.flickerTime += delta;
	if (state.currentFlickerCount === 0 && Math.random() < options.flicker.startProbability) {
		state.currentFlickerCount = options.flicker.countFunc();
	}
	if (state.currentFlickerCount > 0) {
		if (state.flickerOn && state.flickerTime >= options.flicker.onInterval) {
			scene.remove(ambient);
			state.flickerOn = false;
			state.flickerTime = 0;
		} else if (!state.flickerOn && state.flickerTime >= state.curFlickerOffInterval) {
			scene.add(ambient);
			state.flickerOn = true;
			state.currentFlickerCount -= 1;
			state.flickerTime = 0;
			state.curFlickerOffInterval = options.flicker.timingFunc();
		}
	}

	if (state.slideCameraTowardDefault) {
		if (camera.position.equals(options.camera.defaultPosition)) {
			state.slideCameraTowardDefault = false;
		}
		const adjustment = options.camera.defaultPosition.clone().sub(camera.position)
			.multiplyScalar(options.cameraSlide.speed);
		camera.position.add(adjustment);
	}

	if (state.ticketFramesLeft > 0) {
		const adjustment = options.ticketSlide.finalPosition.clone().sub(ticket.position)
			.multiplyScalar(options.ticketSlide.speed);
		ticket.position.add(adjustment);
		state.ticketFramesLeft -= 1;
	}

	renderer.render(scene, camera);
	requestAnimationFrame(animate);
	controls.update(0.01);
}

window.addEventListener('resize', () => {
	const width = window.innerWidth;
	const height = window.innerHeight;
	renderer.setSize(width, height);
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
});

function init() {
	const buttons = [
		document.querySelector('#save-button'),
		document.querySelector('#discard-button'),
	];
	buttons.forEach((el) => {
		el.addEventListener('click', () => {
			controls.enabled = true;
		})
	});
	animate();
	window.addEventListener('click', shootRay);
}
document.addEventListener('DOMContentLoaded', init);
