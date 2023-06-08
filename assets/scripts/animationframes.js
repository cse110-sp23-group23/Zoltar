/* eslint-disable no-param-reassign */

/**
 * Helper to calculate a 'step' in the direction of targetPos from objectPos in 3 dimensions
 * @param { Vector3 } objectPos - vector representing cur position in 3d space
 * @param { Vector3} targetPos - vector representing target position in 3d spcae
 * @param { Double } speed - scalar representing proportion of distance to travel
 * @param { Double } delta - time since last call
 * @returns { Vector3 } - representation of intermediate distance on coord plane
 */
function calcMidDistance(objectPos, targetPos, speed, delta) {
	return targetPos.clone().sub(objectPos).multiplyScalar(speed * delta);
} /* calcMidDistance */

/**
 * Helper func to decide if lights should turn off
 * @param none
 * @return { Boolean }
 */
function shouldFlickerOff(state, options) {
	return (state.flickerOn) && (state.flickerTime >= options.flicker.onInterval);
} /* shouldFlickerOff */

/**
 * Helper func to decide if lights should turn back on
 * @param none
 * @return { Boolean }
 */
function shouldFlickerOn(state) {
	return (!state.flickerOn) && (state.flickerTime >= state.curFlickerOffInterval);
} /* shouldFlickerOn */

/**
 * Generates difference from last frame in terms of camera shake
 * @param { Double } delta - time since last frame generated
 */
export function animateShakeFrame(delta, state, options, ticket, camera, scene) {
	if (state.currentShakeDuration > 0 || !state.responseGenerated) { // if not done
		state.shakeDeltaVec.random().subScalar(0.5).multiply(options.shake.intensity);
		camera.position.add(state.shakeDeltaVec);
		state.currentShakeDuration -= delta;
		state.shakeEndHappened = false;
	} else if (!state.shakeEndHappened) { // do once when done
		state.shakeEndHappened = true;
		ticket.position.copy(options.ticketSlide.initialPosition);
		scene.add(ticket); // spawn ticket
		state.slideCameraTowardDefault = true; // move back to original position
	}
} /* animateShakeFrame */

/**
 * Generates difference from last frame in terms of background lights flickering
 * @param { Double } delta - time since last frame generated
 */
export function animateFlickerFrame(delta, state, options, scene, ambient) {
	state.flickerTime += delta;
	if (state.currentFlickerCount > 0) {
		if (shouldFlickerOff(state, options)) {
			scene.remove(ambient);
			state.flickerOn = false;
			state.flickerTime = 0;
		} else if (shouldFlickerOn(state)) {
			scene.add(ambient);
			state.flickerOn = true;
			state.flickerTime = 0;
			state.currentFlickerCount -= 1;
			state.curFlickerOffInterval = options.flicker.timingFunc();
		}
	} else if (Math.random() < options.flicker.startProbability) {
		state.currentFlickerCount = options.flicker.countFunc();
	}
} /* animateFlickerFrame */

/**
 * Generates frame tending camera toward default position if state allows
 * @param { Double } delta - time since last frame requested
 */
export function conditionalAnimateSlideCameraFrame(delta, state, options, camera) {
	if (!state.slideCameraTowardDefault) {
		return;
	}
	const cameraAdjustment = calcMidDistance(
		camera.position,
		options.camera.defaultPosition,
		options.cameraSlide.speed,
		delta,
	);
	camera.position.add(cameraAdjustment);
	if (camera.position.equals(options.camera.defaultPosition)) {
		state.slideCameraTowardDefault = false;
	}
} /* conditionalAnimateSlideCameraFrame */

/**
 * Generates difference from last frame in terms of ticket sliding out of dispenser
 * @param { Double } delta - time since last frame generated
 */
export function animateTicketSlideFrame(delta, options, ticket) {
	if (ticket.position.distanceTo(options.ticketSlide.finalPosition) <= 0.01) {
		return;
	}
	const ticketAdjustment = calcMidDistance(
		ticket.position,
		options.ticketSlide.finalPosition,
		options.ticketSlide.speed,
		delta,
	);
	ticket.position.add(ticketAdjustment);
} /* animateTicketSlideFrame */
