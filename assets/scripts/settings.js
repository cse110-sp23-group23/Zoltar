let isVolumeOn = true;
let dom = {};

/**
 * doesnt work but i sleep now
 */
function toggleVolume() {
	const STRING_ON = './assets/images/volume-on-icon.webp';
	const STRING_OFF = './assets/images/volume-off-icon.webp';

	if (isVolumeOn) {
		dom.volume.src = STRING_OFF;
		isVolumeOn = false;
		// volumeOff();
	} else {
		dom.volume.src = STRING_ON;
		isVolumeOn = true;
		// volumeOn();
	}
}

function toggleSettingsContainer() {
	dom.settingsButton.classList.toggle('clicked');
	dom.settings.classList.toggle('settings-slide-in');
}

function init() {
	dom = {
		settings: document.querySelector('.settings-menu-container'),
		settingsButton: document.querySelector('.settings-menu-button img'),
		volume: document.querySelector('.volume'),
		exitButton: document.querySelector('.exit-zoltar'),
	};

	// eslint-disable-next-line no-restricted-globals
	dom.exitButton.addEventListener('click', () => { location.reload(); });
	dom.settingsButton.addEventListener('click', () => { toggleSettingsContainer(); });
	dom.volume.addEventListener('click', () => { toggleVolume(); });
}
document.addEventListener('DOMContentLoaded', init);
