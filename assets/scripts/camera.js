import { historyIsOpen } from './storage.js';
import { isTicketCurrentlyDisplayed } from './ticket.js';
import { state } from './main2d.js';

let cameraEl;
let vignette;

let xValue = 0;
let yValue = 0;
let rotateDegree = 0;
let frame = 0;
const FLICKER_DELAY = 130;
const FRAMES_BETWEEN_FLICKER = 400;
const LIGHTS_ON = 'radial-gradient(circle at center, rgba(0, 0, 0, 0) 10%, rgba(0, 0, 0, 1))';
const LIGHTS_OFF = 'linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.93))';
const ROTATE_AMOUNT = 20;

/**
 * Adjusts vignette value to seem like the lights are flickers.
 * If someone wants to rewrite this then feel free lol
 * @param none
 */
function flickerLights() {
	vignette.style.background = LIGHTS_OFF;
	setTimeout(() => {
		vignette.style.background = LIGHTS_ON;
		setTimeout(() => {
			vignette.style.background = LIGHTS_OFF;
			setTimeout(() => {
				vignette.style.background = LIGHTS_ON;
				if (Math.random() > 0.5) return;
				setTimeout(() => {
					vignette.style.background = LIGHTS_OFF;
					setTimeout(() => {
						vignette.style.background = LIGHTS_ON;// I live to drink code climates tears
					}, FLICKER_DELAY);
				}, FLICKER_DELAY);
			}, FLICKER_DELAY);
		}, FLICKER_DELAY);
	}, FLICKER_DELAY);
} /* flickerLights */

/**
 * When the mouse moves, takes all the elements with the class 'camera' and shifts
 * their positions relative to the mouse
 * @param { Event } e event pased by listener
 */
function cameraMove(e) {
	frame += 1;
	if (historyIsOpen() || isTicketCurrentlyDisplayed() || !state.controls.API.enabled) return;
	if (frame % FRAMES_BETWEEN_FLICKER === 0) flickerLights();
	if (frame % 2 === 0) return;	// Improve performance by reducing frames to calculate.

	xValue = e.clientX - window.innerWidth / 2; // x position relative to center of screen
	yValue = e.clientY - window.innerHeight / 2; // y position relative to center of screen

	rotateDegree = (xValue / (window.innerWidth / 2)) * ROTATE_AMOUNT;

	cameraEl.forEach((element) => {
		const { speedx } = element.dataset;
		const { speedy } = element.dataset;
		const { rotation } = element.dataset;

		// eslint-disable-next-line no-param-reassign
		element.style.transform = `translateX(calc(-50% 
			+ ${-xValue * speedx}px)) translateY(calc(-50% 
			+ ${-yValue * speedy}px)) rotateY(${rotateDegree * rotation}deg)`;
	});
} /* cameraMove */

/**
 * Event Listener that creates a 3D like effect for the 2d Zoltar.
 */
window.addEventListener('mousemove', cameraMove);

function init() {
	cameraEl = document.querySelectorAll('.camera');
	vignette = document.querySelector('.vignette');
	const isSafari = (navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1);
	const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
	|| (navigator.userAgent.includes('Mac') && 'ontouchend' in document);
	// Disable camera movement if browser is Safari or device itself is iOS/iPadOS
	if (isSafari || isIOS) window.removeEventListener('mousemove', cameraMove);
} /* init */
document.addEventListener('DOMContentLoaded', init);
