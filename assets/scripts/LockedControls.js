import {
	MathUtils,
	Vector3,
} from 'three'; // eslint-disable-line import/no-unresolved

/**
 * This controller allows the user to move their view around the screen using
 * their mouse pointer. The absolute camera position is fixed. Both horizontal and
 * vertical movement are constrained to predefined limits. Loosely based on code from
 * https://github.com/mrdoob/three.js/blob/master/examples/jsm/controls/LockedControls.js
 * @class LockedControls
 * @property { Object } object - the 3D object that will be controlled, typically a camera
 * @property { Object } domElement - the DOM element listening for mouse movement
 * @property { Object } options - configuration settings for controls
 * @property { Object } API - public API for controls
 * @property { Object } state - cur state of controls including current pointer and view information
 */
export default class LockedControls {
	/**
     * Initializes the controler with provided object and domElement, sets up event listeners,
	 * and updates the controls with an initial delta.
     * @param {Object} object - the 3D object to control.
     * @param {Object} domElement - the DOM element to attach the controls to
     */
	constructor(object, domElement) {
		this.options = {
			lookSpeed: 0.001,
			minLon: 0.51,
			maxLon: 0.65,
			minLat: 1.68,
			maxLat: 1.88,
		};

		this.object = object;
		this.domElement = domElement;

		this.API = {
			enabled: true,
		};

		this.state = {
			autoSpeedFactor: 0,
			pointerX: 0,
			pointerY: 0,
			viewHalfX: 0,
			viewHalfY: 0,
			lat: (this.options.minLat + this.options.maxLat) / 2,
			lon: (this.options.minLon + this.options.maxLon) / 2,
			targetPosition: new Vector3(),
		};

		this.domElement.addEventListener('pointermove', this.onPointerMove.bind(this));
		window.addEventListener('resize', this.handleResize.bind(this));

		this.handleResize();
		this.update(0.01);
	}

	/**
     * Event handler for the pointermove event. Updates the pointer state based on
	 * the current mouse position
     * @param { Event } event - the pointermove event passed in
     */
	onPointerMove(event) {
		if (this.domElement === document) {
			this.state.pointerX = event.pageX - this.state.viewHalfX;
			this.state.pointerY = event.pageY - this.state.viewHalfY;
		} else {
			this.state.pointerX = event.pageX - this.domElement.offsetLeft - this.state.viewHalfX;
			this.state.pointerY = event.pageY - this.domElement.offsetTop - this.state.viewHalfY;
		}
	}

	/**
     * Event handler for the resize event. Updates the view state based on the
	 * current size of the domElement.
	 * @param none
     */
	handleResize() {
		if (this.domElement === document) {
			this.state.viewHalfX = window.innerWidth / 2;
			this.state.viewHalfY = window.innerHeight / 2;
		} else {
			this.state.viewHalfX = this.domElement.offsetWidth / 2;
			this.state.viewHalfY = this.domElement.offsetHeight / 2;
		}
	}

	/**
     * Updates the controls. This should be called in an animation loop, and must be passed the
	 * time delta since the last update. Updates the look direction and spherical coordinates
	 * based on the current mouse position and look speed.
     * @param { Double } delta - time delta since the last update
     */
	update(delta) {
		if (!this.API.enabled) {
			return;
		}

		const actualLookSpeed = delta * this.options.lookSpeed;
		this.state.lon -= this.state.pointerX * actualLookSpeed;
		this.state.lat += this.state.pointerY * actualLookSpeed;

		this.state.lon = MathUtils.clamp(this.state.lon, this.options.minLon, this.options.maxLon);
		this.state.lat = MathUtils.clamp(this.state.lat, this.options.minLat, this.options.maxLat);

		this.state.targetPosition.setFromSphericalCoords(1, this.state.lat, this.state.lon);
		this.state.targetPosition.add(this.object.position);
		this.object.lookAt(this.state.targetPosition);
	}
}
