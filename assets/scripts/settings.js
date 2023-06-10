const VOLUME_SRC_ON = './assets/images/volume-on-icon.webp';
const VOLUME_SRC_OFF = './assets/images/volume-off-icon.webp';
const DEFAULT_SETTINGS = {
	isVolumeOn: true,
};

let dom = {};
let settings = {
	isVolumeOn: true,
};
let state = {
	isTicketDisplayed: false,
	ticketOpened: null,
};

function refreshSettingsMenu() {
	dom.volume.src = settings.isVolumeOn ? VOLUME_SRC_OFF : VOLUME_SRC_ON;
}

function putSettingsLocalStorage() {
	localStorage.setItem('settings', JSON.stringify(settings));
}

function getSettingsLocalStorage() {
	settings = JSON.parse(localStorage.getItem('settings')) || DEFAULT_SETTINGS;
	refreshSettingsMenu();
}

/**
 * Toggles mute on / off and saves state to localStorage
 * @param none
 */
function toggleMute() {
	settings.isVolumeOn = !settings.isVolumeOn;
	putSettingsLocalStorage();
	refreshSettingsMenu();
} /* toggleMute */

/**
 * Opens and closes the settings buttons container
 * @param none
 */
function toggleSettingsContainer() {
	dom.settingsButton.classList.toggle('clicked');
	dom.subSettingsBtn.classList.toggle('settings-opacity');
	dom.subSettingsBtn.classList.toggle('settings-slide-in');
} /* toggleSettingsContainer */

/**
 * Closes every instance of a settings Tickets
 * @param none
 */
function closeAllSettingsTickets() {
	const arr = document.querySelectorAll('.settings-ticket');
	arr.forEach((ticket) => {
		ticket.classList.add('hidden');
	});
	state.isTicketDisplayed = false;
	state.ticketOpened = null;
} /* closeAllSettingsTickets */

/**
 * Displays desired settings ticket
 * @param {Object} ticket settings ticket to open
 */
function displaySettingsTicket(ticket) {
	ticket.classList.remove('hidden');
	state.isTicketDisplayed = true;
	state.ticketOpened = ticket;
} /* displaySettingsTicket */

/**
 * Handles opening and closing settings menu tickets
 * @param {Object} ticket settings ticket to open/close
 * @returns none
 */
function settingsTicketHandler(ticket) {
	if (!state.isTicketDisplayed) {
		displaySettingsTicket(ticket);
		return;
	}

	if (ticket === state.ticketOpened) {
		closeAllSettingsTickets();
		return;
	}

	closeAllSettingsTickets();
	displaySettingsTicket(ticket);
} /* settingsTicketHandler */

/**
 * Reloads the browser window
 */
function reload() {
	// cant call this on its own 'Illegal invocation'
	window.location.reload();
}

function init() {
	dom = {
		settings: document.querySelector('.settings-menu-container'),
		settingsButton: document.querySelector('.settings-menu-button img'),
		volume: document.querySelector('.volume'),
		exitButton: document.querySelector('.exit-zoltar'),
		subSettingsBtn: document.querySelector('.settings-menu-settings'),
		closeTicket: document.querySelectorAll('.close-settings-ticket'),
		creditsButton: document.querySelector('.credits-button'),
		creditsTicket: document.querySelector('.credits'),
		instructionsButton: document.querySelector('.instructions-button'),
		instructionsTicket: document.querySelector('.instructions'),
	};

	getSettingsLocalStorage();

	dom.instructionsButton.addEventListener('click', () => {
		settingsTicketHandler(dom.instructionsTicket);
	});
	dom.creditsButton.addEventListener('click', () => {
		settingsTicketHandler(dom.creditsTicket);
	});
	dom.closeTicket.forEach((button) => {
		button.addEventListener('click', closeAllSettingsTickets);
	});

	// eslint-disable-next-line no-restricted-globals
	dom.exitButton.addEventListener('click', reload);
	dom.settingsButton.addEventListener('click', toggleSettingsContainer);
	dom.volume.addEventListener('click', toggleMute);
}
document.addEventListener('DOMContentLoaded', init);
