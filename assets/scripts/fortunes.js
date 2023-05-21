let data;
let fortuneText;
let fortuneNumbers;

/**
 * Generates a random fortune from JSON file
 * @param { Array<Object> } array of fortune objects with .message field
 * @return { String } random fortune
 */
export function produceFortune(arr) {
	return arr[Math.floor(Math.random() * arr.length)].message;
} /* produceFortune */

/**
 * Places fortune into DOM
 * @param { String } text text to place (default to 'Hmmm... my vision is cloudy')
 */
export function placeFortune(text = 'Hmmm... my vision is cloudy') {
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
export function produceRandomNumbers(n, low = 0, high = 100) {
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
export function placeRandomNumbers(arr = [1, 2, 3, 4]) {
	const text = arr.reduce((prevText, nextNum, i, array) =>
		`${prevText}${i < array.length - 1 ? ',' : ', and'} ${nextNum}` // place 'and' after last comma
	);
	fortuneNumbers.innerText = text;
} /* placeRandomNumbers */

/**
 * Replaces text on card in DOM with new fortune and new list of lucky numbers.
 * @param none
 */
export function createFortuneOnTicket() {
	placeFortune(produceFortune(data.fortunes));
	placeRandomNumbers(produceRandomNumbers(4, 1, 100));
} /* createFortuneOnTicket */

function init() {
	fetch('assets/json/responses.json').then((response) => response.json()).then((json) => data = json);

	fortuneText = document.querySelector('#fortune-content');
	fortuneNumbers = document.querySelector('#ticket-lucky-numbers');
}
document.addEventListener('DOMContentLoaded', init);
