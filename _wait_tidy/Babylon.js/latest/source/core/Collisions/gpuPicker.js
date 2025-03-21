
import { RenderTargetTexture } from "../Materials/Textures/renderTargetTexture.js";
import { ShaderMaterial } from "../Materials/shaderMaterial.js";
import { Color3, Color4 } from "../Maths/math.color.js";
import { VertexBuffer } from "../Meshes/buffer.js";
import "../Shaders/picking.fragment.js";
import "../Shaders/picking.vertex.js";
/**
 * Class used to perform a picking operation using GPU
 * Please note that GPUPIcker cannot pick instances, only meshes
 */
export class GPUPicker {
    constructor() {
        this._pickingTexure = null;
        this._idMap = [];
        this._idColors = [];
        this._meshRenderingCount = 0;
        this._attributeName = "instanceMeshID";
    }
    _createRenderTarget(scene, width, height) {
        if (this._pickingTexure) {
            this._pickingTexure.dispose();
        }
        this._pickingTexure = new RenderTargetTexture("pickingTexure", { width: width, height: height }, scene, false, undefined, 0, false, 1);
    }
    _createColorMaterial(scene) {
        if (this._renderMaterial) {
            this._renderMaterial.dispose();
        }
        const defines = [];
        const options = {
            attributes: [VertexBuffer.PositionKind, this._attributeName],
            uniforms: ["world", "viewProjection", "meshID"],
            needAlphaBlending: false,
            defines: defines,
            useClipPlane: null,
        };
        this._renderMaterial = new ShaderMaterial("pickingShader", scene, "picking", options, false);
        const callback = (mesh) => {
            if (!mesh) {
                return;
            }
            const effect = this._renderMaterial.getEffect();
            if (!mesh.hasInstances && !mesh.isAnInstance) {
                effect.setColor4("meshID", this._idColors[mesh.uniqueId], 1);
            }
            this._meshRenderingCount++;
        };
        this._renderMaterial.onBindObservable.add(callback);
    }
    /**
     * Set the list of meshes to pick from
     * Set that value to null to clear the list (and avoid leaks)
     * @param list defines the list of meshes to pick from
     */
    setPickingList(list) {
        if (this._pickableMeshes) {
            // Cleanup
            for (let index = 0; index < this._pickableMeshes.length; index++) {
                const mesh = this._pickableMeshes[index];
                if (mesh.hasInstances) {
                    mesh.removeVerticesData(this._attributeName);
                }
                if (this._pickingTexure) {
                    this._pickingTexure.setMaterialForRendering(mesh, undefined);
                }
            }
            this._pickableMeshes.length = 0;
            this._idMap.length = 0;
            this._idColors.length = 0;
            if (this._pickingTexure) {
                this._pickingTexure.renderList = [];
            }
        }
        if (!list || list.length === 0) {
            return;
        }
        this._pickableMeshes = list;
        // Prepare target
        const scene = list[0].getScene();
        const engine = scene.getEngine();
        const rttSizeW = engine.getRenderWidth();
        const rttSizeH = engine.getRenderHeight();
        if (!this._pickingTexure) {
            this._createRenderTarget(scene, rttSizeW, rttSizeH);
        }
        else {
            const size = this._pickingTexure.getSize();
            if (size.width !== rttSizeW || size.height !== rttSizeH || this._cachedScene !== scene) {
                this._createRenderTarget(scene, rttSizeW, rttSizeH);
            }
        }
        if (!this._cachedScene || this._cachedScene !== scene) {
            this._createColorMaterial(scene);
        }
        this._cachedScene = scene;
        this._pickingTexure.renderList = [];
        // We will affect colors and create vertex color buffers
        let id = 1;
        for (let index = 0; index < this._pickableMeshes.length; index++) {
            const mesh = this._pickableMeshes[index];
            this._pickingTexure.setMaterialForRendering(mesh, this._renderMaterial);
            this._pickingTexure.renderList.push(mesh);
            if (mesh.isAnInstance) {
                continue; // This will be handled by the source mesh
            }
            const r = (id & 0xff0000) >> 16;
            const g = (id & 0x00ff00) >> 8;
            const b = (id & 0x0000ff) >> 0;
            this._idMap[id] = index;
            id++;
            if (mesh.hasInstances) {
                const instances = mesh.instances;
                const colorData = new Float32Array(4 * (instances.length + 1));
                const engine = mesh.getEngine();
                colorData[0] = r / 255.0;
                colorData[1] = g / 255.0;
                colorData[2] = b / 255.0;
                colorData[3] = 1.0;
                for (let i = 0; i < instances.length; i++) {
                    const instance = instances[i];
                    const r = (id & 0xff0000) >> 16;
                    const g = (id & 0x00ff00) >> 8;
                    const b = (id & 0x0000ff) >> 0;
                    this._idMap[id] = this._pickableMeshes.indexOf(instance);
                    colorData[(i + 1) * 4] = r / 255.0;
                    colorData[(i + 1) * 4 + 1] = g / 255.0;
                    colorData[(i + 1) * 4 + 2] = b / 255.0;
                    colorData[(i + 1) * 4 + 3] = 1.0;
                    id++;
                }
                const buffer = new VertexBuffer(engine, colorData, this._attributeName, false, false, 4, true);
                mesh.setVerticesBuffer(buffer, true);
            }
            else {
                this._idColors[mesh.uniqueId] = Color3.FromInts(r, g, b);
            }
        }
    }
    /**
     * Execute a picking operation
     * @param x defines the X coordinates where to run the pick
     * @param y defines the Y coordinates where to run the pick
     * @param disposeWhenDone defines a boolean indicating we do not want to keep resources alive (false by default)
     * @returns A promise with the picking results
     */
    pickAsync(x, y, disposeWhenDone = false) {
        if (!this._pickableMeshes || this._pickableMeshes.length === 0) {
            return Promise.resolve(null);
        }
        const scene = this._cachedScene;
        const engine = scene.getEngine();
        const rttSizeW = engine.getRenderWidth();
        const rttSizeH = engine.getRenderHeight();
        if (!this._readbuffer) {
            this._readbuffer = new Uint8Array(engine.isWebGPU ? 256 : 4); // Because of block alignment in WebGPU
        }
        // Do we need to rebuild the RTT?
        const size = this._pickingTexure.getSize();
        if (size.width !== rttSizeW || size.height !== rttSizeH) {
            this._createRenderTarget(scene, rttSizeW, rttSizeH);
            this._pickingTexure.renderList = [];
            for (let index = 0; index < this._pickableMeshes.length; index++) {
                const mesh = this._pickableMeshes[index];
                this._pickingTexure.setMaterialForRendering(mesh, this._renderMaterial);
                this._pickingTexure.renderList.push(mesh);
            }
        }
        this._meshRenderingCount = 0;
        // Ensure ints
        x = x >> 0;
        y = y >> 0;
        if (x < 0 || y < 0 || x >= rttSizeW || y >= rttSizeH) {
            return Promise.resolve(null);
        }
        // Invert Y
        y = rttSizeH - y;
        this._pickingTexure.clearColor = new Color4(0, 0, 0, 0);
        scene.customRenderTargets.push(this._pickingTexure);
        this._pickingTexure.onBeforeRender = () => {
            // Enable scissor
            if (engine.enableScissor) {
                engine.enableScissor(x, y, 1, 1);
            }
        };
        return new Promise((resolve, reject) => {
            this._pickingTexure.onAfterRender = async () => {
                // Disable scissor
                if (engine.disableScissor) {
                    engine.disableScissor();
                }
                if (!this._pickingTexure) {
                    reject();
                }
                let pickedMesh = null;
                const wasSuccessfull = this._meshRenderingCount > 0;
                if (wasSuccessfull) {
                    // Remove from the active RTTs
                    const index = scene.customRenderTargets.indexOf(this._pickingTexure);
                    if (index > -1) {
                        scene.customRenderTargets.splice(index, 1);
                    }
                    // Do the actual picking
                    if (await this._readTexturePixelsAsync(x, y)) {
                        const r = this._readbuffer[0];
                        const g = this._readbuffer[1];
                        const b = this._readbuffer[2];
                        const colorId = (r << 16) + (g << 8) + b;
                        pickedMesh = this._pickableMeshes[this._idMap[colorId]];
                    }
                }
                // Clean-up
                if (!wasSuccessfull) {
                    this._meshRenderingCount = 0;
                    return; // We need to wait for the shaders to be ready
                }
                else {
                    if (disposeWhenDone) {
                        this.dispose();
                    }
                    if (pickedMesh) {
                        resolve({ mesh: pickedMesh });
                    }
                    else {
                        resolve(null);
                    }
                }
            };
        });
    }
    async _readTexturePixelsAsync(x, y) {
        if (!this._cachedScene || !this._pickingTexure?._texture) {
            return false;
        }
        const engine = this._cachedScene.getEngine();
        await engine._readTexturePixels(this._pickingTexure._texture, 1, 1, -1, 0, this._readbuffer, true, true, x, y);
        return true;
    }
    /** Release the resources */
    dispose() {
        this.setPickingList(null);
        this._cachedScene = null;
        // Cleaning up
        this._pickingTexure?.dispose();
        this._pickingTexure = null;
        this._renderMaterial?.dispose();
        this._renderMaterial = null;
    }
}
//# sourceMappingURL=gpuPicker.js.map