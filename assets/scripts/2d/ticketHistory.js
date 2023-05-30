import { getAllTickets } from "../storage.js";
import { convertArrToReadableString } from "../ticket.js";
import { test } from './SavedTicket.js';

const historyCircleButton = document.querySelector('#ticketHistoryCircle');
const ticketHistoryCount = document.querySelector('#ticketHistoryCount');
const ticketHistoryTickets = document.querySelector('#ticketHistoryTickets');
let currentCards = [];
let count = 0;

historyCircleButton.addEventListener('click', () => {
    // test();
	console.log('hello');

	const allTickets = getAllTickets();
	count = allTickets.length;

	if (allTickets.length === 0) {
		return;
	}

	let state = {
		currentMessage: allTickets[0].currentMessage,
		currentNumbers: allTickets[0].currentNumbers,
	};

	let card = document.createElement('saved-ticket');
	// card.content = state;

	console.log(card);

	ticketHistoryTickets.append(card);
});

function init() {
	count = getAllTickets().length;
	ticketHistoryCount.innerText = count;
}

window.addEventListener('DOMContentLoaded', init);
