import { GLTFLoader as GLTF2Loader } from './2.0/glTFLoader.js';
import { GLTFValidation } from './glTFValidation.js';


const {
	Observable,
	Tools,
	SceneLoader,
	AssetContainer,
	Logger,
	DataReader,
	DecodeBase64UrlToBinary,
	RuntimeError,
	ErrorCodes,
} = window.BABYLON;

function readAsync(arrayBuffer, byteOffset, byteLength) {
	try {
		return Promise.resolve(new Uint8Array(arrayBuffer, byteOffset, byteLength));
	} catch (e) {
		return Promise.reject(e);
	}
}

function readViewAsync(arrayBufferView, byteOffset, byteLength) {
	try {
		if (byteOffset < 0 || byteOffset >= arrayBufferView.byteLength) {
			throw new RangeError("Offset is out of range.");
		}

		if (byteOffset + byteLength > arrayBufferView.byteLength) {
			throw new RangeError("Length is out of range.");
		}

		return Promise.resolve(new Uint8Array(arrayBufferView.buffer, arrayBufferView.byteOffset + byteOffset, byteLength));
	} catch (e) {
		return Promise.reject(e);
	}
}

/**
 * Mode that determines the coordinate system to use.
 */
export const GLTFLoaderCoordinateSystemMode = {
	/**
	 * Automatically convert the glTF right-handed data to the appropriate system based on the current coordinate system mode of the scene.
	 */
	AUTO: 'AUTO',

	/**
	 * Sets the useRightHandedSystem flag on the scene.
	 */
	FORCE_RIGHT_HANDED: 'FORCE_RIGHT_HANDED',
}

/**
 * Mode that determines what animations will start.
 */
export const GLTFLoaderAnimationStartMode = {
	/**
	 * No animation will start.
	 */
	NONE: 'NONE',

	/**
	 * The first animation will start.
	 */
	FIRST: 'FIRST',

	/**
	 * All animations will start.
	 */
	ALL: 'ALL',
}

/**
 * Loader state.
 */
export const GLTFLoaderState = {
	/**
	 * The asset is loading.
	 */
	LOADING: 'LOADING',

	/**
	 * The asset is ready for rendering.
	 */
	READY: 'READY',

	/**
	 * The asset is completely loaded.
	 */
	COMPLETE: 'COMPLETE',
}

/**
 * File loader for loading glTF files into a scene.
 */
export class GLTFFileLoader {
	/** @internal */
	// static _CreateGLTF1Loader = (parent) => { return new GLTFLoader(parent) };

	/** @internal */
	static _CreateGLTF2Loader = (parent) => { return new GLTF2Loader(parent) };

	// --------------
	// Common options
	// --------------

	/**
	 * Raised when the asset has been parsed
	 */
	onParsedObservable = new Observable();

	_onParsedObserver;

	/**
	 * Raised when the asset has been parsed
	 */
	set onParsed(callback) {
		if (this._onParsedObserver) {
			this.onParsedObservable.remove(this._onParsedObserver);
		}
		this._onParsedObserver = this.onParsedObservable.add(callback);
	}

	// ----------
	// V1 options
	// ----------

	/**
	 * Set this property to false to disable incremental loading which delays the loader from calling the success callback until after loading the meshes and shaders.
	 * Textures always loads asynchronously. For example, the success callback can compute the bounding information of the loaded meshes when incremental loading is disabled.
	 * Defaults to true.
	 * @internal
	 */
	static IncrementalLoading = true;

	/**
	 * Set this property to true in order to work with homogeneous coordinates, available with some converters and exporters.
	 * Defaults to false. See https://en.wikipedia.org/wiki/Homogeneous_coordinates.
	 * @internal
	 */
	static HomogeneousCoordinates = false;

	// ----------
	// V2 options
	// ----------

	/**
	 * The coordinate system mode. Defaults to AUTO.
	 */
	coordinateSystemMode = GLTFLoaderCoordinateSystemMode.AUTO;

	/**
	 * The animation start mode. Defaults to FIRST.
	 */
	animationStartMode = GLTFLoaderAnimationStartMode.FIRST;

