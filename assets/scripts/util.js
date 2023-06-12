/**
 * Toggles a specific class for every HTML element in an array
 * @param { Array<HTMLElement> } arr - arr of elements to use
 * @param { String } className - name of class to toggle
 */
export function toggleClassToArr(arr, className) {
	arr.forEach((el) => {
		el.classList.toggle(className);
	});
} /* toggleClassToArr */

/**
 * Clamps value between high and low value, inclusive
 * @param { Integer } value number to be clamped
 * @param { Integer } lo lowest allowed value
 * @param { Integer } hi highest allowed value
 * @return { Integer }
 */
export function clamp(value, lo, hi) {
	if (value < lo) {
		return lo;
	}
	return value > hi ? hi : value;
} /* clamp */

/**
 * Loads array from external json file into javascript array
 * @param { String } url location of json file
 * @param { Array<Object> } destination array to put contents into
 */
export async function loadJsonArr(url) {
	return fetch(url).then((responses) => responses.json());
} /* loadJsonArr */

/**
 * Chooses a random item from an arrary
 * @param { Array<Object> } array of objects to choose from
 * @return { String } randomly chosen object
 */
export function chooseOptionFromArr(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
} /* chooseOptionFromArr */

/**
 * Basic promise that resolves after fixed input time
 * @param { Integer } delay ms delay before resolving
 * @returns { Promise } promise to resolve after delay length
 */
export function flickerDelay(delay) {
	return new Promise((resolve) => {
		setTimeout(resolve, delay);
	});
} /* flickerDelay */

/**
 * Quickly flash vignette on edges of screen to show user they clicked button
 * @param none
 */
export function flickVignette() {
	const cover = document.querySelector('.cover');
	cover.classList.remove('hidden');
	cover.classList.add('vignette-cover');
	cover.addEventListener('animationend', () => {
		cover.classList.add('hidden');
		cover.classList.remove('vignette-cover');
	});
} /* flickVignette */

/**
 * For elements with opacity transition, sets to no opacity and then hides
 * when transition is over
 * @param { HTMLElement } el element to hide
 */
export function slowHideElement(el) {
	el.classList.add('no-opacity');
	el.addEventListener('transitionend', () => {
		el.classList.add('hidden');
		el.classList.remove('no-opacity');
	}, { once: true });
} /* slowHideElement */

/**
 * Takes in an integer array and returns a string of integers separated by
 * 		commas with an 'and' after final comma
 * @param { Array<Integer> } arr
 * @return { String }
 */
export function convertArrToReadableString(arr) {
	if (arr.length === 0) return '';
	if (arr.length === 1) return arr[0].toString();

	return arr.reduce((prevText, nextNum, i, array) => {
		const isLastItem = i === array.length - 1;
		const delimiter = isLastItem ? ', and' : ',';
		return `${prevText}${delimiter} ${nextNum}`;
	});
} /* convertArrToReadableString */

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
