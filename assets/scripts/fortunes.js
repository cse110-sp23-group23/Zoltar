import { state, updateTicket } from './ticket.js';

const ENDPOINT_URL = 'https://zoltar-gpt-api-team-23.netlify.app/.netlify/functions/gptendpoint';
const ENABLE_GPT_FLAG = false;

let responseBank = [];
let imageBank = [];

/**
 * Chooses a random item from an arrary
 * @param { Array<Object> } array of objects to choose from
 * @return { String } randomly chosen object
 */
export function chooseOptionFromArr(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
} /* chooseOptionFromArr */

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
		.catch(() => chooseOptionFromArr(responseBank.fortunes)).message; // fallback if problem
} /* produceFortuneFromGPT */

/**
 * Fetches and returns fortune, using API if possible and flagged
 * @async
 * @param { Boolean } tryGPT flag to try GPT API first; true = try, false = don't try
 * @param { String } message (optional) user input to pass to APi
 * @return { String }
 */
export async function produceFortune(tryGPT = false, options = { message: '', arr: responseBank.fortunes }) {
	if (tryGPT && ENABLE_GPT_FLAG) {
		try {
			return await produceFortuneFromGPT(options.message);
		} catch (error) {
			// fall through
		}
	}
	return chooseOptionFromArr(options.arr).message;
} /* produceFortune */

/**
 * Replaces text on card in DOM with new fortune and new list of lucky numbers.
 * @async
 * @param { Object } options optional 'callback' field to be called with ticket state
 */
export async function createFortuneOnTicket(options) {
	const paramOptions = { message: 'I am worried about final exams.', arr: responseBank.fortunes };
	state.currentMessage = await produceFortune(true, paramOptions);
	state.currentNumbers = produceRandomNumbers(4, 1, 100);
	state.currentImageBack = chooseOptionFromArr(imageBank.back);
	state.currentImageFront = chooseOptionFromArr(imageBank.front);
	if (options.callback) {
		options.callback(state);
	}
	updateTicket();
} /* createFortuneOnTicket */

function init() {
	fetch('assets/json/responses.json')
		.then((responses) => responses.json())
		.then((json) => { responseBank = json; });
	fetch('assets/json/images.json')
		.then((images) => images.json())
		.then((json) => { imageBank = json; });
} /* init */

document.addEventListener('DOMContentLoaded', init);
