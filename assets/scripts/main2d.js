import { isTicketCurrentlyDisplayed, toggleTicketOn } from './ticket.js';
import { tellPageLoaded } from './splash.js';
import { createFortuneOnTicket } from './fortunes.js';

// eslint-disable-next-line no-console
console.log('%cWelcome to %cZoltar%c.live!', '', 'color: red; font-weight: bolder', '');

export const state = {
	responseGenerated: true,
	ticketSpawned: false,
	controls: {
		API: {
			enabled: false,
		},
	},
};

let dom = {};

// Sound effects
const rumble = new Audio('./assets/audio/rumble.mp3');

/**
 * Returns whether or not new event can be queued
 * @param none
 * @return { Boolean }
 */
export function canTriggerEvent() {
	return !isTicketCurrentlyDisplayed()
		&& !state.ticketSpawned
		&& document.querySelector('.cover').classList.contains('hidden');
} /* canTriggerEvent */

/**
 * Triggers the screen to shake for predetermined time. Ticket dispenses after
 * shaking is completed
 * @param none
 */
function startShaking() {
	rumble.play();
	dom.body.classList.add('shake');
} /* startShaking */

/**
 * Generates card and displays on screen
 * @param none
 */
function addCardToScene() {
	toggleTicketOn();
	state.ticketSpawned = false;
	state.controls.API.enabled = false;
} /* addCardToScene */

/**
 * Opens starter project 8 ball on the same tab.
 * @param none
 */
export function openEightBall() {
	setTimeout(() => {
		window.location = ('https://cse110-sp23-group23.github.io/cse110-sp23-group23/source/8ball/');
	}, 500);
} /* openEightBall */

/**
 * Quickly flash vignette on edges of screen to show user they clicked button
 * @param none
 */
function flickVignette() {
	dom.cover.classList.remove('hidden');
	dom.cover.classList.add('vignette-cover');
	dom.cover.addEventListener('animationend', () => {
		dom.cover.classList.add('hidden');
		dom.cover.classList.remove('vignette-cover');
	});
} /* flickVignette */

/**
 * Decides and calls appropriate action for all keypresses heard in window
 * @param { Event } event - keypress event passed by eventlistener
 */
function handleKeypress(event) {
	if (event.key === ' ' && canTriggerEvent()) {
		state.ticketSpawned = true;
		state.responseGenerated = false;
		flickVignette();
		const paramOptions = {
			callback: () => {
				state.responseGenerated = true;
			},
		};
		createFortuneOnTicket(paramOptions);
		startShaking();
		setTimeout(addCardToScene, 500);
	}
} /* handleKeypress */

function init() {
	dom = {
		buttons: [
			document.querySelector('#save-button'),
			document.querySelector('#discard-button'),
		],
		cover: document.querySelector('.cover'),
		body: document.querySelector('body'),
		eightBall: document.querySelector('#eight-ball-image'),
	};

	dom.eightBall.addEventListener('click', openEightBall);
	dom.buttons.forEach((button) => {
		button.addEventListener('click', () => {
			dom.body.classList.remove('shake');
			state.controls.API.enabled = true;
		});
	});
	window.addEventListener('keydown', handleKeypress);

	tellPageLoaded(state.controls);
} /* init */

document.addEventListener('DOMContentLoaded', init);
