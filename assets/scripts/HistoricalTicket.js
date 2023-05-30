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
 * @property { Object } ticketContent - the inner content of the ticket, namely fortune and numbers
 */
class HistoricalTicket extends HTMLElement {
	/**
     * HistoricalTicket constructor. Initializes the element, attaches it to the
	 * shadow dom, and sets up ticketContent for later calls
     */
	constructor() {
		super();

		this.attachShadow({ mode: 'open' });
		this.shadowRoot.appendChild(template.content.cloneNode(true));
		this.ticketContent = this.shadowRoot.querySelector('.ticket-front-content');
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
	} /* set content */
} /* HistoricalTicket */

// use as '<historical-ticket></historical-ticket>'
customElements.define('historical-ticket', HistoricalTicket);
