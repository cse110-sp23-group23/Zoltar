import { convertArrToReadableString } from '../ticket.js';
import { removeCard } from './ticketHistory.js';

/**
 * SavedTicket2D class for creating custom HTML elements. This class represents a ticket that
 * the user previously received, and will be displayed in aggregate with the rest of the tickets
 * to the user. State can be set to control displayed fortune and lucky numbers.
 * @class SavedTicket2D
 * @extends HTMLElement
 */
class SavedTicket2D extends HTMLElement {
	constructor() {
		super();

		this.identifier = null;
		const shadow = this.attachShadow({ mode: 'open' });

		// Section
		const section = document.createElement('section');
		section.classList.add('ticket', 'savedTicket');
		section.innerHTML = '';

		// Style
		const style = document.createElement('style');
		style.innerHTML = `
		    @import url('./assets/styles/twodee.css');
            @import url('./assets/styles/ticket.css');
		`;

		// Discard Button
		const discardButton = document.createElement('button');
		discardButton.classList.add('clickable');
		discardButton.innerText = 'Discard';

		const div = document.createElement('div');
		div.append(discardButton);

		section.append(style, div);
		shadow.append(section);
	}

	connectedCallback() {
		this.shadowRoot.querySelector('div').classList.add('deleteTicket');
		this.shadowRoot.querySelector('button').addEventListener('click', () => {
			removeCard(this);
		});
	}

	set index(int) {
		this.identifier = int;
	}

	/**
	 * Setter for the content of the SavedTicket2D. Give an object with (string)currentImageFront,
	 * (string)'currentMessage' and (number array)'currentNumbers' properties. Updates the ticket
	 * content with respective properties
	 * @param { Object } state - an object with currentImageFront, currentMessage and currentNumbers
	 */
	set content(state) {
		if (!state) {
			return;
		}

		this.shadowRoot.querySelector('section').innerHTML += `
            <img loading="lazy" src="/assets/images/horizontalrule.png" class="top">
	        <h1 class="ticket-title" class="loaded-message">YOUR FORTUNE</h1>
            <img loading="lazy" src="assets/images/image-bank-front/header-${state.currentImageFront}.png" 
				class="ticket-header-image">
	        <p class="fortune-text">${state.currentMessage}</p>
			<p class="fortune-number">
				Your lucky numbers are ${convertArrToReadableString(state.currentNumbers)}
			</p>
	        <img loading="lazy" src="/assets/images/horizontalrule.png" class="bottom">
	        `;
	}

	/**
	 * Setter for the position of the ticket.
	 * @param { string } pos - CSS transform for the ticket.
	 */
	set position(pos) {
		this.shadowRoot.querySelector('section').style.transform = `${pos}`;
	}

	/**
	 * Setter for the z index of the ticket.
	 * @param { number } int - CSS z-index for the ticket.
	 */
	set zIndex(int) {
		this.shadowRoot.querySelector('section').style.zIndex = `${int}`;
	}

	testAlert() {
		this.shadowRoot.querySelector('button').innerText = 'wwww';
	}
}

customElements.define('saved-ticket', SavedTicket2D);
