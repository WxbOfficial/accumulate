

export default class SimpleParticles{

	constructor(scene){

		this.name = name;

		this._scene = scene;

		this.position = new BABYLON.Vector3(0.0, 0.0, 0.0);

		this.color = new BABYLON.Color4(1.0, 1.0, 1.0, 1.0);
		this.angle = Math.PI / 2;
		this.size = 10;

		this.textureMask = new BABYLON.Color4(1.0, 1.0, 1.0, 1.0);

		// Particles
		this.particles = [];
		this._newPartsExcess = 0;

		// VBO
		this._vertexDeclaration = [3, 4, 4];
		this._vertexStrideSize = 11 * 4; // 10 floats per particle (x, y, z, r, g, b, a, angle, size, offsetX, offsetY)
		this._vertexBuffer = scene.getEngine().createDynamicVertexBuffer(1 * this._vertexStrideSize * 4);

		this.init();

		var indices = [];
		var index = 0;
		for (var count = 0; count < 1; count++) {
				indices.push(index);
				indices.push(index + 1);
				indices.push(index + 2);
				indices.push(index);
				indices.push(index + 2);
				indices.push(index + 3);
				index += 4;
		}

		this._indexBuffer = scene.getEngine().createIndexBuffer(indices);

		// init Effect
		var defines = [];

		if (BABYLON.clipPlane) {
				defines.push("#define CLIPPLANE");
		}

		// Effect
		var join = defines.join("\n");

		this._effect = this._scene.getEngine().createEffect("./simple_particles",
				["position", "color", "options"],
				["invView", "view", "projection", "vClipPlane", "textureMask"],
				["diffuseSampler"], join);
	}

	init(){
		var vertices = [];

		vertices.push(
			this.position.x, this.position.y, this.position.z,
			this.color.r, this.color.g, this.color.b, this.color.a,
			this.angle, this.size, 0, 0
		);

		vertices.push(
			this.position.x, this.position.y, this.position.z,
			this.color.r, this.color.g, this.color.b, this.color.a,
			this.angle, this.size, 1, 0
		);

		vertices.push(
			this.position.x, this.position.y, this.position.z,
			this.color.r, this.color.g, this.color.b, this.color.a,
			this.angle, this.size, 1, 1
		);

		vertices.push(
			this.position.x, this.position.y, this.position.z,
			this.color.r, this.color.g, this.color.b, this.color.a,
			this.angle, this.size, 0, 1
		);

		var engine = this._scene.getEngine();
		engine.updateDynamicVertexBuffer(this._vertexBuffer, vertices);
	}

	render(){

		var
			engine = this._scene.getEngine(),
			effect = this._effect;

		// Check
		if (!effect.isReady() || !this.particleTexture || !this.particleTexture.isReady() )
			return 0;

		// Render
		engine.enableEffect(effect);

		var viewMatrix = this._scene.getViewMatrix();
		effect.setTexture("diffuseSampler", this.particleTexture);
		effect.setMatrix("view", viewMatrix);
		effect.setMatrix("projection", this._scene.getProjectionMatrix());
		effect.setFloat4("textureMask", this.textureMask.r, this.textureMask.g, this.textureMask.b, this.textureMask.a);

		if (BABYLON.clipPlane) {
			var invView = viewMatrix.clone();
			invView.invert();
			effect.setMatrix("invView", invView);
			effect.setFloat4("vClipPlane", BABYLON.clipPlane.normal.x, BABYLON.clipPlane.normal.y, BABYLON.clipPlane.normal.z, BABYLON.clipPlane.d);
		}

		// VBOs
		engine.bindBuffers(this._vertexBuffer, this._indexBuffer, this._vertexDeclaration, this._vertexStrideSize, effect);

		// Draw order
		// if (this.blendMode === BABYLON.ParticleSystem.BLENDMODE_ONEONE) {
		// 		engine.setAlphaMode(BABYLON.Engine.ALPHA_ADD);
		// } else {
		// 		engine.setAlphaMode(BABYLON.Engine.ALPHA_COMBINE);
		// }
    engine.draw(true, 0, 1 * 6);
		// engine.setAlphaMode(BABYLON.Engine.ALPHA_DISABLE);

	}

}