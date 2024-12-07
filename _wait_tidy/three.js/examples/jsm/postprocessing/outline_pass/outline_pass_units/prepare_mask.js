import * as THREE from 'three';

// 需要继续完善 glsl 相关前缀
export default function getPrepareMaskUnit( depthTexture = null ){

	return {

		prepareMaskMaterial: new THREE.RawShaderMaterial( {
			uniforms: {
				depthTexture: {
					value: depthTexture
				},
				cameraNearFar: {
					value: new THREE.Vector2( 0.5, 0.5 )
				},
				textureMatrix: {
					value: null
				}
			},
			vertexShader: `
				precision mediump float;

				attribute vec3 position;

				uniform mat4 modelMatrix;
				uniform mat4 modelViewMatrix;
				uniform mat4 projectionMatrix;

				// *** #include <morphtarget_pars_vertex>
				#ifdef USE_MORPHTARGETS

					#ifndef USE_INSTANCING_MORPH

						uniform float morphTargetBaseInfluence;

					#endif
					#ifdef MORPHTARGETS_TEXTURE

						#ifndef USE_INSTANCING_MORPH

							uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];

						#endif

						uniform sampler2DArray morphTargetsTexture;
						uniform ivec2 morphTargetsTextureSize;

						vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {

							int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
							int y = texelIndex / morphTargetsTextureSize.x;
							int x = texelIndex - y * morphTargetsTextureSize.x;

							ivec3 morphUV = ivec3( x, y, morphTargetIndex );
							return texelFetch( morphTargetsTexture, morphUV, 0 );

						}

					#else
						#ifndef USE_MORPHNORMALS

							uniform float morphTargetInfluences[ 8 ];

						#else

							uniform float morphTargetInfluences[ 4 ];

						#endif
					#endif
				#endif

				// *** #include <skinning_pars_vertex>
				#ifdef USE_SKINNING

					uniform mat4 bindMatrix;
					uniform mat4 bindMatrixInverse;

					uniform highp sampler2D boneTexture;

					mat4 getBoneMatrix( const in float i ) {

						int size = textureSize( boneTexture, 0 ).x;
						int j = int( i ) * 4;
						int x = j % size;
						int y = j / size;
						vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
						vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
						vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
						vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );

						return mat4( v1, v2, v3, v4 );
					}
				#endif

				varying vec4 projTexCoord;
				varying vec4 vPosition;
				uniform mat4 textureMatrix;

				void main() {

					// *** #include <skinbase_vertex>
					#ifdef USE_SKINNING
						mat4 boneMatX = getBoneMatrix( skinIndex.x );
						mat4 boneMatY = getBoneMatrix( skinIndex.y );
						mat4 boneMatZ = getBoneMatrix( skinIndex.z );
						mat4 boneMatW = getBoneMatrix( skinIndex.w );
					#endif

					// *** #include <begin_vertex>
					vec3 transformed = vec3( position );

					#ifdef USE_ALPHAHASH
						vPosition = vec3( position );
					#endif

					// *** #include <morphtarget_vertex>
					#ifdef USE_MORPHTARGETS

						// morphTargetBaseInfluence is set based on BufferGeometry.morphTargetsRelative value:
						// When morphTargetsRelative is false, this is set to 1 - sum(influences); this results in position = sum((target - base) * influence)
						// When morphTargetsRelative is true, this is set to 1; as a result, all morph targets are simply added to the base after weighting
						transformed *= morphTargetBaseInfluence;

						#ifdef MORPHTARGETS_TEXTURE

							for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {

								if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];

							}

						#else

							transformed += morphTarget0 * morphTargetInfluences[ 0 ];
							transformed += morphTarget1 * morphTargetInfluences[ 1 ];
							transformed += morphTarget2 * morphTargetInfluences[ 2 ];
							transformed += morphTarget3 * morphTargetInfluences[ 3 ];

							#ifndef USE_MORPHNORMALS

								transformed += morphTarget4 * morphTargetInfluences[ 4 ];
								transformed += morphTarget5 * morphTargetInfluences[ 5 ];
								transformed += morphTarget6 * morphTargetInfluences[ 6 ];
								transformed += morphTarget7 * morphTargetInfluences[ 7 ];

							#endif
						#endif
					#endif

					// *** #include <skinning_vertex>
					#ifdef USE_SKINNING
						vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );

						vec4 skinned = vec4( 0.0 );
						skinned += boneMatX * skinVertex * skinWeight.x;
						skinned += boneMatY * skinVertex * skinWeight.y;
						skinned += boneMatZ * skinVertex * skinWeight.z;
						skinned += boneMatW * skinVertex * skinWeight.w;

						transformed = ( bindMatrixInverse * skinned ).xyz;
					#endif

					// *** #include <project_vertex>
					vec4 mvPosition = vec4( transformed, 1.0 );

					#ifdef USE_BATCHING
						mvPosition = batchingMatrix * mvPosition;
					#endif

					#ifdef USE_INSTANCING
						mvPosition = instanceMatrix * mvPosition;
					#endif

					mvPosition = modelViewMatrix * mvPosition;
					gl_Position = projectionMatrix * mvPosition;

					vPosition = mvPosition;

					vec4 worldPosition = vec4( transformed, 1.0 );

					#ifdef USE_INSTANCING
						worldPosition = instanceMatrix * worldPosition;
					#endif

					worldPosition = modelMatrix * worldPosition;

					projTexCoord = textureMatrix * worldPosition;

				}
			`,
			fragmentShader: `
				precision mediump float;

				const float UnpackDownscale = 255. / 256.; // 0..1 -> fraction (excluding 1)

				const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );

				const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );

				float unpackRGBAToDepth( const in vec4 v ) {
					return dot( v, UnpackFactors );
				}

				float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
					// maps perspective depth in [ 0, 1 ] to viewZ
					return ( near * far ) / ( ( far - near ) * depth - far );
				}

				varying vec4 vPosition;
				varying vec4 projTexCoord;
				uniform sampler2D depthTexture;
				uniform vec2 cameraNearFar;

				void main() {

					float depth = unpackRGBAToDepth(texture2DProj( depthTexture, projTexCoord ));
					float viewZ = - perspectiveDepthToViewZ( depth, cameraNearFar.x, cameraNearFar.y );
					float depthTest = (-vPosition.z > viewZ) ? 1.0 : 0.0;
					gl_FragColor = vec4(0.0, depthTest, 1.0, 1.0);
				}
			`,
			side: THREE.DoubleSide
		} )
	}
}