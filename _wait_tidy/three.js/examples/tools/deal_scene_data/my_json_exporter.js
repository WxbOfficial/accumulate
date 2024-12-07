


class MyJsonExporter{

	constructor(){

		this.attributeMap = new Map();
		this.interleavedBufferMap = new Map();
		this.materialMap = new Map();
		this.textureMap = new Map();
		this.imageMap = new Map();

		this.assets = {
			geometries: {},
			attributes: {},
			interleavedBuffers: {},
			materials: {},
			textures: {},
			images: {},
		};
	}

	parse( node ){

	}

}