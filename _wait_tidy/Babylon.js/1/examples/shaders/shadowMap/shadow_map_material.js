import { shaderName } from './shadow_map_shaders.js';

export default class ShadowMapMaterial {

	wireframe = false;

	backFaceCulling = true;

	_effect = null;

	constructor(name, scene, useVarianceShadowMap, light){
		this.name = name;
		this.id = name;

		this._scene = scene;
		scene.materials.push(this);

		this._light = light;

		this.useVarianceShadowMap = useVarianceShadowMap;

		// Effect
		this._effect = this._scene.getEngine().createEffect(shaderName,
								["position"],
								["worldViewProjection"],
								[], "");

		this._effectVSM = this._scene.getEngine().createEffect(shaderName,
								["position"],
								["worldViewProjection"],
								[], "#define VSM");

		// Internals
		this._viewMatrix = BABYLON.Matrix.Zero();
		this._projectionMatrix = BABYLON.Matrix.Zero();
		this._transformMatrix = BABYLON.Matrix.Zero();
		this._worldViewProjection = BABYLON.Matrix.Zero();
	}

	isReady(mesh){

		return true;
	}

	getEffect = function () {
		return this._effect;
	};

	needAlphaBlending = function () {
		return false;
	};

	needAlphaTesting = function () {
		return false;
	};

	_preBind = function () {
		var engine = this._scene.getEngine();

		engine.enableEffect(this._effect);
		engine.setState(this.backFaceCulling);
	};

	unbind(){}

	bind(world, mesh){
		var effect = this.useVarianceShadowMap ? this._effectVSM : this._effect;
		var world = mesh.getWorldMatrix();

		world.multiplyToRef(this.getTransformMatrix(), this._worldViewProjection);

		effect.setMatrix("worldViewProjection", this._worldViewProjection);
	}

	getTransformMatrix(){
		if (!this._cachedPosition || !this._cachedDirection || !this._light.position.equals(this._cachedPosition) || !this._light.direction.equals(this._cachedDirection)) {

			this._cachedPosition = this._light.position.clone();
			this._cachedDirection = this._light.direction.clone();

			var activeCamera = this._scene.activeCamera;

			BABYLON.Matrix.LookAtLHToRef(this._light.position, this._light.position.add(this._light.direction), BABYLON.Vector3.Up(), this._viewMatrix);
			BABYLON.Matrix.PerspectiveFovLHToRef(Math.PI / 2.0, 1.0, activeCamera.minZ, activeCamera.maxZ, this._projectionMatrix);

			// 使用相机矩阵
			// var engine = this._scene.getEngine();
			// BABYLON.Matrix.PerspectiveFovLHToRef(activeCamera.fov, engine.getAspectRatio(), activeCamera.minZ, activeCamera.maxZ, this._projectionMatrix);
			// BABYLON.Matrix.LookAtLHToRef(activeCamera.position, activeCamera.target, BABYLON.Vector3.Up(), this._viewMatrix);

			this._viewMatrix.multiplyToRef(this._projectionMatrix, this._transformMatrix);
		}

		return this._transformMatrix;
	}
}