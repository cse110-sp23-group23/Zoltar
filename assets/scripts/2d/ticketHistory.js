import { getAllTickets, saveAllStates } from '../storage.js';
import { clamp } from '../util.js';

const OPEN = 1;
const CLOSE = 0;
const TOP_INDEX = 900;
const ARBITRARY_PIXEL_COUNT = 300;

let historyOnScreen = false;
let count = 0;
let currentCards = [];
let domContent = {};
let selectedCard = 0;

/**
 * Positions ticket history card on screen relative to the main card that
 * is being displayed.
 * @param none
 */
export function translateCards() {
	currentCards.forEach((card, i) => {
		const distance = i - selectedCard;
		const geoSumDistance = (distance < 0 ? -1 : 1) * ARBITRARY_PIXEL_COUNT * (1 - 0.9 ** Math.abs(distance));
		const scaleFactor = 0.9 ** Math.abs(distance);
		const cardMod = card;

		cardMod.position = `translate(calc(${geoSumDistance}vw - 50%), -50%) scale(${scaleFactor})`;
		cardMod.zIndex = TOP_INDEX - Math.abs(distance);
	});
} /* translateCards */

/**
 * Updates the counter between the arrow buttons on the ticket history screen
 * @param {number} position card position
 */
function updateCounterSpan(position) {
	domContent.currentCardPosition.innerText = `${position + 1} / ${currentCards.length}`;
} /* updateCounterSpan */

/**
 * Displays the tickets from local storage
 * @param none
 */
function displayStorage() {
	const allTickets = getAllTickets();
	allTickets.forEach((ticket, i) => {
		const card = document.createElement('saved-ticket');
		const state = {
			currentMessage: ticket.currentMessage,
			currentNumbers: ticket.currentNumbers,
			currentImageFront: ticket.currentImageFront,
			currentImageBack: ticket.currentImageBack,
		};
		card.index = i;
		card.content = state;
		currentCards.push(card);
	});
	currentCards.forEach((card) => {
		domContent.ticketHistoryTickets.append(card);
	});
	updateCounterSpan(selectedCard);
	translateCards();
} /* displayStorage */

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
 * @param none
 * @returns boolean
 */
export function isHistoryOnScreen() {
	return historyOnScreen;
} /* isHistoryOnScreen */

/**
 * updates ticket count on yellow button
 * @param none
 */
export function updateticketHistoryCount() {
	count = getAllTickets().length;
	domContent.ticketHistoryCount.innerText = count;
} /* updateticketHistoryCount */

function shake(asset) {
	asset.classList.add('shake');
	setTimeout(() => {
		asset.classList.remove('shake');
	}, 1000);
}
/**
 * Toggles items display properties
 * @param {boolean} action OPEN to display, CLOSE to hide
 */
function toggleItems(action) {
	const items = [
		domContent.historyWrapper,
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

export function removeCard(card) {
	const index = currentCards.indexOf(card);
	if (index === -1 || index > count) return;
	domContent.ticketHistoryTickets.removeChild(card);
	currentCards.splice(index, 1);
	const newStates = getAllTickets();
	newStates.splice(index, 1);
	saveAllStates(newStates);
	if (currentCards.length === 0) {
		selectedCard = 0;
	} else {
		selectedCard = clamp(selectedCard, 0, currentCards.length - 1);
	}
	translateCards();
	if (currentCards.length === 0) {
		selectedCard = 0;
		toggleItems(CLOSE);
	}
	updateticketHistoryCount();
} /* removeCard */

/**
 * Gets all the tickets from storage and displays them
 * TODO: This function needs some clean up.
 * @param none
 */
function historyCircleButtonFunc() {
	if (historyOnScreen) {
		toggleItems(CLOSE);
		return;
	}
	currentCards = [];
	const allTickets = getAllTickets();
	count = allTickets.length;
	if (allTickets.length === 0) {
		shake(domContent.historyCircleButton);
		return;
	}
	toggleItems(OPEN);
	displayStorage();
	historyOnScreen = true;
} /* historyCircleButtonFunc */

window.addEventListener('keydown', (event) => {
	if (!historyOnScreen) return;
	if (event.key === 'ArrowRight') slide(1);
	if (event.key === 'ArrowLeft') slide(-1);
});

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
		historyWrapper: document.querySelector('.historyWrapper'),
	};

	domContent.historyCircleButton.addEventListener('click', historyCircleButtonFunc);
	domContent.historyCloseButton.addEventListener('click', () => { toggleItems(CLOSE); });
	domContent.leftButton.addEventListener('click', () => { slide(-1); });
	domContent.rightButton.addEventListener('click', () => { slide(1); });

	updateticketHistoryCount();
	updateCounterSpan(0);
}

window.addEventListener('DOMContentLoaded', init);
