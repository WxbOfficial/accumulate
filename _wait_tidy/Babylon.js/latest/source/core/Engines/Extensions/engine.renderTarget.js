import { InternalTexture, InternalTextureSource } from "../../Materials/Textures/internalTexture.js";
import { Logger } from "../../Misc/logger.js";
import { ThinEngine } from "../thinEngine.js";
import { WebGLRenderTargetWrapper } from "../WebGL/webGLRenderTargetWrapper.js";

import "../AbstractEngine/abstractEngine.texture.js";
ThinEngine.prototype._createHardwareRenderTargetWrapper = function (isMulti, isCube, size) {
    const rtWrapper = new WebGLRenderTargetWrapper(isMulti, isCube, size, this, this._gl);
    this._renderTargetWrapperCache.push(rtWrapper);
    return rtWrapper;
};
ThinEngine.prototype.createRenderTargetTexture = function (size, options) {
    const rtWrapper = this._createHardwareRenderTargetWrapper(false, false, size);
    let generateDepthBuffer = true;
    let generateStencilBuffer = false;
    let noColorAttachment = false;
    let colorAttachment = undefined;
    let samples = 1;
    let label = undefined;
    if (options !== undefined && typeof options === "object") {
        generateDepthBuffer = options.generateDepthBuffer ?? true;
        generateStencilBuffer = !!options.generateStencilBuffer;
        noColorAttachment = !!options.noColorAttachment;
        colorAttachment = options.colorAttachment;
        samples = options.samples ?? 1;
        label = options.label;
    }
    const texture = colorAttachment || (noColorAttachment ? null : this._createInternalTexture(size, options, true, InternalTextureSource.RenderTarget));
    const width = size.width || size;
    const height = size.height || size;
    const currentFrameBuffer = this._currentFramebuffer;
    const gl = this._gl;
    // Create the framebuffer
    const framebuffer = gl.createFramebuffer();
    this._bindUnboundFramebuffer(framebuffer);
    rtWrapper._depthStencilBuffer = this._setupFramebufferDepthAttachments(generateStencilBuffer, generateDepthBuffer, width, height);
    // No need to rebind on every frame
    if (texture && !texture.is2DArray && !texture.is3D) {
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture._hardwareTexture.underlyingResource, 0);
    }
    this._bindUnboundFramebuffer(currentFrameBuffer);
    rtWrapper.label = label ?? "RenderTargetWrapper";
    rtWrapper._framebuffer = framebuffer;
    rtWrapper._generateDepthBuffer = generateDepthBuffer;
    rtWrapper._generateStencilBuffer = generateStencilBuffer;
    rtWrapper.setTextures(texture);
    this.updateRenderTargetTextureSampleCount(rtWrapper, samples);
    return rtWrapper;
};
ThinEngine.prototype._createDepthStencilTexture = function (size, options) {
    const gl = this._gl;
    const layers = size.layers || 0;
    const depth = size.depth || 0;
    let target = gl.TEXTURE_2D;
    if (layers !== 0) {
        target = gl.TEXTURE_2D_ARRAY;
    }
    else if (depth !== 0) {
        target = gl.TEXTURE_3D;
    }
    const internalTexture = new InternalTexture(this, InternalTextureSource.DepthStencil);
    internalTexture.label = options.label;
    if (!this._caps.depthTextureExtension) {
        Logger.Error("Depth texture is not supported by your browser or hardware.");
        return internalTexture;
    }
    const internalOptions = {
        bilinearFiltering: false,
        comparisonFunction: 0,
        generateStencil: false,
        ...options,
    };
    this._bindTextureDirectly(target, internalTexture, true);
    this._setupDepthStencilTexture(internalTexture, size, internalOptions.generateStencil, internalOptions.comparisonFunction === 0 ? false : internalOptions.bilinearFiltering, internalOptions.comparisonFunction, internalOptions.samples);
    if (internalOptions.depthTextureFormat !== undefined) {
        if (internalOptions.depthTextureFormat !== 15 &&
            internalOptions.depthTextureFormat !== 16 &&
            internalOptions.depthTextureFormat !== 17 &&
            internalOptions.depthTextureFormat !== 13 &&
            internalOptions.depthTextureFormat !== 14 &&
            internalOptions.depthTextureFormat !== 18) {
            Logger.Error("Depth texture format is not supported.");
            return internalTexture;
        }
        internalTexture.format = internalOptions.depthTextureFormat;
    }
    else {
        internalTexture.format = internalOptions.generateStencil ? 13 : 16;
    }
    const hasStencil = internalTexture.format === 17 ||
        internalTexture.format === 13 ||
        internalTexture.format === 18;
    let type = gl.UNSIGNED_INT;
    if (internalTexture.format === 15) {
        type = gl.UNSIGNED_SHORT;
    }
    else if (internalTexture.format === 17 || internalTexture.format === 13) {
        type = gl.UNSIGNED_INT_24_8;
    }
    else if (internalTexture.format === 14) {
        type = gl.FLOAT;
    }
    else if (internalTexture.format === 18) {
        type = gl.FLOAT_32_UNSIGNED_INT_24_8_REV;
    }
    const format = hasStencil ? gl.DEPTH_STENCIL : gl.DEPTH_COMPONENT;
    let internalFormat = format;
    if (this.webGLVersion > 1) {
        if (internalTexture.format === 15) {
            internalFormat = gl.DEPTH_COMPONENT16;
        }
        else if (internalTexture.format === 16) {
            internalFormat = gl.DEPTH_COMPONENT24;
        }
        else if (internalTexture.format === 17 || internalTexture.format === 13) {
            internalFormat = gl.DEPTH24_STENCIL8;
        }
        else if (internalTexture.format === 14) {
            internalFormat = gl.DEPTH_COMPONENT32F;
        }
        else if (internalTexture.format === 18) {
            internalFormat = gl.DEPTH32F_STENCIL8;
        }
    }
    if (internalTexture.is2DArray) {
        gl.texImage3D(target, 0, internalFormat, internalTexture.width, internalTexture.height, layers, 0, format, type, null);
    }
    else if (internalTexture.is3D) {
        gl.texImage3D(target, 0, internalFormat, internalTexture.width, internalTexture.height, depth, 0, format, type, null);
    }
    else {
        gl.texImage2D(target, 0, internalFormat, internalTexture.width, internalTexture.height, 0, format, type, null);
    }
    this._bindTextureDirectly(target, null);
    this._internalTexturesCache.push(internalTexture);
    return internalTexture;
};
ThinEngine.prototype.updateRenderTargetTextureSampleCount = function (rtWrapper, samples) {
    if (this.webGLVersion < 2 || !rtWrapper || !rtWrapper.texture) {
        return 1;
    }
    if (rtWrapper.samples === samples) {
        return samples;
    }
    const gl = this._gl;
    samples = Math.min(samples, this.getCaps().maxMSAASamples);
    // Dispose previous render buffers
    if (rtWrapper._depthStencilBuffer) {
        gl.deleteRenderbuffer(rtWrapper._depthStencilBuffer);
        rtWrapper._depthStencilBuffer = null;
    }
    if (rtWrapper._MSAAFramebuffer) {
        gl.deleteFramebuffer(rtWrapper._MSAAFramebuffer);
        rtWrapper._MSAAFramebuffer = null;
    }
    const hardwareTexture = rtWrapper.texture._hardwareTexture;
    hardwareTexture.releaseMSAARenderBuffers();
    if (samples > 1 && typeof gl.renderbufferStorageMultisample === "function") {
        const framebuffer = gl.createFramebuffer();
        if (!framebuffer) {
            throw new Error("Unable to create multi sampled framebuffer");
        }
        rtWrapper._MSAAFramebuffer = framebuffer;
        this._bindUnboundFramebuffer(rtWrapper._MSAAFramebuffer);
        const colorRenderbuffer = this._createRenderBuffer(rtWrapper.texture.width, rtWrapper.texture.height, samples, -1 /* not used */, this._getRGBABufferInternalSizedFormat(rtWrapper.texture.type, rtWrapper.texture.format, rtWrapper.texture._useSRGBBuffer), gl.COLOR_ATTACHMENT0, false);
        if (!colorRenderbuffer) {
            throw new Error("Unable to create multi sampled framebuffer");
        }
        hardwareTexture.addMSAARenderBuffer(colorRenderbuffer);
    }
    else {
        this._bindUnboundFramebuffer(rtWrapper._framebuffer);
    }
    rtWrapper.texture.samples = samples;
    rtWrapper._samples = samples;
    rtWrapper._depthStencilBuffer = this._setupFramebufferDepthAttachments(rtWrapper._generateStencilBuffer, rtWrapper._generateDepthBuffer, rtWrapper.texture.width, rtWrapper.texture.height, samples);
    this._bindUnboundFramebuffer(null);
    return samples;
};
ThinEngine.prototype._setupDepthStencilTexture = function (internalTexture, size, generateStencil, bilinearFiltering, comparisonFunction, samples = 1) {
    const width = size.width || size;
    const height = size.height || size;
    const layers = size.layers || 0;
    const depth = size.depth || 0;
    internalTexture.baseWidth = width;
    internalTexture.baseHeight = height;
    internalTexture.width = width;
    internalTexture.height = height;
    internalTexture.is2DArray = layers > 0;
    internalTexture.depth = layers || depth;
    internalTexture.isReady = true;
    internalTexture.samples = samples;
    internalTexture.generateMipMaps = false;
    internalTexture.samplingMode = bilinearFiltering ? 2 : 1;
    internalTexture.type = 0;
    internalTexture._comparisonFunction = comparisonFunction;
    const gl = this._gl;
    const target = this._getTextureTarget(internalTexture);
    const samplingParameters = this._getSamplingParameters(internalTexture.samplingMode, false);
    gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, samplingParameters.mag);
    gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, samplingParameters.min);
    gl.texParameteri(target, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(target, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    // TEXTURE_COMPARE_FUNC/MODE are only availble in WebGL2.
    if (this.webGLVersion > 1) {
        if (comparisonFunction === 0) {
            gl.texParameteri(target, gl.TEXTURE_COMPARE_FUNC, 515);
            gl.texParameteri(target, gl.TEXTURE_COMPARE_MODE, gl.NONE);
        }
        else {
            gl.texParameteri(target, gl.TEXTURE_COMPARE_FUNC, comparisonFunction);
            gl.texParameteri(target, gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE);
        }
    }
};
//# sourceMappingURL=engine.renderTarget.js.map