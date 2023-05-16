import data from '../json/responses.json' assert { type: "json" };

let fortuneText;

document.addEventListener('DOMContentLoaded', init);

/**
 * Generates a random fortune from JSON file and places it into
 * the text on card
 * @param none
 */
function produceFortune() {
	const fortune = data.fortunes[Math.floor(Math.random() * data.fortunes.length)].message;
	fortuneText.innerText = fortune;
}

function init() {
	fortuneText = document.querySelector('#fortune-content');
}

export { produceFortune }; 