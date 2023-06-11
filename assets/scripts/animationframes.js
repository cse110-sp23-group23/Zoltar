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
	return targetPos
		.clone()
		.sub(objectPos)
		.multiplyScalar(speed * delta);
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
 * @param { Object} args - object containing all relevant info and objects from scene
 */
export function animateShakeFrame(delta, args) {
	if (args.state.currentShakeDuration > 0 || !args.state.responseGenerated) { // if not done
		args.state.shakeDeltaVec.random().subScalar(0.5).multiply(args.options.shake.intensity);
		args.camera.position.add(args.state.shakeDeltaVec);
		args.state.currentShakeDuration -= delta;
		args.state.shakeEndHappened = false;
	} else if (!args.state.shakeEndHappened) { // do once when done
		args.state.shakeEndHappened = true;
		args.ticket.position.copy(args.options.ticketSlide.initialPosition);
		args.scene.add(args.ticket); // spawn ticket
		args.state.slideCameraTowardDefault = true; // move back to original position
	}
} /* animateShakeFrame */

/**
 * Generates difference from last frame in terms of background lights flickering
 * @param { Double } delta - time since last frame generated
 * @param { Object} args - object containing all relevant info and objects from scene
 */
export function animateFlickerFrame(delta, args) {
	args.state.flickerTime += delta;
	if (args.state.currentFlickerCount > 0) {
		if (shouldFlickerOff(args.state, args.options)) {
			args.scene.remove(args.ambient);
			args.state.flickerOn = false;
			args.state.flickerTime = 0;
		} else if (shouldFlickerOn(args.state)) {
			args.scene.add(args.ambient);
			args.state.flickerOn = true;
			args.state.flickerTime = 0;
			args.state.currentFlickerCount -= 1;
			args.state.curFlickerOffInterval = args.options.flicker.timingFunc();
		}
	} else if (Math.random() < args.options.flicker.startProbability) {
		args.state.currentFlickerCount = args.options.flicker.countFunc();
	}
} /* animateFlickerFrame */

/**
 * Generates frame tending camera toward default position if state allows
 * @param { Double } delta - time since last frame requested
 * @param { Object} args - object containing all relevant info and objects from scene
 */
export function conditionalAnimateSlideCameraFrame(delta, args) {
	if (!args.state.slideCameraTowardDefault) {
		return;
	}
	const cameraAdjustment = calcMidDistance(
		args.camera.position,
		args.options.camera.defaultPosition,
		args.options.cameraSlide.speed,
		delta,
	);
	args.camera.position.add(cameraAdjustment);
	if (args.camera.position.equals(args.options.camera.defaultPosition)) {
		args.state.slideCameraTowardDefault = false;
	}
} /* conditionalAnimateSlideCameraFrame */

/**
 * Generates difference from last frame in terms of ticket sliding out of dispenser
 * @param { Double } delta - time since last frame generated
 * @param { Object} args - object containing all relevant info and objects from scene
 */
export function animateTicketSlideFrame(delta, args) {
	if (args.ticket.position.distanceTo(args.options.ticketSlide.finalPosition) <= 0.01) {
		return;
	}
	const ticketAdjustment = calcMidDistance(
		args.ticket.position,
		args.options.ticketSlide.finalPosition,
		args.options.ticketSlide.speed,
		delta,
	);
	args.ticket.position.add(ticketAdjustment);
} /* animateTicketSlideFrame */
