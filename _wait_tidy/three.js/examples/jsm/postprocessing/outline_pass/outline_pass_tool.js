
import * as THREE from 'three';

export function createOutlinePassScene(){

	const colorArray = [0x00cbc8, 0x0081cb, 0x00cbb8, 0x00c1cb, 0xbacb00, 0x7c00cb, 0x7a00cb, 0xa300cb, 0x9800cb, 0x00cbbc, 0x97cb00, 0x4000cb, 0xabcb00, 0x9fcb00, 0x8700cb, 0xcbb400, 0xcb004c, 0x64cb00, 0x0091cb, 0x00cbb8];
	const positionArray = [
		{ x: -1.5588489357434576, y: 1.1606585826550901, z: 0.7021372794686127 },
		{ x: -0.6582104994702567, y: -1.736378051340123, z: 2.7656447589461086 },
		{ x: -0.14759543876479952, y: -2.968185192179346, z: -1.5615612543562332 },
		{ x: -0.5647630901093952, y: 0.9222723203910475, z: 1.2468226856017512 },
		{ x: 1.5891118773431288, y: 0.9283010882416818, z: 1.9909305739490257 },
		{ x: 2.769639499673416, y: -1.2976644074378734, z: 1.2428727472900487 },
		{ x: 0.8009604624534603, y: 1.3927286088630666, z: -2.5840043770249896 },
		{ x: 1.5856632022185408, y: 1.8354588339227078, z: -2.3280257693644604 },
		{ x: -1.4914863606082096, y: 2.1190824495091007, z: -2.444070658953419 },
		{ x: -1.1940496639085394, y: 0.7488308619982305, z: 2.271209618351694 },
		{ x: -1.0073932464775703, y: -2.46903227593967, z: -1.926653315099287 },
		{ x: 0.014499359789094779, y: 1.6811057419660766, z: 1.7794272064667673 },
		{ x: -2.429126203788805, y: -0.5880810449846612, z: 1.6562559979945268 },
		{ x: -1.2873536682260314, y: 0.21810480696311751, z: -0.8989165295578707 },
		{ x: -2.538647013655482, y: -0.7782770361432174, z: 2.5081333995006014 },
		{ x: 1.0055362236334542, y: 0.5514999125160198, z: 1.9462079510391774 },
		{ x: 0.8014812942495824, y: -1.606672391410044, z: -0.44796112094073726 },
		{ x: -1.333743909962156, y: 1.8001146759776177, z: 0.2981000152833997 },
		{ x: -2.9744472618929128, y: -1.8036792012192402, z: 1.6866695599193147 },
		{ x: 0.17036870397278747, y: -0.4810400336528824, z: -1.1870758792578022
		}
	];
	const scaleArray = [
		{ x: 0.11114165120909031, y: 0.11114165120909031, z: 0.11114165120909031 },
		{ x: 0.27875082577393007, y: 0.27875082577393007, z: 0.27875082577393007 },
		{ x: 0.11642746431789391, y: 0.11642746431789391, z: 0.11642746431789391 },
		{ x: 0.2259807995410909, y: 0.2259807995410909, z: 0.2259807995410909 },
		{ x: 0.34926264246917704, y: 0.34926264246917704, z: 0.34926264246917704 },
		{ x: 0.21589237292070002, y: 0.21589237292070002, z: 0.21589237292070002 },
		{ x: 0.39648735558046, y: 0.39648735558046, z: 0.39648735558046 },
		{ x: 0.2798511729822959, y: 0.2798511729822959, z: 0.2798511729822959 },
		{ x: 0.25888191307062114, y: 0.25888191307062114, z: 0.25888191307062114 },
		{ x: 0.17244733312779387, y: 0.17244733312779387, z: 0.17244733312779387 },
		{ x: 0.3730195817892187, y: 0.3730195817892187, z: 0.3730195817892187 },
		{ x: 0.274078783884496, y: 0.274078783884496, z: 0.274078783884496 },
		{ x: 0.3408495460310168, y: 0.3408495460310168, z: 0.3408495460310168 },
		{ x: 0.2360813967353148, y: 0.2360813967353148, z: 0.2360813967353148 },
		{ x: 0.3561485803725082, y: 0.3561485803725082, z: 0.3561485803725082 },
		{ x: 0.2948610503376867, y: 0.2948610503376867, z: 0.2948610503376867 },
		{ x: 0.36154189828048, y: 0.36154189828048, z: 0.36154189828048 },
		{ x: 0.1534816537749742, y: 0.1534816537749742, z: 0.1534816537749742 },
		{ x: 0.37132954869301127, y: 0.37132954869301127, z: 0.37132954869301127 },
		{ x: 0.3568109269747307, y: 0.3568109269747307, z: 0.3568109269747307 }
	]

	const group = new THREE.Group();
	const geometry = new THREE.SphereGeometry( 3, 48, 24 );

	for( let i = 0; i < 20; i++ ){

		const mesh = new THREE.Mesh(
			geometry,
			new THREE.MeshBasicMaterial({
				color: new THREE.Color( colorArray[i] )
			})
		);

		mesh.position.copy( positionArray[i] );
		mesh.scale.copy( scaleArray[i] );

		group.add( mesh );
	}

	return group;
}

