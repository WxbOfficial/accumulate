// copy from engine/extras/exporters/gltf-exporter.js
const
	ADDRESS_CLAMP_TO_EDGE = 1, ADDRESS_MIRRORED_REPEAT = 2, ADDRESS_REPEAT = 0,
	BLEND_NORMAL = 2,
	CULLFACE_NONE = 0,
	FILTER_NEAREST = 0, FILTER_LINEAR = 1, FILTER_NEAREST_MIPMAP_NEAREST = 2, FILTER_LINEAR_MIPMAP_NEAREST = 4,
	FILTER_NEAREST_MIPMAP_LINEAR = 3, FILTER_LINEAR_MIPMAP_LINEAR = 5,
	INDEXFORMAT_UINT8 = 0, INDEXFORMAT_UINT16 = 1, INDEXFORMAT_UINT32 = 2,
	PROJECTION_ORTHOGRAPHIC = 1,
	SEMANTIC_POSITION = 'POSITION', SEMANTIC_NORMAL = 'NORMAL', SEMANTIC_TANGENT = 'TANGENT', SEMANTIC_COLOR = 'COLOR',
	SEMANTIC_BLENDINDICES = 'BLENDINDICES', SEMANTIC_BLENDWEIGHT = 'BLENDWEIGHT',
	SEMANTIC_TEXCOORD0 = 'TEXCOORD0', SEMANTIC_TEXCOORD1 = 'TEXCOORD1', SEMANTIC_TEXCOORD2 = 'TEXCOORD2', SEMANTIC_TEXCOORD3 = 'TEXCOORD3',
	SEMANTIC_TEXCOORD4 = 'TEXCOORD4', SEMANTIC_TEXCOORD5 = 'TEXCOORD5', SEMANTIC_TEXCOORD6 = 'TEXCOORD6', SEMANTIC_TEXCOORD7 = 'TEXCOORD7',
	TYPE_INT8 = 0, TYPE_UINT8 = 1, TYPE_INT16 = 2, TYPE_UINT16 = 3,
	TYPE_INT32 = 4, TYPE_UINT32 = 5, TYPE_FLOAT32 = 6;

function roundUp(numToRound, multiple) {
  if (multiple === 0){
  	return numToRound;
  }
  return Math.ceil(numToRound / multiple) * multiple;
}

const ARRAY_BUFFER = 34962;
const ELEMENT_ARRAY_BUFFER = 34963;

const getIndexComponentType = (indexFormat) => {
	switch (indexFormat) {
		case INDEXFORMAT_UINT8: return 5121;
		case INDEXFORMAT_UINT16: return 5123;
		case INDEXFORMAT_UINT32: return 5125;
	}
	return 0;
};

const getComponentType = (dataType) => {
	switch (dataType) {
		case TYPE_INT8: return 5120;
		case TYPE_UINT8: return 5121;
		case TYPE_INT16: return 5122;
		case TYPE_UINT16: return 5123;
		case TYPE_INT32: return 5124;
		case TYPE_UINT32: return 5125;
		case TYPE_FLOAT32: return 5126;
	}
	return 0;
};

const getAccessorType = (componentCount) => {
	switch (componentCount) {
		case 1: return 'SCALAR';
		case 2: return 'VEC2';
		case 3: return 'VEC3';
		case 4: return 'VEC4';
	}
	return 0;
};

const getSemantic = (engineSemantic) => {
	switch (engineSemantic) {
		case SEMANTIC_POSITION: return 'POSITION';
		case SEMANTIC_NORMAL: return 'NORMAL';
		case SEMANTIC_TANGENT: return 'TANGENT';
		case SEMANTIC_COLOR: return 'COLOR_0';
		case SEMANTIC_BLENDINDICES: return 'JOINTS_0';
		case SEMANTIC_BLENDWEIGHT: return 'WEIGHTS_0';
		case SEMANTIC_TEXCOORD0: return 'TEXCOORD_0';
		case SEMANTIC_TEXCOORD1: return 'TEXCOORD_1';
		case SEMANTIC_TEXCOORD2: return 'TEXCOORD_2';
		case SEMANTIC_TEXCOORD3: return 'TEXCOORD_3';
		case SEMANTIC_TEXCOORD4: return 'TEXCOORD_4';
		case SEMANTIC_TEXCOORD5: return 'TEXCOORD_5';
		case SEMANTIC_TEXCOORD6: return 'TEXCOORD_6';
		case SEMANTIC_TEXCOORD7: return 'TEXCOORD_7';
	}
};


