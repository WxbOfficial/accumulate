import loadBuffer from './load_buffer.js';

export default function loadBufferView( json, bufferViewIndex, cache, bin ){

	const bufferView = json.bufferViews[ bufferViewIndex ];

	if ( bufferView.extensions && bufferView.extensions[ 'EXT_meshopt_compression' ] ) {

		throw new Error('bufferView extensions 情况待完善');
	}else {
		const byteLength = bufferView.byteLength || 0;
		const byteOffset = bufferView.byteOffset || 0;

		return loadBuffer( json, bufferView.buffer, cache, bin ).slice( byteOffset, byteOffset + byteLength );
	}
}