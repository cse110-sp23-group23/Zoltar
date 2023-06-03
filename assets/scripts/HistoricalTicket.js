import { convertArrToReadableString } from './ticket.js';

/**
 * Location of template for ticket structure to use
 * @constant
 */
const template = document.getElementById('historical-ticket-template');

/**
 * HistoricalTicket class for creating custom HTML elements. This class represents a ticket that a
 * user previously received, and will be displayed in aggregate with rest of tickets to user. State
 * can be set to control displayed fortune and lucky numbers.
 * @class HistoricalTicket
 * @extends HTMLElement
 */
class HistoricalTicket extends HTMLElement {
	constructor() {
		super();

		this.attachShadow({ mode: 'open' });
		this.shadowRoot.appendChild(template.content.cloneNode(true));
		this.headerImage = this.shadowRoot.querySelector('.ticket-header-image');
	} /* constructor */

	/**
	 * Setter for the content of the HistoricalTicket. Given an object with a 'currentMessage'
	 * and 'currentNumbers' properties, updates the ticket content with appropriate information
	 * @param { Object } state - an object with the current message and numbers
	 */
	set content(state) {
		if (!state) {
			return;
		}

		const numArrString = convertArrToReadableString(state.currentNumbers);

		const fortuneContentNode = document.createTextNode(state.currentMessage);
		const luckyNumbersNode = document.createTextNode(numArrString);

		const fortuneSlot = this.shadowRoot.querySelector('slot[name="fortune-content"]');
		const numbersSlot = this.shadowRoot.querySelector('slot[name="lucky-numbers"]');

		fortuneSlot.replaceChildren(fortuneContentNode);
		numbersSlot.replaceChildren(luckyNumbersNode);

		this.headerImage.src = `assets/images/image-bank-front/header-${state.currentImageFront}.png`;
	} /* set content */
} /* HistoricalTicket */

// use as '<historical-ticket></historical-ticket>'
customElements.define('historical-ticket', HistoricalTicket);
