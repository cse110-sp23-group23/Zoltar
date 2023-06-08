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
