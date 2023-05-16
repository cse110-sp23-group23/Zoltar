document.addEventListener('DOMContentLoaded', init);

let backgroundSource;

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

	fetch('/assets/audio/background.wav')
    .then((response) => response.arrayBuffer())
    .then((data) => audioContext.decodeAudioData(data))
    .then((buffer) => {
		backgroundSource.buffer = buffer;
		backgroundSource.loop = true;
		gainNode.gain.setValueAtTime(0, audioContext.currentTime);
		gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + 10);
    });
}

export { playBackgroundNoise };