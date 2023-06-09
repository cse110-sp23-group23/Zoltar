import { saveState } from './storage.js';
import { slowHideElement, toggleClassToArr, convertArrToReadableString } from './util.js';

const ANIMATION_LENGTH_MS = 500;
const IMAGE_BANK_PREFIX_BACK = 'assets/images/image-bank-back/background-card-';
const IMAGE_BANK_PREFIX_FRONT = 'assets/images/image-bank-front/header-';

let ticket = {};
let buttons = {};
let dom = {};

export const state = {
	currentMessage: '',
	currentNumbers: [],
	currentImageBack: '',
	currentImageFront: '',
};

/**
 * Gets whether or not fortune card is currently on screen
 * @param none
 * @return { boolean }
 */
export function isTicketCurrentlyDisplayed() {
	return !ticket.main.classList.contains('hidden-animation');
} /* isTicketCurrentlyDisplayed */

/**
 * Gets whether or not fortune card is currently displaying rear face
 * @param none
 * @return { boolean }
 */
export function isTicketCurrentlyFlipped() {
	return !ticket.main.classList.contains('ticket-hoverable');
} /* isTicketCurrentlyFlipped */

/**
 * Returns if user is currently looking at the save/discard ticket prompt
 * @param none
 * @return { Boolean }
 */
export function isSaveDiscardVisible() {
	return !buttons.main.classList.contains('hidden');
} /* isSaveDiscardVisible */

/**
 * Slides ticket off screen
 * @param none
 */
function toggleTicketOff() {
	ticket.main.classList.add('hidden-animation');
	ticket.main.classList.remove('ticket-hoverable');
	buttons.main.classList.remove('hidden');
	buttons.cover.classList.remove('hidden');
	setTimeout(() => {
		toggleClassToArr([ticket.background, ticket.front, ticket.back], 'flipped');
	}, ANIMATION_LENGTH_MS);
} /* toggleTicketOff */

/**
 * Slides ticket up from bottom of screen
 * @param none
 */
export function toggleTicketOn() {
	ticket.ticketCount.classList.add('hidden');
	dom.settings.classList.add('hidden');
	ticket.main.classList.remove('hidden-animation');
	setTimeout(() => {
		ticket.main.classList.add('ticket-hoverable');
	}, ANIMATION_LENGTH_MS);
} /* toggleTicketOn */

/**
 * Starting from image face of ticket, flip
 * @param none
 */
function flipTicket() {
	if (isTicketCurrentlyFlipped()) {
		return;
	}
	ticket.main.classList.remove('ticket-hoverable');
	toggleClassToArr([ticket.background, ticket.front, ticket.back], 'flipped');
} /* flipTicket */

/**
 * Hides prompt for user to save or discard ticket
 * @param { Integer } index representing button clicked; 0 for discard, 1 for save
 */
function hideSavePrompt(index) {
	toggleClassToArr([buttons.main, ticket.ticketCount, dom.settings], 'hidden');
	slowHideElement(buttons.cover);
	if (index === 1) {
		saveState(state);
	}
} /* hideSavePrompt */

/**
 * Places current state onto ticket
 * @param none
 */
export function updateTicket() {
	ticket.text.innerText = state.currentMessage;
	ticket.numbers.innerText = convertArrToReadableString(state.currentNumbers);
	ticket.backgroundImage.src = `${IMAGE_BANK_PREFIX_BACK}${state.currentImageBack}.webp`;
	ticket.frontImage.src = `${IMAGE_BANK_PREFIX_FRONT}${state.currentImageFront}.webp`;
} /* updateTicket */

// hide ticket when user hits escape and card currently shown
window.addEventListener('keydown', (event) => {
	if (event.key === 'Escape' && isTicketCurrentlyDisplayed()
		&& isTicketCurrentlyFlipped()) {
		toggleTicketOff();
	}
});

function init() {
	ticket = {
		main: document.querySelector('.ticket-wrapper'),
		background: document.querySelector('.ticket-background'),
		backgroundImage: document.querySelector('.ticket-back-image'),
		frontImage: document.querySelector('.ticket-header-image'),
		front: document.querySelector('.ticket-front-content'),
		back: document.querySelector('.ticket-back-content'),
		buttonRemove: document.querySelector('#close-ticket'),
		text: document.querySelector('#fortune-content'),
		numbers: document.querySelector('#ticket-lucky-numbers'),
		ticketCount: document.querySelector('.count-tickets-icon'),
	};
	buttons = {
		main: document.querySelector('.save-delete-ticket'),
		save: document.getElementById('save-button'),
		discard: document.getElementById('discard-button'),
		cover: document.querySelector('.cover'),
	};
	dom = { settings: document.querySelector('.settings-menu-container') };
	ticket.main.addEventListener('click', flipTicket);
	ticket.buttonRemove.addEventListener('click', toggleTicketOff);
	[buttons.discard, buttons.save].forEach((el, i) => {
		el.addEventListener('click', () => { hideSavePrompt(i); });
	});
}
document.addEventListener('DOMContentLoaded', init);
