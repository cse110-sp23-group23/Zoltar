import { deleteCard } from './storage.js';
import { toggleClassToArr, convertArrToReadableString } from './util.js';

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

		this.flipped = false;
		this.animations = false; // prevent initial load flip animations

		this.attachShadow({ mode: 'open' });
		this.shadowRoot.appendChild(template.content.cloneNode(true));

		this.dom = this.fetchElementsFromDOM();

		this.dom.backContent.addEventListener('click', this.flipCard.bind(this));
		this.dom.flipButton.addEventListener('click', this.flipCard.bind(this));
		this.dom.discardButton.addEventListener('click', () => { deleteCard(this); });
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

		this.dom.headerImage.src = `assets/images/image-bank-front/header-${state.currentImageFront}.webp`;
		this.dom.backImage.src = `assets/images/image-bank-back/background-card-${state.currentImageBack}.webp`;
	} /* set content */

	/**
	 * Finds necessary HTML elements in shadow root and puts into this.dom object
	 * @param none
	 */
	fetchElementsFromDOM() {
		return {
			headerImage: this.shadowRoot.querySelector('.ticket-header-image'),
			backImage: this.shadowRoot.querySelector('.ticket-back-image'),
			overlay: this.shadowRoot.querySelector('.ticket-flip-overlay'),
			backContent: this.shadowRoot.querySelector('.ticket-back-content'),
			frontContent: this.shadowRoot.querySelector('.ticket-front-content'),
			background: this.shadowRoot.querySelector('.ticket-background'),
			wrapper: this.shadowRoot.querySelector('.ticket-wrapper'),
			discardButton: this.shadowRoot.querySelector('.discard-history-button'),
			flipButton: this.shadowRoot.querySelector('.flip-history-button'),
		};
	} /* fetchElemenetsFromDOM */

	/**
	 * Makes overlay containing discard and flip buttons visible to user
	 * @param { Event } event - event from eventListener trigger
	 */
	handleButtonOverlay(event) {
		if (this.flipped) {
			return;
		}
		if (event.type === 'mouseover') {
			this.dom.overlay.classList.add('transition-action');
			this.dom.overlay.classList.remove('hidden');
		} else if (event.type === 'mouseout') {
			this.dom.overlay.classList.add('hidden');
		}
	} /* showCardButtonOverlay */

	/**
	 * Flips card, toggling between front and back
	 * @param none
	 */
	flipCard() {
		if (!this.animations) { // fires once per element for lifetime
			this.addTransitionEffects.bind(this)();
			this.animations = true;
		}
		toggleClassToArr([this.dom.background, this.dom.backContent, this.dom.frontContent], 'flipped');
		this.dom.wrapper.classList.toggle('ticket-hoverable');
		this.flipped = !this.flipped;
	} /* flipCardToBack */

	/**
	 * Adds transitions to card for animation of flip (necessary to avoid transition during setup)
	 * @param none
	 */
	addTransitionEffects() {
		toggleClassToArr([this.dom.frontContent, this.dom.backContent, this.dom.background], 'transition-action');
	} /* addTransitionEffects */
} /* HistoricalTicket */

// use as '<historical-ticket></historical-ticket>'
customElements.define('historical-ticket', HistoricalTicket);
