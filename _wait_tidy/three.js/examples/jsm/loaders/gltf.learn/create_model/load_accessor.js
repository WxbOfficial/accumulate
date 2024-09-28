import { BufferAttribute } from 'three';

import { WEBGL_TYPE_SIZES, WEBGL_COMPONENT_TYPES } from './constant.js';
import loadBufferView from './load_buffer_view.js';

export default function loadAccessor( json, accessorIndex, cache, bin){

	if( cache.accessors[accessorIndex] ){

		return cache.accessors[accessorIndex];
	}

	const accessor = json.accessors[ accessorIndex ];

	if ( accessor.bufferView === void 0 && accessor.sparse === void 0 ) {

			const
				itemSize = WEBGL_TYPE_SIZES[ accessor.type ],
				TypedArray = WEBGL_COMPONENT_TYPES[ accessor.componentType ],
				normalized = accessor.normalized === true,
				array = new TypedArray( accessor.count * itemSize );;

			return new BufferAttribute( array, itemSize, normalized );
	}

	let bufferView;

	if( accessor.bufferView !== void 0 ){

		bufferView = loadBufferView( json, accessor.bufferView, cache, bin);
	}else{

		throw new Error( 'accessor.bufferView 不存在的情况, 待完善' );
	}

	if( accessor.sparse !== void 0 ){

		throw new Error( 'accessor.spare 不知道是什么情况' );
	}

	const itemSize = WEBGL_TYPE_SIZES[ accessor.type ];
	const TypedArray = WEBGL_COMPONENT_TYPES[ accessor.componentType ];

	const elementBytes = TypedArray.BYTES_PER_ELEMENT;
	const itemBytes = elementBytes * itemSize;
	const byteOffset = accessor.byteOffset || 0;
	const byteStride = accessor.bufferView !== undefined ? json.bufferViews[ accessor.bufferView ].byteStride : undefined;
	const normalized = accessor.normalized === true;
	let array, bufferAttribute;

	if ( byteStride && byteStride !== itemBytes ) {

		throw new Error( '待完善' );
	} else {

		if ( bufferView === null ) {

			array = new TypedArray( accessor.count * itemSize );
		} else {

			array = new TypedArray( bufferView, byteOffset, accessor.count * itemSize );
		}

		bufferAttribute = new BufferAttribute( array, itemSize, normalized );
	}

	if ( accessor.sparse !== undefined ) {

		throw new Error( '待完善' );
	}

	cache.accessors[accessorIndex] = bufferAttribute;


	return bufferAttribute;
}