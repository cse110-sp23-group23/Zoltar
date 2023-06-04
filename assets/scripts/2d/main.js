import { produceFortune, produceRandomNumbers } from '../fortunes.js';
import { convertArrToReadableString } from '../ticket.js';

const fortuneOutput = document.querySelector('#fortune-output');
const ticket = document.querySelector('#ticket');
const zoltar = document.querySelector('#zoltar-image');
const eightball = document.querySelector('#eight-ball-image');
const ticketX = document.getElementById('closeTicket');
const fortuneNumber = document.querySelector('#fortune-number');
const splash = document.querySelector('#splash-screen');
const volumeControl = document.querySelector('.volume-controls');
const volumeOn = document.querySelector('#volumeOn');
const volumeOff = document.querySelector('#volumeOff');

const LOADING_DELAY = 2000;
const OPEN = 1;
const CLOSE = 0;

let backgroundmp3;
let thundermp3;
let responses;
let muteAudio;
let disableZoltar = false;

/**
 * Shakes Zoltar
 * @param none
 */
function shakeZoltar() {
	zoltar.classList.add('shake');
}

/**
 * Slides ticket onto screen
 * @param none
 */
function displayTicket() {
	ticket.classList.add('visible');
}

/**
 * Removes ticket from screen and allows Zoltar to pressed again
 * @param none
 */
function closeTicket() {
	zoltar.classList.remove('shake');
	ticket.classList.remove('visible');
	disableZoltar = false;
}

/**
 * Assigns fortune and lucky numbers to the ticket
 * @param none
 */
function assignTicketContent() {
	fortuneOutput.textContent = produceFortune(responses.fortunes);
	fortuneNumber.textContent = `Your lucky numbers are: ${convertArrToReadableString(produceRandomNumbers(4, 1, 100))}`;
}

/**
 * When called with OPEN, plays thunder, shakes Zoltar, and displays the ticket and disables
 * Zoltar to prevent new tickets reappearing
 * WHen called with CLOSE, simply closes the ticket.
 * @param {boolean} action CLOSE = 0, OPEN = 1
 */
function ticketHandler(action) {
	if (action) {
		thundermp3.play();
		shakeZoltar();
		assignTicketContent();
		disableZoltar = true;
		setTimeout(() => {
			displayTicket();
		}, 1300);
	} else {
		closeTicket();
	}
}

/**
 * Toggles muteAudio and volume icons when called. Sets muteAudio to localStorage so that
 * setting is persistent between page loads.
 * @param none
 */
function toggleAudio() {
	if (muteAudio) {
		backgroundmp3.volume = 0.4;
		thundermp3.volume = 0.5;
		volumeOn.style.display = 'inline';
		volumeOff.style.display = 'none';
	} else {
		backgroundmp3.volume = 0;
		thundermp3.volume = 0;
		volumeOn.style.display = 'none';
		volumeOff.style.display = 'inline';
	}
	muteAudio = !muteAudio;
	localStorage.setItem('MuteAudio', muteAudio);
}

/**
 * Zoltar image event Listener.
 * Disabled when ticket is already displayed
 * Thunder is played when Zoltar shakes, then a
 * ticket pops up.
 */
zoltar.addEventListener('click', (e) => {
	e.preventDefault();
	if (disableZoltar) {
		ticketHandler(CLOSE);
	} else {
		ticketHandler(OPEN);
	}
});

/**
 * Closes the ticket through the X on the ticket
 */
ticketX.addEventListener('click', () => {
	ticketHandler(CLOSE);
});

/**
 * Closes the ticket when 'esc' is pressed
 */
document.addEventListener('keydown', (event) => {
	if (event.key === 'Escape') {
		ticketHandler(CLOSE);
	} else if (event.key === ' ') {
		if (disableZoltar) {
			ticketHandler(CLOSE);
		} else {
			ticketHandler(OPEN);
		}
	}
});

volumeControl.addEventListener('click', () => {
	toggleAudio();
});

/**
 * Clicking on the 8-ball goes to 8-ball project
 */
eightball.addEventListener('click', () => {
	window.location = ('https://cse110-sp23-group23.github.io/cse110-sp23-group23/source/8ball/');
});

/**
 * Gets List of responses from Json file
 * @param none
 */
async function getResponses() {
	fetch('assets/json/responses.json')
		.then((response) => response.json())
		.then((json) => { responses = json; });
}

/**
 * Gets Background audio
 * Gets thunderAudio
 * @param none
 */
function getAudio() {
	backgroundmp3 = new Audio('assets/audio/background.wav');
	backgroundmp3.loop = true;
	backgroundmp3.muted = true;
	backgroundmp3.volume = muteAudio ? 0 : 0.4;
	setTimeout(() => {
		backgroundmp3.muted = false;
		backgroundmp3.play();	// caught (in promise) DOMException: play() failed because the user didn't interact with the document first. https://goo.gl/xX8pDD
	}, LOADING_DELAY);
	thundermp3 = new Audio('assets/audio/thunder2d.wav');
	thundermp3.volume = muteAudio ? 0 : 0.5;
}

function init() {
	setTimeout(() => {
		splash.style.display = 'none';
	}, LOADING_DELAY);
	if (!(localStorage.getItem('MuteAudio'))) {
		localStorage.setItem('MuteAudio', false);
		muteAudio = false;
	} else {
		muteAudio = localStorage.getItem('MuteAudio');
	}
	(muteAudio ? volumeOff : volumeOn).style.display = 'inline';
	getResponses();
	getAudio();
}
document.addEventListener('DOMContentLoaded', init);