	/**
	 * Defines if the loader should compile materials before raising the success callback. Defaults to false.
	 */
	compileMaterials = false;

	/**
	 * Defines if the loader should also compile materials with clip planes. Defaults to false.
	 */
	useClipPlane = false;

	/**
	 * Defines if the loader should compile shadow generators before raising the success callback. Defaults to false.
	 */
	compileShadowGenerators = false;

	/**
	 * Defines if the Alpha blended materials are only applied as coverage.
	 * If false, (default) The luminance of each pixel will reduce its opacity to simulate the behaviour of most physical materials.
	 * If true, no extra effects are applied to transparent pixels.
	 */
	transparencyAsCoverage = false;

	/**
	 * Defines if the loader should use range requests when load binary glTF files from HTTP.
	 * Enabling will disable offline support and glTF validator.
	 * Defaults to false.
	 */
	useRangeRequests = false;

	/**
	 * Defines if the loader should create instances when multiple glTF nodes point to the same glTF mesh. Defaults to true.
	 */
	createInstances = true;

	/**
	 * Defines if the loader should always compute the bounding boxes of meshes and not use the min/max values from the position accessor. Defaults to false.
	 */
	alwaysComputeBoundingBox = false;

	/**
	 * If true, load all materials defined in the file, even if not used by any mesh. Defaults to false.
	 */
	loadAllMaterials = false;

	/**
	 * If true, load only the materials defined in the file. Defaults to false.
	 */
	loadOnlyMaterials = false;

	/**
	 * If true, do not load any materials defined in the file. Defaults to false.
	 */
	skipMaterials = false;

	/**
	 * If true, load the color (gamma encoded) textures into sRGB buffers (if supported by the GPU), which will yield more accurate results when sampling the texture. Defaults to true.
	 */
	useSRGBBuffers = true;

	/**
	 * When loading glTF animations, which are defined in seconds, target them to this FPS. Defaults to 60.
	 */
	targetFps = 60;

	/**
	 * Defines if the loader should always compute the nearest common ancestor of the skeleton joints instead of using `skin.skeleton`. Defaults to false.
	 * Set this to true if loading assets with invalid `skin.skeleton` values.
	 */
	alwaysComputeSkeletonRootNode = false;

	/**
	 * Function called before loading a url referenced by the asset.
	 * @param url
	 */
	preprocessUrlAsync = (url) => Promise.resolve(url);

	/**
	 * Observable raised when the loader creates a mesh after parsing the glTF properties of the mesh.
	 * Note that the observable is raised as soon as the mesh object is created, meaning some data may not have been setup yet for this mesh (vertex data, morph targets, material, ...)
	 */
	onMeshLoadedObservable = new Observable();

	_onMeshLoadedObserver;

	/**
	 * Callback raised when the loader creates a mesh after parsing the glTF properties of the mesh.
	 * Note that the callback is called as soon as the mesh object is created, meaning some data may not have been setup yet for this mesh (vertex data, morph targets, material, ...)
	 */
	set onMeshLoaded(callback) {
		if (this._onMeshLoadedObserver) {
			this.onMeshLoadedObservable.remove(this._onMeshLoadedObserver);
		}
		this._onMeshLoadedObserver = this.onMeshLoadedObservable.add(callback);
	}

	/**
	 * Callback raised when the loader creates a skin after parsing the glTF properties of the skin node.
	 * @see https://doc.babylonjs.com/features/featuresDeepDive/importers/glTF/glTFSkinning#ignoring-the-transform-of-the-skinned-mesh
	 * @param node - the transform node that corresponds to the original glTF skin node used for animations
	 * @param skinnedNode - the transform node that is the skinned mesh itself or the parent of the skinned meshes
	 */
	onSkinLoadedObservable = new Observable();

	/**
	 * Observable raised when the loader creates a texture after parsing the glTF properties of the texture.
	 */
	onTextureLoadedObservable = new Observable();

	_onTextureLoadedObserver;

