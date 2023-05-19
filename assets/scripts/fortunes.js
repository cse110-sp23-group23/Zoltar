let data = undefined;
fetch('assets/json/responses.json').then(response => response.json()).then(json => data = json);

let fortuneText;

document.addEventListener('DOMContentLoaded', init);

/**
 * Generates a random fortune from JSON file and places it into
 * the text on card
 * @param none
 */
function produceFortune() {
    if (data === undefined) {
        fortuneText.innerText = 'Fortunes are not claer...';
    }
    const fortune = data.fortunes[Math.floor(Math.random() * data.fortunes.length)].message;
    fortuneText.innerText = fortune;
}

function init() {
    fortuneText = document.querySelector('#fortune-content');
}

export { produceFortune };