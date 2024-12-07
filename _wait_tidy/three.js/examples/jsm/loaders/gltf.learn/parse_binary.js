
// copy from GLTFBinaryExtension

/* BINARY EXTENSION */
const BINARY_EXTENSION_HEADER_MAGIC = 'glTF';
const BINARY_EXTENSION_HEADER_LENGTH = 12;
const BINARY_EXTENSION_CHUNK_TYPES = { JSON: 0x4E4F534A, BIN: 0x004E4942 };

export default function ParseBinary( data ){

	const headerView = new DataView( data, 0, BINARY_EXTENSION_HEADER_LENGTH );
	const textDecoder = new TextDecoder();

	const
		magic = textDecoder.decode( new Uint8Array( data.slice( 0, 4 ) ) ),
		version = headerView.getUint32( 4, true ),
		length = headerView.getUint32( 8, true );

	let
		json = null,
		bin = null;

	const chunkContentsLength = length - BINARY_EXTENSION_HEADER_LENGTH;
	const chunkView = new DataView( data, BINARY_EXTENSION_HEADER_LENGTH );
	let chunkIndex = 0;

	while ( chunkIndex < chunkContentsLength ) {

		const chunkLength = chunkView.getUint32( chunkIndex, true );
		chunkIndex += 4;

		const chunkType = chunkView.getUint32( chunkIndex, true );
		chunkIndex += 4;

		if ( chunkType === BINARY_EXTENSION_CHUNK_TYPES.JSON ) {

			const contentArray = new Uint8Array( data, BINARY_EXTENSION_HEADER_LENGTH + chunkIndex, chunkLength );
			json = JSON.parse( textDecoder.decode( contentArray ) );

		} else if ( chunkType === BINARY_EXTENSION_CHUNK_TYPES.BIN ) {

			const byteOffset = BINARY_EXTENSION_HEADER_LENGTH + chunkIndex;
			bin = data.slice( byteOffset, byteOffset + chunkLength );

		}

		// Clients must ignore chunks with unknown types.

		chunkIndex += chunkLength;
	}

	return {
		magic,
		version,
		length,
		json,
		bin,
	}
}