import * as THREE from 'three';

import { Water } from '../../../jsm.js';
import { createWaterScene } from '../create_scene.water.js';

export class WaterTool extends THREE.Object3D {

	constructor(){
		super();

		this.clipBias = 0;






		this.eye = new THREE.Vector3( 0, 0, 0 );

		this.mirrorPlane = new THREE.Plane();
		this.normal = new THREE.Vector3();
		this.mirrorWorldPosition = new THREE.Vector3();
		this.cameraWorldPosition = new THREE.Vector3();
		this.rotationMatrix = new THREE.Matrix4();
		this.lookAtPosition = new THREE.Vector3( 0, 0, - 1 );
		this.clipPlane = new THREE.Vector4();

		this.view = new THREE.Vector3();
		this.target = new THREE.Vector3();
		this.q = new THREE.Vector4();

		this.textureMatrix = new THREE.Matrix4();

		this.mirrorCamera = new THREE.PerspectiveCamera();
	}

	update = function( camera ){

		this.mirrorWorldPosition.setFromMatrixPosition( this.matrixWorld );
		this.cameraWorldPosition.setFromMatrixPosition( camera.matrixWorld );

		this.rotationMatrix.extractRotation( this.matrixWorld );

		this.normal.set( 0, 0, 1 );
		this.normal.applyMatrix4( this.rotationMatrix );

		this.view.subVectors( this.mirrorWorldPosition, this.cameraWorldPosition );

		// Avoid rendering when mirror is facing away

		if ( this.view.dot( this.normal ) > 0 ) return;

		this.view.reflect( this.normal ).negate();
		this.view.add( this.mirrorWorldPosition );

		this.rotationMatrix.extractRotation( camera.matrixWorld );

		this.lookAtPosition.set( 0, 0, - 1 );
		this.lookAtPosition.applyMatrix4( this.rotationMatrix );
		this.lookAtPosition.add( this.cameraWorldPosition );

		this.target.subVectors( this.mirrorWorldPosition, this.lookAtPosition );
		this.target.reflect( this.normal ).negate();
		this.target.add( this.mirrorWorldPosition );

		this.mirrorCamera.position.copy( this.view );
		this.mirrorCamera.up.set( 0, 1, 0 );
		this.mirrorCamera.up.applyMatrix4( this.rotationMatrix );
		this.mirrorCamera.up.reflect( this.normal );
		this.mirrorCamera.lookAt( this.target );

		this.mirrorCamera.far = camera.far; // Used in WebGLBackground

		this.mirrorCamera.updateMatrixWorld();
		this.mirrorCamera.projectionMatrix.copy( camera.projectionMatrix );

		// 与 Water 2 中的 updateTextureMatrix 类似
		// Update the texture matrix
		this.textureMatrix.set(
			0.5, 0.0, 0.0, 0.5,
			0.0, 0.5, 0.0, 0.5,
			0.0, 0.0, 0.5, 0.5,
			0.0, 0.0, 0.0, 1.0
		);
		this.textureMatrix.multiply( this.mirrorCamera.projectionMatrix );
		this.textureMatrix.multiply( this.mirrorCamera.matrixWorldInverse );
		// this.textureMatrix.multiply( this.matrixWorld );

		// Now update projection matrix with new clip plane, implementing code from: http://www.terathon.com/code/oblique.html
		// Paper explaining this technique: http://www.terathon.com/lengyel/Lengyel-Oblique.pdf
		this.mirrorPlane.setFromNormalAndCoplanarPoint( this.normal, this.mirrorWorldPosition );
		this.mirrorPlane.applyMatrix4( this.mirrorCamera.matrixWorldInverse );

		this.clipPlane.set( this.mirrorPlane.normal.x, this.mirrorPlane.normal.y, this.mirrorPlane.normal.z, this.mirrorPlane.constant );

		const projectionMatrix = this.mirrorCamera.projectionMatrix;

		this.q.x = ( Math.sign( this.clipPlane.x ) + projectionMatrix.elements[ 8 ] ) / projectionMatrix.elements[ 0 ];
		this.q.y = ( Math.sign( this.clipPlane.y ) + projectionMatrix.elements[ 9 ] ) / projectionMatrix.elements[ 5 ];
		this.q.z = - 1.0;
		this.q.w = ( 1.0 + projectionMatrix.elements[ 10 ] ) / projectionMatrix.elements[ 14 ];

		// Calculate the scaled plane vector
		this.clipPlane.multiplyScalar( 2.0 / this.clipPlane.dot( this.q ) );

		// Replacing the third row of the projection matrix
		projectionMatrix.elements[ 2 ] = this.clipPlane.x;
		projectionMatrix.elements[ 6 ] = this.clipPlane.y;
		projectionMatrix.elements[ 10 ] = this.clipPlane.z + 1.0 - this.clipBias;
		projectionMatrix.elements[ 14 ] = this.clipPlane.w;

		this.eye.setFromMatrixPosition( camera.matrixWorld );


	}
}

export function getDemoScene( camera ){

	const scene = new THREE.Scene();

	const waterScene = createWaterScene();

	scene.add( waterScene );

	const water = new Water(
		new THREE.PlaneGeometry( 10, 10 ),
		{
			textureWidth: 512,
			textureHeight: 512,
			waterNormals: new THREE.TextureLoader().load( '../../textures/waternormals.jpg', function ( texture ) {

				texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
			} ),
			sunDirection: new THREE.Vector3(),
			sunColor: 0xffffff,
			waterColor: 0x001e0f,
			distortionScale: 3.7,
			fog: scene.fog !== undefined
		}
	);

	water.position.y = 1;
	water.rotation.x = Math.PI * - 0.5;
	scene.add( water );

	return [ scene, water ];
}