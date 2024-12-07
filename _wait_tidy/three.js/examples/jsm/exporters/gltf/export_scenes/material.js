import * as THREE from 'three';


export function addLineBasicMaterial( scene ){
	const material = new THREE.LineBasicMaterial( {
		color: 0xffffff,
		linewidth: 1,
	} );

	const geometry = new THREE.BufferGeometry()

	geometry.setAttribute( "position", new THREE.BufferAttribute(new Float32Array([
		-4, 4, 0,
		 4, 4, 0,
		-4,-4, 0,
		 4,-4, 0,
	]), 3) );

	const line = new THREE.Line( geometry, material );

	scene.add( line );
}