import data from '../json/responses.json' assert { type: "json" };

let fortuneText;

document.addEventListener('DOMContentLoaded', init);

function produceFortune() {
	const fortune = data.fortunes[Math.floor(Math.random() * data.fortunes.length)].message;
	fortuneText.innerText = fortune;
}

function init() {
	fortuneText = document.querySelector('#fortune-content');
}

export { produceFortune }; 