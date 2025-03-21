import { Scalar } from "../../Maths/math.scalar.js";
// eslint-disable-next-line @typescript-eslint/naming-convention
import * as WebGPUConstants from "./webgpuConstants.js";
import { WebGPUTextureHelper } from "./webgpuTextureHelper.js";
/** @internal */
export class WebGPUHardwareTexture {
    get underlyingResource() {
        return this._webgpuTexture;
    }
    getMSAATexture(index = 0) {
        return this._webgpuMSAATexture?.[index] ?? null;
    }
    setMSAATexture(texture, index = -1) {
        if (!this._webgpuMSAATexture) {
            this._webgpuMSAATexture = [];
        }
        if (index === -1) {
            index = this._webgpuMSAATexture.length;
        }
        this._webgpuMSAATexture[index] = texture;
    }
    releaseMSAATexture() {
        if (this._webgpuMSAATexture) {
            for (const texture of this._webgpuMSAATexture) {
                texture?.destroy();
            }
            this._webgpuMSAATexture = null;
        }
    }
    constructor(existingTexture = null) {
        /** @internal */
        this._originalFormatIsRGB = false;
        this.format = WebGPUConstants.TextureFormat.RGBA8Unorm;
        this.textureUsages = 0;
        this.textureAdditionalUsages = 0;
        this._webgpuTexture = existingTexture;
        this._webgpuMSAATexture = null;
        this.view = null;
        this.viewForWriting = null;
    }
    set(hardwareTexture) {
        this._webgpuTexture = hardwareTexture;
    }
    setUsage(_textureSource, generateMipMaps, is2DArray, isCube, is3D, width, height, depth) {
        let viewDimension = WebGPUConstants.TextureViewDimension.E2d;
        let arrayLayerCount = 1;
        if (isCube) {
            viewDimension = is2DArray ? WebGPUConstants.TextureViewDimension.CubeArray : WebGPUConstants.TextureViewDimension.Cube;
            arrayLayerCount = 6 * (depth || 1);
        }
        else if (is3D) {
            viewDimension = WebGPUConstants.TextureViewDimension.E3d;
            arrayLayerCount = 1;
        }
        else if (is2DArray) {
            viewDimension = WebGPUConstants.TextureViewDimension.E2dArray;
            arrayLayerCount = depth;
        }
        const format = WebGPUTextureHelper.GetDepthFormatOnly(this.format);
        const aspect = WebGPUTextureHelper.HasDepthAndStencilAspects(this.format) ? WebGPUConstants.TextureAspect.DepthOnly : WebGPUConstants.TextureAspect.All;
        this.createView({
            label: `TextureView${is3D ? "3D" : isCube ? "Cube" : "2D"}${is2DArray ? "_Array" + arrayLayerCount : ""}_${width}x${height}_${generateMipMaps ? "wmips" : "womips"}_${this.format}_${viewDimension}`,
            format,
            dimension: viewDimension,
            mipLevelCount: generateMipMaps ? Scalar.ILog2(Math.max(width, height)) + 1 : 1,
            baseArrayLayer: 0,
            baseMipLevel: 0,
            arrayLayerCount,
            aspect,
        });
    }
    createView(descriptor, createViewForWriting = false) {
        this.view = this._webgpuTexture.createView(descriptor);
        if (createViewForWriting && descriptor) {
            const saveNumMipMaps = descriptor.mipLevelCount;
            descriptor.mipLevelCount = 1;
            this.viewForWriting = this._webgpuTexture.createView(descriptor);
            descriptor.mipLevelCount = saveNumMipMaps;
        }
    }
    reset() {
        this._webgpuTexture = null;
        this._webgpuMSAATexture = null;
        this.view = null;
        this.viewForWriting = null;
    }
    release() {
        this._webgpuTexture?.destroy();
        this.releaseMSAATexture();
        this._copyInvertYTempTexture?.destroy();
        this.reset();
    }
}
//# sourceMappingURL=webgpuHardwareTexture.js.map