	/**
	 * Callback raised when the loader creates a texture after parsing the glTF properties of the texture.
	 */
	set onTextureLoaded(callback) {
		if (this._onTextureLoadedObserver) {
			this.onTextureLoadedObservable.remove(this._onTextureLoadedObserver);
		}
		this._onTextureLoadedObserver = this.onTextureLoadedObservable.add(callback);
	}

	/**
	 * Observable raised when the loader creates a material after parsing the glTF properties of the material.
	 */
	onMaterialLoadedObservable = new Observable();

	_onMaterialLoadedObserver;

	/**
	 * Callback raised when the loader creates a material after parsing the glTF properties of the material.
	 */
	set onMaterialLoaded(callback) {
		if (this._onMaterialLoadedObserver) {
			this.onMaterialLoadedObservable.remove(this._onMaterialLoadedObserver);
		}
		this._onMaterialLoadedObserver = this.onMaterialLoadedObservable.add(callback);
	}

	/**
	 * Observable raised when the loader creates a camera after parsing the glTF properties of the camera.
	 */
	onCameraLoadedObservable = new Observable();

	_onCameraLoadedObserver;

	/**
	 * Callback raised when the loader creates a camera after parsing the glTF properties of the camera.
	 */
	set onCameraLoaded(callback) {
		if (this._onCameraLoadedObserver) {
			this.onCameraLoadedObservable.remove(this._onCameraLoadedObserver);
		}
		this._onCameraLoadedObserver = this.onCameraLoadedObservable.add(callback);
	}

	/**
	 * Observable raised when the asset is completely loaded, immediately before the loader is disposed.
	 * For assets with LODs, raised when all of the LODs are complete.
	 * For assets without LODs, raised when the model is complete, immediately after the loader resolves the returned promise.
	 */
	onCompleteObservable = new Observable();

	_onCompleteObserver;

	/**
	 * Callback raised when the asset is completely loaded, immediately before the loader is disposed.
	 * For assets with LODs, raised when all of the LODs are complete.
	 * For assets without LODs, raised when the model is complete, immediately after the loader resolves the returned promise.
	 */
	set onComplete(callback) {
		if (this._onCompleteObserver) {
			this.onCompleteObservable.remove(this._onCompleteObserver);
		}
		this._onCompleteObserver = this.onCompleteObservable.add(callback);
	}

	/**
	 * Observable raised when an error occurs.
	 */
	onErrorObservable = new Observable();

	_onErrorObserver;

	/**
	 * Callback raised when an error occurs.
	 */
	set onError(callback) {
		if (this._onErrorObserver) {
			this.onErrorObservable.remove(this._onErrorObserver);
		}
		this._onErrorObserver = this.onErrorObservable.add(callback);
	}

	/**
	 * Observable raised after the loader is disposed.
	 */
	onDisposeObservable = new Observable();

	_onDisposeObserver;

	/**
	 * Callback raised after the loader is disposed.
	 */
	set onDispose(callback) {
		if (this._onDisposeObserver) {
			this.onDisposeObservable.remove(this._onDisposeObserver);
		}
		this._onDisposeObserver = this.onDisposeObservable.add(callback);
	}

	/**
	 * Observable raised after a loader extension is created.
	 * Set additional options for a loader extension in this event.
	 */
	onExtensionLoadedObservable = new Observable();

	_onExtensionLoadedObserver;

	/**
	 * Callback raised after a loader extension is created.
	 */
	set onExtensionLoaded(callback) {
		if (this._onExtensionLoadedObserver) {
			this.onExtensionLoadedObservable.remove(this._onExtensionLoadedObserver);
		}
		this._onExtensionLoadedObserver = this.onExtensionLoadedObservable.add(callback);
	}

	/**
	 * Defines if the loader logging is enabled.
	 */
	get loggingEnabled() {
		return this._loggingEnabled;
	}

	set loggingEnabled(value) {
		if (this._loggingEnabled === value) {
			return;
		}

		this._loggingEnabled = value;

		if (this._loggingEnabled) {
			this._log = this._logEnabled;
		} else {
			this._log = this._logDisabled;
		}
	}

	/**
	 * Defines if the loader should capture performance counters.
	 */
	get capturePerformanceCounters() {
		return this._capturePerformanceCounters;
	}

