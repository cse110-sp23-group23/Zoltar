import { produceRandomNumbers, produceFortuneFromArr } from '../fortunes.js';
import { convertArrToReadableString } from '../ticket.js';

const OPEN = 1;
const CLOSE = 0;
const AUDIO_LOW = 0.3;

let domContent = {};
let backgroundmp3;
let thundermp3;
let responses;
let muteAudio;
let disableZoltar = false;
let muteBackgroundAudio = true;
let ticketOnScreen = false;

export function isTicketOnScreen() {
	return ticketOnScreen;
}
/**
 * Shakes document body
 * @param none
 */
function shakeScreen() {
	domContent.body.classList.add('shake');
} /* shakeZoltar */

/**
 * Slides ticket onto screen
 * @param none
 */
function displayTicket() {
	domContent.ticket.classList.add('visible');
} /* displayTicket */

function displayTicketPrompt() {
	domContent.storeTicketPrompt.style.display = 'inline';
}

/**
 * Removes ticket from screen and allows Zoltar to pressed again
 * @param none
 */
function closeTicket() {
	domContent.body.classList.remove('shake');
	domContent.ticket.classList.remove('visible');
	displayTicketPrompt();
} /* closeTicket */

function removeTicketPrompt() {
	domContent.storeTicketPrompt.style.display = 'none';
	disableZoltar = false;
	ticketOnScreen = false;
}

function storeButtonHandler(id) {
	if (id === 'saveTicket') {
		// TODO: ADD TICKET TO LOCAL STORAGE
	}
	removeTicketPrompt();
}

/**
 * Gets List of responses from Json file
 * @param none
 */
async function getResponses() {
	fetch('assets/json/responses.json')
		.then((response) => response.json())
		.then((json) => { responses = json; });
} /* getResponses */

/**
 * Assigns fortune and lucky numbers to the ticket
 * @param none
 */
function assignTicketContent() {
	domContent.fortuneOutput.textContent = produceFortuneFromArr(responses.fortunes);
	domContent.fortuneNumber.textContent = `Your lucky numbers are: ${convertArrToReadableString(produceRandomNumbers(4, 1, 100))}`;
} /* assignTicketContent */

/**
 * When called with OPEN, plays thunder, shakes Zoltar, and displays the ticket and disables
 * Zoltar to prevent new tickets reappearing
 * WHen called with CLOSE, simply closes the ticket.
 * @param {boolean} action CLOSE = 0, OPEN = 1
 */
function ticketHandler(action) {
	if (action) {
		if (thundermp3) thundermp3.play();
		shakeScreen();
		assignTicketContent();
		disableZoltar = true;
		setTimeout(() => {
			displayTicket();
		}, 1300);
		ticketOnScreen = true;
	} else if (ticketOnScreen) {
		displayTicketPrompt();
		closeTicket();
	}
} /* ticketHandler */

/**
 * Toggles muteAudio and volume icons when called. Sets muteAudio to localStorage so that
 * setting is persistent between page loads.
 * @param none
 */
function toggleAudio() {
	muteAudio = !muteAudio;
	localStorage.setItem('MuteAudio', muteAudio);
	backgroundmp3.volume = muteAudio ? 0 : AUDIO_LOW;
	thundermp3.volume = muteAudio ? 0 : AUDIO_LOW;

	domContent.volumeOn.style.display = muteAudio ? 'none' : 'inline';
	domContent.volumeOff.style.display = muteAudio ? 'inline' : 'none';
} /* toggleAudio */

/**
 * Zoltar image event Listener.
 * Disabled when ticket is already displayed
 * Thunder is played when Zoltar shakes, then a
 * ticket pops up.
 */
function zoltarHandler() {
	if (disableZoltar) {
		ticketHandler(CLOSE);
	} else {
		ticketHandler(OPEN);
	}
}

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

/**
 * Gets Background audio
 * Gets thunderAudio
 * @param none
 */
function getAudio() {
	if (!localStorage.getItem('MuteAudio')) {
		localStorage.setItem('MuteAudio', false);
		muteAudio = false;
	} else {
		muteAudio = localStorage.getItem('MuteAudio');
	}

	(muteAudio ? domContent.volumeOff : domContent.volumeOn).style.display = 'inline';

	backgroundmp3 = new Audio('assets/audio/background.wav');
	backgroundmp3.loop = true;
	backgroundmp3.muted = true;
	backgroundmp3.volume = muteAudio ? 0 : AUDIO_LOW;

	thundermp3 = new Audio('assets/audio/thunder2d.wav');
	thundermp3.volume = muteAudio ? 0 : AUDIO_LOW;
} /* getAudio */

function createStoreButtonListener(array) {
	array.forEach((button) => {
		button.addEventListener('click', (e) => {
			e.preventDefault();
			storeButtonHandler(button.id);
			removeTicketPrompt();
			ticketOnScreen = false;
		});
	});
}

function init() {
	domContent = {
		body: document.querySelector('body'),
		fortuneOutput: document.querySelector('#fortune-output'),
		ticket: document.querySelector('#mainTicket'),
		zoltar: document.querySelector('#zoltar-image'),
		ticketX: document.getElementById('closeTicket'),
		fortuneNumber: document.querySelector('#fortune-number'),
		splash: document.querySelector('#splash-screen'),
		volumeControl: document.querySelector('.volume-controls'),
		volumeOn: document.querySelector('#volumeOn'),
		volumeOff: document.querySelector('#volumeOff'),
		storeTicketPrompt: document.querySelector('#storeTicketPrompt'),
		storeButton: document.querySelectorAll('.storeButton'),
	};
	domContent.splash.style.display = 'none';
	getResponses();
	getAudio();
	domContent.volumeControl.addEventListener('click', toggleAudio);
	domContent.zoltar.addEventListener('click', zoltarHandler);
	domContent.ticketX.addEventListener('click', () => { ticketHandler(CLOSE); });
	createStoreButtonListener(domContent.storeButton);
}

document.addEventListener('DOMContentLoaded', init);
document.addEventListener('click', () => {
	if (muteBackgroundAudio) {
		backgroundmp3.play();
		backgroundmp3.muted = false;
		muteBackgroundAudio = false;
	}
});
