import { ThinEngine } from "../../Engines/thinEngine.js";
import { InternalTexture, InternalTextureSource } from "../../Materials/Textures/internalTexture.js";
import { Logger } from "../../Misc/logger.js";

import { GetExponentOfTwo } from "../../Misc/tools.functions.js";
ThinEngine.prototype._createDepthStencilCubeTexture = function (size, options) {
    const internalTexture = new InternalTexture(this, InternalTextureSource.DepthStencil);
    internalTexture.isCube = true;
    if (this.webGLVersion === 1) {
        Logger.Error("Depth cube texture is not supported by WebGL 1.");
        return internalTexture;
    }
    const internalOptions = {
        bilinearFiltering: false,
        comparisonFunction: 0,
        generateStencil: false,
        ...options,
    };
    const gl = this._gl;
    this._bindTextureDirectly(gl.TEXTURE_CUBE_MAP, internalTexture, true);
    this._setupDepthStencilTexture(internalTexture, size, internalOptions.generateStencil, internalOptions.bilinearFiltering, internalOptions.comparisonFunction);
    // Create the depth/stencil buffer
    for (let face = 0; face < 6; face++) {
        if (internalOptions.generateStencil) {
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + face, 0, gl.DEPTH24_STENCIL8, size, size, 0, gl.DEPTH_STENCIL, gl.UNSIGNED_INT_24_8, null);
        }
        else {
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + face, 0, gl.DEPTH_COMPONENT24, size, size, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT, null);
        }
    }
    this._bindTextureDirectly(gl.TEXTURE_CUBE_MAP, null);
    this._internalTexturesCache.push(internalTexture);
    return internalTexture;
};
ThinEngine.prototype._setCubeMapTextureParams = function (texture, loadMipmap, maxLevel) {
    const gl = this._gl;
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, loadMipmap ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    texture.samplingMode = loadMipmap ? 3 : 2;
    if (loadMipmap && this.getCaps().textureMaxLevel && maxLevel !== undefined && maxLevel > 0) {
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAX_LEVEL, maxLevel);
        texture._maxLodLevel = maxLevel;
    }
    this._bindTextureDirectly(gl.TEXTURE_CUBE_MAP, null);
};
ThinEngine.prototype.createCubeTexture = function (rootUrl, scene, files, noMipmap, onLoad = null, onError = null, format, forcedExtension = null, createPolynomials = false, lodScale = 0, lodOffset = 0, fallback = null, loaderOptions, useSRGBBuffer = false, buffer = null) {
    const gl = this._gl;
    return this.createCubeTextureBase(rootUrl, scene, files, !!noMipmap, onLoad, onError, format, forcedExtension, createPolynomials, lodScale, lodOffset, fallback, (texture) => this._bindTextureDirectly(gl.TEXTURE_CUBE_MAP, texture, true), (texture, imgs) => {
        const width = this.needPOTTextures ? GetExponentOfTwo(imgs[0].width, this._caps.maxCubemapTextureSize) : imgs[0].width;
        const height = width;
        const faces = [
            gl.TEXTURE_CUBE_MAP_POSITIVE_X,
            gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
            gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
            gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
            gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
            gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
        ];
        this._bindTextureDirectly(gl.TEXTURE_CUBE_MAP, texture, true);
        this._unpackFlipY(false);
        const internalFormat = format ? this._getInternalFormat(format, texture._useSRGBBuffer) : texture._useSRGBBuffer ? this._glSRGBExtensionValues.SRGB8_ALPHA8 : gl.RGBA;
        let texelFormat = format ? this._getInternalFormat(format) : gl.RGBA;
        if (texture._useSRGBBuffer && this.webGLVersion === 1) {
            texelFormat = internalFormat;
        }
        for (let index = 0; index < faces.length; index++) {
            if (imgs[index].width !== width || imgs[index].height !== height) {
                this._prepareWorkingCanvas();
                if (!this._workingCanvas || !this._workingContext) {
                    Logger.Warn("Cannot create canvas to resize texture.");
                    return;
                }
                this._workingCanvas.width = width;
                this._workingCanvas.height = height;
                this._workingContext.drawImage(imgs[index], 0, 0, imgs[index].width, imgs[index].height, 0, 0, width, height);
                gl.texImage2D(faces[index], 0, internalFormat, texelFormat, gl.UNSIGNED_BYTE, this._workingCanvas);
            }
            else {
                gl.texImage2D(faces[index], 0, internalFormat, texelFormat, gl.UNSIGNED_BYTE, imgs[index]);
            }
        }
        if (!noMipmap) {
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        }
        this._setCubeMapTextureParams(texture, !noMipmap);
        texture.width = width;
        texture.height = height;
        texture.isReady = true;
        if (format) {
            texture.format = format;
        }
        texture.onLoadedObservable.notifyObservers(texture);
        texture.onLoadedObservable.clear();
        if (onLoad) {
            onLoad();
        }
    }, !!useSRGBBuffer, buffer);
};
ThinEngine.prototype.generateMipMapsForCubemap = function (texture, unbind = true) {
    if (texture.generateMipMaps) {
        const gl = this._gl;
        this._bindTextureDirectly(gl.TEXTURE_CUBE_MAP, texture, true);
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        if (unbind) {
            this._bindTextureDirectly(gl.TEXTURE_CUBE_MAP, null);
        }
    }
};
//# sourceMappingURL=engine.cubeTexture.js.map