	set capturePerformanceCounters(value) {
		if (this._capturePerformanceCounters === value) {
			return;
		}

		this._capturePerformanceCounters = value;

		if (this._capturePerformanceCounters) {
			this._startPerformanceCounter = this._startPerformanceCounterEnabled;
			this._endPerformanceCounter = this._endPerformanceCounterEnabled;
		} else {
			this._startPerformanceCounter = this._startPerformanceCounterDisabled;
			this._endPerformanceCounter = this._endPerformanceCounterDisabled;
		}
	}

	/**
	 * Defines if the loader should validate the asset.
	 */
	validate = false;

	/**
	 * Observable raised after validation when validate is set to true. The event data is the result of the validation.
	 */
	onValidatedObservable = new Observable();

	_onValidatedObserver;

	/**
	 * Callback raised after a loader extension is created.
	 */
	set onValidated(callback) {
		if (this._onValidatedObserver) {
			this.onValidatedObservable.remove(this._onValidatedObserver);
		}
		this._onValidatedObserver = this.onValidatedObservable.add(callback);
	}

	_loader = null;
	_state = null;
	_progressCallback;
	_requests = new Array();

	static _MagicBase64Encoded = "Z2xURg"; // "glTF" base64 encoded (without the quotes!)

	/**
	 * Name of the loader ("gltf")
	 */
	name = "gltf";

	/** @internal */
	extensions = {
		".gltf": { isBinary: false },
		".glb": { isBinary: true },
	};

	/**
	 * Disposes the loader, releases resources during load, and cancels any outstanding requests.
	 */
	dispose() {
		if (this._loader) {
			this._loader.dispose();
			this._loader = null;
		}

		for (const request of this._requests) {
			request.abort();
		}

		this._requests.length = 0;

		delete this._progressCallback;

		this.preprocessUrlAsync = (url) => Promise.resolve(url);

		this.onMeshLoadedObservable.clear();
		this.onSkinLoadedObservable.clear();
		this.onTextureLoadedObservable.clear();
		this.onMaterialLoadedObservable.clear();
		this.onCameraLoadedObservable.clear();
		this.onCompleteObservable.clear();
		this.onExtensionLoadedObservable.clear();

		this.onDisposeObservable.notifyObservers(undefined);
		this.onDisposeObservable.clear();
	}

	/**
	 * @internal
	 */
	loadFile(
		scene,
		fileOrUrl,
		rootUrl,
		onSuccess,
		onProgress,
		useArrayBuffer,
		onError,
		name
	) {
		if (ArrayBuffer.isView(fileOrUrl)) {
			this._loadBinary(scene, fileOrUrl, rootUrl, onSuccess, onError, name);
			return null;
		}

		this._progressCallback = onProgress;

		const fileName = (fileOrUrl).name || Tools.GetFilename(fileOrUrl);

		if (useArrayBuffer) {
			if (this.useRangeRequests) {
				if (this.validate) {
					console.warn("glTF validation is not supported when range requests are enabled");
				}

				const fileRequest = {
					abort: () => {},
					onCompleteObservable: new Observable(),
				};

				const dataBuffer = {
					readAsync: (byteOffset, byteLength) => {
						return new Promise((resolve, reject) => {
							this._loadFile(
								scene,
								fileOrUrl,
								(data) => {
									resolve(new Uint8Array(data));
								},
								true,
								(error) => {
									reject(error);
								},
								(webRequest) => {
									webRequest.setRequestHeader("Range", `bytes=${byteOffset}-${byteOffset + byteLength - 1}`);
								}
							);
						});
					},
					byteLength: 0,
				};

				this._unpackBinaryAsync(new DataReader(dataBuffer)).then(
					(loaderData) => {
						fileRequest.onCompleteObservable.notifyObservers(fileRequest);
						onSuccess(loaderData);
					},
					onError ? (error) => onError(undefined, error) : undefined
				);

				return fileRequest;
			}

			return this._loadFile(
				scene,
				fileOrUrl,
				(data) => {
					this._validate(scene, new Uint8Array(data, 0, data.byteLength), rootUrl, fileName);
					this._unpackBinaryAsync(
						new DataReader({
							readAsync: (byteOffset, byteLength) => readAsync(data, byteOffset, byteLength),
							byteLength: data.byteLength,
						})
					).then(
						(loaderData) => {
							onSuccess(loaderData);
						},
						onError ? (error) => onError(undefined, error) : undefined
					);
				},
				true,
				onError
			);
		} else {
			return this._loadFile(
				scene,
				fileOrUrl,
				(data) => {
					this._validate(scene, data, rootUrl, fileName);
					onSuccess({ json: this._parseJson(data) });
				},
				false,
				onError
			);
		}
	}

