import { convertArrToReadableString } from './ticket.js';

const template = document.getElementById('historical-ticket-template');

class HistoricalTicket extends HTMLElement {
	constructor() {
		super();

		this.attachShadow({ mode: 'open' });
		this.shadowRoot.appendChild(template.content.cloneNode(true));
		this.ticketContent = this.shadowRoot.querySelector('.ticket-front-content');
	}

	set content(state) {
		if (!state) {
			return;
		}
		this.ticketContent.innerHTML = `				
			<img src="assets/images/horizontalrule.png" class="rule top">
			<p class="ticket-title">YOUR FORTUNE</p>
			<img src="assets/images/header.png" class="ticket-header-image">
			<p class="ticket-text" id="fortune-content">${state.currentMessage}</p>
			<p class="ticket-text">Your lucky numbers are ${convertArrToReadableString(state.currentNumbers)}.</p>
			<img src="assets/images/horizontalrule.png" class="rule bottom">
			`;
	}
}

customElements.define('historical-ticket', HistoricalTicket);
