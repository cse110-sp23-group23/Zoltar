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
		this.flipped = false;
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
		discardButton.setAttribute('id', 'discardShadow');
		discardButton.classList.add('clickable');
		discardButton.innerText = 'Discard';

		// Flip Button
		const flipButton = document.createElement('button');
		flipButton.setAttribute('id', 'flipShadow');
		flipButton.classList.add('clickable', 'yellow');
		flipButton.innerText = 'Flip';

		// Button Overlay
		const div = document.createElement('div');
		div.append(flipButton, discardButton);

		section.append(style, div);
		shadow.append(section);
	}

	/**
	 * Assigns event listeners when rendered on the DOM
	 * @param
	 */
	connectedCallback() {
		this.shadowRoot.querySelector('div').classList.add('deleteTicket');

		this.shadowRoot.getElementById('discardShadow').addEventListener('click', () => {
			removeCard(this);
		});

		this.shadowRoot.getElementById('flipShadow').addEventListener('click', () => {
			this.flip();
		});

		this.shadowRoot.querySelector('.front-side').addEventListener('click', () => {
			this.flip();
		});
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
			<div class="front-side subTicket rotate clickable">
				<img loading="lazy" src="assets/images/image-bank-back/background-card-${state.currentImageBack}.png"
				"class="ticket-front-image" alt="Front ticket image">
			</div>
			<div class="back-side subTicket">
				<img loading="lazy" src="/assets/images/horizontalrule.png" class="rule top-rule">
				<section class="content-container">
					<h1 class="ticket-title" class="loaded-message">YOUR FORTUNE</h1>
					<img loading="lazy" class="back-side-image" 
					src="assets/images/image-bank-front/header-${state.currentImageFront}.png" 
						class="ticket-header-image">
					<p class="fortune-text">${state.currentMessage}</p>
					<p class="fortune-number">
						Your lucky numbers are ${convertArrToReadableString(state.currentNumbers)}
					</p>
				</section>
				<img loading="lazy" src="/assets/images/horizontalrule.png" class="rule bottom-rule">
			</div>
	        `;
	}

	/**
	 * Setter for the position of the ticket.
	 * @param { string } pos - CSS transform for the ticket.
	 */
	set position(tuple) {
		const section = this.shadowRoot.querySelector('section');
		section.style.transform = `${tuple[0]}`;
		section.style.zIndex = `${tuple[1]}`;
	}

	/**
	 * Flips THIS card
	 * @param none
	 */
	flip() {
		this.flipped = !this.flipped;

		const div = this.shadowRoot.querySelector('div');
		this.shadowRoot.querySelectorAll('.subTicket').forEach((el) => {
			el.classList.toggle('rotate');
		});

		if (this.flipped) {
			div.style.display = 'none';
		} else {
			setTimeout(() => {
				div.style.display = 'flex';
			}, 500);
		}
	}
}

customElements.define('saved-ticket', SavedTicket2D);
