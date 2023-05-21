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

const lookDirection = new Vector3();
const spherical = new Spherical();
const target = new Vector3();

function contextmenu(event) {
	event.preventDefault();
}

export default class LockedControls {
	constructor(object, domElement) {
		this.object = object;
		this.domElement = domElement;

		// API
		this.enabled = true;
		this.lookSpeed = 0.005;
		this.lookVertical = true;
		this.activeLook = true;
		this.constrainVertical = false;
		this.verticalMin = 0;
		this.verticalMax = Math.PI;
		this.mouseDragOn = false;
		this.minLon = -90;
		this.maxLon = 90;

		// Internals
		this.autoSpeedFactor = 0.0;
		this.pointerX = 0;
		this.pointerY = 0;
		this.viewHalfX = 0;
		this.viewHalfY = 0;

		// Private variables
		let lat = 0;
		let lon = 0;

		function setOrientation(controls) {
			lookDirection.set(0, 0, -1).applyQuaternion(controls.object.quaternion);
			spherical.setFromVector3(lookDirection);
			lat = 90 - MathUtils.radToDeg(spherical.phi);
			lon = MathUtils.radToDeg(spherical.theta);
		}

		this.handleResize = () => {
			if (this.domElement === document) {
				this.viewHalfX = window.innerWidth / 2;
				this.viewHalfY = window.innerHeight / 2;
			} else {
				this.viewHalfX = this.domElement.offsetWidth / 2;
				this.viewHalfY = this.domElement.offsetHeight / 2;
			}
		};

		this.onPointerDown = () => {
			if (this.domElement !== document) {
				this.domElement.focus();
			}
			this.mouseDragOn = true;
		};

		this.onPointerUp = () => {
			this.mouseDragOn = false;
		};

		this.onPointerMove = (event) => {
			if (this.domElement === document) {
				this.pointerX = event.pageX - this.viewHalfX;
				this.pointerY = event.pageY - this.viewHalfY;
			} else {
				this.pointerX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
				this.pointerY = event.pageY - this.domElement.offsetTop - this.viewHalfY;
			}
		};

		this.lookAt = (x, y, z) => {
			if (x.isVector3) {
				target.copy(x);
			} else {
				target.set(x, y, z);
			}
			this.object.lookAt(target);
			setOrientation(this);
			return this;
		};

		this.update = (() => {
			const targetPosition = new Vector3();
			return function update(delta) {
				if (this.enabled === false) return;
				let actualLookSpeed = delta * this.lookSpeed;
				if (!this.activeLook) {
					actualLookSpeed = 0;
				}
				let verticalLookRatio = 1;
				if (this.constrainVertical) {
					verticalLookRatio = Math.PI / (this.verticalMax - this.verticalMin);
				}
				lon = MathUtils.clamp(lon - this.pointerX * actualLookSpeed, this.minLon, this.maxLon);
				if (this.lookVertical) lat -= this.pointerY * actualLookSpeed * verticalLookRatio;
				lat = Math.max(-85, Math.min(85, lat));
				let phi = MathUtils.degToRad(90 - lat);
				const theta = MathUtils.degToRad(lon);
				if (this.constrainVertical) {
					phi = MathUtils.mapLinear(phi, 0, Math.PI, this.verticalMin, this.verticalMax);
				}
				targetPosition.setFromSphericalCoords(1, phi, theta).add(this.object.position);
				this.object.lookAt(targetPosition);
			};
		})();

		const onPointerMove = this.onPointerMove.bind(this);
		const onPointerDown = this.onPointerDown.bind(this);
		const onPointerUp = this.onPointerUp.bind(this);

		this.domElement.addEventListener('contextmenu', contextmenu);
		this.domElement.addEventListener('pointerdown', onPointerDown);
		this.domElement.addEventListener('pointermove', onPointerMove);
		this.domElement.addEventListener('pointerup', onPointerUp);

		this.dispose = () => {
			this.domElement.removeEventListener('contextmenu', contextmenu);
			this.domElement.removeEventListener('pointerdown', onPointerDown);
			this.domElement.removeEventListener('pointermove', onPointerMove);
			this.domElement.removeEventListener('pointerup', onPointerUp);
			window.removeEventListener('resize', this.handleResize);
		};

		this.handleResize();
		setOrientation(this);
	}
}
