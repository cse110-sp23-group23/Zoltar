import { state, updateTicket } from './ticket.js';

let data;

/**
 * Generates a random fortune from JSON file
 * @param { Array<Object> } array of fortune objects with .message field
 * @return { String } random fortune
 */
export function produceFortune(arr) {
	return arr[Math.floor(Math.random() * arr.length)].message;
} /* produceFortune */

/**
 * Generates an array of n distinct integers spaced between low and high.
 * Gives back an empty array if no input n, or if there aren't enough numbers
 * 		between high and low to fill the array
 * @param { Integer } n number of unique integers to generate
 * @param { Integer } low bottom bound for random integers, inclusive (default 0)
 * @param { Integer } high top bound for random integers, exclusive (default 100)
 * @return { Array<Integer> } array of n unique integers
 */
export function produceRandomNumbers(n, low = 0, high = 100) {
	if (n === undefined || (high - low) < n) { // no input or not enough numbers
		return [];
	}
	const list = new Set();
	while (list.size <= n) {
		list.add(Math.floor(Math.random() * (high - low)) + low);
	}
	return [...list];
} /* produceRandomNumbers */

/**
 * Replaces text on card in DOM with new fortune and new list of lucky numbers.
 * @param none
 */
export function createFortuneOnTicket() {
	state.currentMessage = produceFortune(data.fortunes);
	state.currentNumbers = produceRandomNumbers(4, 1, 100);
	updateTicket();
} /* createFortuneOnTicket */

function init() {
	fetch('assets/json/responses.json')
		.then((response) => response.json())
		.then((json) => { data = json; });
}
document.addEventListener('DOMContentLoaded', init);
