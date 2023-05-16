const ANIMATION_LENGTH_MS = 500;

document.addEventListener('DOMContentLoaded', init);

let ticket = {};

/**
 * Gets whether or not fortune card is currently on screen
 * @param none
 * @returns { boolean } 
 */
function isTicketCurrentlyDisplayed() {
	return !ticket.main.classList.contains('hidden-animation');
}

/**
 * Gets whether or not fortune card is currently displaying rear face
 * @param none
 * @returns { boolean }
 */
function isTicketCurrentlyFlipped() {
	return !ticket.main.classList.contains('ticket-hoverable');
}

/**
 * Slides ticket off screen
 * @param none
 */
function toggleTicketOff() {
	ticket.main.classList.add('hidden-animation');
	ticket.main.classList.remove('ticket-hoverable');
	setTimeout(() => {
		ticket.background.classList.remove('flipped');
		ticket.front.classList.add('flipped');
		ticket.back.classList.remove('flipped');
	}, ANIMATION_LENGTH_MS);
}

// hide ticket when user hits escape and card currently shown
window.addEventListener('keydown', (event) => {
	if (event.key === 'Escape' && isTicketCurrentlyDisplayed()
		&& isTicketCurrentlyFlipped()) {
		toggleTicketOff();
	}
});

/**
 * Slides ticket up from bottom of screen
 * @param none
 */
function toggleTicketOn() {
	ticket.main.classList.remove('hidden-animation');
	setTimeout(() => {
		ticket.main.classList.add('ticket-hoverable');
	}, ANIMATION_LENGTH_MS);
}

/**
 * Starting from image face of ticket, flip
 * @param none
 */
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