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
import { isTicketCurrentlyDisplayed, toggleTicketOn } from './ticket.js';
import { tellPageLoaded } from './splash.js';
import { createFortuneOnTicket } from './fortunes.js';

const options = {
	camera: {
		defaultPosition: new Vector3(-4.2, 1.7, -3.5),
	},
	shake: {
		intensity: new Vector3(0.03, 0.03, 0.03),
		minDurationMS: 1000,
	},
	flicker: {
		startProbability: 0.005,
		onInterval: 0.1,
		timingFunc: () => (Math.floor(Math.random() * 0.07) + 0.07),
		countFunc: () => (Math.floor(Math.random() * 2) + 2),
	},
	cameraSlide: {
		speed: 4,
	},
	ticketSlide: {
		speed: 4,
		initialPosition: new Vector3(-1.82, -0.051, -0.45),
		finalPosition: new Vector3(-1.945, -0.051, -0.65),
	},
};

const state = {
	currentShakeDuration: 0,
	responseGenerated: true,
	shakeEndHappened: true,
	currentFlickerCount: 0,
	slideCameraTowardDefault: false,
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

// Load renderer
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load custom controls and turn off by default
const controls = new LockedControls(camera, renderer.domElement);
controls.API.enabled = true;

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

/**
 * Returns whether or not new event can be queued
 * @param none
 * @return { Boolean }
 */
export function canTriggerEvent() {
	return !isTicketCurrentlyDisplayed() && controls.API.enabled && !state.ticketSpawned
		&& document.querySelector('.cover').classList.contains('hidden');
} /* canTriggerEvent */

/**
 * Generates card and displays on screen
 * @param none
 */
function addCardToScene() {
	toggleTicketOn();
	scene.remove(ticket);
	state.ticketSpawned = false;
	controls.API.enabled = false;
} /* addCardToScene */

/**
 * Shoots ray from camera and measures instersection with hitbox of
 * ticket; if hit, displays cards
 * @param { Object } event event listener action
 */
function shootRay(event) {
	pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
	pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
	raycaster.setFromCamera(pointer, camera);
	const intersects = raycaster.intersectObjects([hitbox, ticket]);
	if (intersects.length > 0 && state.ticketSpawned) {
		addCardToScene();
	}
} /* shootRay */

/**
 * Decides and calls appropriate action for all keypresses heard in window
 * @param { Event } event - keypress event passed by eventlistener
 */
function handleKeypress(event) {
	if (event.key === ' ' && canTriggerEvent()) {
		state.ticketSpawned = true;
		state.currentShakeDuration = options.shake.minDurationMS / 1000;
		state.responseGenerated = false;
		createFortuneOnTicket().then(() => {
			state.responseGenerated = true;
		});
	}
} /* handleKeypress */

/**
 * Prevents damage from window resize to camera controls and viewport
 * @param none
 */
function handleResize() {
	const width = window.innerWidth;
	const height = window.innerHeight;
	renderer.setSize(width, height);
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
} /* handleResize */

/**
 * Generates difference from last frame in terms of camera shake
 * @param { Double } delta - time since last frame generated
 */
function animateShakeFrame(delta) {
	if (state.currentShakeDuration > 0 || !state.responseGenerated) { // if not done
		state.shakeDeltaVec.random().subScalar(0.5).multiply(options.shake.intensity);
		camera.position.add(state.shakeDeltaVec);
		state.currentShakeDuration -= delta;
		state.shakeEndHappened = false;
	} else if (!state.shakeEndHappened) { // do once when done
		state.shakeEndHappened = true;
		ticket.position.copy(options.ticketSlide.initialPosition);
		scene.add(ticket); // spawn ticket
		state.slideCameraTowardDefault = true; // move back to original position
	}
} /* animateShakeFrame */

/**
 * Helper func to decide if lights should turn off
 * @param none
 * @return { Boolean }
 */
function shouldFlickerOff() {
	return (state.flickerOn) && (state.flickerTime >= options.flicker.onInterval);
} /* shouldFlickerOff */

/**
 * Helper func to decide if lights should turn back on
 * @param none
 * @return { Boolean }
 */
function shouldFlickerOn() {
	return (!state.flickerOn) && (state.flickerTime >= state.curFlickerOffInterval);
} /* shouldFlickerOn */

/**
 * Generates difference from last frame in terms of background lights flickering
 * @param { Double } delta - time since last frame generated
 */
function animateFlickerFrame(delta) {
	state.flickerTime += delta;
	if (state.currentFlickerCount > 0) {
		if (shouldFlickerOff()) {
			scene.remove(ambient);
			state.flickerOn = false;
			state.flickerTime = 0;
		} else if (shouldFlickerOn()) {
			scene.add(ambient);
			state.flickerOn = true;
			state.flickerTime = 0;
			state.currentFlickerCount -= 1;
			state.curFlickerOffInterval = options.flicker.timingFunc();
		}
	} else if (Math.random() < options.flicker.startProbability) {
		state.currentFlickerCount = options.flicker.countFunc();
	}
} /* animateFlickerFrame */

/**
 * Generates frame tending camera toward default position if state allows
 * @param { Double } delta - time since last frame requested
 */
function conditionalAnimateSlideCameraFrame(delta) {
	if (!state.slideCameraTowardDefault) {
		return;
	}
	const adjustment = options.camera.defaultPosition.clone().sub(camera.position)
		.multiplyScalar(options.cameraSlide.speed * delta);
	camera.position.add(adjustment);
	if (camera.position.equals(options.camera.defaultPosition)) {
		state.slideCameraTowardDefault = false;
	}
} /* conditionalAnimateSlideCameraFrame */

/**
 * Generates difference from last frame in terms of ticket sliding out of dispenser
 * @param { Double } delta - time since last frame generated
 */
function animateTicketSlideFrame(delta) {
	if (ticket.position.distanceTo(options.ticketSlide.finalPosition) <= 0.01) {
		return;
	}
	const adjustment = options.ticketSlide.finalPosition.clone().sub(ticket.position)
		.multiplyScalar(options.ticketSlide.speed * delta);
	ticket.position.add(adjustment);
} /* animateTicketSlideFrame */

/**
 * Animation farm; generates each frame and calls self
 * @param none
 */
function animate() {
	const delta = clock.getDelta();

	animateShakeFrame(delta);
	animateFlickerFrame(delta);
	animateTicketSlideFrame(delta);
	conditionalAnimateSlideCameraFrame(delta);
	controls.update(delta);

	renderer.render(scene, camera);
	requestAnimationFrame(animate);
} /* animate */

function init() {
	const buttons = [
		document.querySelector('#save-button'),
		document.querySelector('#discard-button'),
	];

	buttons.forEach((el) => {
		el.addEventListener('click', () => {
			controls.API.enabled = true;
		});
	});

	window.addEventListener('click', shootRay);
	window.addEventListener('keydown', handleKeypress);
	window.addEventListener('resize', handleResize);

	manager.onLoad = () => { tellPageLoaded(controls); };

	animate();
} /* init */

document.addEventListener('DOMContentLoaded', init);
