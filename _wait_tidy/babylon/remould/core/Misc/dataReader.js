import { Decode } from './stringTools.js';


export class DataReader {

	constructor(buffer) {

		this.byteOffset = 0;
		this.buffer = buffer;
	}

	loadAsync(byteLength){
		return this.buffer.readAsync(this.byteOffset, byteLength).then((data) => {
			this._dataView = new DataView(data.buffer, data.byteOffset, data.byteLength);
			this._dataByteOffset = 0;
		});
	}

	readUint32() {
	  const value = this._dataView.getUint32(this._dataByteOffset, true);
	  this._dataByteOffset += 4;
	  this.byteOffset += 4;
	  return value;
	}

	readUint8Array(byteLength) {
	  const value = new Uint8Array(this._dataView.buffer, this._dataView.byteOffset + this._dataByteOffset, byteLength);
	  this._dataByteOffset += byteLength;
	  this.byteOffset += byteLength;
	  return value;
	}

	readString(byteLength) {
	  return Decode(this.readUint8Array(byteLength));
	}

	skipBytes(byteLength) {
      this._dataByteOffset += byteLength;
      this.byteOffset += byteLength;
  }
}