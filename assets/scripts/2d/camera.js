import { isHistoryOnScreen } from './ticketHistory.js';
import { isTicketOnScreen } from './main.js';

let cameraEl;
let vignette;

let xValue = 0;
let yValue = 0;
let rotateDegree = 0;
let frame = 0;
const FLICKER_DELAY = 130;
const FRAMES_BETWEEN_FLICKER = 400;
const LIGHTS_ON = 'radial-gradient(circle at center, rgba(0, 0, 0, 0) 20%, rgba(0, 0, 0, 1))';
const LIGHTS_OFF = 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7))';

/**
 * adjusts vignette value to seem like lights flicker
 * @param none
 * I live to drink code climates tears
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
						vignette.style.background = LIGHTS_ON;
					}, FLICKER_DELAY);
				}, FLICKER_DELAY);
			}, FLICKER_DELAY);
		}, FLICKER_DELAY);
	}, FLICKER_DELAY);
}

/**
 * Event Listener that creates a 3D like effect for the 2d Zoltar.
 */
window.addEventListener('mousemove', (e) => {
	// Pauses Zoltar's movements if any asset if displayed on screen. Eg. ticket, history
	frame += 1;
	if (isHistoryOnScreen() || isTicketOnScreen()) return;
	if (frame % FRAMES_BETWEEN_FLICKER === 0) flickerLights();
	if (frame % 2 === 0) return;

	xValue = e.clientX - window.innerWidth / 2;
	yValue = e.clientY - window.innerHeight / 2;

	rotateDegree = (xValue / (window.innerWidth / 2)) * 20;

	cameraEl.forEach((element) => {
		const { speedx } = element.dataset;
		const { speedy } = element.dataset;
		const { rotation } = element.dataset;

		// eslint-disable-next-line no-param-reassign
		element.style.transform = `translateX(calc(-50% + ${-xValue * speedx}px)) translateY(calc(-50% + ${-yValue * speedy}px)) rotateY(${rotateDegree * rotation}deg)`;
	});
});

function init() {
	cameraEl = document.querySelectorAll('.camera');
	vignette = document.querySelector('.vignette');
}

document.addEventListener('DOMContentLoaded', init);
