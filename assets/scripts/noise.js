let muted = false;
let currentlyPlayingVoice = false;

const AUDIO_PATHS = {
	background: {
		path: 'assets/audio/background.wav',
		loop: true,
		defaultVolume: 0.1,
	},
	rumble: {
		path: 'assets/audio/rumble.mp3',
		loop: false,
		defaultVolume: 1,
	},
}; // voice_lines automatically populated from below

const VOICE_LINES = {
	number: 28,
	range: [1, 10],
};

const context = new window.AudioContext();
const gainNodes = {}; // auto populated
const buffers = {}; // auto populated

/**
 * Plays audio corresponding to passed name, muted if appropriate
 * @param { String } name name of audio to play, must be in AUDIO_PATHS object with defined path
 * @param { Double } rampTime time delta until ramp should be completed
 */
export function playAudio(name, rampTime = 0) {
	if (!AUDIO_PATHS[name] || currentlyPlayingVoice) return;

	const source = context.createBufferSource();
	source.buffer = buffers[name];
	source.loop = AUDIO_PATHS[name].loop;
	source.connect(gainNodes[name]);

	if (!muted) {
		gainNodes[name].gain.setValueAtTime(0, context.currentTime);
		gainNodes[name].gain.linearRampToValueAtTime(AUDIO_PATHS[name].defaultVolume, context.currentTime + rampTime);
	}
	source.start();

	if (name.includes('voiceLine')) currentlyPlayingVoice = true;
	if (name.includes('voiceLine')) source.onended = () => { currentlyPlayingVoice = false; };
} /* playAudio */

/**
 * Mutes all audio elements
 * @param none
 */
export function mute() {
	muted = true;
	Object.values(gainNodes).forEach((node) => {
		node.gain.linearRampToValueAtTime(0, context.currentTime + 0.5);
	});
} /* mute */

/**
 * Unmutes all audio elements
 * @param none
 */
export function unmute() {
	muted = false;
	Object.entries(gainNodes).forEach(([key, node]) => {
		node.gain.linearRampToValueAtTime(AUDIO_PATHS[key].defaultVolume, context.currentTime + 0.5);
	});
} /* unmute */

/**
 * Plays a random voice line from list of all options
 * @param none
 */
export function playRandomVoiceLine() {
	const randIndex = (Math.floor(Math.random() * VOICE_LINES.number)) + 1;
	playAudio(`voiceLine${randIndex}`, 0.3);
} /* playRandomVoiceLine */

// populates all voice lines into AUDIO_PATHS automatically
for (let i = 1; i <= VOICE_LINES.number; i += 1) {
	AUDIO_PATHS[`voiceLine${i}`] = {
		path: `assets/audio/zoltar-voice-lines/zoltar-voice-${i}.mp3`,
		loop: false,
		defaultVolume: 1,
	};
}

// loads all audio assets automatically, populating from AUDIO_PATHS object
Object.entries(AUDIO_PATHS).forEach(([key, value]) => {
	gainNodes[key] = context.createGain();
	gainNodes[key].gain.setValueAtTime(0, context.currentTime);
	gainNodes[key].connect(context.destination);
	fetch(value.path)
		.then((response) => response.arrayBuffer())
		.then((data) => context.decodeAudioData(data))
		.then((buffer) => {
			buffers[key] = buffer;
		});
});
