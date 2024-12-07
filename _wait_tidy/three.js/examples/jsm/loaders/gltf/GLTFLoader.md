# GLTFParser 模型加载流程

<!--
	getDependency( type, index ) {
-->
## GLTFParser
```js
	parse( onLoad, onError ) {

		loadScene( sceneIndex ) {

			const sceneDef = this.json.scenes[ sceneIndex ];
			const nodeIds = sceneDef.nodes || [];
			for ( let i = 0, il = nodeIds.length; i < il; i ++ )
			loadNode( nodeIndex ) {

				const nodeDef = this.json.nodes[ nodeIndex ];
				_loadNodeShallow( nodeIndex ) {
					createNodeMesh( nodeIndex ) {

						const nodeDef = this.json.nodes[ nodeIndex ]
						nodeDef.mesh
						loadMesh( meshIndex ) {

							const meshDef = this.json.meshes[ meshIndex ];
							const primitives = meshDef.primitives;
							for ( let i = 0, il = primitives.length; i < il; i ++ )
							primitives[ i ].material
							loadMaterial( materialIndex ) {

								const materialDef = this.json.materials[ materialIndex ];
								assignTexture( materialParams, mapName, mapDef, colorSpace ) {

									mapDef.index
									loadTexture( textureIndex ) {

										const textureDef = this.json.textures[ textureIndex ];
										const sourceIndex = textureDef.source;
										const sourceDef = this.json.images[ sourceIndex ];

										options.manager.getHandler( sourceDef.uri );
										loadTextureImage( textureIndex, sourceIndex, loader ) {

											const textureDef = this.json.textures[ textureIndex ];
											const sourceDef = this.json.images[ sourceIndex ];
											loadImageSource( sourceIndex, loader ) {

												const sourceDef = this.json.images[ sourceIndex ];
												sourceDef.bufferView
												loadBufferView( bufferViewIndex ) {}
											}
										}
									}
								}
							}

							loadGeometries( primitives ) {

								const primitive = primitives[ i ];
								addPrimitiveAttributes( geometry, primitiveDef, parser ) {

									const attributes = primitiveDef.attributes;
									for ( const gltfAttributeName in attributes )
									attributes[ gltfAttributeName ]
									loadAccessor( accessorIndex ) {

										const accessorDef = this.json.accessors[ accessorIndex ];
										// accessorDef.bufferView
										// accessorDef.sparse.indices.bufferView
										// accessorDef.sparse.values.bufferView
										loadBufferView( bufferViewIndex ) {

											const bufferViewDef = this.json.bufferViews[ bufferViewIndex ];
											loadBuffer( bufferIndex ) {

												const bufferDef = this.json.buffers[ bufferIndex ];
											}
										}
									}
								}
							}
						}
					}

					loadCamera( cameraIndex ) {}

					createNodeAttachment( nodeIndex ) {

						const lightDef = ( nodeDef.extensions && nodeDef.extensions[ this.name ] ) || {};
						const lightIndex = lightDef.light;
						_loadLight( lightIndex ) {

							const json = parser.json;
							const extensions = ( json.extensions && json.extensions[ this.name ] ) || {};
							const lightDefs = extensions.lights || [];
							const lightDef = lightDefs[ lightIndex ];
						}
					}
				}

				const childrenDef = nodeDef.children || [];
				loadNode( nodeIndex ) {}

				const skeletonPending = nodeDef.skin === undefined
				loadSkin( skinIndex ) {

					const skinDef = this.json.skins[ skinIndex ];
					for ( let i = 0, il = skinDef.joints.length; i < il; i ++ )

					_loadNodeShallow( nodeIndex ) {}
					loadAccessor( accessorIndex ) {}
				}
			}
		}

		loadAnimation( animationIndex ) {
			// 未完待续
		}

		loadCamera( cameraIndex ) {}
	}
```

