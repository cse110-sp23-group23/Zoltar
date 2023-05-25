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

let backgroundmp3, thundermp3;
let responses;

let disableZoltar = false;

function init() {
	setTimeout(() => {
		splash.style.display = `none`;
	}, 2000);
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
	thundermp3.play();
	e.preventDefault();

	if (disableZoltar) return;

	ticketHandler();
});


/**
 * Closes the ticket through the X on the ticket
 */
ticketX.addEventListener('click', () => {
	closeTicket();
})

/**
 * Closes the ticket when `esc` is pressed
 */
document.addEventListener('keydown', evt => {
	if (evt.key === 'Escape') {
		closeTicket();
	}
});


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
async function getAudio() {
	backgroundmp3 = new Audio('assets/audio/background.wav');
	backgroundmp3.loop = true;
	backgroundmp3.muted = true;
	backgroundmp3.play();
	setTimeout(() => {
		backgroundmp3.muted = false;
	}, 2000);

	thundermp3 = new Audio('assets/audio/thunder2d.wav');
	thundermp3.volume = 0.2;

}

/**
 * Called when a button that invokes Zoltar is pressed.
 * Shakes Zoltar, then displays the ticket after a 1.3s delay.
 */
function ticketHandler() {
	shakeZoltar();
	assignTicketContent();
	disableZoltar = true;

	setTimeout(() => {
		displayTicket();
	}, 1300);
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