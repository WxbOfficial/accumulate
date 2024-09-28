

export const EndsWith = (str, suffix) => {
	return str.endsWith(suffix);
};


export const StartsWith = (str, suffix) => {
	if (!str) {
		return false;
	}
	return str.startsWith(suffix);
};

let textDecoder;

if( typeof TextDecoder !== "undefined" ){
	textDecoder = new TextDecoder();
}

export const Decode = (buffer) => {
	if (typeof textDecoder !== "undefined") {
		return textDecoder.decode(buffer);
	}

	let result = "";
	for (let i = 0; i < buffer.byteLength; i++) {
		result += String.fromCharCode(buffer[i]);
	}

	return result;
};


export const EncodeArrayBufferToBase64 = (buffer) => {
	const keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	let output = "";
	let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
	let i = 0;
	const bytes = ArrayBuffer.isView(buffer) ? new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength) : new Uint8Array(buffer);

	while (i < bytes.length) {
		chr1 = bytes[i++];
		chr2 = i < bytes.length ? bytes[i++] : Number.NaN;
		chr3 = i < bytes.length ? bytes[i++] : Number.NaN;

		enc1 = chr1 >> 2;
		enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
		enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
		enc4 = chr3 & 63;

		if (isNaN(chr2)) {
			enc3 = enc4 = 64;
		} else if (isNaN(chr3)) {
			enc4 = 64;
		}
		output += keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
	}

	return output;
};


export const DecodeBase64ToString = (base64Data) => {
	return atob(base64Data);
};

export const DecodeBase64ToBinary = (base64Data) => {
	const decodedString = DecodeBase64ToString(base64Data);
	const bufferLength = decodedString.length;
	const bufferView = new Uint8Array(new ArrayBuffer(bufferLength));

	for (let i = 0; i < bufferLength; i++) {
		bufferView[i] = decodedString.charCodeAt(i);
	}

	return bufferView.buffer;
};


export const PadNumber = (num, length) => {
	let str = String(num);
	while (str.length < length) {
		str = "0" + str;
	}
	return str;
};

export const StringTools = {
	EndsWith,
	StartsWith,
	Decode,
	EncodeArrayBufferToBase64,
	DecodeBase64ToString,
	DecodeBase64ToBinary,
	PadNumber,
};
