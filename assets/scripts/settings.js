import { mute, unmute } from './noise.js';
import { toggleClassToArr, slowHideElement } from './util.js';

const VOLUME_SRC_ON = './assets/images/volume_on.svg';
const VOLUME_SRC_OFF = './assets/images/volume_off.svg';
const DEFAULT_SETTINGS = {
	isVolumeOn: true,
};
let dom = {};
export const settings = {
	isVolumeOn: true,
};
const state = {
	isTicketDisplayed: false,
	isSettingsOpen: false,
	ticketOpened: null,
	exitOpen: false,
};

let controls;
let safeToExit = () => true;

/**
 * Allows external functions to tell settings functions which type of controls, 3d or 2d
 * are currently being used by passing control object
 * @param { Object } passedControls controls to be used later by settings
 */
export function setControls(passedControls) {
	controls = passedControls;
} /* setControls */

/**
 * Allows dynamic setting of current meaning of safe to exit for setting menu
 * @param { Function } func function set use
 */
export function setSafeToExitFunc(func) {
	safeToExit = func;
} /* giveSafeToExitFunc */

/**
 * Mutes/unmutes audio depending on current settings
 * @param none
 */
function updateAudioOutput() {
	if (settings.isVolumeOn) {
		unmute();
	} else {
		mute();
	}
} /* updateAudioOutput */

/**
 * Updates display of settings menu to match current settings
 * @param none
 */
function refreshSettingsMenu() {
	dom.volumeImg.src = settings.isVolumeOn ? VOLUME_SRC_ON : VOLUME_SRC_OFF;
	updateAudioOutput();
} /* refreshSettingsMenu */

/**
 * Saves current settings to local storage
 * @param none
 */
function putSettingsLocalStorage() {
	localStorage.setItem('settings', JSON.stringify(settings));
} /* putSettingsLocalStorage */

/**
 * Sets current settings to settings saved in local storage
 * @param none
 */
function getSettingsLocalStorage() {
	const newSettings = JSON.parse(localStorage.getItem('settings')) || DEFAULT_SETTINGS;
	Object.entries(newSettings).forEach(([key, val]) => {
		settings[key] = val;
	});
	refreshSettingsMenu();
} /* getSettingsLocalStorage */

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
	state.isSettingsOpen = !state.isSettingsOpen;
	dom.settingsButton.classList.toggle('clicked');
	dom.subSettingsBtn.classList.toggle('settings-slide-in');
} /* toggleSettingsContainer */

/**
 * Closes every instance of a settings Tickets
 * @param none
 */
function closeAllSettingsTickets() {
	if (!state.isTicketDisplayed) return;
	dom.settingsTickets.forEach((ticket) => {
		ticket.classList.add('hidden-animation');
	});
	state.isTicketDisplayed = false;
	state.ticketOpened = null;
	controls.API.enabled = true;
	dom.ticketCount.classList.remove('hidden');
} /* closeAllSettingsTickets */

/**
 * Displays desired settings ticket
 * @param {Object} ticket settings ticket to open
 */
function displaySettingsTicket(ticket) {
	ticket.classList.remove('hidden-animation');
	state.isTicketDisplayed = true;
	state.ticketOpened = ticket;
	controls.API.enabled = false;
	dom.ticketCount.classList.add('hidden');
} /* displaySettingsTicket */

/**
 * When icon is pressed, closes corresponding ticket if already open,
 * otherwise opens ticket
 * @param {Object} ticket settings ticket to open/close
 */
function settingsTicketHandler(ticket) {
	if (state.isTicketDisplayed && ticket === state.ticketOpened) {
		closeAllSettingsTickets();
	} else {
		if (state.isTicketDisplayed) closeAllSettingsTickets();
		displaySettingsTicket(ticket);
	}
} /* settingsTicketHandler */

/**
 * Closes out of exit confirmation menu when user chooses to stay on page
 * @param none
 */
function closeExitPageMenu() {
	state.exitOpen = false;
	controls.API.enabled = true;
	toggleClassToArr([dom.exitConfirmation, dom.ticketCount, dom.settings], 'hidden');
	slowHideElement(dom.cover);
	dom.cover.removeEventListener('click', closeExitPageMenu);
} /* closeExitPageMenu */

/**
 * Handles keydown event listener for setttings. Closes currently open settings tickets
 * or menu if any exist on 'escape' keypress.
 * @param event
 */
function handleKeydown(event) {
	if (event.key === 'Escape') {
		if (state.isTicketDisplayed) {
			closeAllSettingsTickets();
		} else if (state.isSettingsOpen && dom.cover.classList.contains('hidden')) {
			toggleSettingsContainer();
		} else if (state.exitOpen) {
			closeExitPageMenu();
		}
	}
} /* handleEscape */

/**
 * Asks user for confirmation if they have ticket currently pending, otherwise
 * says goodbye and goes back to start
 * @param none
 */
function exitPage() {
	state.exitOpen = true;
	controls.API.enabled = false;
	dom.unsavedChangesMsg.style.display = (safeToExit() ? 'none' : 'inline');
	closeAllSettingsTickets();
	toggleClassToArr([dom.exitConfirmation, dom.cover, dom.ticketCount, dom.settings], 'hidden');
	dom.confirmExit.addEventListener('click', window.location.reload.bind(window.location), { once: true });
	dom.denyExit.addEventListener('click', closeExitPageMenu, { once: true });
	dom.cover.addEventListener('click', closeExitPageMenu, { once: true });
} /* exitPage */

/**
 * Finds and returns all elements necessary for settings.js file
 * @return { Object<HTMLElement> } all elements needed for this file
 */
function findElementsInDOM() {
	return {
		settings: document.querySelector('.settings-menu-container'),
		settingsButton: document.querySelector('.settings-menu-button img'),
		volume: document.querySelector('.volume'),
		volumeImg: document.querySelector('.volume img'),
		exitButton: document.querySelector('.exit-zoltar'),
		subSettingsBtn: document.querySelector('.settings-menu-settings'),
		closeTicket: document.querySelectorAll('.close-settings-ticket'),
		creditsButton: document.querySelector('.credits-button'),
		creditsTicket: document.querySelector('.credits'),
		instructionsButton: document.querySelector('.instructions-button'),
		instructionsTicket: document.querySelector('.instructions'),
		ticketCount: document.querySelector('.count-tickets-icon'),
		cover: document.querySelector('.cover'),
		settingsTickets: document.querySelectorAll('.settings-ticket'),
		exitConfirmation: document.querySelector('.exit-confirmation'),
		confirmExit: document.querySelector('#leave-button'),
		denyExit: document.querySelector('#stay-button'),
		unsavedChangesMsg: document.querySelector('#unsaved-warning'),
	};
} /* findElementsInDom */

function init() {
	dom = findElementsInDOM();
	dom.exitButton.addEventListener('click', exitPage);
	dom.settingsButton.addEventListener('click', toggleSettingsContainer);
	dom.volume.addEventListener('click', toggleMute);
	dom.instructionsButton.addEventListener('click', () => { settingsTicketHandler(dom.instructionsTicket); });
	dom.creditsButton.addEventListener('click', () => {	settingsTicketHandler(dom.creditsTicket); });
	dom.closeTicket.forEach((button) => { button.addEventListener('click', closeAllSettingsTickets); });
	window.addEventListener('keydown', handleKeydown);

	getSettingsLocalStorage();
} /* init */
document.addEventListener('DOMContentLoaded', init);
