import { getAllTickets } from '../storage.js';

const OPEN = 1;
const CLOSE = 0;

let historyOnScreen = false;
let count = 0;
let currentCards = [];
let domContent = {};

/**
 * Position cards on screen relative to currently selected card
 * @param none
 * STILL WORKING ON THIS -Marc
 */
function translateCards() {
	currentCards.forEach((card, i) => {
		const distance = i - 0;
		const geoSumDistance = (distance < 0 ? -1 : 1) * 20 * (1 - 0.9 ** Math.abs(distance));
		const scaleFactor = 0.9 ** Math.abs(distance);
		const cardMod = card;
		cardMod.style.transform = `translate(calc(${geoSumDistance}vw - 50%), -50%) scale(${scaleFactor})`;
	});

	// ticketHistoryTickets.style.left = '50%';
	// ticketHistoryTickets.style.transform = 'translateX(-50%)';
}

/**
 * displays the saved tickets.
 * STILL WORKING ON THIS -Marc
 */
function displayStorage() {
	currentCards.forEach((card) => {
		domContent.ticketHistoryTickets.append(card);
	});

	translateCards();
}

/**
 * Toggles items display properties
 * @param {boolean} action OPEN to display, CLOSE to hide
 */
function toggleItems(action) {
	const items = [
		domContent.ticketHistoryBackground,
		domContent.arrowButtons,
		domContent.historyCloseButton];

	items.forEach((tag) => {
		const asset = tag;
		if (action) {
			asset.style.display = 'inline';
		} else {
			asset.style.display = 'none';
		}
	});

	if (historyOnScreen) {
		domContent.ticketHistoryTickets.innerHTML = '';
		historyOnScreen = false;
	}
}

/**
 * Gets all the tickets from storage and displays them
 * STILL WORKING ON THIS -Marc
 */
function historyCircleButtonFunc() {
	if (historyOnScreen) {
		toggleItems(CLOSE);
		return;
	}
	toggleItems(OPEN);
	currentCards = [];
	const allTickets = getAllTickets();
	count = allTickets.length;

	if (allTickets.length === 0) {
		return;
	}

	allTickets.forEach((ticket) => {
		const card = document.createElement('saved-ticket');
		const state = {
			currentMessage: ticket.currentMessage,
			currentNumbers: ticket.currentNumbers,
		};

		card.content = state;
		currentCards.push(card);
	});
	displayStorage();
	historyOnScreen = true;
}

function init() {
	domContent = {
		historyCircleButton: document.querySelector('#ticketHistoryCircle'),
		ticketHistoryCount: document.querySelector('#ticketHistoryCount'),
		ticketHistoryTickets: document.querySelector('#ticketHistoryTickets'),
		ticketHistoryBackground: document.querySelector('.ticketHistoryBackground'),
		arrowButtons: document.querySelector('.historyArrowButtons'),
		historyCloseButton: document.querySelector('#closeHistory'),
	};

	domContent.historyCircleButton.addEventListener('click', historyCircleButtonFunc());
	domContent.historyCloseButton.addEventListener('click', toggleItems(CLOSE));

	count = getAllTickets().length;
	domContent.ticketHistoryCount.innerText = count;
}

window.addEventListener('DOMContentLoaded', init);
