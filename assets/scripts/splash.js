import { playAudio } from './noise.js';

const LOADED_MESSAGE = '[ press anywhere to continue ]';

const dom = {};

/**
 * Adds event listeners to trigger dismissal of splash screen
 * and enabling of controls on any user input (key/mouse)
 * @param { LockedControls } [controls] object containing controls
 */
export function tellPageLoaded(controls) {
	const go = () => {
		playAudio('background', 3);
		dom.splash.classList.add('no-opacity');
		dom.splash.addEventListener('transitionend', () => {
			dom.splash.classList.add('hidden');
		});
		if (controls) {
			const controlRef = controls;
			controlRef.API.enabled = true;
		}
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
	dom.loadedMessage = document.querySelector('.loaded-message');
	dom.longLoadingMessage = document.querySelector('.long-loading-message');
} /* init */

document.addEventListener('DOMContentLoaded', init);
