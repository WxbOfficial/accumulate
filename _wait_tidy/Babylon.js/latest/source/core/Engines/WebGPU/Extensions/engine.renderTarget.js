import { InternalTexture, InternalTextureSource } from "../../../Materials/Textures/internalTexture.js";

import { WebGPUEngine } from "../../webgpuEngine.js";
import { WebGPURenderTargetWrapper } from "../webgpuRenderTargetWrapper.js";
import { WebGPUTextureHelper } from "../webgpuTextureHelper.js";
import "../../AbstractEngine/abstractEngine.texture.js";
WebGPUEngine.prototype._createHardwareRenderTargetWrapper = function (isMulti, isCube, size) {
    const rtWrapper = new WebGPURenderTargetWrapper(isMulti, isCube, size, this);
    this._renderTargetWrapperCache.push(rtWrapper);
    return rtWrapper;
};
WebGPUEngine.prototype.createRenderTargetTexture = function (size, options) {
    const rtWrapper = this._createHardwareRenderTargetWrapper(false, false, size);
    const fullOptions = {};
    if (options !== undefined && typeof options === "object") {
        fullOptions.generateMipMaps = options.generateMipMaps;
        fullOptions.generateDepthBuffer = options.generateDepthBuffer === undefined ? true : options.generateDepthBuffer;
        fullOptions.generateStencilBuffer = fullOptions.generateDepthBuffer && options.generateStencilBuffer;
        fullOptions.samplingMode = options.samplingMode === undefined ? 3 : options.samplingMode;
        fullOptions.creationFlags = options.creationFlags ?? 0;
        fullOptions.noColorAttachment = !!options.noColorAttachment;
        fullOptions.samples = options.samples;
        fullOptions.label = options.label;
    }
    else {
        fullOptions.generateMipMaps = options;
        fullOptions.generateDepthBuffer = true;
        fullOptions.generateStencilBuffer = false;
        fullOptions.samplingMode = 3;
        fullOptions.creationFlags = 0;
        fullOptions.noColorAttachment = false;
    }
    const texture = fullOptions.noColorAttachment ? null : this._createInternalTexture(size, options, true, InternalTextureSource.RenderTarget);
    rtWrapper.label = fullOptions.label ?? "RenderTargetWrapper";
    rtWrapper._samples = fullOptions.samples ?? 1;
    rtWrapper._generateDepthBuffer = fullOptions.generateDepthBuffer;
    rtWrapper._generateStencilBuffer = fullOptions.generateStencilBuffer ? true : false;
    rtWrapper.setTextures(texture);
    if (rtWrapper._generateDepthBuffer || rtWrapper._generateStencilBuffer) {
        rtWrapper.createDepthStencilTexture(0, false, // force false as filtering is not supported for depth textures
        rtWrapper._generateStencilBuffer, rtWrapper.samples, fullOptions.generateStencilBuffer ? 13 : 14, fullOptions.label ? fullOptions.label + "-DepthStencil" : undefined);
    }
    if (texture) {
        if (options !== undefined && typeof options === "object" && options.createMipMaps && !fullOptions.generateMipMaps) {
            texture.generateMipMaps = true;
        }
        this._textureHelper.createGPUTextureForInternalTexture(texture, undefined, undefined, undefined, fullOptions.creationFlags);
        if (options !== undefined && typeof options === "object" && options.createMipMaps && !fullOptions.generateMipMaps) {
            texture.generateMipMaps = false;
        }
    }
    return rtWrapper;
};
WebGPUEngine.prototype._createDepthStencilTexture = function (size, options) {
    const internalTexture = new InternalTexture(this, options.generateStencil ? InternalTextureSource.DepthStencil : InternalTextureSource.Depth);
    internalTexture.label = options.label;
    const internalOptions = {
        bilinearFiltering: false,
        comparisonFunction: 0,
        generateStencil: false,
        samples: 1,
        depthTextureFormat: options.generateStencil ? 13 : 14,
        ...options,
    };
    internalTexture.format = internalOptions.depthTextureFormat;
    this._setupDepthStencilTexture(internalTexture, size, internalOptions.generateStencil, internalOptions.bilinearFiltering, internalOptions.comparisonFunction, internalOptions.samples);
    this._textureHelper.createGPUTextureForInternalTexture(internalTexture);
    // Now that the hardware texture is created, we can retrieve the GPU format and set the right type to the internal texture
    const gpuTextureWrapper = internalTexture._hardwareTexture;
    internalTexture.type = WebGPUTextureHelper.GetTextureTypeFromFormat(gpuTextureWrapper.format);
    this._internalTexturesCache.push(internalTexture);
    return internalTexture;
};
WebGPUEngine.prototype._setupDepthStencilTexture = function (internalTexture, size, generateStencil, bilinearFiltering, comparisonFunction, samples = 1) {
    const width = size.width || size;
    const height = size.height || size;
    const layers = size.layers || 0;
    const depth = size.depth || 0;
    internalTexture.baseWidth = width;
    internalTexture.baseHeight = height;
    internalTexture.width = width;
    internalTexture.height = height;
    internalTexture.is2DArray = layers > 0;
    internalTexture.is3D = depth > 0;
    internalTexture.depth = layers || depth;
    internalTexture.isReady = true;
    internalTexture.samples = samples;
    internalTexture.generateMipMaps = false;
    internalTexture.samplingMode = bilinearFiltering ? 2 : 1;
    internalTexture.type = 1;
    internalTexture._comparisonFunction = comparisonFunction;
    internalTexture._cachedWrapU = 0;
    internalTexture._cachedWrapV = 0;
};
WebGPUEngine.prototype.updateRenderTargetTextureSampleCount = function (rtWrapper, samples) {
    if (!rtWrapper || !rtWrapper.texture || rtWrapper.samples === samples) {
        return samples;
    }
    samples = Math.min(samples, this.getCaps().maxMSAASamples);
    this._textureHelper.createMSAATexture(rtWrapper.texture, samples);
    if (rtWrapper._depthStencilTexture) {
        this._textureHelper.createMSAATexture(rtWrapper._depthStencilTexture, samples);
        rtWrapper._depthStencilTexture.samples = samples;
    }
    rtWrapper._samples = samples;
    rtWrapper.texture.samples = samples;
    return samples;
};
//# sourceMappingURL=engine.renderTarget.js.map