	_loadBinary(
		scene,
		data,
		rootUrl,
		onSuccess,
		onError,
		fileName
	) {
		this._validate(scene, new Uint8Array(data.buffer, data.byteOffset, data.byteLength), rootUrl, fileName);
		this._unpackBinaryAsync(
			new DataReader({
				readAsync: (byteOffset, byteLength) => readViewAsync(data, byteOffset, byteLength),
				byteLength: data.byteLength,
			})
		).then(
			(loaderData) => {
				onSuccess(loaderData);
			},
			onError ? (error) => onError(undefined, error) : undefined
		);
	}

	/**
	 * @internal
	 */
	importMeshAsync(
		meshesNames,
		scene,
		data,
		rootUrl,
		onProgress,
		fileName
	) {
		return Promise.resolve().then(() => {
			this.onParsedObservable.notifyObservers(data);
			this.onParsedObservable.clear();

			this._log(`Loading ${fileName || ""}`);
			this._loader = this._getLoader(data);
			return this._loader.importMeshAsync(meshesNames, scene, null, data, rootUrl, onProgress, fileName);
		});
	}

	/**
	 * @internal
	 */
	loadAsync(scene, data, rootUrl, onProgress, fileName) {
		return Promise.resolve().then(() => {
			this.onParsedObservable.notifyObservers(data);
			this.onParsedObservable.clear();

			this._log(`Loading ${fileName || ""}`);
			this._loader = this._getLoader(data);
			return this._loader.loadAsync(scene, data, rootUrl, onProgress, fileName);
		});
	}

	/**
	 * @internal
	 */
	loadAssetContainerAsync(scene, data, rootUrl, onProgress, fileName) {
		return Promise.resolve().then(() => {
			this.onParsedObservable.notifyObservers(data);
			this.onParsedObservable.clear();

			this._log(`Loading ${fileName || ""}`);
			this._loader = this._getLoader(data);

			// Prepare the asset container.
			const container = new AssetContainer(scene);

			// Get materials/textures when loading to add to container
			const materials = [];
			this.onMaterialLoadedObservable.add((material) => {
				materials.push(material);
			});
			const textures = [];
			this.onTextureLoadedObservable.add((texture) => {
				textures.push(texture);
			});
			const cameras = [];
			this.onCameraLoadedObservable.add((camera) => {
				cameras.push(camera);
			});

			const morphTargetManagers = [];
			this.onMeshLoadedObservable.add((mesh) => {
				if (mesh.morphTargetManager) {
					morphTargetManagers.push(mesh.morphTargetManager);
				}
			});

			return this._loader.importMeshAsync(null, scene, container, data, rootUrl, onProgress, fileName).then((result) => {
				Array.prototype.push.apply(container.geometries, result.geometries);
				Array.prototype.push.apply(container.meshes, result.meshes);
				Array.prototype.push.apply(container.particleSystems, result.particleSystems);
				Array.prototype.push.apply(container.skeletons, result.skeletons);
				Array.prototype.push.apply(container.animationGroups, result.animationGroups);
				Array.prototype.push.apply(container.materials, materials);
				Array.prototype.push.apply(container.textures, textures);
				Array.prototype.push.apply(container.lights, result.lights);
				Array.prototype.push.apply(container.transformNodes, result.transformNodes);
				Array.prototype.push.apply(container.cameras, cameras);
				Array.prototype.push.apply(container.morphTargetManagers, morphTargetManagers);
				return container;
			});
		});
	}

