import {
	BoxGeometry,
	MeshLambertMaterial,
	Vector3,
} from 'three'; // eslint-disable-line import/no-unresolved

/**
 * Options object for use by main.js, relating to positioning, coloring, and
 * animation preferences for various objects visable to the user.
 * @constant
 * @export
 */
export const options = {
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
		leftEyePos: new Vector3(-1.851, 1.3, 0.055),
		rightEyePos: new Vector3(-1.945, 1.3, 0.12),
		color: 0xbb2929,
		stepSize: 0.02,
		baseSize: 0.02,
		baseOpacity: 0.7,
		frames: [ // of form [action, numLayers, speed (inverse), timeUntilNextMS]
			['remove', 0, 7, 1500],
			['add', 100, 8, 0],
		],
	},
}; /* options */
