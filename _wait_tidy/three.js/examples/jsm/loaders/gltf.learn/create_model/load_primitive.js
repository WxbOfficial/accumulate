import { BufferGeometry } from 'three';

import { ATTRIBUTES } from './constant.js';
import loadAccessor from './load_accessor.js';

function createPrimitiveKey( primitive ) {

	let geometryKey;

	const dracoExtension = primitive.extensions && primitive.extensions[ 'KHR_draco_mesh_compression' ];

	if ( dracoExtension ) {

		geometryKey = 'draco:' + dracoExtension.bufferView
				+ ':' + dracoExtension.indices
				+ ':' + createAttributesKey( dracoExtension.attributes );
	} else {

		geometryKey = primitive.indices + ':' + createAttributesKey( primitive.attributes ) + ':' + primitive.mode;
	}

	if ( primitive.targets !== undefined ) {

		for ( let i = 0, il = primitive.targets.length; i < il; i ++ ) {

			geometryKey += ':' + createAttributesKey( primitive.targets[ i ] );
		}
	}

	return geometryKey;
}


function createAttributesKey( attributes ) {

	let attributesKey = '';

	const keys = Object.keys( attributes ).sort();

	for ( let i = 0, il = keys.length; i < il; i ++ ) {

		attributesKey += keys[ i ] + ':' + attributes[ keys[ i ] ] + ';';

	}

	return attributesKey;
}

export default function loadPrimitive( json, primitive, cache, bin ){

	const cacheKey = createPrimitiveKey( primitive );
	const cached = cache.geometries[ cacheKey ];

	if( cached ){

		return cached;
	} else {

		if ( primitive.extensions &&
			primitive.extensions[ 'KHR_draco_mesh_compression' ] ) {

			throw new Error( 'primitive KHR_draco_mesh_compression 拓展待完善' );
		}else {

			const geometry =  addPrimitiveAttributes( json, new BufferGeometry(), primitive, cache, bin );

			cache.geometries[ cacheKey ] = geometry;

			return geometry;
		}
	}
}

export function addPrimitiveAttributes( json, geometry, primitive, cache, bin ){

	const attributes = primitive.attributes;

	for ( const gltfAttributeName in attributes ) {

		const attributeName = ATTRIBUTES[ gltfAttributeName ] || gltfAttributeName.toLowerCase();

		if ( attributeName in geometry.attributes ) {
			continue;
		}

		geometry.setAttribute( attributeName,
			loadAccessor( json, attributes[ gltfAttributeName ], cache, bin ) );
	}

	if ( primitive.indices !== undefined && ! geometry.index ) {

		geometry.setIndex(
			loadAccessor( json, primitive.indices, cache, bin ) );
	}

	return geometry;
}