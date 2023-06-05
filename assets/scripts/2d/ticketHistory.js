import { getAllTickets } from '../storage.js';
import { clamp } from '../util.js';

const OPEN = 1;
const CLOSE = 0;
const TOP_INDEX = 900;

let historyOnScreen = false;
let count = 0;
let currentCards = [];
let domContent = {};
let selectedCard = 0;

/**
 * Position cards on screen relative to currently selected card
 * @param none
 */
function translateCards() {
	currentCards.forEach((card, i) => {
		const distance = i - selectedCard;
		const geoSumDistance = (distance < 0 ? -1 : 1) * 300 * (1 - 0.9 ** Math.abs(distance));
		const scaleFactor = 0.9 ** Math.abs(distance);
		const cardMod = card;

		cardMod.position = `translate(calc(${geoSumDistance}vw - 50%), -50%) scale(${scaleFactor})`;
		cardMod.zIndex = TOP_INDEX - Math.abs(distance);
	});
}
/**
 * Displays the tickets from local storage
 * @param none
 */
function displayStorage() {
	currentCards.forEach((card) => {
		domContent.ticketHistoryTickets.append(card);
	});

	translateCards();
} /* displayStorage */

/**
 * Updates the counter between the arrow buttons on the ticket history screen
 * @param {number} position card position
 */

function updateCounterSpan(position) {
	domContent.currentCardPosition.innerText = `${position + 1} / ${count}`;
} /* updateCounterSpan */
/**
 * Slides the Cards left or right
 * @param {number} dir -1 or 1
 */
function slide(dir) {
	selectedCard = clamp(selectedCard + dir, 0, currentCards.length - 1);
	translateCards();
	updateCounterSpan(selectedCard);
} /* slide */

/**
 * Returns whether or not the tickets are on screen
 * @returns boolean
 */
export function isHistoryOnScreen() {
	return historyOnScreen;
} /* isHistoryOnScreen */

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
} /* toggleItems */

/**
 * Gets all the tickets from storage and displays them
 * STILL WORKING ON THIS -Marc
 * @param none
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
			currentImageFront: ticket.currentImageFront,
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
		leftButton: document.querySelector('.left'),
		rightButton: document.querySelector('.right'),
		currentCardPosition: document.querySelector('#currentCardPosition'),
	};

	domContent.historyCircleButton.addEventListener('click', historyCircleButtonFunc);
	domContent.historyCloseButton.addEventListener('click', () => { toggleItems(CLOSE); });
	domContent.leftButton.addEventListener('click', () => { slide(-1); });
	domContent.rightButton.addEventListener('click', () => { slide(1); });

	count = getAllTickets().length;
	domContent.ticketHistoryCount.innerText = count;
	updateCounterSpan(0);
}

window.addEventListener('DOMContentLoaded', init);
