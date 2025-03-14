import { InternalTexture, InternalTextureSource } from "../../../Materials/Textures/internalTexture.js";

import { WebGPUEngine } from "../../webgpuEngine.js";
import { WebGPUTextureHelper } from "../webgpuTextureHelper.js";
WebGPUEngine.prototype._createDepthStencilCubeTexture = function (size, options) {
    const internalTexture = new InternalTexture(this, options.generateStencil ? InternalTextureSource.DepthStencil : InternalTextureSource.Depth);
    internalTexture.isCube = true;
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
WebGPUEngine.prototype.createCubeTexture = function (rootUrl, scene, files, noMipmap, onLoad = null, onError = null, format, forcedExtension = null, createPolynomials = false, lodScale = 0, lodOffset = 0, fallback = null, loaderOptions, useSRGBBuffer = false, buffer = null) {
    return this.createCubeTextureBase(rootUrl, scene, files, !!noMipmap, onLoad, onError, format, forcedExtension, createPolynomials, lodScale, lodOffset, fallback, null, (texture, imgs) => {
        const imageBitmaps = imgs; // we will always get an ImageBitmap array in WebGPU
        const width = imageBitmaps[0].width;
        const height = width;
        this._setCubeMapTextureParams(texture, !noMipmap);
        texture.format = format ?? -1;
        const gpuTextureWrapper = this._textureHelper.createGPUTextureForInternalTexture(texture, width, height);
        this._textureHelper.updateCubeTextures(imageBitmaps, gpuTextureWrapper.underlyingResource, width, height, gpuTextureWrapper.format, false, false, 0, 0);
        if (!noMipmap) {
            this._generateMipmaps(texture, this._uploadEncoder);
        }
        texture.isReady = true;
        texture.onLoadedObservable.notifyObservers(texture);
        texture.onLoadedObservable.clear();
        if (onLoad) {
            onLoad();
        }
    }, !!useSRGBBuffer, buffer);
};
WebGPUEngine.prototype._setCubeMapTextureParams = function (texture, loadMipmap, maxLevel) {
    texture.samplingMode = loadMipmap ? 3 : 2;
    texture._cachedWrapU = 0;
    texture._cachedWrapV = 0;
    if (maxLevel) {
        texture._maxLodLevel = maxLevel;
    }
};
WebGPUEngine.prototype.generateMipMapsForCubemap = function (texture) {
    if (texture.generateMipMaps) {
        const gpuTexture = texture._hardwareTexture?.underlyingResource;
        if (!gpuTexture) {
            this._textureHelper.createGPUTextureForInternalTexture(texture);
        }
        this._generateMipmaps(texture);
    }
};
//# sourceMappingURL=engine.cubeTexture.js.map