import data from '../json/responses.json' assert { type: "json" };

let fortuneText, fortuneNumbers;

document.addEventListener('DOMContentLoaded', init);

/**
 * Replaces text on card in DOM with new fortune and new list of lucky numbers.
 * @param none
 */
function createFortuneOnTicket() {
	placeFortune(produceFortune());
	placeRandomNumbers(produceRandomNumbers(4,1,100));
} /* createFortuneOnTicket */

/**
 * Generates a random fortune from JSON file
 * @param none
 * @return { String } random fortune
 */
function produceFortune() {
	return data.fortunes[Math.floor(Math.random() * data.fortunes.length)].message;
} /* produceFortune */

/**
 * Places fortune into DOM
 * @param { String } text text to place (default to 'Hmmm... my vision is cloudy')
 */
function placeFortune(text = 'Hmmm... my vision is cloudy') {
	fortuneText.innerText = text;
} /* placeFortune */

/**
 * Generates an array of n distinct integers spaced between low and high.
 * Gives back an empty array if no input n, or if there aren't enough numbers
 * 		between high and low to fill the array
 * @param { Integer } n number of unique integers to generate
 * @param { Integer } low bottom bound for random integers, inclusive (default 0)
 * @param { Integer } high top bound for random integers, exclusive (default 100)
 * @returns { Array<Integer> } array of n unique integers
 */
function produceRandomNumbers(n, low = 0, high = 100) {
	if (n === undefined || (high - low) < n) { // no input or not enough numbers
		return [];
	}
	const list = new Set();
	while (list.size < n) {
		list.add(Math.floor(Math.random() * (high - low)) + low);
	}
	return [...list];
} /* produceRandomNumbers */

/**
 * Place list of random numbers into the DOM
 * @param { Array<Integer> } arr integers to put into list (default to [1,2,3,4])
 */
function placeRandomNumbers(arr = [1,2,3,4]) {
	const text = arr.reduce((prevText, nextNum, i, arr) => 
		`${prevText}${i < arr.length - 1 ? ',' : ', and'} ${nextNum}` // place 'and' after last comma
	);
	fortuneNumbers.innerText = text;
} /* placeRandomNumbers */

function init() {
	fortuneText = document.querySelector('#fortune-content');
	fortuneNumbers = document.querySelector('#ticket-lucky-numbers');
} 

export { createFortuneOnTicket }; 