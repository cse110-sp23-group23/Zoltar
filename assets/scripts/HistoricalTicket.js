import { convertArrToReadableString } from './ticket.js';

class HistoricalTicket extends HTMLElement {
	constructor() {
		super();

		const shadow = this.attachShadow({ mode: 'open' });
		this.wrapper = document.createElement('div');
		this.wrapper.classList.add('ticket-wrapper', 'hidden');
		const background = document.createElement('div');
		background.classList.add('ticket-background');
		background.innerHTML = `
			<div class="ticket-weathered-background">
				<svg style="display: none;">
					<defs>
						<filter id="weathered-edges" x="0" y="0" width="100%" height="100%">
							<feTurbulence baseFrequency="0.04" numOctaves="5" seed="10" type="fractalNoise" result="turbulence" />
							<feDisplacementMap in="SourceGraphic" in2="turbulence" scale="20" xChannelSelector="R" yChannelSelector="G" />
						</filter>
					</defs>
				</svg>
			</div>
			`;
		this.ticketContent = document.createElement('div');
		this.ticketContent.classList.add('ticket-front-content');
		const style = document.createElement('style');
		style.innerHTML = `
			@import url('./assets/styles/ticket.css');
		`;
		this.wrapper.appendChild(background);
		this.wrapper.appendChild(this.ticketContent);
		shadow.appendChild(style);
		shadow.appendChild(this.wrapper);
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

	set selected(value) {
		if (value) {
			this.wrapper.classList.remove('hidden');
		} else {
			this.wrapper.classList.add('hidden');
		}
	}
}

customElements.define('historical-ticket', HistoricalTicket);