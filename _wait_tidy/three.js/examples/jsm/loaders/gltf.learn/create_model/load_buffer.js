


export default function loadBuffer( json, bufferIndex, cache, bin ){

	const buffer = json.buffers[ bufferIndex ];

	// If present, GLB container is required to be the first buffer.
	if ( buffer.uri === void 0 && bufferIndex === 0 ) {

		return bin;
	}else {

		throw new Error('buffer 其他情况待完善');
	}
}