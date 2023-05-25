import { produceFortune, produceRandomNumbers, convertArrToReadableString } from "../fortunes.js";

document.addEventListener('DOMContentLoaded', init);

const fortuneOutput = document.querySelector(`#fortune-output`);
const imageMap = document.querySelector(`map`);
const ticket = document.querySelector(`#ticket`);
const zoltar = document.querySelector(`#zoltar-image`);
const ticketX = document.getElementById(`closeTicket`);
const fortuneNumber = document.querySelector(`#fortune-number`);
const splash = document.querySelector('#splash-screen');
const loadedMessage = document.querySelector('.loaded-message');
const volumeControl = document.querySelector(`.volume-controls`);
const volumeOn = document.querySelector(`#volumeOn`);
const volumeOff = document.querySelector(`#volumeOff`);


const LOADING_DELAY = 2000;
const OPEN = 1;
const CLOSE = 0;

let backgroundmp3, thundermp3;
let responses;

let muteAudio;
let disableZoltar = false;

function init() {
	setTimeout(() => {
		splash.style.display = `none`;
	}, LOADING_DELAY);

	if (!(localStorage.getItem("MuteAudio"))) {
		localStorage.setItem("MuteAudio", false);
		muteAudio = false;
	} else {
		muteAudio = localStorage.getItem("MuteAudio");
		console.log(muteAudio);
		muteAudio ? volumeOff.style.display = `inline` : volumeOn.style.display = `inline`;
	}

	getResponses();
	getAudio();

}

/**
 * Zoltar image event Listener.
 * Disabled when ticket is already displayed
 * Thunder is played when Zoltar shakes, then a 
 * ticket pops up.
 */
zoltar.addEventListener(`click`, (e) => {
	e.preventDefault();

	disableZoltar ? ticketHandler(CLOSE) : ticketHandler(OPEN);
});


/**
 * Closes the ticket through the X on the ticket
 */
ticketX.addEventListener('click', () => {
	ticketHandler(CLOSE);
})

/**
 * Closes the ticket when `esc` is pressed
 */
document.addEventListener('keydown', evt => {
	if (evt.key === 'Escape') {
		ticketHandler(CLOSE);
	} else if (evt.key === ` `) {
		disableZoltar ? ticketHandler(CLOSE) : ticketHandler(OPEN);
	}

});

volumeControl.addEventListener(`click`, () => {
	toggleAudio();
})


//-------------------Refactored-------------------

/**
 * Gets List of responses from Json file
 */
async function getResponses() {
	fetch('assets/json/responses.json')
		.then((response) => response.json())
		.then((json) => { responses = json; });
}

/**
 * Gets Background audio
 * Gets thunderAudio
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
 * Assigns fortune and lucky numbers to the ticket
 */
function assignTicketContent() {
	fortuneOutput.textContent = produceFortune(responses.fortunes);
	fortuneNumber.textContent = `Your lucky numbers are: ${convertArrToReadableString(produceRandomNumbers(4, 1, 100))}`;
}

/**
 * Removes ticket from screen and allows Zoltar to pressed again
 */
function closeTicket() {
	zoltar.classList.remove(`shake`)
	ticket.classList.remove(`visible`);
	disableZoltar = false;
}

/**
 * Slides ticket onto screen
 */
function displayTicket() {
	ticket.classList.add(`visible`);
}

/**
 * Shakes Zoltar
 */
function shakeZoltar() {
	zoltar.classList.add(`shake`)
}

/**
 * Toggles muteAudio and volume icons when called. Sets muteAudio to localStorage so that 
 * setting is persistent between page loads.
 */
function toggleAudio() {
	if (muteAudio) {
		backgroundmp3.volume = 0.4;
		thundermp3.volume = 0.5;
		volumeOn.style.display = `inline`;
		volumeOff.style.display = `none`;
	} else {
		backgroundmp3.volume = 0;
		thundermp3.volume = 0;
		volumeOn.style.display = `none`;
		volumeOff.style.display = `inline`;
	}

	muteAudio = !muteAudio;
	localStorage.setItem("MuteAudio", muteAudio);
}