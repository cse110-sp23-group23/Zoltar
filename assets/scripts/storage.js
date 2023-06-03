let domContent = {};
let currentCards = [];
const state = {
	currentlySelected: 0,
};

/**
 * Clamps value between high and low value, inclusive
 * @param { Integer } value number to be clamped
 * @param { Integer } lo lowest allowed value
 * @param { Integer } hi highest allowed value
 * @return { Integer }
 */
export function clamp(value, lo, hi) {
	if (value < lo) {
		return lo;
	}
	return value > hi ? hi : value;
} /* clamp */

/**
 * Returns if history is currently displayed
 * @param none
 * @return { Boolean }
 */
function isHistoryOpen() {
	return !domContent.historyWrapper.classList.contains('hidden');
} /* isHistoryOpen */

/**
 * Hide history from screen, close cover, and reset environment
 * @param none
 */
function exitHistory() {
	domContent.cover.classList.add('hidden');
	domContent.historyWrapper.classList.add('hidden');
	domContent.circleButton.classList.remove('hidden');
} /* exitHistory */

/**
 * Fetches and returns array of ticket objects
 * @param none
 * @return { Array<Object> } list of tickets in object form
 */
export function getAllTickets() {
	return JSON.parse(window.localStorage.getItem('tickets')) || [];
} /* getAllTickets */

/**
 * Prints new count of tickets to the screen and edits ticket selector values
 * @param { Integer } count (optional) number of tickets to show
 */
function updateCounts(count) {
	domContent.inputCounter.innerText = currentCards.length;
	let dispCount;
	if (count === undefined) {
		dispCount = currentCards.length;
	} else {
		dispCount = count;
	}
	domContent.ticketCounter.innerText = dispCount;
	domContent.inputField.value = state.currentlySelected + 1;
} /* updateCounts */

/**
 * Saves state of ticket to localStorage
 * @param { Object } ticket state of ticket
 * @return { boolean } success status; false if too many tickets
 */
export function saveState(ticketState) {
	const storageContent = getAllTickets();
	if (storageContent.length >= 99) {
		return false;
	}
	storageContent.push(ticketState);
	window.localStorage.setItem('tickets', JSON.stringify(storageContent));
	updateCounts(storageContent.length);
	return true;
} /* saveState */

/**
 * Saves all current tickets in user history to local storage
 * @param { Array<State> } currentStates array of all states to save
 */
function saveAllStates(currentStates) {
	window.localStorage.setItem('tickets', JSON.stringify(currentStates));
} /* saveAllStates */

/**
 * Positions cards on screen relative to currently selected card
 * @param none
 */
function translateCards() {
	currentCards.forEach((card, i) => {
		const distance = i - state.currentlySelected;
		const geoSumDistance = (distance < 0 ? -1 : 1) * 300 * (1 - 0.9 ** Math.abs(distance));
		const scaleFactor = 0.9 ** Math.abs(distance);
		const cardMod = card;
		cardMod.style.transform = `translate(calc(${geoSumDistance}vw - 50%), -50%) scale(${scaleFactor})`;
	});
} /* translateCards */

/**
 * Deletes a specified card from history and local storage
 * @param { Object<Card> } card card to remove from storage
 */
export function deleteCard(card) {
	const index = currentCards.indexOf(card);
	if (index === -1) {
		return;
	}
	domContent.ticketHistory.removeChild(card);
	currentCards.splice(index, 1);
	const newStates = getAllTickets();
	newStates.splice(index, 1);
	saveAllStates(newStates);
	if (currentCards.length === 0) {
		state.currentlySelected = 0;
	} else {
		state.currentlySelected = clamp(state.currentlySelected, 0, currentCards.length - 1);
	}
	updateCounts();
	translateCards();
	if (currentCards.length === 0) {
		exitHistory();
	}
} /* deleteCard */

/**
 * Adds a hover event listener to every ticket to display popup buttons
 * @param none
 */
