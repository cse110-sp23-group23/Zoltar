import { convertArrToReadableString } from '../ticket.js';

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

		const shadow = this.attachShadow({ mode: 'open' });
		// const div = document.createElement('div');
		// div.appendChild(document.createTextNode('Why not show?'));

		const section = document.createElement('section');
		section.classList.add('ticket', 'savedTicket');
		const style = document.createElement('style');
		style.innerHTML = `
		    @import url('./assets/styles/twodee.css');
            @import url('./assets/styles/ticket.css');
		`;

		section.innerHTML = '';

		shadow.append(style, section);
	}

	/**
	 * Setter for the content of the SavedTicket2D. Give an object with (string)'currentMessage'
	 * and (number array)'currentNumbers' properties. Updates the ticket content with respective
	 * properties
	 * @param { Object } state - an object with currentMessage and currentNumbers
	 */
	set content(state) {
		if (!state) {
			return;
		}

		this.shadowRoot.querySelector('section').innerHTML = `
            <img loading="lazy" src="/assets/images/horizontalrule.png" class="top">
	        <h1 class="ticket-title" class="loaded-message">YOUR FORTUNE</h1>
            <img loading="lazy" src="assets/images/header.png" class="ticket-header-image">
	        <p class="fortune-text">${state.currentMessage}</p>
			<p class="fortune-number">
				Your lucky numbers are ${convertArrToReadableString(state.currentNumbers)}
			</p>
	        <img loading="lazy" src="/assets/images/horizontalrule.png" class="bottom">
	        `;
	}

	set position(pos) {
		this.shadowRoot.querySelector('section').style.transform = `${pos}`;
	}

	set zIndex(int) {
		this.shadowRoot.querySelector('section').style.zIndex = `${int}`;
	}
}

customElements.define('saved-ticket', SavedTicket2D);
