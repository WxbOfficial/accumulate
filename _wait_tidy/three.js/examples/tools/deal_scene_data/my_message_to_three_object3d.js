import * as THREE from 'three';

function getNumber( number ){

	if( number === 'NaN' ){
		return NaN;
	} else if( number === 'Infinity' ){
		return Infinity;
	} else if( number === '-Infinity' ){
		return -Infinity;
	} else {
		return number;
	}
}

let createOptions = null;

const
	geometryMap = {},
	attributeMap = {},
	interleavedBufferMap = {},

	materialMap = {},

	textureMap = {},

	imageMap = {};

function createAssets( assets ){

	createAsset( assets.interleavedBuffers, interleavedBufferMap, createInterleavedBuffer );
	createAsset( assets.attributes, attributeMap, startCreateAttribute );
	createAsset( assets.geometries, geometryMap, createGeometry );

	createAsset( assets.images, imageMap, createImage );
	createAsset( assets.textures, textureMap, startCreateTexture );
	createAsset( assets.materials, materialMap, startCreateMaterial );
}

function createAsset( asset, map, callback ){

	for( let key in asset ){
		map[key] = callback( asset[key] );
	}
}

function createInterleavedBuffer( message ){

	const interleavedBuffer = new THREE.InterleavedBuffer(
		new window[ message.arrayType ]( message.array ), message.stride
	);

	if( message._updateRange ){
		interleavedBuffer.addUpdateRange(
			message._updateRange.start,
			message._updateRange.count
		)
	}else if( message.updateRanges ){
		interleavedBuffer.updateRanges = message.updateRanges;
	}

	return interleavedBuffer;
}

function startCreateAttribute( message ){

	if( message.isInstancedBufferAttribute ){

		return createInstancedBufferAttribute( message );
	}else if( message.isInterleavedBufferAttribute ){

		return createInterleavedBufferAttribute( message );
	}else if( message.isBufferAttribute ){

		return creatteBufferAttribute( message );
	}else {

		throw new Error(`未知的属性类型 ${attribute.type} , 需要完善优化啦!`)
	}
}

function createInstancedBufferAttribute( message ){

	const instancedBufferAttribute = new THREE.InstancedBufferAttribute(
		new window[ message.arrayType ]( message.array ),
		16
	);

	instancedBufferAttribute.name = message.name;
	instancedBufferAttribute.usage = message.usage;
	instancedBufferAttribute.gpuType = message.gpuType;

	if( message._updateRange ){
		instancedBufferAttribute.addUpdateRange(
			message._updateRange.start,
			message._updateRange.count
		)
	}else if( message.updateRanges ){
		instancedBufferAttribute.updateRanges = message.updateRanges;
	}

	instancedBufferAttribute.meshPerAttribute = message.meshPerAttribute;

	return instancedBufferAttribute;
}

function createInterleavedBufferAttribute( message ){

	const interleavedBufferAttribute = new THREE.InterleavedBufferAttribute(
		interleavedBufferMap[ message.data ],
		message.itemSize,
		message.offset,
		message.normalized
	);

	interleavedBufferAttribute.name = message.name;

	return interleavedBufferAttribute;
}

function creatteBufferAttribute( message ){

	const attribute = new THREE.BufferAttribute(
		new window[ message.arrayType ]( message.array ),
		message.itemSize,
		message.normalized
	);

	attribute.name = message.name;
	attribute.usage = message.usage;
	attribute.gpuType = message.gpuType;

	if( message._updateRange ){
		attribute.addUpdateRange(
			message._updateRange.start,
			message._updateRange.count
		)
	}else if( message.updateRanges ){
		attribute.updateRanges = message.updateRanges;
	}

	return attribute;
}

function createGeometry( message ){

	let geometry = null;

	if( message.isBufferGeometry ){

		geometry = new THREE.BufferGeometry();

		for( let key in message.attributes ){

			geometry.setAttribute( key, attributeMap[ message.attributes[key] ] );
		}

		for( let key in message.morphAttributes ){

			geometry.setAttribute( key, attributeMap[ message.attributes[key] ] );
		}

		if( message.index ){

			geometry.setIndex( attributeMap[ message.index ] );
		}

		geometry.groups = message.groups;

		geometry.setDrawRange(
			getNumber( message.drawRangeStart ),
			getNumber( message.drawRangeCount )
		);

		return geometry;
	}else{

		throw new Error(`未知的几何体类型 ${message.type} , 需要完善优化啦!`)
	}
}

function startCreateMaterial( message ){
	if( message.isShaderMaterial ){

		return createShaderMaterial( message )
	}else{

		throw new Error(`未知的材质类型 ${message.type} , 需要完善优化啦!`)
	}
}

