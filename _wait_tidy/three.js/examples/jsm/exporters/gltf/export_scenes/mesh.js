import * as THREE from 'three';

export function addOnePlane( scene ){

	const plane = new THREE.BufferGeometry();

	plane.setAttribute( "position", new THREE.BufferAttribute(new Float32Array([
		-4, 4, 0,
		 4, 4, 0,
		-4,-4, 0,
		 4,-4, 0,
	]), 3) );
	plane.setAttribute( "uv", new THREE.BufferAttribute( new Float32Array([
		0, 1,
		1, 1,
		0, 0,
		1, 0,
	]), 2) );

	plane.setIndex( new THREE.BufferAttribute(new Uint16Array([
		0, 2, 3,
		3, 1, 0
	]), 1) );

	const mesh = new THREE.Mesh( plane,
		new THREE.MeshBasicMaterial({
			transparent: true,
			opacity: 0.2,
			color: 0xff0000
		})
	);

	scene.add( mesh );
}


export function addTwoPlane( scene ){

	const plane = new THREE.BufferGeometry();

	plane.setAttribute( "position", new THREE.BufferAttribute(new Float32Array([
		-4, 4, 0,
		 4, 4, 0,
		-4,-4, 0,
		 4,-4, 0,
	]), 3) );
	plane.setAttribute( "uv", new THREE.BufferAttribute( new Float32Array([
		0, 1,
		1, 1,
		0, 0,
		1, 0,
	]), 2) );

	plane.setIndex( new THREE.BufferAttribute(new Uint16Array([
		0, 2, 3,
		3, 1, 0
	]), 1) );

	const mesh1 = new THREE.Mesh( plane,
		new THREE.MeshBasicMaterial({
			color: 0xffffff
		})
	);
	mesh1.position.x = -4;
	mesh1.scale.set(0.5, 0.5, 0.5);
	scene.add( mesh1 );

	const mesh2 = new THREE.Mesh( plane,
		new THREE.MeshBasicMaterial({
			color: 0xff0000
		})
	);
	mesh2.position.x = 4;
	mesh2.scale.set(0.5, 0.5, 0.5);
	scene.add( mesh2 );
}