
import * as THREE from 'three';

export function createWaterScene(){

	const group = new THREE.Group();

	group.add( new THREE.AmbientLight( 0xff0000 ) );

	const	boxMesh = new THREE.Mesh(
		new THREE.BoxGeometry( 1, 1, 1 ),
		new THREE.MeshStandardMaterial( { roughness: 0 } )
	);

	boxMesh.position.y = 2;
	group.add( boxMesh );


	const icosahedronMesh = new THREE.Mesh(
		new THREE.IcosahedronGeometry( 0.5, 4 ),
		new THREE.MeshBasicMaterial({
			color: 0xffffff,
		})
	);

	icosahedronMesh.position.set( 2, 2, 2 );
	group.add( icosahedronMesh );


	const coneMesh = new THREE.Mesh(
		new THREE.ConeGeometry( 0.5, 1, 64 ),
		new THREE.MeshBasicMaterial( {
			color: 'yellow'
		})
	);
	coneMesh.position.set( -2, 2, -2 );
	group.add( coneMesh );


	group.add( new THREE.AxesHelper(20) );

	const ground = new THREE.Mesh(
		new THREE.PlaneGeometry( 20, 20 ),
		new THREE.MeshBasicMaterial( {

		} )
	);
	ground.rotation.x = Math.PI * - 0.5;
	ground.position.y = -3;
	group.add( ground );

	const textureLoader = new THREE.TextureLoader();
	textureLoader.load( '../../../../assets/images/logo1.jpg', function ( map ) {

		map.wrapS = THREE.RepeatWrapping;
		map.wrapT = THREE.RepeatWrapping;
		map.anisotropy = 16;
		map.colorSpace = THREE.SRGBColorSpace;
		ground.material.map = map;
		ground.material.needsUpdate = true;

	} );

	return group;
}

// export function createWaterScene1(){

// 	const group = new THREE.Group();


// 	return group;
// }