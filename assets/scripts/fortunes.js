import { state, updateTicket } from './ticket.js';

const ENDPOINT_URL = 'https://subtle-licorice-abd04e.netlify.app/.netlify/functions/gptendpoint';
const ENABLE_GPT_FLAG = true;

let data;

/**
 * Generates a random fortune from JSON file
 * @param { Array<Object> } array of fortune objects with .message field
 * @return { String } random fortune
 */
export function produceFortuneFromArr(arr) {
	return arr[Math.floor(Math.random() * arr.length)].message;
} /* produceFortuneFromArr */

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
	while (list.size < n) {
		list.add(Math.floor(Math.random() * (high - low)) + low);
	}
	return [...list];
} /* produceRandomNumbers */

/**
 * Takes in a message, queries openAI though serverless function, returns
 * response
 * @param { String } message message to be passed to gpt
 * @return { Promise }
 */
function produceFortuneFromGPT(message) {
	const url = `${ENDPOINT_URL}?prompt=${encodeURIComponent(message)}`;
	return fetch(url)
		.then((response) => response.json())
		.catch(() => produceFortuneFromArr(data.fortunes)); // fallback if problem
} /* produceFortuneFromGPT */

/**
 * Fetches and returns fortune, using API if possible and flagged
 * @param { Boolean } tryGPT flag to try GPT API first; true = try, false = don't try
 * @param { String } message (optional) user input to pass to APi
 * @return { String }
 */
export async function produceFortune(tryGPT = false, options = { message: '', arr: data.fortunes }) {
	if (tryGPT && ENABLE_GPT_FLAG) {
		try {
			return produceFortuneFromGPT(options.message);
		} catch (error) {
			// fall through
		}
	}
	return produceFortuneFromArr(options.arr);
} /* produceFortune */

/**
 * Replaces text on card in DOM with new fortune and new list of lucky numbers.
 * @param none
 */
export function createFortuneOnTicket() {
	const options = { message: 'I am worried about final exams.', arr: data.fortunes };
	produceFortune(true, options).then((response) => { state.currentMessage = response; }).then(
		() => {
			state.currentNumbers = produceRandomNumbers(4, 1, 100);
			updateTicket();
		},
	);
} /* createFortuneOnTicket */

function init() {
	fetch('assets/json/responses.json')
		.then((response) => response.json())
		.then((json) => { data = json; });
}
document.addEventListener('DOMContentLoaded', init);
