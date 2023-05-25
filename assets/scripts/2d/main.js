document.addEventListener('DOMContentLoaded', init);
const fortuneOutput = document.querySelector(`#fortune-output`);
const imageMap = document.querySelector(`map`);
const ticket = document.querySelector(`#ticket`);
const zoltar = document.querySelector(`#zoltar-image`);
const ticketX = document.getElementById(`closeTicket`)


const responses = [
	`A door once closed, perhaps by circumstance, perhaps by choice, is about to reopen. When it does, don't hesitate, don't doubt. What lies beyond is a path you were always meant to tread, a destiny waiting to unfold. The past may guide you, but it's the future where your potential truly lies.

	Your lucky numbers are 60, 96, 54, and 67.`
];

let splash, loadedMessage;

function init() {
	
	let background = new Audio('assets/audio/background.wav');
	background.loop = true;
	background.play();
	splash = document.querySelector('#splash-screen');
	loadedMessage = document.querySelector('.loaded-message');

    setTimeout(() => {
        splash.style.display = `none`;
    },100);


}

/**
 * When Zoltar is clicked, the ticket pops up and displays your fortune
 */
zoltar.addEventListener(`click`,(e) => {
	let thunder = new Audio('assets/audio/thunder2d.wav');
	thunder.volume = 0.2;
	thunder.play();
	e.preventDefault();
	fortuneOutput.textContent = responses[Math.floor(Math.random() * responses.length)];
	ticket.style.display = `flex`;
	openTicket();

});

/**
 * Closes the ticket
 */
ticketX.addEventListener('click', () => {
	closeTicket();
})

document.addEventListener('keydown', evt =>{
	if(evt.key  === 'Escape' ){
		if(ticket.style.display == `flex`){
			closeTicket();
		}
	}
});


function closeTicket() {
	ticket.classList.toggle(`visible`);
}

function openTicket() {
	ticket.classList.toggle(`visible`);
}
