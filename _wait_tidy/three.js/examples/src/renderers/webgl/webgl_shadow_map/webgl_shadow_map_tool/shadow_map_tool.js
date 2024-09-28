import * as THREE from 'three';
import { WebGLLights } from '../../../../../../source/src/renderers/webgl/WebGLLights.js'

import DirectionalLightShadowVertex from './directional_light_shadow_glsl/directional_light_shadow_glsl.vertex.js';
import DirectionalLightShadowFragment from './directional_light_shadow_glsl/directional_light_shadow_glsl.fragment.js';


export default class ShadowMapTool{

	constructor( renderer ){


		this.lights = new WebGLLights( renderer.extensions );
		this.lightsArray = [];
		this.lightsArrayMap = new Map();
		this.shadowsArray = [];
		this.shadowsArrayMap = new Map();


		this.projectObject = function( object ){

			if ( object.isLight ) {

				if( !this.lightsArrayMap.has( object ) ){

					this.lightsArray.push( object );
					this.lightsArrayMap.set( object, true );
				}

				if ( object.castShadow ) {

					if( !this.shadowsArrayMap.has( object ) ){

						this.shadowsArray.push( object );
						this.shadowsArrayMap.set( object, true );
					}
				}
			}

			const children = object.children;

			for ( let i = 0, l = children.length; i < l; i ++ ) {

				this.projectObject( children[ i ] );

			}

			return this;
		}

		this.setupLights = function( useLegacyLights = false ){

			this.lights.setup( this.lightsArray, useLegacyLights );

			return this;
		}

		this.setupLightsView = function( camera ){

			this.lights.setupView( this.lightsArray, camera );

			return this;
		}

		this.getDirectionalLightShadowMaterial = function(){
			// return new THREE.RawShaderMaterial({
			return new THREE.ShaderMaterial({
				// lights: true,
				uniforms: {

					diffuse: {
						value: new THREE.Color( 0xffffff ),
					},
					opacity: {
						value: 1,
					},
					emissive: {
						value: new THREE.Color( 0x000000 ),
					},
					ambientLightColor:{
						value: new THREE.Color( 0x000000 ),
					},

					directionalLights: {
						value: null
					},
					directionalLightShadows: {
						value: null
					},
					directionalShadowMap: {
						value: null,
					},
					directionalShadowMatrix: {
						value: null,
					},
				},
				vertexShader: DirectionalLightShadowVertex,
				fragmentShader: DirectionalLightShadowFragment
			})
		}

		this.setUniforms = function( uniforms ){

			uniforms.directionalLights.value = this.lights.state.directional;
			uniforms.directionalLightShadows.value = this.lights.state.directionalShadow;
			uniforms.directionalShadowMap.value = this.lights.state.directionalShadowMap;
			uniforms.directionalShadowMatrix.value = this.lights.state.directionalShadowMatrix;
		}
	}
}