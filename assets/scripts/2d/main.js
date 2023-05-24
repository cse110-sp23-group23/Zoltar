document.addEventListener('DOMContentLoaded', init);
const fortuneOutput = document.querySelector(`#fortune-output`);
const imageMap = document.querySelector(`map`);
const ticket = document.querySelector(`#ticket`);
const zoltar = document.querySelector(`#zoltar-image`);
const closeTicket = document.getElementById(`closeTicket`)


ticket.style.display = `none`;
const responses = [
	'It is certain',
	'It is decidedly so',
	'Without a doubt',
	'Yes, definitely',
	'You may rely on it',
	'As I see it, yes',
	'Most likely',
	'Outlook good',
	'Yes',
	'Signs point to yes',
	'Reply hazy try again',
	'Ask again later',
	'Better not tell you now',
	'Cannot predict now',
	'Concentrate and ask again',
	"Don't count on it",
	'My reply is no',
	'My sources say no',
	'Outlook not so good',
	'Very doubtful',
];

let splash, loadedMessage;

function init() {
	splash = document.querySelector('#splash-screen');
	loadedMessage = document.querySelector('.loaded-message');

    setTimeout(() => {
        splash.style.display = `none`;
    },100);


}

zoltar.addEventListener(`click`,(e) => {
	e.preventDefault();
	fortuneOutput.textContent = responses[Math.floor(Math.random() * responses.length)];
	ticket.style.display = `flex`;
	slideIn();
});

/**
 * Sliding animation of ticket
 * doesnt work lol
 */
function slideIn() {
	let isOpen = ticket.classList.contains(`slide-in`);

	ticket.setAttribute('class', isOpen ? 'slide-out' : 'slide-in');
}
/**
 * Closes the ticket
 */
closeTicket.addEventListener(`click`, () => {
	ticket.style.display = `none`;
})

document.addEventListener('keydown', evt =>{
	if(evt.key  === 'Escape' ){
		if(ticket.style.display == `flex`){
			ticket.style.display = `none`;
		}
	}
});