	/**
	 * @internal
	 */
	canDirectLoad(data) {
		return (
			(data.indexOf("asset") !== -1 && data.indexOf("version") !== -1) ||
			data.startsWith("data:base64," + GLTFFileLoader._MagicBase64Encoded) || // this is technically incorrect, but will continue to support for backcompat.
			data.startsWith("data:;base64," + GLTFFileLoader._MagicBase64Encoded) ||
			data.startsWith("data:application/octet-stream;base64," + GLTFFileLoader._MagicBase64Encoded) ||
			data.startsWith("data:model/gltf-binary;base64," + GLTFFileLoader._MagicBase64Encoded)
		);
	}

	/**
	 * @internal
	 */
	directLoad(scene, data) {
		if (
			data.startsWith("base64," + GLTFFileLoader._MagicBase64Encoded) || // this is technically incorrect, but will continue to support for backcompat.
			data.startsWith(";base64," + GLTFFileLoader._MagicBase64Encoded) ||
			data.startsWith("application/octet-stream;base64," + GLTFFileLoader._MagicBase64Encoded) ||
			data.startsWith("model/gltf-binary;base64," + GLTFFileLoader._MagicBase64Encoded)
		) {
			const arrayBuffer = DecodeBase64UrlToBinary(data);

			this._validate(scene, new Uint8Array(arrayBuffer, 0, arrayBuffer.byteLength));
			return this._unpackBinaryAsync(
				new DataReader({
					readAsync: (byteOffset, byteLength) => readAsync(arrayBuffer, byteOffset, byteLength),
					byteLength: arrayBuffer.byteLength,
				})
			);
		}

		this._validate(scene, data);
		return Promise.resolve({ json: this._parseJson(data) });
	}

	/**
	 * The callback that allows custom handling of the root url based on the response url.
	 * @param rootUrl the original root url
	 * @param responseURL the response url if available
	 * @returns the new root url
	 */
	// rewriteRootURL(rootUrl, responseURL);

	/** @internal */
	createPlugin() {
		return new GLTFFileLoader();
	}

	/**
	 * The loader state or null if the loader is not active.
	 */
	get loaderState() {
		return this._state;
	}

	/**
	 * Observable raised when the loader state changes.
	 */
	onLoaderStateChangedObservable = new Observable();

	/**
	 * Returns a promise that resolves when the asset is completely loaded.
	 * @returns a promise that resolves when the asset is completely loaded.
	 */
	whenCompleteAsync() {
		return new Promise((resolve, reject) => {
			this.onCompleteObservable.addOnce(() => {
				resolve();
			});
			this.onErrorObservable.addOnce((reason) => {
				reject(reason);
			});
		});
	}

	/**
	 * @internal
	 */
	_setState(state) {
		if (this._state === state) {
			return;
		}

		this._state = state;
		this.onLoaderStateChangedObservable.notifyObservers(this._state);
		this._log(GLTFLoaderState[this._state]);
	}

	/**
	 * @internal
	 */
	_loadFile(
		scene,
		fileOrUrl,
		onSuccess,
		useArrayBuffer,
		onError,
		onOpened
	) {
		const request = scene._loadFile(
			fileOrUrl,
			onSuccess,
			(event) => {
				this._onProgress(event, request);
			},
			true,
			useArrayBuffer,
			onError,
			onOpened
		);
		request.onCompleteObservable.add((request) => {
			this._requests.splice(this._requests.indexOf(request), 1);
		});
		this._requests.push(request);
		return request;
	}

	_onProgress(event, request) {
		if (!this._progressCallback) {
			return;
		}

		request._lengthComputable = event.lengthComputable;
		request._loaded = event.loaded;
		request._total = event.total;

		let lengthComputable = true;
		let loaded = 0;
		let total = 0;
		for (const request of this._requests) {
			if (request._lengthComputable === undefined || request._loaded === undefined || request._total === undefined) {
				return;
			}

			lengthComputable = lengthComputable && request._lengthComputable;
			loaded += request._loaded;
			total += request._total;
		}

		this._progressCallback({
			lengthComputable: lengthComputable,
			loaded: loaded,
			total: lengthComputable ? total : 0,
		});
	}

