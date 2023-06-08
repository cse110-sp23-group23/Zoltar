import { playBackgroundNoise } from './noise.js';

const LOADED_MESSAGE = '[ press anywhere to continue ]';
const INSTRUCTIONS_DURATION_MS = 2;

const dom = {};

/**
 * Handles event triggered when splash screen fades away. Shows instructions for
 * predetermined length of time and then fades them out and enables controls
 * @param { LockedControls } [controls] object containing controls
 */
function handleSplashTransition(controls) {
	dom.splash.classList.add('hidden');
	setTimeout(() => {
		dom.instructions.classList.add('no-opacity');
		dom.instructions.addEventListener('transitionend', () => {
			dom.instructions.classList.add('hidden');
			if (controls) {
				const controlRef = controls;
				controlRef.enabled = true;
			}
		}, { once: true });
	}, INSTRUCTIONS_DURATION_MS);
} /* handleSplashTransition */

/**
 * Adds event listeners to trigger dismissal of splash screen
 * and enabling of controls on any user input (key/mouse)
 * @param { LockedControls } [controls] object containing controls
 */
export function tellPageLoaded(controls) {
	const go = () => {
		playBackgroundNoise();
		dom.splash.classList.add('no-opacity');
		dom.splash.addEventListener('transitionend', () => { handleSplashTransition(controls); }, { once: true });
		window.removeEventListener('mousedown', go);
		window.removeEventListener('keydown', go);
	};
	window.addEventListener('mousedown', go);
	window.addEventListener('keydown', go);
	dom.loadedMessage.innerText = LOADED_MESSAGE;
	dom.longLoadingMessage.innerHTML = '';
} /* tellPageLoaded */

function init() {
	dom.splash = document.querySelector('#splash-screen');
	dom.instructions = document.querySelector('#instructions-screen');
	dom.loadedMessage = document.querySelector('.loaded-message');
	dom.longLoadingMessage = document.querySelector('.long-loading-message');
} /* init */

document.addEventListener('DOMContentLoaded', init);
