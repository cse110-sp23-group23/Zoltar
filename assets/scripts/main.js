import {
	AmbientLight,
	BoxGeometry,
	SphereGeometry,
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
	Group,
} from 'three'; // eslint-disable-line import/no-unresolved
// eslint-disable-next-line import/no-unresolved
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import LockedControls from './LockedControls.js';
import { isTicketCurrentlyDisplayed, toggleTicketOn } from './ticket.js';
import { tellPageLoaded } from './splash.js';
import { createFortuneOnTicket } from './fortunes.js';

// eslint-disable-next-line no-console
console.log('%cWelcome to %cZoltar%c.live!', '', 'color: red; font-weight: bolder', '');

const options = {
	camera: {
		defaultPosition: new Vector3(-4.2, 1.7, -3.5),
	},
	model: {
		position: new Vector3(0, -2, 0),
		scale: new Vector3(2, 2, 2),
	},
	light: {
		spotlightItensity: 3,
		spotlightColor: 0xfff5b6,
		spotlightPos: new Vector3(-8.4, 3.4, -7),
		spotlightTarget: new Vector3(-2.5, 1, -0.3),
		spotlightAngle: Math.PI / 20,
		spotlightDistance: 30,
		ambientIntensity: 0.03,
		ambientColor: 0xffffff,
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
	ticketHitbox: {
		geometry: new BoxGeometry(0.2, 0.11, 0.005),
		position: new Vector3(-2.005, -0.02, -0.75),
		rotateY: 0.50,
	},
	ticketSlide: {
		speed: 4,
		initialPosition: new Vector3(-1.82, -0.051, -0.45),
		finalPosition: new Vector3(-1.945, -0.051, -0.65),
	},
	ticketMat: {
		urlPrefix: 'assets/images/image-bank-back/background-card-',
		material: new MeshLambertMaterial({ color: 0xe0c9a6 }),
		geometry: new BoxGeometry(0.1, 0.005, 0.5),
		rotationY: 0.57,
	},
	eyes: {
		leftEyePos: new Vector3(-1.84, 1.3, 0.065),
		rightEyePos: new Vector3(-1.945, 1.3, 0.145),
		color: 0xbb2929,
		stepSize: 0.05,
		frames: [ // of form [action, timeUntilNextMS]
			['remove', 600],
			['add', 200],
			['remove', 100],
			['add', 300],
			['remove', 100],
			['add', 1000],
		],
		timingFunc: (i) => 2 * i,
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

const dom = {};

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
const spotlight = new SpotLight(options.light.spotlightColor, options.light.spotlightItensity);
const ambient = new AmbientLight(options.light.ambientColor, options.light.ambientIntensity);

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
	object.scale.copy(options.model.scale);
	object.position.copy(options.model.position);
	scene.add(object);
});

// Ticket dispenser hitbox
const hitboxMat = new MeshBasicMaterial({ color: 0xff0000 });
hitboxMat.opacity = 0; // set to positive value to display hitbox
hitboxMat.transparent = true;
const hitbox = new Mesh(options.ticketHitbox.geometry, hitboxMat);
hitbox.position.copy(options.ticketHitbox.position);
hitbox.rotateY(options.ticketHitbox.rotateY);
scene.add(hitbox);

// Ticket
options.ticketMat.material.roughness = 1;
const ticket = new Mesh(options.ticketMat.geometry, options.ticketMat.material);
ticket.rotateY(options.ticketMat.rotationY);

// Light placement
spotlight.position.copy(options.light.spotlightPos);
spotlight.target.position.copy(options.light.spotlightTarget);
spotlight.angle = options.light.spotlightAngle;
spotlight.distance = options.light.spotlightDistance;
spotlight.penumbra = 1;
spotlight.castShadow = true;
scene.add(spotlight.target);
scene.add(spotlight);
scene.add(ambient);

// Glowing eyes setup
const eyeGroup = new Group();
const eyeLayers = [];
const eyeMat = new MeshLambertMaterial({
	color: options.eyes.color,
	transparent: true,
	depthWrite: false,
});
for (let i = 0; i < 1; i += options.eyes.stepSize) {
	const newMat = eyeMat.clone();
	newMat.opacity = 1 - (i ** (options.eyes.stepSize * 2));
	const layer = new Mesh(
		new SphereGeometry(options.eyes.stepSize + (i * i) / 2),
		newMat,
	);
	const eyeLayer = new Group();
	const leftEyeLayer = layer;
	const rightEyeLayer = layer.clone(true);
	leftEyeLayer.position.copy(options.eyes.leftEyePos);
	rightEyeLayer.position.copy(options.eyes.rightEyePos);
	eyeLayer.attach(leftEyeLayer);
	eyeLayer.attach(rightEyeLayer);
	eyeLayers.push(eyeLayer);
}
scene.add(eyeGroup);

/**
 * Returns whether or not new event can be queued
 * @param none
 * @return { Boolean }
 */
export function canTriggerEvent() {
	return !isTicketCurrentlyDisplayed()
		&& controls.API.enabled
		&& !state.ticketSpawned
		&& document.querySelector('.cover').classList.contains('hidden');
} /* canTriggerEvent */

/**
 * Sets ticket texture to image at appropriate url for input
 * @param { String } nameOfImage name of image in format of prefix-name structure
 */
export function setTicketMapToImage(nameOfImage) {
	const mapTexture = textureLoader.load(`${options.ticketMat.urlPrefix}${nameOfImage}-map.png`);
	options.ticketMat.material.map = mapTexture;
} /* setTicketMapToImage */

/**
 * Animates fading (quick, slow, hold) of eyes onto screen
 * @param { String } dir string 'remove' or 'add' representing fading direction
 */
function fadeEyes(dir) {
	if (dir !== 'add' && dir !== 'remove') return;
	eyeLayers.forEach((layer, i) => {
		setTimeout(() => {
			eyeGroup[dir](layer);
		}, options.eyes.timingFunc(i));
	});
} /* fadeEyes */

/**
 * Basic promise that resolves after fixed input time
 * @param { Integer } delay ms delay before resolving
 * @returns { Promise } promise to resolve after delay length
 */
function flickerDelay(delay) {
	return new Promise((resolve) => {
		setTimeout(resolve, delay);
	});
} /* flickerDelay */

/**
 * Adds/removes eye from scene and creates promise to allow next action in delay ms
 * @param { String } action 'add' or 'remove'; action to take in frame
 * @param { Integer } delay ms before allowing to resolve
 * @return { Promise } promise to resolve in a set delay length
 */
function eyeFrame(action, delay) {
	fadeEyes(action);
	return flickerDelay(delay);
}

/**
 * Triggers the screen to shake for predetermined time. Ticket dispenses after
 * shaking is completed
 * @param none
 */
function startShaking() {
	state.currentShakeDuration = options.shake.minDurationMS / 1000;
} /* startShaking */

/**
 * Starts animation sequence for ticket dispense action
 * @param none
 */
function startThinkingAnimation() {
	options.eyes.frames.reduce((prev, cur) => prev.then(() => eyeFrame(cur[0], cur[1])), Promise.resolve())
		.then(() => { setTimeout(startShaking, 500); });
} /* startThinkingAnimation */

/**
 * Generates card and displays on screen
 * @param none
 */
function addCardToScene() {
	toggleTicketOn();
	fadeEyes('remove');
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
 * Quickly flash vignette on edges of screen to show user they clicked button
 * @param none
 */
function flickVignette() {
	dom.cover.classList.remove('hidden');
	dom.cover.classList.add('vignette-cover');
	dom.cover.addEventListener('animationend', () => {
		dom.cover.classList.add('hidden');
		dom.cover.classList.remove('vignette-cover');
	});
} /* flickVignette */

/**
 * Decides and calls appropriate action for all keypresses heard in window
 * @param { Event } event - keypress event passed by eventlistener
 */
function handleKeypress(event) {
	if (event.key === ' ' && canTriggerEvent()) {
		state.ticketSpawned = true;
		state.responseGenerated = false;
		flickVignette();
		startThinkingAnimation();
		const paramOptions = {
			callback: (ticketState) => {
				state.responseGenerated = true;
				setTicketMapToImage(ticketState.currentImageBack);
			},
		};
		createFortuneOnTicket(paramOptions);
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
 * Helper to calculate a 'step' in the direction of targetPos from objectPos in 3 dimensions
 * @param { Vector3 } objectPos - vector representing cur position in 3d space
 * @param { Vector3} targetPos - vector representing target position in 3d spcae
 * @param { Double } speed - scalar representing proportion of distance to travel
 * @param { Double } delta - time since last call
 * @returns { Vector3 } - representation of intermediate distance on coord plane
 */
function calcMidDistance(objectPos, targetPos, speed, delta) {
	return targetPos.clone().sub(objectPos).multiplyScalar(speed * delta);
} /* calcMidDistance */

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
	const cameraAdjustment = calcMidDistance(
		camera.position,
		options.camera.defaultPosition,
		options.cameraSlide.speed,
		delta,
	);
	camera.position.add(cameraAdjustment);
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
	const ticketAdjustment = calcMidDistance(
		ticket.position,
		options.ticketSlide.finalPosition,
		options.ticketSlide.speed,
		delta,
	);
	ticket.position.add(ticketAdjustment);
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
	dom.buttons = [
		document.querySelector('#save-button'),
		document.querySelector('#discard-button'),
	];
	dom.buttons.forEach((el) => {
		el.addEventListener('click', () => {
			controls.API.enabled = true;
		});
	});
	dom.cover = document.querySelector('.cover');

	window.addEventListener('click', shootRay);
	window.addEventListener('keydown', handleKeypress);
	window.addEventListener('resize', handleResize);

	manager.onLoad = () => { tellPageLoaded(controls); };

	animate();
} /* init */

document.addEventListener('DOMContentLoaded', init);
