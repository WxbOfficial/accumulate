import * as THREE from 'three';


export default function getMapShaderUnit( texture = null ){

	return new THREE.RawShaderMaterial({
		uniforms: {
			map: {
				value: null,
			},
		},

		vertexShader: `
			precision mediump float;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;

				gl_Position = vec4( position, 1.0 );
			}
		`,

		fragmentShader: `
			precision mediump float;

			varying vec2 vUv;

			uniform sampler2D map;

			void main() {

				vec4 color = texture2D( map, vUv );

				gl_FragColor = color;
			}`
	});
}