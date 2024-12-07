import * as THREE from 'three';


export default function getEdgeDetectionUnit(maskTexture = null, texSizeWidth, texSizeHeight){

	return {
		edgeDetectionMaterial: new THREE.RawShaderMaterial({
			uniforms: {
				maskTexture: {
					value: maskTexture,
				},
				texSize: {
					value: new THREE.Vector2( texSizeWidth, texSizeHeight )
				},
				visibleEdgeColor: {
					value: new THREE.Color( 1.0, 1.0, 1.0 )
				},
				hiddenEdgeColor: {
					value: new THREE.Color( 0.1, 0.04, 0.02 ),
				}
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

				uniform sampler2D maskTexture;
				uniform vec2 texSize;
				uniform vec3 visibleEdgeColor;
				uniform vec3 hiddenEdgeColor;

				void main() {

					vec2 invSize = 1.0 / texSize;
					vec4 uvOffset = vec4(1.0, 0.0, 0.0, 1.0) * vec4(invSize, invSize);
					vec4 c1 = texture2D( maskTexture, vUv + uvOffset.xy);
					vec4 c2 = texture2D( maskTexture, vUv - uvOffset.xy);
					vec4 c3 = texture2D( maskTexture, vUv + uvOffset.yw);
					vec4 c4 = texture2D( maskTexture, vUv - uvOffset.yw);
					// . c3 .
					// c1 0 c2
					// . c4 .

					float diff1 = (c1.r - c2.r)*0.5;// 水平 r 差
					float diff2 = (c3.r - c4.r)*0.5;// 竖直 r 差
					float d = length( vec2(diff1, diff2) );
					float a1 = min(c1.g, c2.g);
					float a2 = min(c3.g, c4.g);
					float visibilityFactor = min(a1, a2);
					vec3 edgeColor = 1.0 - visibilityFactor > 0.001 ? visibleEdgeColor : hiddenEdgeColor;

					gl_FragColor = vec4(edgeColor, 1.0) * vec4(d);

					// vec4 c = texture2D( maskTexture, vUv);
					// gl_FragColor =
					// 	d > 0.0 ?
					// 		vec4(edgeColor, 1.0) * vec4(d) :

					// 		c.r > 0.0 ? vec4(1.0, 1.0, 1.0, 1.0) :
					// 		c.g > 0.0 ? vec4(0.0, 1.0, 1.0, 1.0) : vec4(0.0, 0.0, 1.0, 1.0);
				}
			`
		})
	}
}