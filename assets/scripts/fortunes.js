import { state, updateTicket } from './ticket.js';
import { loadJsonArr, chooseOptionFromArr, produceRandomNumbers } from './util.js';

const ENDPOINT_URL = 'https://zoltar-gpt-api-team-23.netlify.app/.netlify/functions/gptendpoint';
const ENABLE_GPT_FLAG = false;

let responseBank = [];
let imageBank = [];

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

async function init() {
	responseBank = await loadJsonArr('../assets/json/responses.json');
	imageBank = await loadJsonArr('../assets/json/images.json');
} /* init */

document.addEventListener('DOMContentLoaded', init);
