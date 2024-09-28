import * as THREE from 'three';

export function createDirectionalLightShadowScene(){

	const shadowScene = new THREE.Group();

	shadowScene.add( new THREE.AxesHelper(80) );

	const ground = new THREE.Mesh(
		new THREE.PlaneGeometry( 20, 20 ),
		new THREE.MeshLambertMaterial( {
			name: 'ground',
			// color: 0xff0000,
			// side: THREE.DoubleSide
		} )
	);

	ground.rotation.x = -Math.PI / 2;
	ground.position.y = -1;

	ground.receiveShadow = true;
	shadowScene.add( ground );


	const sphere = new THREE.Mesh(
		new THREE.SphereGeometry( 2, 32, 16 ),

		new THREE.MeshLambertMaterial( {
			emissive: new THREE.Color( 0xff0000 ),
			// color: 0x000000,
			// side: THREE.DoubleSide
		} )
	);

	sphere.position.set( 2, 2, 2 );
	sphere.castShadow = true;


	shadowScene.add( sphere );

	const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);

	directionalLight.position.set( 0, 6, 0 )

	directionalLight.castShadow = true;

	directionalLight.shadow.mapSize.width = 512; // default
	directionalLight.shadow.mapSize.height = 512; // default
	directionalLight.shadowDarkness = 1;
	directionalLight.shadow.camera.near = 0.5; // default
	directionalLight.shadow.camera.far = 500; // default

	shadowScene.add( directionalLight );

	const directionalLightHelper = new THREE.DirectionalLightHelper( directionalLight );
	shadowScene.add( directionalLightHelper );

	return [shadowScene, directionalLight, directionalLightHelper];
}