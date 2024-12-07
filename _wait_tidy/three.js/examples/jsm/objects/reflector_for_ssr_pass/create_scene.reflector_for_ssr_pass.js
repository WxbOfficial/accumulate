
import * as THREE from 'three';

export function createSSRScene(){

	const group = new THREE.Group();
	const boxMesh = new THREE.Mesh(
		new THREE.BoxGeometry(0.05, 0.05, 0.05),
		new THREE.MeshBasicMaterial({
			color: 0xffffff,
			map: new THREE.TextureLoader().load('../../../assets/images/logo1.jpg'),
		})
	);
	const icosahedronMesh = new THREE.Mesh(
		new THREE.IcosahedronGeometry( 0.025, 4 ),
		new THREE.MeshBasicMaterial({
			color: 0xffffff,
		})
	);

	boxMesh.position.set( -0.12, 0.025, 0.015 );
	icosahedronMesh.position.set( -0.05, 0.025, 0.08 );

	const coneMesh = new THREE.Mesh(
		new THREE.ConeGeometry( 0.025, 0.05, 64 ),
		new THREE.MeshBasicMaterial( {
			color: 'yellow'
		})
	);
	coneMesh.position.set( -0.05, 0.025, -0.055 );


	group.add( boxMesh );
	group.add( icosahedronMesh );
	group.add( coneMesh );

	return group;
}