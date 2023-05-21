import { playBackgroundNoise } from './noise.js';

let splash;
let loadedMessage;

/**
 * Adds event listeners to trigger dismissal of splash screen
 * and enabling of controls on any user input (key/mouse)
 * @param { LockedControls } [controls] object containing controls
 */
export function tellPageLoaded(controls) {
	const go = () => {
		playBackgroundNoise();
		splash.classList.add('hidden');
		window.removeEventListener('mousedown', go);
		window.removeEventListener('keydown', go);
		if (controls) {
			const controlRef = controls;
			controlRef.enabled = true;
		}
	};
	window.addEventListener('mousedown', go);
	window.addEventListener('keydown', go);
	loadedMessage.innerText = '[ press anywhere to continue ]';
} /* tellPageLoaded */

function init() {
	splash = document.querySelector('#splash-screen');
	loadedMessage = document.querySelector('.loaded-message');
}
document.addEventListener('DOMContentLoaded', init);
