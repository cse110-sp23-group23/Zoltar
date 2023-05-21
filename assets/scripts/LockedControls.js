/*
Skinned build of FirstPersonControls for Three.js
Removed position movement and constrained horizontal camera movement
Original: https://github.com/mrdoob/three.js/blob/master/examples/jsm/controls/LockedControls.js
*/

import {
	MathUtils,
	Spherical,
	Vector3,
} from 'three';

const _lookDirection = new Vector3();
const _spherical = new Spherical();
const _target = new Vector3();

class LockedControls {
	constructor( object, domElement ) {
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

		this.handleResize = function () {
			if (this.domElement === document ) {
				this.viewHalfX = window.innerWidth / 2;
				this.viewHalfY = window.innerHeight / 2;
			} else {
				this.viewHalfX = this.domElement.offsetWidth / 2;
				this.viewHalfY = this.domElement.offsetHeight / 2;
			}
		};

		this.onPointerDown = function (event) {
			if (this.domElement !== document) {
				this.domElement.focus();
			}
			this.mouseDragOn = true;
		};

		this.onPointerUp = function (event) {
			this.mouseDragOn = false;
		};

		this.onPointerMove = function (event) {
			if (this.domElement === document) {
				this.pointerX = event.pageX - this.viewHalfX;
				this.pointerY = event.pageY - this.viewHalfY;
			} else {
				this.pointerX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
				this.pointerY = event.pageY - this.domElement.offsetTop - this.viewHalfY;
			}
		};

		this.lookAt = function (x, y, z) {
			if (x.isVector3) {
				_target.copy(x);
			} else {
				_target.set(x, y, z);
			}
			this.object.lookAt(_target);
			setOrientation(this);
			return this;
		};

		this.update = function () {
			const targetPosition = new Vector3();
			return function update(delta) {
				if (this.enabled === false) return;
				let actualLookSpeed = delta * this.lookSpeed;
				if (!this.activeLook) {
					actualLookSpeed = 0;
				}
				let verticalLookRatio = 1;
				if (this.constrainVertical) {
					verticalLookRatio = Math.PI / ( this.verticalMax - this.verticalMin );
				}
				lon = MathUtils.clamp(lon - this.pointerX * actualLookSpeed, this.minLon, this.maxLon);
				if (this.lookVertical) lat -= this.pointerY * actualLookSpeed * verticalLookRatio;
				lat = Math.max(-85, Math.min(85, lat));
				let phi = MathUtils.degToRad(90 - lat);
				const theta = MathUtils.degToRad(lon);
				if (this.constrainVertical) {
					phi = MathUtils.mapLinear( phi, 0, Math.PI, this.verticalMin, this.verticalMax );
				}
				const position = this.object.position;
				targetPosition.setFromSphericalCoords( 1, phi, theta ).add(position);
				this.object.lookAt(targetPosition);
			};
		}();

		this.dispose = function () {
			this.domElement.removeEventListener('contextmenu', contextmenu);
			this.domElement.removeEventListener('pointerdown', _onPointerDown);
			this.domElement.removeEventListener('pointermove', _onPointerMove);
			this.domElement.removeEventListener('pointerup', _onPointerUp);
			window.removeEventListener('resize', this.handleResize);
			window.removeEventListener('keydown', _onKeyDown);
			window.removeEventListener('keyup', _onKeyUp);
		};

		const _onPointerMove = this.onPointerMove.bind(this);
		const _onPointerDown = this.onPointerDown.bind(this);
		const _onPointerUp = this.onPointerUp.bind(this);

		this.domElement.addEventListener('contextmenu', contextmenu);
		this.domElement.addEventListener('pointerdown', _onPointerDown);
		this.domElement.addEventListener('pointermove', _onPointerMove);
		this.domElement.addEventListener('pointerup', _onPointerUp);

		function setOrientation(controls) {
			const quaternion = controls.object.quaternion;
			_lookDirection.set(0, 0, - 1).applyQuaternion(quaternion);
			_spherical.setFromVector3(_lookDirection);
			lat = 90 - MathUtils.radToDeg(_spherical.phi);
			lon = MathUtils.radToDeg(_spherical.theta);
		}

		this.handleResize();
		setOrientation( this );
	}

}

function contextmenu( event ) {
	event.preventDefault();
}

export { LockedControls };