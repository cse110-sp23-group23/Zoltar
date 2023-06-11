let muted = false;

let gainNode;
let backgroundSource;
let audioContext;

const SOURCES = {
	thunder: 'assets/audio/rumble.mp3',
	background: 'assets/audio/background.wav',
};

/**
 * Starts background noise, fading in over 5 seconds
 * @param none
 */
export function playBackgroundNoise() {
	if (!muted) {
		gainNode.gain.setValueAtTime(0, audioContext.currentTime);
		gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 3);
	}
	backgroundSource.start();
} /* playBackgroundNoise */

/**
 * Plays rumbling noise
 * @param none
 */
export function playRumbleNoise() {
	const thunder = new Audio(SOURCES.thunder);
	thunder.play();
} /* playRumbleNoise */

/**
 * Mutes all audio elements
 * @param none
 */
export function mute() {
	muted = true;
	gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);
} /* mute */

/**
 * Unmutes all audio elements
 * @param none
 */
export function unmute() {
	muted = false;
	gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.5);
} /* unmute */

function init() {
	// background noise setup
	audioContext = new window.AudioContext();
	backgroundSource = audioContext.createBufferSource();
	gainNode = audioContext.createGain();
	gainNode.gain.setValueAtTime(0, audioContext.currentTime);
	backgroundSource.connect(gainNode);
	gainNode.connect(audioContext.destination);

	fetch(SOURCES.background)
		.then((response) => response.arrayBuffer())
		.then((data) => audioContext.decodeAudioData(data))
		.then((buffer) => {
			backgroundSource.buffer = buffer;
			backgroundSource.loop = true;
		});
} /* init */

document.addEventListener('DOMContentLoaded', init);
