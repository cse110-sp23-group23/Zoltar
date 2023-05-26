let domContent = {};
let currentCards = [];
const state = {
	currentlySelected: 0,
};

/**
 * Returns if history is currently displayed
 * @param none
 * @return { Boolean }
 */
function isHistoryOpen() {
	return !domContent.ticketHistory.classList.contains('hidden');
}

/**
 * Fetches and returns array of ticket objects
 * @param none
 * @return { Array<Object> } list of tickets in object form
 */
function getAllTickets() {
	return JSON.parse(window.localStorage.getItem('tickets')) || [];
} /* getAllTickets */

/**
 * Prints new count of tickets to the screen
 * @param { Integer } count number of tickets to show
 */
function updateCounts(count) {
	domContent.ticketCounter.innerText = count;
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
 * Positions cards on screen relative to currently selected card
 * @param none
 */
function translateCards() {
	currentCards.forEach((card, i) => {
		const distance = i - state.currentlySelected;
		const geoSumDistance = (distance < 0 ? -1 : 1) * 300 * (1 - 0.9**Math.abs(distance));
		const scaleFactor = 0.9**Math.abs(distance);
		const cardMod = card;
		cardMod.style.transform = `translate(calc(${geoSumDistance}vw - 50%), -50%) scale(${scaleFactor})`;
	});
} /* translateCards */

/**
 * Fetches and displays list of saved tickets
 * @param none
 */
function displayStorage() {
	domContent.cover.classList.remove('hidden');
	domContent.ticketHistory.classList.remove('hidden');
	domContent.exitHistoryButton.classList.remove('hidden');
	domContent.ticketHistoryControls.classList.remove('hidden');
	if (currentCards.length < getAllTickets().length) {
		currentCards = [];
		getAllTickets().forEach((ticket) => {
			const card = document.createElement('historical-ticket');
			card.content = ticket;
			currentCards.push(card);
		});
		domContent.ticketHistory.replaceChildren(...currentCards);
	}
	currentCards[state.currentlySelected].selected = true;
	domContent.inputCounter.innerText = currentCards.length;
	translateCards();
} /* displayStorage */

/**
 * Clamps value between high and low value, inclusive
 * @param { Integer } value number to be clamped
 * @param { Integer } lo lowest allowed value
 * @param { Integer } hi highest allowed value
 * @return { Integer }
 */
function clamp(value, lo, hi) {
	if (value < lo) {
		return lo;
	}
	return value > hi ? hi : value;
} /* clamp */

/**
 * Returns index offset by value of dir, clamped to ends of array
 * @param { Integer } curIndex
 * @param { Integer } dir -1 for left, 1 right for
 * @return { Integer } next index selected
 */
function getNextSelected(curIndex, dir) {
	return clamp(curIndex + dir, 0, currentCards.length - 1);
}

/**
 * Animates movement of cards either left or right
 * @param { integer } dir direction of movement, -1 is left, 1 is right
 */
function slide(dir) {
	state.currentlySelected = getNextSelected(state.currentlySelected, dir);
	domContent.inputField.value = state.currentlySelected + 1;
	translateCards();
}

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
 * Hide history from screen, close cover, and reset environment
 * @param none
 */
function exitHistory() {
	domContent.cover.classList.add('hidden');
	domContent.ticketHistory.classList.add('hidden');
	domContent.exitHistoryButton.classList.add('hidden');
	domContent.ticketHistoryControls.classList.add('hidden');
} /* exitHistory */

function init() {
	domContent = {
		ticketCounter: document.getElementById('ticket-count'),
		circleButton: document.querySelector('.count-tickets-circle'),
		cover: document.querySelector('.cover'),
		ticketHistory: document.querySelector('.ticket-history'),
		ticketHistoryControls: document.querySelector('.ticket-history-controls'),
		leftButton: document.querySelector('#left-button'),
		rightButton: document.querySelector('#right-button'),
		inputField: document.querySelector('#ticket-history-input'),
		inputCounter: document.querySelector('#ticket-history-total'),
		exitHistoryButton: document.querySelector('#close-history'),
	};

	updateCounts(getAllTickets().length);

	domContent.circleButton.addEventListener('click', displayStorage);
	domContent.leftButton.addEventListener('click', () => { slide(-1); });
	domContent.rightButton.addEventListener('click', () => { slide(1); });

	window.addEventListener('keydown', (event) => {
		if (event.key === 'ArrowLeft' || event.key === 'a') {
			slide(-1);
		} else if (event.key === 'ArrowRight' || event.key === 'd') {
			slide(1);
		} else if (event.key === 'Escape' && isHistoryOpen()) {
			exitHistory();
		}
	});

	domContent.inputField.addEventListener('change', updateSliderFromInput);

	domContent.exitHistoryButton.addEventListener('click', exitHistory);
}
window.addEventListener('DOMContentLoaded', init);
