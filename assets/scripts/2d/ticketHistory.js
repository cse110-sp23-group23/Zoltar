import { getAllTickets } from '../storage.js';

const historyCircleButton = document.querySelector('#ticketHistoryCircle');
const ticketHistoryCount = document.querySelector('#ticketHistoryCount');
const ticketHistoryTickets = document.querySelector('#ticketHistoryTickets');
const ticketHistoryBackground = document.querySelector('.ticketHistoryBackground');
const arrowButtons = document.querySelector('.historyArrowButtons');

const OPEN = 1;
const CLOSE = 0;

let historyOnScreen = false;
let count = 0;
let currentCards = [];

/**
 * Position cards on screen relative to currently selected card
 * @param none
 * STILL WORKING ON THIS -Marc
 */
function translateCards() {
	currentCards.forEach((card, i) => {
		const distance = i - 1;
		const geoSumDistance = (distance < 0 ? -1 : 1) * 20 * (1 - 0.9 ** Math.abs(distance));
		const scaleFactor = 0.9 ** Math.abs(distance);
		const cardMod = card;
		cardMod.style.transform = `translate(calc(${geoSumDistance}vw - 50%), -50%) scale(${scaleFactor})`;
	});

	ticketHistoryTickets.style.left = '50%';
	ticketHistoryTickets.style.transform = 'translateX(-50%)';
}

/**
 * displays the saved tickets.
 * STILL WORKING ON THIS -Marc
 */
function displayStorage() {
	currentCards.forEach((card) => {
		ticketHistoryTickets.append(card);
	});

	translateCards();
}

/**
 * Toggles items display properties
 * @param {boolean} action OPEN to display, CLOSE to hide
 */
function toggleItems(action) {
	const items = [ticketHistoryBackground, arrowButtons];

	items.forEach((tag) => {
		const asset = tag;
		if (action) {
			asset.style.display = 'inline';
		} else {
			asset.style.display = 'none';
		}
	});
}

/**
 * Gets all the tickets from storage and displays them
 * STILL WORKING ON THIS -Marc
 */
historyCircleButton.addEventListener('click', () => {
	if (historyOnScreen) {
		ticketHistoryTickets.innerHTML = '';
		historyOnScreen = false;
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
});

function init() {
	count = getAllTickets().length;
	ticketHistoryCount.innerText = count;
}

window.addEventListener('DOMContentLoaded', init);
