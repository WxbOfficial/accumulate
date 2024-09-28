import { MeshPrimitiveMode } from "../../../../public/babylon.glTF2Interface.js";
import { GLTFLoader, ArrayItem } from "../glTFLoader.js";

const {
	DracoCompression,
	VertexBuffer,
} = window.BABYLON;


const NAME = "KHR_draco_mesh_compression";

export class KHR_draco_mesh_compression {
	/**
	 * The name of this extension.
	 */
	name = NAME;

	/**
	 * The draco compression used to decode vertex data or DracoCompression.Default if not defined
	 */
	dracoCompression;

	/**
	 * Defines whether this extension is enabled.
	 */
	enabled;

	/**
	 * Defines whether to use the normalized flag from the glTF accessor instead of the Draco data. Defaults to true.
	 */
	useNormalizedFlagFromAccessor = true;

	_loader;

	/**
	 * @internal
	 */
	constructor(loader) {
		this._loader = loader;
		this.enabled = DracoCompression.DecoderAvailable && this._loader.isExtensionUsed(NAME);
	}

	/** @internal */
	dispose() {
		delete this.dracoCompression;
		this._loader = null;
	}

	/**
	 * @internal
	 */
	_loadVertexDataAsync(context, primitive, babylonMesh) {
		return GLTFLoader.LoadExtensionAsync(context, primitive, this.name, (extensionContext, extension) => {
			if (primitive.mode != undefined) {
				if (primitive.mode !== MeshPrimitiveMode.TRIANGLES && primitive.mode !== MeshPrimitiveMode.TRIANGLE_STRIP) {
					throw new Error(`${context}: Unsupported mode ${primitive.mode}`);
				}
			}

			const attributes = {};
			const normalized = {};
			const loadAttribute = (name, kind) => {
				const uniqueId = extension.attributes[name];
				if (uniqueId == undefined) {
					return;
				}

				babylonMesh._delayInfo = babylonMesh._delayInfo || [];
				if (babylonMesh._delayInfo.indexOf(kind) === -1) {
					babylonMesh._delayInfo.push(kind);
				}

				attributes[kind] = uniqueId;

				if (this.useNormalizedFlagFromAccessor) {
					const accessor = ArrayItem.TryGet(this._loader.gltf.accessors, primitive.attributes[name]);
					if (accessor) {
						normalized[kind] = accessor.normalized || false;
					}
				}
			};

			loadAttribute("POSITION", VertexBuffer.PositionKind);
			loadAttribute("NORMAL", VertexBuffer.NormalKind);
			loadAttribute("TANGENT", VertexBuffer.TangentKind);
			loadAttribute("TEXCOORD_0", VertexBuffer.UVKind);
			loadAttribute("TEXCOORD_1", VertexBuffer.UV2Kind);
			loadAttribute("TEXCOORD_2", VertexBuffer.UV3Kind);
			loadAttribute("TEXCOORD_3", VertexBuffer.UV4Kind);
			loadAttribute("TEXCOORD_4", VertexBuffer.UV5Kind);
			loadAttribute("TEXCOORD_5", VertexBuffer.UV6Kind);
			loadAttribute("JOINTS_0", VertexBuffer.MatricesIndicesKind);
			loadAttribute("WEIGHTS_0", VertexBuffer.MatricesWeightsKind);
			loadAttribute("COLOR_0", VertexBuffer.ColorKind);

			const bufferView = ArrayItem.Get(extensionContext, this._loader.gltf.bufferViews, extension.bufferView);
			if (!bufferView._dracoBabylonGeometry) {
				const babylonScene = this._loader.babylonScene;
				bufferView._dracoBabylonGeometry = this._loader.loadBufferViewAsync(`/bufferViews/${bufferView.index}`, bufferView).then((data) => {
					const dracoCompression = this.dracoCompression || DracoCompression.Default;
					return dracoCompression._decodeMeshToGeometryForGltfAsync(babylonMesh.name, babylonScene, data, attributes, normalized).catch((error) => {
						throw new Error(`${context}: ${error.message}`);
					});
				});
			}

			return bufferView._dracoBabylonGeometry;
		});
	}
}