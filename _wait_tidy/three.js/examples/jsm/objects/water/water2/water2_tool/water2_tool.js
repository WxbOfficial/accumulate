import * as THREE from 'three';

// import { Water } from '../../jsm.js';
// import { createWaterScene } from './create_scene.water.js';

export class Water2Tool extends THREE.Object3D {

	constructor(){
		super();


		this.mirrorCamera = new THREE.PerspectiveCamera();
	}

	update = function( camera ){


	}
}