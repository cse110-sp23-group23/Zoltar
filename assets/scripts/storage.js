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
} /* displayStorage */

/**
 * Returns index increased by 1, wrapped around end of array
 * @param { Integer } curIndex 
 * @return { Integer } next index selected
 */
function getNextSelected(curIndex) {
	return (curIndex + 1) % currentCards.length;
}

window.addEventListener('keydown', (event) => {
	if (event.key == 'Enter') {
		currentCards[getNextSelected(state.currentlySelected)].selected = true;
		currentCards[state.currentlySelected].selected = false;
		state.currentlySelected = getNextSelected(state.currentlySelected);
	}
});

function init() {
	domContent = {
		ticketCounter: document.getElementById('ticket-count'),
		circleButton: document.querySelector('.count-tickets-circle'),
		cover: document.querySelector('.cover'),
		ticketHistory: document.querySelector('.ticket-history'),
	}
	updateCounts(getAllTickets().length);
	domContent.circleButton.addEventListener('click', displayStorage);
}
window.addEventListener('DOMContentLoaded', init);