	_validate(scene, data, rootUrl = "", fileName = "") {
		if (!this.validate) {
			return;
		}

		this._startPerformanceCounter("Validate JSON");
		GLTFValidation.ValidateAsync(data, rootUrl, fileName, (uri) => {
			return this.preprocessUrlAsync(rootUrl + uri).then((url) => {
				return scene._loadFileAsync(url, undefined, true, true).then((data) => {
					return new Uint8Array(data, 0, data.byteLength);
				});
			});
		}).then(
			(result) => {
				this._endPerformanceCounter("Validate JSON");
				this.onValidatedObservable.notifyObservers(result);
				this.onValidatedObservable.clear();
			},
			(reason) => {
				this._endPerformanceCounter("Validate JSON");
				Tools.Warn(`Failed to validate: ${reason.message}`);
				this.onValidatedObservable.clear();
			}
		);
	}

	_getLoader(loaderData){
		const asset = (loaderData.json).asset || {};

		this._log(`Asset version: ${asset.version}`);
		asset.minVersion && this._log(`Asset minimum version: ${asset.minVersion}`);
		asset.generator && this._log(`Asset generator: ${asset.generator}`);

		const version = GLTFFileLoader._parseVersion(asset.version);
		if (!version) {
			throw new Error("Invalid version: " + asset.version);
		}

		if (asset.minVersion !== undefined) {
			const minVersion = GLTFFileLoader._parseVersion(asset.minVersion);
			if (!minVersion) {
				throw new Error("Invalid minimum version: " + asset.minVersion);
			}

			if (GLTFFileLoader._compareVersion(minVersion, { major: 2, minor: 0 }) > 0) {
				throw new Error("Incompatible minimum version: " + asset.minVersion);
			}
		}

		const createLoaders = {
			1: GLTFFileLoader._CreateGLTF1Loader,
			2: GLTFFileLoader._CreateGLTF2Loader,
		};

		const createLoader = createLoaders[version.major];
		if (!createLoader) {
			console.error("Unsupported version: " + asset.version);
			throw new Error("Unsupported version: " + asset.version);
		}

		return createLoader(this);
	}

	_parseJson(json) {
		this._startPerformanceCounter("Parse JSON");
		this._log(`JSON length: ${json.length}`);
		const parsed = JSON.parse(json);
		this._endPerformanceCounter("Parse JSON");
		return parsed;
	}

	_unpackBinaryAsync(dataReader) {
		this._startPerformanceCounter("Unpack Binary");

		// Read magic + version + length + json length + json format
		return dataReader.loadAsync(20).then(() => {
			const Binary = {
				Magic: 0x46546c67,
			};

			const magic = dataReader.readUint32();
			if (magic !== Binary.Magic) {
				throw new RuntimeError("Unexpected magic: " + magic, ErrorCodes.GLTFLoaderUnexpectedMagicError);
			}

			const version = dataReader.readUint32();

			if (this.loggingEnabled) {
				this._log(`Binary version: ${version}`);
			}

			const length = dataReader.readUint32();
			if (!this.useRangeRequests && length !== dataReader.buffer.byteLength) {
				console.warn(`Length in header does not match actual data length: ${length} != ${dataReader.buffer.byteLength}`);
			}

			let unpacked;
			switch (version) {
				case 1: {
					unpacked = this._unpackBinaryV1Async(dataReader, length);
					break;
				}
				case 2: {
					unpacked = this._unpackBinaryV2Async(dataReader, length);
					break;
				}
				default: {
					console.error("Unsupported version: " + version)
					throw new Error("Unsupported version: " + version);
				}
			}

			this._endPerformanceCounter("Unpack Binary");

			return unpacked;
		});
	}

	_unpackBinaryV1Async(dataReader, length) {
		const ContentFormat = {
			JSON: 0,
		};

		const contentLength = dataReader.readUint32();
		const contentFormat = dataReader.readUint32();

		if (contentFormat !== ContentFormat.JSON) {
			throw new Error(`Unexpected content format: ${contentFormat}`);
		}

		const bodyLength = length - dataReader.byteOffset;

		const data = { json: this._parseJson(dataReader.readString(contentLength)), bin: null };
		if (bodyLength !== 0) {
			const startByteOffset = dataReader.byteOffset;
			data.bin = {
				readAsync: (byteOffset, byteLength) => dataReader.buffer.readAsync(startByteOffset + byteOffset, byteLength),
				byteLength: bodyLength,
			};
		}

		return Promise.resolve(data);
	}