export class OutlinePassTool {
	constructor(scene, camera, selectedObjects){

		this.renderScene = scene;
		this.renderCamera = camera;
		this.selectedObjects = selectedObjects !== undefined ? selectedObjects : [];


		this._visibilityCache = new Map();


		this.textureMatrix = new THREE.Matrix4();
	}

	changeVisibilityOfSelectedObjects( bVisible ) {

		const cache = this._visibilityCache;

		function gatherSelectedMeshesCallBack( object ) {

			if ( object.isMesh ) {

				if ( bVisible === true ) {

					object.visible = cache.get( object );

				} else {

					cache.set( object, object.visible );
					object.visible = bVisible;

				}

			}

		}

		for ( let i = 0; i < this.selectedObjects.length; i ++ ) {

			const selectedObject = this.selectedObjects[ i ];
			selectedObject.traverse( gatherSelectedMeshesCallBack );

		}

	}

	changeVisibilityOfNonSelectedObjects( bVisible ) {

		const cache = this._visibilityCache;
		const selectedMeshes = [];

		function gatherSelectedMeshesCallBack( object ) {

			if ( object.isMesh ) selectedMeshes.push( object );

		}

		for ( let i = 0; i < this.selectedObjects.length; i ++ ) {

			const selectedObject = this.selectedObjects[ i ];
			selectedObject.traverse( gatherSelectedMeshesCallBack );

		}

		function VisibilityChangeCallBack( object ) {

			if ( object.isMesh || object.isSprite ) {

				// only meshes and sprites are supported by OutlinePass

				let bFound = false;

				for ( let i = 0; i < selectedMeshes.length; i ++ ) {

					const selectedObjectId = selectedMeshes[ i ].id;

					if ( selectedObjectId === object.id ) {

						bFound = true;
						break;

					}

				}

				if ( bFound === false ) {

					const visibility = object.visible;

					if ( bVisible === false || cache.get( object ) === true ) {

						object.visible = bVisible;

					}

					cache.set( object, visibility );

				}

			} else if ( object.isPoints || object.isLine ) {

				// the visibilty of points and lines is always set to false in order to
				// not affect the outline computation

				if ( bVisible === true ) {

					object.visible = cache.get( object ); // restore

				} else {

					cache.set( object, object.visible );
					object.visible = bVisible;

				}

			}

		}

		this.renderScene.traverse( VisibilityChangeCallBack );

	}

	updateTextureMatrix() {

		this.textureMatrix.set( 0.5, 0.0, 0.0, 0.5,
			0.0, 0.5, 0.0, 0.5,
			0.0, 0.0, 0.5, 0.5,
			0.0, 0.0, 0.0, 1.0 );
		this.textureMatrix.multiply( this.renderCamera.projectionMatrix );
		this.textureMatrix.multiply( this.renderCamera.matrixWorldInverse );

	}
}