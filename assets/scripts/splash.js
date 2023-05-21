import { playBackgroundNoise } from './noise.js';

document.addEventListener('DOMContentLoaded', init);

let splash;
let loadedMessage;

/**
 * Adds event listeners to trigger dismissal of splash screen
 * and enabling of controls on any user input (key/mouse)
 * @param {LockedControls} controls object containing controls
 */
export function tellPageLoaded(controls) {
	const go = () => {
		splash.classList.add('hidden');
		controls.enabled = true;
		window.removeEventListener('mousedown', go);
		window.removeEventListener('keydown', go);
		playBackgroundNoise();
	};
	window.addEventListener('mousedown', go);
	window.addEventListener('keydown', go);
	loadedMessage.innerText = '[ press anywhere to continue ]';
} /* tellPageLoaded */

function init() {
	splash = document.querySelector('#splash-screen');
	loadedMessage = document.querySelector('.loaded-message');
}
