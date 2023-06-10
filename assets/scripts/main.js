import {
	AmbientLight,
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
import {
	animateShakeFrame,
	animateFlickerFrame,
	animateTicketSlideFrame,
	conditionalAnimateSlideCameraFrame,
} from './animationframes.js';
import LockedControls from './LockedControls.js';
import { isTicketCurrentlyDisplayed, toggleTicketOn } from './ticket.js';
import { tellPageLoaded } from './splash.js';
import { createFortuneOnTicket } from './fortunes.js';
import { flickerDelay, flickVignette } from './util.js';
import { options } from './options.js';
import { setControls } from './settings.js';

// eslint-disable-next-line no-console
console.log('%cWelcome to %cZoltar%c.live!', '', 'color: red; font-weight: bolder', '');

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

// Load 3D scene and necessary objects
const scene = new Scene();
const clock = new Clock();
const manager = new LoadingManager();
const raycaster = new Raycaster();
const pointer = new Vector2();
const textureLoader = new TextureLoader();
const loader = new GLTFLoader(manager);
const renderer = new WebGLRenderer({ alpha: false });
const camera = new PerspectiveCamera(25, window.innerWidth / window.innerHeight, 1, 2000);

// Sound effects
const rumble = new Audio('./assets/audio/rumble.mp3');

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
export const controls = new LockedControls(camera, renderer.domElement);
controls.API.enabled = false;
setControls(controls);

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
	newMat.opacity = options.eyes.baseOpacity * (1 - (i ** (options.eyes.stepSize * 2)));
	const layerGeo = new SphereGeometry(options.eyes.baseSize + (i * i) / 2);
	layerGeo.scale(2, 1, 2);
	const layer = new Mesh(layerGeo, newMat);
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
 * @param { String } numLayers if adding, number of layers to add. Remove always removes everything
 */
function fadeEyes(dir, speed, numLayers) {
	if (dir !== 'add' && dir !== 'remove') return;
	eyeLayers.forEach((layer, i) => {
		if (dir === 'add' && i >= numLayers) return;
		setTimeout(() => {
			eyeGroup[dir](layer);
		}, speed * i);
	});
} /* fadeEyes */

/**
 * Adds/removes eye from scene and creates promise to allow next action in delay ms
 * @param { Array } frame of form [action, numLayers, speed, timeUntilNextMS], action either 'add' or 'remove'
 * 		and layers only effect 'add' action
 * @return { Promise } promise to resolve in a set delay length
 */
function eyeFrame(frame) {
	fadeEyes(frame[0], frame[2], frame[1]);
	return flickerDelay(frame[3]);
}

/**
 * Triggers the screen to shake for predetermined time. Ticket dispenses after
 * shaking is completed
 * @param none
 */
function startShaking() {
	rumble.play();
	state.currentShakeDuration = options.shake.minDurationMS / 1000;
} /* startShaking */

/**
 * Starts animation sequence for ticket dispense action
 * @param none
 */
function startThinkingAnimation() {
	options.eyes.frames.reduce((prev, cur) => prev.then(() => eyeFrame(cur)), Promise.resolve())
		.then(() => { setTimeout(startShaking, 500); });
} /* startThinkingAnimation */

/**
 * Generates card and displays on screen
 * @param none
 */
function addCardToScene() {
	toggleTicketOn();
	fadeEyes('remove', 10);
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
		state.responseGenerated = false;
		flickVignette();
		startThinkingAnimation();
		rumble.load();
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
 * Animation farm; generates each frame and calls self
 * @param none
 */
function animate() {
	const delta = clock.getDelta();
	const args = {
		state, options, ticket, camera, scene, ambient,
	};
	animateShakeFrame(delta, args);
	animateFlickerFrame(delta, args);
	animateTicketSlideFrame(delta, args);
	conditionalAnimateSlideCameraFrame(delta, args);
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

	window.addEventListener('click', shootRay);
	window.addEventListener('keydown', handleKeypress);
	window.addEventListener('resize', handleResize);
	window.addEventListener('beforeunload', (event) => {
		// eslint-disable-next-line no-param-reassign
		event.returnValue = 'Leaving now will cause your ticket to be lost.';
	});

	manager.onLoad = () => { tellPageLoaded(controls); };

	animate();
} /* init */

document.addEventListener('DOMContentLoaded', init);
