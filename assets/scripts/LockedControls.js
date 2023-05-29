/*
Skinned build of FirstPersonControls for Three.js
Removed position movement and constrained horizontal camera movement
Original: https://github.com/mrdoob/three.js/blob/master/examples/jsm/controls/LockedControls.js
*/

import {
	MathUtils,
	Spherical,
	Vector3,
} from 'three'; // eslint-disable-line import/no-unresolved

export default class LockedControls {
	constructor(object, domElement) {
		this.object = object;
		this.domElement = domElement;

		this.lookDirection = new Vector3();
		this.spherical = new Spherical();
		this.target = new Vector3();
		this.targetPosition = new Vector3();

		this.options = {
			verticalMin: 1.67,
			verticalMax: 1.87,
			lookSpeed: 0.035,
			minLon: 29,
			maxLon: 37,
		};

		this.API = {
			enabled: true,
		};

		this.state = {
			autoSpeedFactor: 0.0,
			pointerX: 0,
			pointerY: 0,
			viewHalfX: 0,
			viewHalfY: 0,
			lat: 0,
			lon: 0,
		};

		this.domElement.addEventListener('pointerdown', this.onPointerDown.bind(this));
		this.domElement.addEventListener('pointermove', this.onPointerMove.bind(this));
		window.addEventListener('resize', this.handleResize.bind(this));

		this.handleResize();
		this.setOrientation();
		this.update(0.01);
	}

	setOrientation() {
		this.lookDirection.set(0, 0, -1).applyQuaternion(this.object.quaternion);
		this.spherical.setFromVector3(this.lookDirection);
		this.state.lat = 90 - MathUtils.radToDeg(this.spherical.phi);
		this.state.lon = MathUtils.radToDeg(this.spherical.theta);
	}

	handleResize() {
		if (this.domElement === document) {
			this.state.viewHalfX = window.innerWidth / 2;
			this.state.viewHalfY = window.innerHeight / 2;
		} else {
			this.state.viewHalfX = this.domElement.offsetWidth / 2;
			this.state.viewHalfY = this.domElement.offsetHeight / 2;
		}
	}

	onPointerDown() {
		if (this.domElement !== document) {
			this.domElement.focus();
		}
	}

	onPointerMove(event) {
		if (this.domElement === document) {
			this.state.pointerX = event.pageX - this.state.viewHalfX;
			this.state.pointerY = event.pageY - this.state.viewHalfY;
		} else {
			this.state.pointerX = event.pageX - this.domElement.offsetLeft - this.state.viewHalfX;
			this.state.pointerY = event.pageY - this.domElement.offsetTop - this.state.viewHalfY;
		}
	}

	lookAt(x, y, z) {
		if (x.isVector3) {
			this.target.copy(x);
		} else {
			this.target.set(x, y, z);
		}
		this.object.lookAt(this.target);
		this.setOrientation(this);
		return this;
	}

	update(delta) {
		if (!this.API.enabled) {
			return;
		}
		const actualLookSpeed = delta * this.options.lookSpeed;
		const verticalLookRatio = Math.PI / (this.options.verticalMax - this.options.verticalMin);
		const originalLon = this.state.lon - this.state.pointerX * actualLookSpeed;
		this.state.lon = MathUtils.clamp(originalLon, this.options.minLon, this.options.maxLon);
		this.state.lat -= this.state.pointerY * actualLookSpeed * verticalLookRatio;
		this.state.lat = Math.max(-85, Math.min(85, this.state.lat));
		let phi = MathUtils.degToRad(90 - this.state.lat);
		const theta = MathUtils.degToRad(this.state.lon);
		phi = MathUtils.mapLinear(phi, 0, Math.PI, this.options.verticalMin, this.options.verticalMax);
		this.targetPosition.setFromSphericalCoords(1, phi, theta).add(this.object.position);
		this.object.lookAt(this.targetPosition);
	}
}
