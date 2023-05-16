document.addEventListener('DOMContentLoaded', init);

let backgroundSource;

/**
 * Starts background noise, fading in over 5 seconds
 * @param none
 */
function playBackgroundNoise() {
	backgroundSource.start();
}

function init() {
	// background noise setup
	const audioContext = new window.AudioContext();
	backgroundSource = audioContext.createBufferSource();
	const gainNode = audioContext.createGain();
	backgroundSource.connect(gainNode);
	gainNode.connect(audioContext.destination);

	fetch('./assets/audio/background.wav')
    .then((response) => response.arrayBuffer())
    .then((data) => audioContext.decodeAudioData(data))
    .then((buffer) => {
		backgroundSource.buffer = buffer;
		backgroundSource.loop = true;
		gainNode.gain.setValueAtTime(0.0001, audioContext.currentTime);
		gainNode.gain.exponentialRampToValueAtTime(1, audioContext.currentTime + 5);
    });
}

export { playBackgroundNoise };