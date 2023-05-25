let domContent = {};
let currentCards = [];
const state = {
	currentlySelected: 0,
};

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
		const geoSumDistance = (distance < 0 ? -1 : 1) * 30 * (1 - Math.pow(0.9, Math.abs(distance))) / (1 - 0.9);
		const scaleFactor = Math.pow(0.9, Math.abs(distance));
		card.style.transform = `translate(calc(${geoSumDistance}vw - 50%), -50%) scale(${scaleFactor})`;
	});
} /* translateCards */

/**
 * Fetches and displays list of saved tickets
 * @param none
 */
function displayStorage() {
	domContent.cover.classList.remove('hidden');
	domContent.ticketHistory.classList.remove('hidden');
	getAllTickets().forEach((ticket) => {
		const card = document.createElement('historical-ticket');
		card.content = ticket;
		domContent.ticketHistory.append(card);
		currentCards.push(card);
	});
	currentCards[state.currentlySelected].selected = true;
	translateCards();
} /* displayStorage */

/**
 * Returns index offset by value of dir, clamped to ends of array
 * @param { Integer } curIndex 
 * @param { Integer } dir -1 for left, 1 right for 
 * @return { Integer } next index selected
 */
function getNextSelected(curIndex, dir) {
	const response = curIndex + dir;
	if (response < 0) {
		return 0;
	} else if (response > currentCards.length - 1) {
		return currentCards.length - 1;
	}
	return response;
}

/**
 * Animates movement of cards either left or right
 * @param { integer } dir direction of movement, -1 is left, 1 is right 
 */
function slide(dir) {
	currentCards[getNextSelected(state.currentlySelected, dir)].selected = true;
	currentCards[state.currentlySelected].selected = false;
	state.currentlySelected = getNextSelected(state.currentlySelected, dir);
	translateCards();
}

window.addEventListener('keydown', (event) => {
	if (event.key === 'ArrowLeft') {
		slide(-1)
	} else if (event.key === 'ArrowRight') {
		slide(1)
	}
});

function init() {
	domContent = {
		ticketCounter: document.getElementById('ticket-count'),
		circleButton: document.querySelector('.count-tickets-circle'),
		cover: document.querySelector('.cover'),
		ticketHistory: document.querySelector('.ticket-history'),
		leftButton: document.querySelector('#left-button'),
		rightButton: document.querySelector('#right-button'),
	}
	updateCounts(getAllTickets().length);
	domContent.circleButton.addEventListener('click', displayStorage);
	domContent.leftButton.addEventListener('click', () => { slide(-1); });
	domContent.rightButton.addEventListener('click', () => { slide(1); });
}
window.addEventListener('DOMContentLoaded', init);