const textureSemantics = [
	'diffuseMap',
	'colorMap'
];

//贴图就不处理了，主要是拿到几何体
function exportGltf(root){
	const
		resources = collectResources(root),
		json = buildJson(resources),
		glbBuffer = build(resources, json);



	const url = window.URL || window.webkitURL || window;
	const blob = new Blob([glbBuffer]);
	const saveLink = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
	saveLink.href = url.createObjectURL(blob);
	// 设置 download 属性
	saveLink.download = 'glbBuffer.glb';
	saveLink.click();

	return glbBuffer;
}

function collectResources(root){

	const
		resources = {
			buffers: [],
			cameras: [],
			entities: [],
			materials: [],
			textures: [],

			// entry: { node, meshInstances}
			entityMeshInstances: [],

			// maps a buffer (vertex or index) to an array of bufferview indices
			bufferViewMap: new Map()
		},
		{ materials, buffers, entityMeshInstances, textures } = resources;

	// Collect entities
	root.forEach((entity) => {
		resources.entities.push(entity);
	});

	const collectMeshInstances = (meshInstances) => {
		meshInstances.forEach((meshInstance) => {

			// Collect material
			const material = meshInstance.material;
			if (materials.indexOf(material) < 0) {
				resources.materials.push(material);

				// collect textures
				textureSemantics.forEach((semantic) => {
					const texture = material[semantic];
					if (texture && textures.indexOf(texture) < 0) {
						textures.push(texture);
					}
				});
			}

			// collect mesh instances per node
			const node = meshInstance.node;
			let nodeMeshInstances = entityMeshInstances.find(e => e.node === node);
			if (!nodeMeshInstances) {
				nodeMeshInstances = { node: node, meshInstances: [] };
				entityMeshInstances.push(nodeMeshInstances);
			}
			nodeMeshInstances.meshInstances.push(meshInstance);

			// Collect buffers
			const mesh = meshInstance.mesh;
			const vertexBuffer = mesh.vertexBuffer;
			if (buffers.indexOf(vertexBuffer) < 0) {
				buffers.unshift(vertexBuffer);
			}

			const indexBuffer = mesh.indexBuffer[0];
			if (buffers.indexOf(indexBuffer) < 0) {
				buffers.push(indexBuffer);
			}
		});
	};

	resources.entities.forEach((entity) => {
		if (entity.camera) {
			resources.cameras.push(entity.camera);
		}

		if (entity.render && entity.render.enabled) {
			collectMeshInstances(entity.render.meshInstances);
		}

		if (entity.model && entity.model.enabled && entity.model.meshInstances) {
			collectMeshInstances(entity.model.meshInstances);
		}
	});

return resources;
}

function buildJson(resources){
	const json = {
			asset: {
				version: "2.0",
				generator: "wangxinbo learn from playcanvas"
			},
			scenes: [
				{
						nodes: [
								0
						]
				}
			],
			images: [
			],
			samplers: [
			],
			textures: [
			],
			scene: 0
	};

	writeBuffers(resources, json);
	writeBufferViews(resources, json);
	// writeCameras(resources, json);
	writeNodes(resources, json);
	writeMaterials(resources, json);
	writeMeshes(resources, json);
	// writeTextures(resources.textures, textureCanvases, json, options);

	return json;
}

function writeBuffers(resources, json) {
	if (resources.buffers.length > 0) {
		json.buffers = [];

		let byteLength = 0;

		resources.buffers.forEach((buffer) => {
			const arrayBuffer = buffer.lock();
			byteLength += arrayBuffer.byteLength;
		});

		const buffer = {
			byteLength: byteLength
		};

		json.buffers.push(buffer);
	}
}