function registerHoverListeners() {
	currentCards.forEach((card) => {
		card.addEventListener('mouseover', card.showCardButtonOverlay);
		card.addEventListener('mouseout', card.hideCardButtonOverlay);
	});
} /* registerHoverListeners */

/**
 * Removes all listeners registered by registerHoverListeners()
 * @param none
 */
function unregisterHoverListeners() {
	currentCards.forEach((card) => {
		card.removeEventListener('mouseover', card.showCardButtonOverlay);
		card.removeEventListener('mouseout', card.hideCardButtonOverlay);
	});
} /* unregisterHoverListeners */

/**
 * Fetches and displays list of saved tickets
 * @param none
 */
function displayStorage() {
	const allTickets = getAllTickets();
	if (allTickets.length === 0) {
		return;
	}
	domContent.cover.classList.remove('hidden');
	domContent.historyWrapper.classList.remove('hidden');
	domContent.circleButton.classList.add('hidden');
	if (currentCards.length !== allTickets.length) {
		unregisterHoverListeners();
		currentCards = [];
		allTickets.forEach((ticket) => {
			const card = document.createElement('historical-ticket');
			card.content = ticket;
			currentCards.push(card);
		});
		domContent.ticketHistory.replaceChildren(...currentCards);
	}
	currentCards[state.currentlySelected].selected = true;
	domContent.inputCounter.innerText = currentCards.length;
	registerHoverListeners();
	translateCards();
} /* displayStorage */

/**
 * Returns index offset by value of dir, clamped to ends of array
 * @param { Integer } curIndex
 * @param { Integer } dir -1 for left, 1 right for
 * @return { Integer } next index selected
 */
function getNextSelected(curIndex, dir) {
	return clamp(curIndex + dir, 0, currentCards.length - 1);
} /* getNextSelected */

/**
 * Animates movement of cards either left or right
 * @param { integer } dir direction of movement, -1 is left, 1 is right
 */
function slide(dir) {
	state.currentlySelected = getNextSelected(state.currentlySelected, dir);
	domContent.inputField.value = state.currentlySelected + 1;
	translateCards();
} /* slide */

/**
 * Fetch and react to user input from text field to move to corresponding card
 * @param none
 */
function updateSliderFromInput() {
	const input = domContent.inputField;
	input.value = clamp(input.value, 1, currentCards.length);
	state.currentlySelected = input.value - 1;
	translateCards();
} /* updateSliderFromInput */

/**
 * Determines and takes appropriate action during keypress, attached to
 * event listener
 * @param { Event } event - event object passed in
 */
function keyHandler(event) {
	if (event.key === 'ArrowLeft' || event.key === 'a') {
		slide(-1);
	} else if (event.key === 'ArrowRight' || event.key === 'd') {
		slide(1);
	} else if (event.key === 'Escape' && isHistoryOpen()) {
		exitHistory();
	}
} /* keyHandler */

function init() {
	domContent = {
		ticketCounter: document.getElementById('ticket-count'),
		circleButton: document.querySelector('.count-tickets-circle'),
		cover: document.querySelector('.cover'),
		ticketHistory: document.querySelector('.ticket-history'),
		leftButton: document.querySelector('#left-button'),
		rightButton: document.querySelector('#right-button'),
		inputField: document.querySelector('#ticket-history-input'),
		inputCounter: document.querySelector('#ticket-history-total'),
		exitHistoryButton: document.querySelector('#close-history'),
		historyWrapper: document.querySelector('.history-wrapper'),
	};

	domContent.circleButton.addEventListener('click', displayStorage);
	domContent.leftButton.addEventListener('click', () => { slide(-1); });
	domContent.rightButton.addEventListener('click', () => { slide(1); });
	domContent.inputField.addEventListener('change', updateSliderFromInput);
	domContent.exitHistoryButton.addEventListener('click', exitHistory);
	window.addEventListener('keydown', keyHandler);

	updateCounts(getAllTickets().length);
} /* init */

window.addEventListener('DOMContentLoaded', init);
