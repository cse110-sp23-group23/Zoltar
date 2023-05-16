const ANIMATION_LENGTH_MS = 500;

document.addEventListener('DOMContentLoaded', init);

let ticket = {};

function isTicketCurrentlyDisplayed() {
	return !ticket.main.classList.contains('hidden-animation');
}

function isTicketCurrentlyFlipped() {
	return !ticket.main.classList.contains('ticket-hoverable');
}

function toggleTicketOff() {
	ticket.main.classList.add('hidden-animation');
	ticket.main.classList.remove('ticket-hoverable');
	setTimeout(() => {
		ticket.background.classList.remove('flipped');
		ticket.front.classList.add('flipped');
		ticket.back.classList.remove('flipped');
	}, ANIMATION_LENGTH_MS);
}

window.addEventListener('keydown', (event) => {
	if (event.key === 'Escape' && isTicketCurrentlyDisplayed()
		&& isTicketCurrentlyFlipped()) {
		toggleTicketOff();
	}
});

function toggleTicketOn() {
	ticket.main.classList.remove('hidden-animation');
	setTimeout(() => {
		ticket.main.classList.add('ticket-hoverable');
	}, ANIMATION_LENGTH_MS);
}

function flipTicket() {
	if (isTicketCurrentlyFlipped()) {
		return; 
	}
	ticket.main.classList.remove('ticket-hoverable');
	ticket.background.classList.add('flipped');
	ticket.front.classList.toggle('flipped');
	ticket.back.classList.toggle('flipped');
}

function init() {
	ticket = {
		main: document.querySelector('.ticket-wrapper'),
		background: document.querySelector('.ticket-background'),
		front: document.querySelector('.ticket-front-content'),
		back: document.querySelector('.ticket-back-content'),
		buttonRemove: document.querySelector('#close-ticket'),
	};

	ticket.main.addEventListener('click', flipTicket);
	ticket.buttonRemove.addEventListener('click', toggleTicketOff);
}

export { isTicketCurrentlyDisplayed, isTicketCurrentlyFlipped, toggleTicketOn };