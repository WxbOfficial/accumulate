import * as THREE from 'three';


export default function getSeperableBlurUnit( maxRadius, colorTexture = null, texSizeWidth, texSizeHeight ){

	return {
		seperableBlurMaterial: new THREE.RawShaderMaterial({
			defines: {
				'MAX_RADIUS': maxRadius,
			},
			uniforms: {
				colorTexture: {
					value: colorTexture,
				},
				texSize: {
					value: new THREE.Vector2( texSizeWidth, texSizeHeight )
				},
				direction: {
					value: new THREE.Vector2( 1.0, 0.0 )
				},
				kernelRadius: {
					value: 1.0
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
				uniform sampler2D colorTexture;
				uniform vec2 texSize;
				uniform vec2 direction;
				uniform float kernelRadius;

				float gaussianPdf(in float x, in float sigma) {
					return 0.39894 * exp( -0.5 * x * x/( sigma * sigma))/sigma;
				}

				void main() {
					vec2 invSize = 1.0 / texSize;

					float sigma = kernelRadius/2.0;
					float weightSum = gaussianPdf(0.0, sigma);
					vec4 diffuseSum = texture2D( colorTexture, vUv) * weightSum;
					vec2 delta = direction * invSize * kernelRadius/float(MAX_RADIUS);
					vec2 uvOffset = delta;
					for( int i = 1; i <= MAX_RADIUS; i ++ ) {
						float x = kernelRadius * float(i) / float(MAX_RADIUS);
						float w = gaussianPdf(x, sigma);
						vec4 sample1 = texture2D( colorTexture, vUv + uvOffset);
						vec4 sample2 = texture2D( colorTexture, vUv - uvOffset);
						diffuseSum += ((sample1 + sample2) * w);
						weightSum += (2.0 * w);
						uvOffset += delta;
					}
					gl_FragColor = diffuseSum/weightSum;
				}
			`
		})
	}
}