	_unpackBinaryV2Async(dataReader, length) {
		const ChunkFormat = {
			JSON: 0x4e4f534a,
			BIN: 0x004e4942,
		};

		// Read the JSON chunk header.
		const chunkLength = dataReader.readUint32();
		const chunkFormat = dataReader.readUint32();
		if (chunkFormat !== ChunkFormat.JSON) {
			throw new Error("First chunk format is not JSON");
		}

		// Bail if there are no other chunks.
		if (dataReader.byteOffset + chunkLength === length) {
			return dataReader.loadAsync(chunkLength).then(() => {
				return { json: this._parseJson(dataReader.readString(chunkLength)), bin: null };
			});
		}

		// Read the JSON chunk and the length and type of the next chunk.
		return dataReader.loadAsync(chunkLength + 8).then(() => {
			const data = { json: this._parseJson(dataReader.readString(chunkLength)), bin: null };

			const readAsync = () => {
				const chunkLength = dataReader.readUint32();
				const chunkFormat = dataReader.readUint32();

				switch (chunkFormat) {
					case ChunkFormat.JSON: {
						throw new Error("Unexpected JSON chunk");
					}
					case ChunkFormat.BIN: {
						const startByteOffset = dataReader.byteOffset;
						data.bin = {
							readAsync: (byteOffset, byteLength) => dataReader.buffer.readAsync(startByteOffset + byteOffset, byteLength),
							byteLength: chunkLength,
						};
						dataReader.skipBytes(chunkLength);
						break;
					}
					default: {
						// ignore unrecognized chunkFormat
						dataReader.skipBytes(chunkLength);
						break;
					}
				}

				if (dataReader.byteOffset !== length) {
					return dataReader.loadAsync(8).then(readAsync);
				}

				return Promise.resolve(data);
			};

			return readAsync();
		});
	}

	static _parseVersion(version) {
		if (version === "1.0" || version === "1.0.1") {
			return {
				major: 1,
				minor: 0,
			};
		}

		const match = (version + "").match(/^(\d+)\.(\d+)/);
		if (!match) {
			return null;
		}

		return {
			major: parseInt(match[1]),
			minor: parseInt(match[2]),
		};
	}

	static _compareVersion(a, b) {
		if (a.major > b.major) {
			return 1;
		}
		if (a.major < b.major) {
			return -1;
		}
		if (a.minor > b.minor) {
			return 1;
		}
		if (a.minor < b.minor) {
			return -1;
		}
		return 0;
	}

	static _logSpaces = "                                ";
	_logIndentLevel = 0;
	_loggingEnabled = false;

	/** @internal */
	_log = this._logDisabled;

	/**
	 * @internal
	 */
	_logOpen(message) {
		this._log(message);
		this._logIndentLevel++;
	}

	/** @internal */
	_logClose() {
		--this._logIndentLevel;
	}

	_logEnabled(message) {
		const spaces = GLTFFileLoader._logSpaces.substr(0, this._logIndentLevel * 2);
		Logger.Log(`${spaces}${message}`);
	}

	_logDisabled(message) {}

	_capturePerformanceCounters = false;

	/** @internal */
	_startPerformanceCounter = this._startPerformanceCounterDisabled;

	/** @internal */
	_endPerformanceCounter = this._endPerformanceCounterDisabled;

	_startPerformanceCounterEnabled(counterName) {
		Tools.StartPerformanceCounter(counterName);
	}

	_startPerformanceCounterDisabled(counterName) {}

	_endPerformanceCounterEnabled(counterName) {
		Tools.EndPerformanceCounter(counterName);
	}

	_endPerformanceCounterDisabled(counterName) {}
}

if (SceneLoader) {
	SceneLoader.RegisterPlugin(new GLTFFileLoader());
}