function assignMaterial( material, message ){

	material.blending = message.blending;
	material.side = message.side;
	material.vertexColors = message.vertexColors;

	material.opacity = message.opacity;
	material.transparent = message.transparent;
	material.alphaHash = message.alphaHash;

	material.blendSrc = message.blendSrc;
	material.blendDst = message.blendDst;
	material.blendEquation = message.blendEquation;
	material.blendSrcAlpha = message.blendSrcAlpha;
	material.blendDstAlpha = message.blendDstAlpha;
	material.blendEquationAlpha = message.blendEquationAlpha;
	material.blendColor = message.blendColor ? new THREE.Color().fromArray( message.blendColor ) : message.blendColor;
	material.blendAlpha = message.blendAlpha;

	material.depthFunc = message.depthFunc;
	material.depthTest = message.depthTest;
	material.depthWrite = message.depthWrite;

	material.stencilWriteMask = message.stencilWriteMask;
	material.stencilFunc = message.stencilFunc;
	material.stencilRef = message.stencilRef;
	material.stencilFuncMask = message.stencilFuncMask;
	material.stencilFail = message.stencilFail;
	material.stencilZFail = message.stencilZFail;
	material.stencilZPass = message.stencilZPass;
	material.stencilWrite = message.stencilWrite;

	material.clippingPlanes = message.clippingPlanes;
	material.clipIntersection = message.clipIntersection;
	material.clipShadows = message.clipShadows;

	material.shadowSide = message.shadowSide;

	material.colorWrite = message.colorWrite;

	material.precision = message.precision;

	material.polygonOffset = message.polygonOffset;
	material.polygonOffsetFactor = message.polygonOffsetFactor;
	material.polygonOffsetUnits = message.polygonOffsetUnits;

	material.dithering = message.dithering;

	material.alphaToCoverage = message.alphaToCoverage;
	material.premultipliedAlpha = message.premultipliedAlpha;
	material.forceSinglePass = message.forceSinglePass;

	material.toneMapped = message.toneMapped;

	material.alphaTest = message.alphaTest;

	return material;
}

function createShaderMaterial( message ){

	const shaderMaterial = assignMaterial( new THREE.ShaderMaterial(), message );

	shaderMaterial.uniforms = {};

	shaderMaterial.vertexShader = message.vertexShader;
	shaderMaterial.fragmentShader = message.fragmentShader;

	shaderMaterial.linewidth = message.linewidth;

	shaderMaterial.wireframe = message.wireframe;
	shaderMaterial.wireframeLinewidth = message.wireframeLinewidth;

	shaderMaterial.fog = message.fog;
	shaderMaterial.lights = message.lights;
	shaderMaterial.clipping = message.clipping;

	shaderMaterial.forceSinglePass = message.forceSinglePass;

	shaderMaterial.index0AttributeName = message.index0AttributeName;


	for ( const name in message.uniforms ) {

		const uniform = message.uniforms[ name ];

		shaderMaterial.uniforms[ name ] = {};

		switch ( uniform.type ) {

			case 't':

				shaderMaterial.uniforms[ name ].value = textureMap[uniform.value];
				break;

			case 'c':
				shaderMaterial.uniforms[ name ].value = new THREE.Color().setHex( uniform.value );
				break;

			case 'v2':
				shaderMaterial.uniforms[ name ].value = new THREE.Vector2().fromArray( uniform.value );
				break;

			case 'v3':
				shaderMaterial.uniforms[ name ].value = new THREE.Vector3().fromArray( uniform.value );
				break;

			case 'v4':
				shaderMaterial.uniforms[ name ].value = new THREE.Vector4().fromArray( uniform.value );
				break;

			case 'm3':
				shaderMaterial.uniforms[ name ].value = new THREE.Matrix3().fromArray( uniform.value );
				break;

			case 'm4':
				shaderMaterial.uniforms[ name ].value = new THREE.Matrix4().fromArray( uniform.value );
				break;

			default:
				shaderMaterial.uniforms[ name ].value = uniform.value;
				break;
		}
	}

	return shaderMaterial;
}

function startCreateTexture( message ){

	if( message.isCanvasTexture ){

		throw new Error('CanvasTexture 纹理资源创建待完善');
	} else if( message.isCompressedArrayTexture ){

		throw new Error('CompressedArrayTexture 纹理资源创建待完善');
	} else if( message.isCompressedCubeTexture ){

		throw new Error('CompressedCubeTexture 纹理资源创建待完善');
	} else if( message.isCompressedTexture ){

		throw new Error('CompressedTexture 纹理资源创建待完善');
	} else if( message.isCubeTexture ){

		throw new Error('CubeTexture 纹理资源创建待完善');
	} else if( message.isData3DTexture ){

		throw new Error('Data3DTexture 纹理资源创建待完善');
	} else if( message.isDataArrayTexture ){

		throw new Error('DataArrayTexture 纹理资源创建待完善');
	} else if( message.isDataTexture ){

		throw new Error('DataTexture 纹理资源创建待完善');
	} else if( message.isDepthTexture ){

		throw new Error('DepthTexture 纹理资源创建待完善');
	} else if( message.isFramebufferTexture ){

		throw new Error('FramebufferTexture 纹理资源创建待完善');
	} else if( message.isVideoTexture ){

		throw new Error('VideoTexture 纹理资源创建待完善');
	} else if( message.isTexture ){

		return createTexture( message );
	} else {

		console.error( message );
		throw new Error('不应该存在的参数');
	}
}

