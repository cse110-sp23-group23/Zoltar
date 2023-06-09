const VOLUME_SRC_ON = './assets/images/volume-on-icon.webp';
const VOLUME_SRC_OFF = './assets/images/volume-off-icon.webp';
const DEFAULT_SETTINGS = {
	isVolumeOn: true,
};

let dom = {};
let settings = {
	isVolumeOn: true,
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
}

function toggleSettingsContainer() {
	dom.settingsButton.classList.toggle('clicked');
	dom.subSettingsBtn.classList.toggle('settings-opacity');
	dom.subSettingsBtn.classList.toggle('settings-slide-in');
}

function init() {
	dom = {
		settings: document.querySelector('.settings-menu-container'),
		settingsButton: document.querySelector('.settings-menu-button img'),
		volume: document.querySelector('.volume'),
		exitButton: document.querySelector('.exit-zoltar'),
		subSettingsBtn: document.querySelector('.settings-menu-settings'),
	};

	getSettingsLocalStorage();

	// eslint-disable-next-line no-restricted-globals
	dom.exitButton.addEventListener('click', location.reload);
	dom.settingsButton.addEventListener('click', toggleSettingsContainer);
	dom.volume.addEventListener('click', toggleMute);
}
document.addEventListener('DOMContentLoaded', init);
