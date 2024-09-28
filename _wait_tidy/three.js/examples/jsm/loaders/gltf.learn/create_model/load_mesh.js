
// import { toTrianglesDrawMode } from '../utils/BufferGeometryUtils.js';
import { Mesh } from 'three';

import { WEBGL_CONSTANTS } from './constant.js';
import loadMaterial from './load_material.js';
import loadPrimitive from './load_primitive.js';


export default function loadMesh( json, meshIndex, cache, bin, isSkinnedMesh ){

	const
		mesh = json.meshes[ meshIndex ],
		primitives = mesh.primitives,

		threeMeshes = [];

	primitives.forEach(( primitive )=>{

		let
			material = loadMaterial( json, primitive.material, cache ),
			geometry = loadPrimitive( json, primitive, cache, bin ),
			threeMesh ;

		if ( primitive.mode === WEBGL_CONSTANTS.TRIANGLES ||
				primitive.mode === WEBGL_CONSTANTS.TRIANGLE_STRIP ||
				primitive.mode === WEBGL_CONSTANTS.TRIANGLE_FAN ||
				primitive.mode === undefined ) {

			threeMesh = isSkinnedMesh
				? new SkinnedMesh( geometry, material )
				: new Mesh( geometry, material );

			if ( threeMesh.isSkinnedMesh === true ) {

				// normalize skin weights to fix malformed assets (see #15319)
				threeMesh.normalizeSkinWeights();
			}

			if ( primitive.mode === WEBGL_CONSTANTS.TRIANGLE_STRIP ) {

				throw new Error( 'TRIANGLE_STRIP 暂未完善' );
			} else if ( primitive.mode === WEBGL_CONSTANTS.TRIANGLE_FAN ) {

				throw new Error( 'TRIANGLE_FAN 暂未完善' );
			}
		} else if ( primitive.mode === WEBGL_CONSTANTS.LINES ) {

			threeMesh = new LineSegments( geometry, material );
		} else if ( primitive.mode === WEBGL_CONSTANTS.LINE_STRIP ) {

			threeMesh = new Line( geometry, material );
		} else if ( primitive.mode === WEBGL_CONSTANTS.LINE_LOOP ) {

			threeMesh = new LineLoop( geometry, material );
		} else if ( primitive.mode === WEBGL_CONSTANTS.POINTS ) {

			threeMesh = new Points( geometry, material );
		} else {

			throw new Error( '位置类型的 primitive.mode' + primitive.mode  );
		}

		if ( Object.keys( threeMesh.geometry.morphAttributes ).length > 0 ) {

			throw new Error( 'morphAttributes 暂未完善' );
		}

		threeMesh.name = mesh.name;

		threeMeshes.push( threeMesh );
	});

	if ( threeMeshes.length === 1 ) {

		return threeMeshes[ 0 ];
	}

	const group = new Group();

	for ( let i = 0, il = meshes.length; i < il; i ++ ) {

		group.add( threeMeshes[ i ] );
	}

	return group;
}