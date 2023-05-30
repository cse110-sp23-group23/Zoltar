// import { convertArrToReadableString } from '../ticket.js';

class SavedTicket extends HTMLElement {
	constructor() {
		super();

		const shadow = this.attachShadow({ mode: 'open' });
		const div = document.createElement('div');
		div.appendChild(document.createTextNode('Why not show?'));

		// let section = document.createElement('section');
		// this.section.classList.add('ticket');
		// const style = document.createElement('style');
		// style.innerHTML = `
		//     @import url('./assets/styles/twodee.css');

		//     section {
		//         height: 50px;
		//         width: 50px;
		//         background-color: blue;
		//         z-index: 10000;
		//         position: absolute;
		//         left: 50px;
		//         display: inline;
		//     }
		// `;

		// this.section.innerHTML = `<p>WTF MAN</p>`;

		// shadow.append(style);
		shadow.append(div);
	}

	// set content(state) {
	//     if (!state) {
	//         return;
	//     }
	//     this.section.innerHTML = `
	//         <img loading="lazy" src="/assets/images/horizontalrule.png" class="top">
	//         <span class="closeTicket" id="closeTicket">&times;</span>
	//         <h1 class="ticket-title" class="loaded-message">YOUR FORTUNE</h1>
	//         <img loading="lazy" src="assets/images/header.png" class="ticket-header-image">
	//         <p class="fortune-text">${state.currentMessage}</p>
	//			<p class="fortune-number">
	//				Your lucky numbers are ${convertArrToReadableString(state.currentNumbers)}
	// 			</p>
	//         <img loading="lazy" src="/assets/images/horizontalrule.png" class="bottom">
	//         `;
	// }
}

customElements.define('saved-ticket', SavedTicket);