function addBufferView(bufferViews, target, byteLength, byteOffset, byteStride){

	return bufferViews.push({
		target: target,
		buffer: 0,
		byteLength: byteLength,
		byteOffset: byteOffset,
		byteStride: byteStride
	}) - 1;
}

function writeBufferViews(resources, json){

	json.bufferViews = [];
	let offset = 0;

	resources.buffers.forEach((buffer)=>{

		const arrayBuffer = buffer.lock();

		if( buffer.getNumVertices ){// VertexBuffer
			const format = buffer.getFormat();

			if (format.interleaved) {

				const bufferViewIndex = addBufferView(json.bufferViews, ARRAY_BUFFER, arrayBuffer.byteLength, offset, format.size);
				resources.bufferViewMap.set(buffer, [bufferViewIndex]);
			}else{

				// generate buffer view per element
				const bufferViewIndices = [];
				format.elements.forEach((element) => {

					const bufferViewIndex = addBufferView(json.bufferViews, ARRAY_BUFFER, element.size * format.vertexCount, offset + element.offset, element.size);
					bufferViewIndices.push(bufferViewIndex);
				});

				resources.bufferViewMap.set(buffer, bufferViewIndices);
			}

		}else if( buffer.getNumIndices ){// IndexBuffer

			const bufferViewIndex = addBufferView(json.bufferViews, ELEMENT_ARRAY_BUFFER, arrayBuffer.byteLength, offset);
			resources.bufferViewMap.set(buffer, [bufferViewIndex]);
		}else{
			console.error('buffer:', buffer);
			throw new Error('unknow buffer type');
		}

		offset += arrayBuffer.byteLength;
	});
}

function writeNodes(resources, json){
	if (resources.entities.length > 0) {
		json.nodes = resources.entities.map((entity)=>{
			const name = entity.name;
			const t = entity.getLocalPosition();
			const r = entity.getLocalRotation();
			const s = entity.getLocalScale();

			const node = {};

			if (name && name.length > 0) {
				node.name = name;
			}

			node.translation = [t.x, t.y, t.z];
			node.rotation = [r.x, r.y, r.z, r.w];
			node.scale = [s.x, s.y, s.z];

			const entityMeshInstance = resources.entityMeshInstances.find((e) => {
				e.node === entity
			});
			if (entityMeshInstance) {
				node.mesh = resources.entityMeshInstances.indexOf(entityMeshInstance);
			}

			if (entity.children.length > 0) {
				node.children = [];

				entity.children.forEach((child) => {
					node.children.push(resources.entities.indexOf(child));
				});
			}

			return node;
		});
	}
}

function writeStandardMaterial(resources, mat, output){

	const { diffuse, emissive, opacity } = mat;
	const pbr = output.pbrMetallicRoughness;
	pbr.baseColorFactor = [diffuse.r, diffuse.g, diffuse.b, opacity];

	output.emissiveFactor = [emissive.r, emissive.g, emissive.b];
}

function writeBasicMaterial(resources, mat, output){

	const { color } = mat;
	const pbr = output.pbrMetallicRoughness;

	pbr.baseColorFactor = [color.r, color.g, color.b, color];
}

function writeMaterials(resources, json){

	if (resources.materials.length > 0) {
		json.materials = resources.materials.map((mat) => {
			const { name, blendType, cull } = mat;
			const material = {
				pbrMetallicRoughness: {}
			};

			if (name && name.length > 0) {
				material.name = name;
			}

			if (mat.diffuse || mat.emissive) {
			  writeStandardMaterial(resources, mat, material);
			}else if (mat.color) {
				writeBasicMaterial(resources, mat, material);
			}else{
				throw new Error('unknow material type');
			}

			// if (blendType === BLEND_NORMAL) {
				material.alphaMode = "BLEND";
			// }

			// if (cull === CULLFACE_NONE) {
				material.doubleSided = true;
			// }

			return material;
		});
	}
}