function createImage( message ){

	let image = null;

	switch( message.type ){

		case 'HTMLImageElement':

			image = new Image();

			if( message.src ){

				if( createOptions.path !== void 0 ){

					image.src = createOptions.path + message.src;
				}else{

					image.src = message.src;
				}
			}

			return image;
		default:
			console.error( message );
			throw new Error(`其他的 image 类型 ${ message.type } , 需要完善优化啦!`);
			break;
	}
}

function createTexture( message ){

	const image = imageMap[message.image];
	const texture = new THREE.Texture( image );

	if( !image.complete ){
		image.onload = ()=>{
			texture.needsUpdate = true;
		}
	}

	texture.mapping = message.mapping;
	texture.channel = message.channel;

	texture.wrapS = message.wrapS;
	texture.wrapT = message.wrapT;

	texture.magFilter = message.magFilter;
	texture.minFilter = message.minFilter;

	texture.anisotropy = message.anisotropy;

	texture.format = message.format;
	texture.internalFormat = message.internalFormat;
	texture.type = message.type;

	texture.offset =  new THREE.Vector2().fromArray( message.offset );
	texture.repeat =  new THREE.Vector2().fromArray( message.repeat );
	texture.center =  new THREE.Vector2().fromArray( message.center );
	texture.rotation = message.rotation;

	texture.generateMipmaps = message.generateMipmaps;
	texture.premultiplyAlpha = message.premultiplyAlpha;
	texture.flipY = message.flipY;
	texture.unpackAlignment = message.unpackAlignment;

	if( message.colorSpace ){
		texture.colorSpace = message.colorSpace;
	}
	texture.pmremVersion = message.pmremVersion;

	return texture;
}

export default function myMessageToThreeObject3D( message, assets, options = {} ){

	createOptions = options;

	createAssets( assets );

	return toThreeObject3D( message, assets );
}

function toThreeObject3D( message, assets ){

	let node = null;

	switch( message.type ){
		case 'Object3D':
		case 'Group':
			node = createObject3D( message );
			break;
		case 'Mesh':

			if( message.isInstancedMesh ){

				node = createInstancedMesh( message, assets );
			}else if( message.isBatchedMesh ){

				node = createBatchedMesh( message, assets );
			}else if( message.isSkinnedMesh ){

				node = createSkinnedMesh( message, assets );
			} else if( message.isMesh ){

				node = createMesh( message, assets );
			} else{
				console.error( message );
				throw new Error(`未知的 Mesh 节点 , 需要优化添加啦!`);
			}
			break;
		default:
			throw new Error(`未知的节点类型 ${message.type} , 需要优化添加啦!`)
			break;
	}

	if( Array.isArray( message.children ) && message.children.length > 0 ){
		message.children.forEach(( childMessage )=>{

			node.add(
				toThreeObject3D( childMessage, assets )
			);
		});
	}

	return node;
}

function createObject3D( message ){

	return assignObject3D(
		new THREE.Object3D(),
		message
	);
}

function assignObject3D( object3D, message ){

	object3D.name = message.name;

	object3D.up.fromArray( message.up );
	object3D.position.fromArray( message.position );
	object3D.rotation.fromArray( message.rotation );
	object3D.scale.fromArray( message.scale );

	object3D.layers.mask = message.layersMask;

	object3D.castShadow = message.castShadow;
	object3D.receiveShadow = message.receiveShadow;
	object3D.frustumCulled = message.frustumCulled;
	object3D.renderOrder = message.renderOrder;

	return object3D;
}

function createMesh( message ){
	return assignObject3D(
		new THREE.Mesh(
			geometryMap[message.geometry],
			Array.isArray( message.material ) ?
				message.material.map(( mat )=>{
					return materialMap[ mat ];
				}) : materialMap[ message.material ]
		),
		message
	);
}

function createInstancedMesh( message ){

	const instancedMesh = assignObject3D(
		new THREE.InstancedMesh(
			geometryMap[message.geometry],
			Array.isArray( message.material ) ?
				message.material.map(( mat )=>{
					return materialMap[ mat ];
				}) : materialMap[ message.material ],
			message.count
		),
		message
	);

	if( message.instanceMatrix ){

		instancedMesh.instanceMatrix = attributeMap[ message.instanceMatrix ];
	}

	if( message.instanceColor ){

		instancedMesh.instanceColor = attributeMap[ message.instanceColor ];
	}

	if( message.morphTexture ){

		instancedMesh.morphTexture =  textureMap[ message.morphTexture ];
	}

	return instancedMesh;
}

function createBatchedMesh( message ){

	throw new Error('BatchedMesh 类型节点创建待完善');
}

function createSkinnedMesh( message ){

	throw new Error('SkinnedMesh 类型节点创建待完善');
}

