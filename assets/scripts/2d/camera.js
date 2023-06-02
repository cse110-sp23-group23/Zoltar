import { isHistoryOnScreen } from './ticketHistory.js';
import { isTicketOnScreen } from './main.js';

let cameraEl;

let xValue = 0;
let yValue = 0;
let rotateDegree = 0;

// implement max movement so that there is no gap between top and bottom
window.addEventListener('mousemove', (e) => {
	if (isHistoryOnScreen() || isTicketOnScreen()) {
		return;
	}

	xValue = e.clientX - window.innerWidth / 2;
	yValue = e.clientY - window.innerHeight / 2;

	rotateDegree = (xValue / (window.innerWidth / 2)) * 20;

	cameraEl.forEach((element) => {
		const { speedx } = element.dataset;
		const { speedy } = element.dataset;
		const { rotation } = element.dataset;

		// eslint-disable-next-line no-param-reassign
		element.style.transform = `translateX(calc(-50% + ${xValue * speedx}px)) translateY(calc(-50% + ${yValue * speedy}px)) rotateY(${rotateDegree * rotation}deg)`;
	});
});

function init() {
	cameraEl = document.querySelectorAll('.camera');
}

document.addEventListener('DOMContentLoaded', init);