function writeMeshes(resources, json){
	if (resources.entityMeshInstances.length > 0) {
		json.accessors = [];
		json.meshes = [];

		resources.entityMeshInstances.forEach((entityMeshInstances) => {

			const mesh = {
				primitives: []
			};

			const meshInstances = entityMeshInstances.meshInstances;

			meshInstances.forEach((meshInstance) => {

				const primitive = {
					attributes: {},
					material: resources.materials.indexOf(meshInstance.material)
				};
				mesh.primitives.push(primitive);

				// vertex buffer
				const { vertexBuffer } = meshInstance.mesh;
				const { format } = vertexBuffer;
				const { interleaved, elements } = format;
				const numVertices = vertexBuffer.getNumVertices();

				elements.forEach((element, elementIndex) => {

					const viewIndex = resources.bufferViewMap.get(vertexBuffer)[interleaved ? 0 : elementIndex];

					const accessor = {
						bufferView: viewIndex,
						byteOffset: interleaved ? element.offset : 0,
						componentType: getComponentType(element.dataType),
						type: getAccessorType(element.numComponents),
						count: numVertices
					};

					const idx = json.accessors.push(accessor) - 1;
					primitive.attributes[getSemantic(element.name)] = idx;

					// Position accessor also requires min and max properties


				});

				// index buffer
				const indexBuffer = meshInstance.mesh.indexBuffer[0];

				if (indexBuffer) {

					const viewIndex = resources.bufferViewMap.get(indexBuffer)[0];

					const accessor = {
							bufferView: viewIndex,
							componentType: getIndexComponentType(indexBuffer.getFormat()),
							count: indexBuffer.getNumIndices(),
							type: "SCALAR"
					};

					const idx = json.accessors.push(accessor) - 1;
					primitive.indices = idx;
				}
			});

			json.meshes.push(mesh);
		});
	}
}

function build(resources, json){
	const jsonText = JSON.stringify(json);

	const headerLength = 12;

	const jsonHeaderLength = 8;
	const jsonDataLength = jsonText.length;
	const jsonPaddingLength = (4 - (jsonDataLength & 3)) & 3;

	const binaryHeaderLength = 8;
	let binaryDataLength = 0;
	resources.buffers.forEach((buffer) => {
		binaryDataLength += buffer.lock().byteLength;
	});
	binaryDataLength = roundUp(binaryDataLength, 4);

	let totalLength = headerLength + jsonHeaderLength + jsonDataLength + jsonPaddingLength;
	if (binaryDataLength > 0) {
		totalLength += binaryHeaderLength + binaryDataLength;
	}

	const glbBuffer = new ArrayBuffer(totalLength);
	const glbView = new DataView(glbBuffer);

	// GLB header
	glbView.setUint32(0, 0x46546C67, true);
	glbView.setUint32(4, 2, true);
	glbView.setUint32(8, totalLength, true);

	// JSON chunk header
	glbView.setUint32(12, jsonDataLength + jsonPaddingLength, true);
	glbView.setUint32(16, 0x4E4F534A, true);

	let offset = headerLength + jsonHeaderLength;

	// JSON data
	for (let i = 0; i < jsonDataLength; i++) {
	  glbView.setUint8(offset + i, jsonText.charCodeAt(i));
	}

	offset += jsonDataLength;

	for (let i = 0; i < jsonPaddingLength; i++) {
	  glbView.setUint8(offset + i, 0x20);
	}

	offset += jsonPaddingLength;

	if (binaryDataLength > 0) {
	  // Binary chunk header
	  glbView.setUint32(offset, binaryDataLength, true);
	  glbView.setUint32(offset + 4, 0x004E4942, true);

	  offset += binaryHeaderLength;

	  resources.buffers.forEach((buffer) => {
      const srcBuffer = buffer.lock();
      let src;
      if (srcBuffer instanceof ArrayBuffer) {
          src = new Uint8Array(srcBuffer);
      } else {
          src = new Uint8Array(srcBuffer.buffer, srcBuffer.byteOffset, srcBuffer.byteLength);
      }
      const dst = new Uint8Array(glbBuffer, offset, srcBuffer.byteLength);
      dst.set(src);

      offset += srcBuffer.byteLength;
	  });
	}

	return glbBuffer;

}
