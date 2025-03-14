/* eslint-disable babylonjs/available */
import { Logger } from "../Misc/logger.js";
import { Color4 } from "../Maths/math.js";
import { Engine } from "../Engines/engine.js";
import { InternalTexture, InternalTextureSource } from "../Materials/Textures/internalTexture.js";
import { Effect } from "../Materials/effect.js";

// eslint-disable-next-line @typescript-eslint/naming-convention
import * as WebGPUConstants from "./WebGPU/webgpuConstants.js";
import { VertexBuffer } from "../Buffers/buffer.js";
import { WebGPUPipelineContext } from "./WebGPU/webgpuPipelineContext.js";
import { WebGPUShaderProcessorGLSL } from "./WebGPU/webgpuShaderProcessorsGLSL.js";
import { WebGPUShaderProcessorWGSL } from "./WebGPU/webgpuShaderProcessorsWGSL.js";
import { WebGPUShaderProcessingContext } from "./WebGPU/webgpuShaderProcessingContext.js";
import { Tools } from "../Misc/tools.js";
import { WebGPUTextureHelper } from "./WebGPU/webgpuTextureHelper.js";
import { WebGPUTextureManager } from "./WebGPU/webgpuTextureManager.js";
import { AbstractEngine } from "./abstractEngine.js";
import { WebGPUBufferManager } from "./WebGPU/webgpuBufferManager.js";
import { WebGPUHardwareTexture } from "./WebGPU/webgpuHardwareTexture.js";
import { UniformBuffer } from "../Materials/uniformBuffer.js";
import { WebGPUCacheSampler } from "./WebGPU/webgpuCacheSampler.js";
import { WebGPUCacheRenderPipelineTree } from "./WebGPU/webgpuCacheRenderPipelineTree.js";
import { WebGPUStencilStateComposer } from "./WebGPU/webgpuStencilStateComposer.js";
import { WebGPUDepthCullingState } from "./WebGPU/webgpuDepthCullingState.js";
import { WebGPUMaterialContext } from "./WebGPU/webgpuMaterialContext.js";
import { WebGPUDrawContext } from "./WebGPU/webgpuDrawContext.js";
import { WebGPUCacheBindGroups } from "./WebGPU/webgpuCacheBindGroups.js";
import { WebGPUClearQuad } from "./WebGPU/webgpuClearQuad.js";
import { WebGPURenderItemBlendColor, WebGPURenderItemScissor, WebGPURenderItemStencilRef, WebGPURenderItemViewport, WebGPUBundleList } from "./WebGPU/webgpuBundleList.js";
import { WebGPUTimestampQuery } from "./WebGPU/webgpuTimestampQuery.js";
import { WebGPUOcclusionQuery } from "./WebGPU/webgpuOcclusionQuery.js";
import { ShaderCodeInliner } from "./Processors/shaderCodeInliner.js";
import { WebGPUTintWASM } from "./WebGPU/webgpuTintWASM.js";
import { WebGPUShaderProcessor } from "./WebGPU/webgpuShaderProcessor.js";
import { ShaderLanguage } from "../Materials/shaderLanguage.js";
import { WebGPUSnapshotRendering } from "./WebGPU/webgpuSnapshotRendering.js";
import "../Buffers/buffer.align.js";
import "../ShadersWGSL/postprocess.vertex.js";
import { WebGPUPerfCounter } from "./WebGPU/webgpuPerfCounter.js";
import { SphericalPolynomial } from "../Maths/sphericalPolynomial.js";
import { PerformanceMonitor } from "../Misc/performanceMonitor.js";
import { CreateImageBitmapFromSource, ExitFullscreen, ExitPointerlock, GetFontOffset, RequestFullscreen, RequestPointerlock, ResizeImageBitmap, _CommonDispose, _CommonInit, } from "./engine.common.js";
import { IsWrapper } from "../Materials/drawWrapper.functions.js";
import { PerfCounter } from "../Misc/perfCounter.js";
import "./AbstractEngine/abstractEngine.loadingScreen.js";
import "./AbstractEngine/abstractEngine.dom.js";
import "./AbstractEngine/abstractEngine.states.js";
import "./AbstractEngine/abstractEngine.renderPass.js";
import "../Audio/audioEngine.js";
import { resetCachedPipeline } from "../Materials/effect.functions.js";
import { WebGPUExternalTexture } from "./WebGPU/webgpuExternalTexture.js";
const viewDescriptorSwapChainAntialiasing = {
    label: `TextureView_SwapChain_ResolveTarget`,
    dimension: WebGPUConstants.TextureDimension.E2d,
    format: undefined,
    mipLevelCount: 1,
    arrayLayerCount: 1,
};
const viewDescriptorSwapChain = {
    label: `TextureView_SwapChain`,
    dimension: WebGPUConstants.TextureDimension.E2d,
    format: undefined,
    mipLevelCount: 1,
    arrayLayerCount: 1,
};
const tempColor4 = new Color4();
/**
 * The web GPU engine class provides support for WebGPU version of babylon.js.
 * @since 5.0.0
 */
export class WebGPUEngine extends AbstractEngine {
    /**
     * Gets or sets the snapshot rendering mode
     */
    get snapshotRenderingMode() {
        return this._snapshotRendering.mode;
    }
    set snapshotRenderingMode(mode) {
        this._snapshotRendering.mode = mode;
    }
    /**
     * Creates a new snapshot at the next frame using the current snapshotRenderingMode
     */
    snapshotRenderingReset() {
        this._snapshotRendering.reset();
    }
    /**
     * Enables or disables the snapshot rendering mode
     * Note that the WebGL engine does not support snapshot rendering so setting the value won't have any effect for this engine
     */
    get snapshotRendering() {
        return this._snapshotRendering.enabled;
    }
    set snapshotRendering(activate) {
        this._snapshotRendering.enabled = activate;
    }
    /**
     * Sets this to true to disable the cache for the samplers. You should do it only for testing purpose!
     */
    get disableCacheSamplers() {
        return this._cacheSampler ? this._cacheSampler.disabled : false;
    }
    set disableCacheSamplers(disable) {
        if (this._cacheSampler) {
            this._cacheSampler.disabled = disable;
        }
    }
    /**
     * Sets this to true to disable the cache for the render pipelines. You should do it only for testing purpose!
     */
    get disableCacheRenderPipelines() {
        return this._cacheRenderPipeline ? this._cacheRenderPipeline.disabled : false;
    }
    set disableCacheRenderPipelines(disable) {
        if (this._cacheRenderPipeline) {
            this._cacheRenderPipeline.disabled = disable;
        }
    }
    /**
     * Sets this to true to disable the cache for the bind groups. You should do it only for testing purpose!
     */
    get disableCacheBindGroups() {
        return this._cacheBindGroups ? this._cacheBindGroups.disabled : false;
    }
    set disableCacheBindGroups(disable) {
        if (this._cacheBindGroups) {
            this._cacheBindGroups.disabled = disable;
        }
    }
    /**
     * Gets a boolean indicating if all created effects are ready
     * @returns true if all effects are ready
     */
    areAllEffectsReady() {
        return true;
    }
    /**
     * Get Font size information
     * @param font font name
     * @returns an object containing ascent, height and descent
     */
    getFontOffset(font) {
        return GetFontOffset(font);
    }
    /**
     * Gets a Promise<boolean> indicating if the engine can be instantiated (ie. if a WebGPU context can be found)
     */
    static get IsSupportedAsync() {
        return !navigator.gpu
            ? Promise.resolve(false)
            : navigator.gpu
                .requestAdapter()
                .then((adapter) => !!adapter, () => false)
                .catch(() => false);
    }
    /**
     * Not supported by WebGPU, you should call IsSupportedAsync instead!
     */
    static get IsSupported() {
        Logger.Warn("You must call IsSupportedAsync for WebGPU!");
        return false;
    }
    /**
     * Gets a boolean indicating that the engine supports uniform buffers
     */
    get supportsUniformBuffers() {
        return true;
    }
    /** Gets the supported extensions by the WebGPU adapter */
    get supportedExtensions() {
        return this._adapterSupportedExtensions;
    }
    /** Gets the currently enabled extensions on the WebGPU device */
    get enabledExtensions() {
        return this._deviceEnabledExtensions;
    }
    /** Gets the supported limits by the WebGPU adapter */
    get supportedLimits() {
        return this._adapterSupportedLimits;
    }
    /** Gets the current limits of the WebGPU device */
    get currentLimits() {
        return this._deviceLimits;
    }
    /**
     * Returns a string describing the current engine
     */
    get description() {
        const description = this.name + this.version;
        return description;
    }
    /**
     * Returns the version of the engine
     */
    get version() {
        return 1;
    }
    /**
     * Gets an object containing information about the current engine context
     * @returns an object containing the vendor, the renderer and the version of the current engine context
     */
    getInfo() {
        return {
            vendor: this._adapterInfo.vendor || "unknown vendor",
            renderer: this._adapterInfo.architecture || "unknown renderer",
            version: this._adapterInfo.description || "unknown version",
        };
    }
    /**
     * (WebGPU only) True (default) to be in compatibility mode, meaning rendering all existing scenes without artifacts (same rendering than WebGL).
     * Setting the property to false will improve performances but may not work in some scenes if some precautions are not taken.
     * See https://doc.babylonjs.com/setup/support/webGPU/webGPUOptimization/webGPUNonCompatibilityMode for more details
     */
    get compatibilityMode() {
        return this._compatibilityMode;
    }
    set compatibilityMode(mode) {
        this._compatibilityMode = mode;
    }
    /**
     * Enables or disables GPU timing measurements.
     * Note that this is only supported if the "timestamp-query" extension is enabled in the options.
     */
    get enableGPUTimingMeasurements() {
        return this._timestampQuery.enable;
    }
    set enableGPUTimingMeasurements(enable) {
        if (this._timestampQuery.enable === enable) {
            return;
        }
        this.gpuTimeInFrameForMainPass = enable ? new WebGPUPerfCounter() : undefined;
        this._timestampQuery.enable = enable;
    }
    /** @internal */
    get currentSampleCount() {
        return this._currentRenderTarget ? this._currentRenderTarget.samples : this._mainPassSampleCount;
    }
    /**
     * Create a new instance of the gpu engine asynchronously
     * @param canvas Defines the canvas to use to display the result
     * @param options Defines the options passed to the engine to create the GPU context dependencies
     * @returns a promise that resolves with the created engine
     */
    static CreateAsync(canvas, options = {}) {
        const engine = new WebGPUEngine(canvas, options);
        return new Promise((resolve) => {
            engine.initAsync(options.glslangOptions, options.twgslOptions).then(() => resolve(engine));
        });
    }
    /**
     * Create a new instance of the gpu engine.
     * @param canvas Defines the canvas to use to display the result
     * @param options Defines the options passed to the engine to create the GPU context dependencies
     */
    constructor(canvas, options = {}) {
        super(options.antialias ?? true, options);
        /** A unique id to identify this instance */
        this.uniqueId = -1;
        // Page Life cycle and constants
        this._uploadEncoderDescriptor = { label: "upload" };
        this._renderEncoderDescriptor = { label: "render" };
        /** @internal */
        this._clearDepthValue = 1;
        /** @internal */
        this._clearReverseDepthValue = 0;
        /** @internal */
        this._clearStencilValue = 0;
        this._defaultSampleCount = 4; // Only supported value for now.
        this._glslang = null;
        this._tintWASM = null;
        this._adapterInfo = {
            vendor: "",
            architecture: "",
            device: "",
            description: "",
        };
        /** @internal */
        this._timestampIndex = 0;
        /** @internal */
        this._compiledComputeEffects = {};
        /** @internal */
        this._counters = {
            numEnableEffects: 0,
            numEnableDrawWrapper: 0,
            numBundleCreationNonCompatMode: 0,
            numBundleReuseNonCompatMode: 0,
        };
        /**
         * Counters from last frame
         */
        this.countersLastFrame = {
            numEnableEffects: 0,
            numEnableDrawWrapper: 0,
            numBundleCreationNonCompatMode: 0,
            numBundleReuseNonCompatMode: 0,
        };
        /**
         * Max number of uncaptured error messages to log
         */
        this.numMaxUncapturedErrors = 20;
        /**
         * Gets the list of created scenes
         */
        this.scenes = [];
        /** @internal */
        this._virtualScenes = new Array();
        this._commandBuffers = [null, null];
        // Frame Buffer Life Cycle (recreated for each render target pass)
        /** @internal */
        this._currentRenderPass = null;
        this._mainRenderPassWrapper = {
            renderPassDescriptor: null,
            colorAttachmentViewDescriptor: null,
            depthAttachmentViewDescriptor: null,
            colorAttachmentGPUTextures: [],
            depthTextureFormat: undefined,
        };
        this._rttRenderPassWrapper = {
            renderPassDescriptor: null,
            colorAttachmentViewDescriptor: null,
            depthAttachmentViewDescriptor: null,
            colorAttachmentGPUTextures: [],
            depthTextureFormat: undefined,
        };
        /** @internal */
        this._pendingDebugCommands = [];
        this._currentOverrideVertexBuffers = null;
        this._currentIndexBuffer = null;
        this._colorWriteLocal = true;
        this._forceEnableEffect = false;
        // TODO WEBGPU remove those variables when code stabilized
        /** @internal */
        this.dbgShowShaderCode = false;
        /** @internal */
        this.dbgSanityChecks = true;
        /** @internal */
        this.dbgVerboseLogsForFirstFrames = false;
        /** @internal */
        this.dbgVerboseLogsNumFrames = 10;
        /** @internal */
        this.dbgLogIfNotDrawWrapper = true;
        /** @internal */
        this.dbgShowEmptyEnableEffectCalls = true;
        this._snapshotRenderingMode = 0;
        /**
         * Indicates if the z range in NDC space is 0..1 (value: true) or -1..1 (value: false)
         */
        this.isNDCHalfZRange = true;
        /**
         * Indicates that the origin of the texture/framebuffer space is the bottom left corner. If false, the origin is top left
         */
        this.hasOriginBottomLeft = false;
        //------------------------------------------------------------------------------
        //                              Dynamic WebGPU States
        //------------------------------------------------------------------------------
        // index 0 is for main render pass, 1 for RTT render pass
        this._viewportsCurrent = { x: 0, y: 0, w: 0, h: 0 };
        this._scissorsCurrent = { x: 0, y: 0, w: 0, h: 0 };
        this._scissorCached = { x: 0, y: 0, z: 0, w: 0 };
        this._stencilRefsCurrent = -1;
        this._blendColorsCurrent = [null, null, null, null];
        this._performanceMonitor = new PerformanceMonitor();
        this._name = "WebGPU";
        this._drawCalls = new PerfCounter();
        options.deviceDescriptor = options.deviceDescriptor || {};
        options.enableGPUDebugMarkers = options.enableGPUDebugMarkers ?? false;
        Logger.Log(`Babylon.js v${Engine.Version} - ${this.description} engine`);
        if (!navigator.gpu) {
            Logger.Error("WebGPU is not supported by your browser.");
            return;
        }
        options.swapChainFormat = options.swapChainFormat || navigator.gpu.getPreferredCanvasFormat();
        this._isWebGPU = true;
        this._shaderPlatformName = "WEBGPU";
        this._renderingCanvas = canvas;
        this._options = options;
        this._mainPassSampleCount = options.antialias ? this._defaultSampleCount : 1;
        if (navigator && navigator.userAgent) {
            this._setupMobileChecks();
        }
        this._sharedInit(this._renderingCanvas);
        this._shaderProcessor = new WebGPUShaderProcessorGLSL();
        this._shaderProcessorWGSL = new WebGPUShaderProcessorWGSL();
    }
    //------------------------------------------------------------------------------
    //                              Initialization
    //------------------------------------------------------------------------------
    /**
     * Initializes the WebGPU context and dependencies.
     * @param glslangOptions Defines the GLSLang compiler options if necessary
     * @param twgslOptions Defines the Twgsl compiler options if necessary
     * @returns a promise notifying the readiness of the engine.
     */
    initAsync(glslangOptions, twgslOptions) {
        this.uniqueId = WebGPUEngine._InstanceId++;
        this._glslangOptions = glslangOptions;
        this._twgslOptions = twgslOptions;
        return this._initGlslang(glslangOptions ?? this._options?.glslangOptions)
            .then((glslang) => {
            this._glslang = glslang;
            this._tintWASM = WebGPUEngine.UseTWGSL ? new WebGPUTintWASM() : null;
            return this._tintWASM
                ? this._tintWASM.initTwgsl(twgslOptions ?? this._options?.twgslOptions).then(() => {
                    return navigator.gpu.requestAdapter(this._options);
                })
                : navigator.gpu.requestAdapter(this._options);
        })
            .then((adapter) => {
            if (!adapter) {
                // eslint-disable-next-line no-throw-literal
                throw "Could not retrieve a WebGPU adapter (adapter is null).";
            }
            else {
                this._adapter = adapter;
                this._adapterSupportedExtensions = [];
                this._adapter.features?.forEach((feature) => this._adapterSupportedExtensions.push(feature));
                this._adapterSupportedLimits = this._adapter.limits;
                this._adapter.requestAdapterInfo().then((adapterInfo) => {
                    this._adapterInfo = adapterInfo;
                });
                const deviceDescriptor = this._options.deviceDescriptor ?? {};
                const requiredFeatures = deviceDescriptor?.requiredFeatures ?? (this._options.enableAllFeatures ? this._adapterSupportedExtensions : undefined);
                if (requiredFeatures) {
                    const requestedExtensions = requiredFeatures;
                    const validExtensions = [];
                    for (const extension of requestedExtensions) {
                        if (this._adapterSupportedExtensions.indexOf(extension) !== -1) {
                            validExtensions.push(extension);
                        }
                    }
                    deviceDescriptor.requiredFeatures = validExtensions;
                }
                if (this._options.setMaximumLimits && !deviceDescriptor.requiredLimits) {
                    deviceDescriptor.requiredLimits = {};
                    for (const name in this._adapterSupportedLimits) {
                        if (name === "minSubgroupSize" || name === "maxSubgroupSize") {
                            // Chrome exposes these limits in "webgpu developer" mode, but these can't be set on the device.
                            continue;
                        }
                        deviceDescriptor.requiredLimits[name] = this._adapterSupportedLimits[name];
                    }
                }
                deviceDescriptor.label = `BabylonWebGPUDevice${this.uniqueId}`;
                return this._adapter.requestDevice(deviceDescriptor);
            }
        })
            .then((device) => {
            this._device = device;
            this._deviceEnabledExtensions = [];
            this._device.features?.forEach((feature) => this._deviceEnabledExtensions.push(feature));
            this._deviceLimits = device.limits;
            let numUncapturedErrors = -1;
            this._device.addEventListener("uncapturederror", (event) => {
                if (++numUncapturedErrors < this.numMaxUncapturedErrors) {
                    Logger.Warn(`WebGPU uncaptured error (${numUncapturedErrors + 1}): ${event.error} - ${event.error.message}`);
                }
                else if (numUncapturedErrors++ === this.numMaxUncapturedErrors) {
                    Logger.Warn(`WebGPU uncaptured error: too many warnings (${this.numMaxUncapturedErrors}), no more warnings will be reported to the console for this engine.`);
                }
            });
            if (!this._doNotHandleContextLost) {
                this._device.lost?.then((info) => {
                    if (this._isDisposed) {
                        return;
                    }
                    this._contextWasLost = true;
                    Logger.Warn("WebGPU context lost. " + info);
                    this.onContextLostObservable.notifyObservers(this);
                    this._restoreEngineAfterContextLost(async () => {
                        const snapshotRenderingMode = this.snapshotRenderingMode;
                        const snapshotRendering = this.snapshotRendering;
                        const disableCacheSamplers = this.disableCacheSamplers;
                        const disableCacheRenderPipelines = this.disableCacheRenderPipelines;
                        const disableCacheBindGroups = this.disableCacheBindGroups;
                        const enableGPUTimingMeasurements = this.enableGPUTimingMeasurements;
                        await this.initAsync(this._glslangOptions ?? this._options?.glslangOptions, this._twgslOptions ?? this._options?.twgslOptions);
                        this.snapshotRenderingMode = snapshotRenderingMode;
                        this.snapshotRendering = snapshotRendering;
                        this.disableCacheSamplers = disableCacheSamplers;
                        this.disableCacheRenderPipelines = disableCacheRenderPipelines;
                        this.disableCacheBindGroups = disableCacheBindGroups;
                        this.enableGPUTimingMeasurements = enableGPUTimingMeasurements;
                        this._currentRenderPass = null;
                    });
                });
            }
        })
            .then(() => {
            this._bufferManager = new WebGPUBufferManager(this, this._device);
            this._textureHelper = new WebGPUTextureManager(this, this._device, this._glslang, this._tintWASM, this._bufferManager, this._deviceEnabledExtensions);
            this._cacheSampler = new WebGPUCacheSampler(this._device);
            this._cacheBindGroups = new WebGPUCacheBindGroups(this._device, this._cacheSampler, this);
            this._timestampQuery = new WebGPUTimestampQuery(this, this._device, this._bufferManager);
            this._occlusionQuery = this._device.createQuerySet ? new WebGPUOcclusionQuery(this, this._device, this._bufferManager) : undefined;
            this._bundleList = new WebGPUBundleList(this._device);
            this._snapshotRendering = new WebGPUSnapshotRendering(this, this._snapshotRenderingMode, this._bundleList);
            this._ubInvertY = this._bufferManager.createBuffer(new Float32Array([-1, 0]), WebGPUConstants.BufferUsage.Uniform | WebGPUConstants.BufferUsage.CopyDst, "UBInvertY");
            this._ubDontInvertY = this._bufferManager.createBuffer(new Float32Array([1, 0]), WebGPUConstants.BufferUsage.Uniform | WebGPUConstants.BufferUsage.CopyDst, "UBDontInvertY");
            if (this.dbgVerboseLogsForFirstFrames) {
                if (this._count === undefined) {
                    this._count = 0;
                    Logger.Log(["%c frame #" + this._count + " - begin", "background: #ffff00"]);
                }
            }
            this._uploadEncoder = this._device.createCommandEncoder(this._uploadEncoderDescriptor);
            this._renderEncoder = this._device.createCommandEncoder(this._renderEncoderDescriptor);
            this._initializeLimits();
            this._emptyVertexBuffer = new VertexBuffer(this, [0], "", {
                stride: 1,
                offset: 0,
                size: 1,
                label: "EmptyVertexBuffer",
            });
            this._cacheRenderPipeline = new WebGPUCacheRenderPipelineTree(this._device, this._emptyVertexBuffer);
            this._depthCullingState = new WebGPUDepthCullingState(this._cacheRenderPipeline);
            this._stencilStateComposer = new WebGPUStencilStateComposer(this._cacheRenderPipeline);
            this._stencilStateComposer.stencilGlobal = this._stencilState;
            this._depthCullingState.depthTest = true;
            this._depthCullingState.depthFunc = 515;
            this._depthCullingState.depthMask = true;
            this._textureHelper.setCommandEncoder(this._uploadEncoder);
            this._clearQuad = new WebGPUClearQuad(this._device, this, this._emptyVertexBuffer);
            this._defaultDrawContext = this.createDrawContext();
            this._currentDrawContext = this._defaultDrawContext;
            this._defaultMaterialContext = this.createMaterialContext();
            this._currentMaterialContext = this._defaultMaterialContext;
            this._initializeContextAndSwapChain();
            this._initializeMainAttachments();
            this.resize();
        })
            .catch((e) => {
            Logger.Error("A fatal error occurred during WebGPU creation/initialization.");
            throw e;
        });
    }
    _initGlslang(glslangOptions) {
        glslangOptions = glslangOptions || {};
        glslangOptions = {
            ...WebGPUEngine._GLSLslangDefaultOptions,
            ...glslangOptions,
        };
        if (glslangOptions.glslang) {
            return Promise.resolve(glslangOptions.glslang);
        }
        if (self.glslang) {
            return self.glslang(glslangOptions.wasmPath);
        }
        if (glslangOptions.jsPath && glslangOptions.wasmPath) {
            return Tools.LoadBabylonScriptAsync(glslangOptions.jsPath).then(() => {
                return self.glslang(Tools.GetBabylonScriptURL(glslangOptions.wasmPath));
            });
        }
        return Promise.reject("gslang is not available.");
    }
    _initializeLimits() {
        // Init caps
        // TODO WEBGPU Real Capability check once limits will be working.
        this._caps = {
            maxTexturesImageUnits: this._deviceLimits.maxSampledTexturesPerShaderStage,
            maxVertexTextureImageUnits: this._deviceLimits.maxSampledTexturesPerShaderStage,
            maxCombinedTexturesImageUnits: this._deviceLimits.maxSampledTexturesPerShaderStage * 2,
            maxTextureSize: this._deviceLimits.maxTextureDimension2D,
            maxCubemapTextureSize: this._deviceLimits.maxTextureDimension2D,
            maxRenderTextureSize: this._deviceLimits.maxTextureDimension2D,
            maxVertexAttribs: this._deviceLimits.maxVertexAttributes,
            maxVaryingVectors: this._deviceLimits.maxInterStageShaderVariables,
            maxFragmentUniformVectors: Math.floor(this._deviceLimits.maxUniformBufferBindingSize / 4),
            maxVertexUniformVectors: Math.floor(this._deviceLimits.maxUniformBufferBindingSize / 4),
            standardDerivatives: true,
            astc: (this._deviceEnabledExtensions.indexOf(WebGPUConstants.FeatureName.TextureCompressionASTC) >= 0 ? true : undefined),
            s3tc: (this._deviceEnabledExtensions.indexOf(WebGPUConstants.FeatureName.TextureCompressionBC) >= 0 ? true : undefined),
            pvrtc: null,
            etc1: null,
            etc2: (this._deviceEnabledExtensions.indexOf(WebGPUConstants.FeatureName.TextureCompressionETC2) >= 0 ? true : undefined),
            bptc: this._deviceEnabledExtensions.indexOf(WebGPUConstants.FeatureName.TextureCompressionBC) >= 0 ? true : undefined,
            maxAnisotropy: 16,
            uintIndices: true,
            fragmentDepthSupported: true,
            highPrecisionShaderSupported: true,
            colorBufferFloat: true,
            supportFloatTexturesResolve: false,
            rg11b10ufColorRenderable: this._deviceEnabledExtensions.indexOf(WebGPUConstants.FeatureName.RG11B10UFloatRenderable) >= 0,
            textureFloat: true,
            textureFloatLinearFiltering: this._deviceEnabledExtensions.indexOf(WebGPUConstants.FeatureName.Float32Filterable) >= 0,
            textureFloatRender: true,
            textureHalfFloat: true,
            textureHalfFloatLinearFiltering: true,
            textureHalfFloatRender: true,
            textureLOD: true,
            texelFetch: true,
            drawBuffersExtension: true,
            depthTextureExtension: true,
            vertexArrayObject: false,
            instancedArrays: true,
            timerQuery: typeof BigUint64Array !== "undefined" && this._deviceEnabledExtensions.indexOf(WebGPUConstants.FeatureName.TimestampQuery) !== -1 ? true : undefined,
            supportOcclusionQuery: typeof BigUint64Array !== "undefined",
            canUseTimestampForTimerQuery: true,
            multiview: false,
            oculusMultiview: false,
            parallelShaderCompile: undefined,
            blendMinMax: true,
            maxMSAASamples: 4,
            canUseGLInstanceID: true,
            canUseGLVertexID: true,
            supportComputeShaders: true,
            supportSRGBBuffers: true,
            supportTransformFeedbacks: false,
            textureMaxLevel: true,
            texture2DArrayMaxLayerCount: this._deviceLimits.maxTextureArrayLayers,
            disableMorphTargetTexture: false,
        };
        this._features = {
            forceBitmapOverHTMLImageElement: true,
            supportRenderAndCopyToLodForFloatTextures: true,
            supportDepthStencilTexture: true,
            supportShadowSamplers: true,
            uniformBufferHardCheckMatrix: false,
            allowTexturePrefiltering: true,
            trackUbosInFrame: true,
            checkUbosContentBeforeUpload: true,
            supportCSM: true,
            basisNeedsPOT: false,
            support3DTextures: true,
            needTypeSuffixInShaderConstants: true,
            supportMSAA: true,
            supportSSAO2: true,
            supportExtendedTextureFormats: true,
            supportSwitchCaseInShader: true,
            supportSyncTextureRead: false,
            needsInvertingBitmap: false,
            useUBOBindingCache: false,
            needShaderCodeInlining: true,
            needToAlwaysBindUniformBuffers: true,
            supportRenderPasses: true,
            supportSpriteInstancing: true,
            forceVertexBufferStrideAndOffsetMultiple4Bytes: true,
            _checkNonFloatVertexBuffersDontRecreatePipelineContext: true,
            _collectUbosUpdatedInFrame: false,
        };
    }
    _initializeContextAndSwapChain() {
        if (!this._renderingCanvas) {
            // eslint-disable-next-line no-throw-literal
            throw "The rendering canvas has not been set!";
        }
        this._context = this._renderingCanvas.getContext("webgpu");
        this._configureContext();
        this._colorFormat = this._options.swapChainFormat;
        this._mainRenderPassWrapper.colorAttachmentGPUTextures = [new WebGPUHardwareTexture()];
        this._mainRenderPassWrapper.colorAttachmentGPUTextures[0].format = this._colorFormat;
        this._setColorFormat(this._mainRenderPassWrapper);
    }
    // Set default values as WebGL with depth and stencil attachment for the broadest Compat.
    _initializeMainAttachments() {
        if (!this._bufferManager) {
            return;
        }
        this.flushFramebuffer();
        this._mainTextureExtends = {
            width: this.getRenderWidth(true),
            height: this.getRenderHeight(true),
            depthOrArrayLayers: 1,
        };
        const bufferDataUpdate = new Float32Array([this.getRenderHeight(true)]);
        this._bufferManager.setSubData(this._ubInvertY, 4, bufferDataUpdate);
        this._bufferManager.setSubData(this._ubDontInvertY, 4, bufferDataUpdate);
        let mainColorAttachments;
        if (this._options.antialias) {
            const mainTextureDescriptor = {
                label: `Texture_MainColor_${this._mainTextureExtends.width}x${this._mainTextureExtends.height}_antialiasing`,
                size: this._mainTextureExtends,
                mipLevelCount: 1,
                sampleCount: this._mainPassSampleCount,
                dimension: WebGPUConstants.TextureDimension.E2d,
                format: this._options.swapChainFormat,
                usage: WebGPUConstants.TextureUsage.RenderAttachment,
            };
            if (this._mainTexture) {
                this._textureHelper.releaseTexture(this._mainTexture);
            }
            this._mainTexture = this._device.createTexture(mainTextureDescriptor);
            mainColorAttachments = [
                {
                    view: this._mainTexture.createView({
                        label: "TextureView_MainColor_antialiasing",
                        dimension: WebGPUConstants.TextureDimension.E2d,
                        format: this._options.swapChainFormat,
                        mipLevelCount: 1,
                        arrayLayerCount: 1,
                    }),
                    clearValue: new Color4(0, 0, 0, 1),
                    loadOp: WebGPUConstants.LoadOp.Clear,
                    storeOp: WebGPUConstants.StoreOp.Store, // don't use StoreOp.Discard, else using several cameras with different viewports or using scissors will fail because we call beginRenderPass / endPass several times for the same color attachment!
                },
            ];
        }
        else {
            mainColorAttachments = [
                {
                    view: undefined,
                    clearValue: new Color4(0, 0, 0, 1),
                    loadOp: WebGPUConstants.LoadOp.Clear,
                    storeOp: WebGPUConstants.StoreOp.Store,
                },
            ];
        }
        this._mainRenderPassWrapper.depthTextureFormat = this.isStencilEnable ? WebGPUConstants.TextureFormat.Depth24PlusStencil8 : WebGPUConstants.TextureFormat.Depth32Float;
        this._setDepthTextureFormat(this._mainRenderPassWrapper);
        this._setColorFormat(this._mainRenderPassWrapper);
        const depthTextureDescriptor = {
            label: `Texture_MainDepthStencil_${this._mainTextureExtends.width}x${this._mainTextureExtends.height}`,
            size: this._mainTextureExtends,
            mipLevelCount: 1,
            sampleCount: this._mainPassSampleCount,
            dimension: WebGPUConstants.TextureDimension.E2d,
            format: this._mainRenderPassWrapper.depthTextureFormat,
            usage: WebGPUConstants.TextureUsage.RenderAttachment,
        };
        if (this._depthTexture) {
            this._textureHelper.releaseTexture(this._depthTexture);
        }
        this._depthTexture = this._device.createTexture(depthTextureDescriptor);
        const mainDepthAttachment = {
            view: this._depthTexture.createView({
                label: `TextureView_MainDepthStencil_${this._mainTextureExtends.width}x${this._mainTextureExtends.height}`,
                dimension: WebGPUConstants.TextureDimension.E2d,
                format: this._depthTexture.format,
                mipLevelCount: 1,
                arrayLayerCount: 1,
            }),
            depthClearValue: this._clearDepthValue,
            depthLoadOp: WebGPUConstants.LoadOp.Clear,
            depthStoreOp: WebGPUConstants.StoreOp.Store,
            stencilClearValue: this._clearStencilValue,
            stencilLoadOp: !this.isStencilEnable ? undefined : WebGPUConstants.LoadOp.Clear,
            stencilStoreOp: !this.isStencilEnable ? undefined : WebGPUConstants.StoreOp.Store,
        };
        this._mainRenderPassWrapper.renderPassDescriptor = {
            label: "MainRenderPass",
            colorAttachments: mainColorAttachments,
            depthStencilAttachment: mainDepthAttachment,
        };
    }
    /**
     * Shared initialization across engines types.
     * @param canvas The canvas associated with this instance of the engine.
     */
    _sharedInit(canvas) {
        super._sharedInit(canvas);
        _CommonInit(this, canvas, this._creationOptions);
    }
    _configureContext() {
        this._context.configure({
            device: this._device,
            format: this._options.swapChainFormat,
            usage: WebGPUConstants.TextureUsage.RenderAttachment | WebGPUConstants.TextureUsage.CopySrc,
            alphaMode: this.premultipliedAlpha ? WebGPUConstants.CanvasAlphaMode.Premultiplied : WebGPUConstants.CanvasAlphaMode.Opaque,
        });
    }
    /**
     * Resize an image and returns the image data as an uint8array
     * @param image image to resize
     * @param bufferWidth destination buffer width
     * @param bufferHeight destination buffer height
     * @returns an uint8array containing RGBA values of bufferWidth * bufferHeight size
     */
    resizeImageBitmap(image, bufferWidth, bufferHeight) {
        return ResizeImageBitmap(this, image, bufferWidth, bufferHeight);
    }
    /**
     * Engine abstraction for loading and creating an image bitmap from a given source string.
     * @param imageSource source to load the image from.
     * @param options An object that sets options for the image's extraction.
     * @returns ImageBitmap
     */
    _createImageBitmapFromSource(imageSource, options) {
        return CreateImageBitmapFromSource(this, imageSource, options);
    }
    /**
     * Toggle full screen mode
     * @param requestPointerLock defines if a pointer lock should be requested from the user
     */
    switchFullscreen(requestPointerLock) {
        if (this.isFullscreen) {
            this.exitFullscreen();
        }
        else {
            this.enterFullscreen(requestPointerLock);
        }
    }
    /**
     * Enters full screen mode
     * @param requestPointerLock defines if a pointer lock should be requested from the user
     */
    enterFullscreen(requestPointerLock) {
        if (!this.isFullscreen) {
            this._pointerLockRequested = requestPointerLock;
            if (this._renderingCanvas) {
                RequestFullscreen(this._renderingCanvas);
            }
        }
    }
    /**
     * Exits full screen mode
     */
    exitFullscreen() {
        if (this.isFullscreen) {
            ExitFullscreen();
        }
    }
    /**
     * Enters Pointerlock mode
     */
    enterPointerlock() {
        if (this._renderingCanvas) {
            RequestPointerlock(this._renderingCanvas);
        }
    }
    /**
     * Exits Pointerlock mode
     */
    exitPointerlock() {
        ExitPointerlock();
    }
    _rebuildBuffers() {
        super._rebuildBuffers();
        for (const storageBuffer of this._storageBuffers) {
            // The buffer can already be rebuilt by the call to _rebuildGeometries(), which recreates the storage buffers for the ComputeShaderParticleSystem
            if (storageBuffer.getBuffer().engineId !== this.uniqueId) {
                storageBuffer._rebuild();
            }
        }
    }
    _restoreEngineAfterContextLost(initEngine) {
        WebGPUCacheRenderPipelineTree.ResetCache();
        WebGPUCacheBindGroups.ResetCache();
        // Clear the draw wrappers and material contexts
        const cleanScenes = (scenes) => {
            for (const scene of scenes) {
                for (const mesh of scene.meshes) {
                    const subMeshes = mesh.subMeshes;
                    if (!subMeshes) {
                        continue;
                    }
                    for (const subMesh of subMeshes) {
                        subMesh._drawWrappers = [];
                    }
                }
                for (const material of scene.materials) {
                    material._materialContext?.reset();
                }
            }
        };
        cleanScenes(this.scenes);
        cleanScenes(this._virtualScenes);
        // The leftOver uniform buffers are removed from the list because they will be recreated when we rebuild the effects
        const uboList = [];
        for (const uniformBuffer of this._uniformBuffers) {
            if (uniformBuffer.name.indexOf("leftOver") < 0) {
                uboList.push(uniformBuffer);
            }
        }
        this._uniformBuffers = uboList;
        super._restoreEngineAfterContextLost(initEngine);
    }
    /**
     * Force a specific size of the canvas
     * @param width defines the new canvas' width
     * @param height defines the new canvas' height
     * @param forceSetSize true to force setting the sizes of the underlying canvas
     * @returns true if the size was changed
     */
    setSize(width, height, forceSetSize = false) {
        if (!super.setSize(width, height, forceSetSize)) {
            return false;
        }
        if (this.dbgVerboseLogsForFirstFrames) {
            if (this._count === undefined) {
                this._count = 0;
            }
            if (!this._count || this._count < this.dbgVerboseLogsNumFrames) {
                Logger.Log(["frame #" + this._count + " - setSize -", width, height]);
            }
        }
        this._initializeMainAttachments();
        if (this.snapshotRendering) {
            // reset snapshot rendering so that the next frame will record a new list of bundles
            this.snapshotRenderingReset();
        }
        return true;
    }
    /**
     * @internal
     */
    _getShaderProcessor(shaderLanguage) {
        if (shaderLanguage === ShaderLanguage.WGSL) {
            return this._shaderProcessorWGSL;
        }
        return this._shaderProcessor;
    }
    /**
     * @internal
     */
    _getShaderProcessingContext(shaderLanguage) {
        return new WebGPUShaderProcessingContext(shaderLanguage);
    }
    _currentPassIsMainPass() {
        return this._currentRenderTarget === null;
    }
    _getCurrentRenderPass() {
        if (this._currentRenderTarget && !this._currentRenderPass) {
            // delayed creation of the render target pass, but we now need to create it as we are requested the render pass
            this._startRenderTargetRenderPass(this._currentRenderTarget, false, null, false, false);
        }
        else if (!this._currentRenderPass) {
            this._startMainRenderPass(false);
        }
        return this._currentRenderPass;
    }
    /** @internal */
    _getCurrentRenderPassWrapper() {
        return this._currentRenderTarget ? this._rttRenderPassWrapper : this._mainRenderPassWrapper;
    }
    //------------------------------------------------------------------------------
    //                          Static Pipeline WebGPU States
    //------------------------------------------------------------------------------
    /** @internal */
    applyStates() {
        this._stencilStateComposer.apply();
        this._cacheRenderPipeline.setAlphaBlendEnabled(this._alphaState.alphaBlend);
    }
    /**
     * Force the entire cache to be cleared
     * You should not have to use this function unless your engine needs to share the WebGPU context with another engine
     * @param bruteForce defines a boolean to force clearing ALL caches (including stencil, detoh and alpha states)
     */
    wipeCaches(bruteForce) {
        if (this.preventCacheWipeBetweenFrames && !bruteForce) {
            return;
        }
        //this._currentEffect = null; // can't reset _currentEffect, else some crashes can occur (for eg in ProceduralTexture which calls bindFrameBuffer (which calls wipeCaches) after having called enableEffect and before drawing into the texture)
        // _forceEnableEffect = true assumes the role of _currentEffect = null
        this._forceEnableEffect = true;
        this._currentIndexBuffer = null;
        this._currentOverrideVertexBuffers = null;
        this._cacheRenderPipeline.setBuffers(null, null, null);
        if (bruteForce) {
            this._stencilStateComposer.reset();
            this._depthCullingState.reset();
            this._depthCullingState.depthFunc = 515;
            this._alphaState.reset();
            this._alphaMode = 1;
            this._alphaEquation = 0;
            this._cacheRenderPipeline.setAlphaBlendFactors(this._alphaState._blendFunctionParameters, this._alphaState._blendEquationParameters);
            this._cacheRenderPipeline.setAlphaBlendEnabled(false);
            this.setColorWrite(true);
        }
        this._cachedVertexBuffers = null;
        this._cachedIndexBuffer = null;
        this._cachedEffectForVertexBuffers = null;
    }
    /**
     * Enable or disable color writing
     * @param enable defines the state to set
     */
    setColorWrite(enable) {
        this._colorWriteLocal = enable;
        this._cacheRenderPipeline.setWriteMask(enable ? 0xf : 0);
    }
    /**
     * Gets a boolean indicating if color writing is enabled
     * @returns the current color writing state
     */
    getColorWrite() {
        return this._colorWriteLocal;
    }
    _mustUpdateViewport() {
        const x = this._viewportCached.x, y = this._viewportCached.y, w = this._viewportCached.z, h = this._viewportCached.w;
        const update = this._viewportsCurrent.x !== x || this._viewportsCurrent.y !== y || this._viewportsCurrent.w !== w || this._viewportsCurrent.h !== h;
        if (update) {
            this._viewportsCurrent.x = this._viewportCached.x;
            this._viewportsCurrent.y = this._viewportCached.y;
            this._viewportsCurrent.w = this._viewportCached.z;
            this._viewportsCurrent.h = this._viewportCached.w;
        }
        return update;
    }
    _applyViewport(bundleList) {
        const x = Math.floor(this._viewportCached.x);
        const w = Math.floor(this._viewportCached.z);
        const h = Math.floor(this._viewportCached.w);
        let y = Math.floor(this._viewportCached.y);
        if (!this._currentRenderTarget) {
            y = this.getRenderHeight(true) - y - h;
        }
        if (bundleList) {
            bundleList.addItem(new WebGPURenderItemViewport(x, y, w, h));
        }
        else {
            this._getCurrentRenderPass().setViewport(x, y, w, h, 0, 1);
        }
        if (this.dbgVerboseLogsForFirstFrames) {
            if (this._count === undefined) {
                this._count = 0;
            }
            if (!this._count || this._count < this.dbgVerboseLogsNumFrames) {
                Logger.Log([
                    "frame #" + this._count + " - viewport applied - (",
                    this._viewportCached.x,
                    this._viewportCached.y,
                    this._viewportCached.z,
                    this._viewportCached.w,
                    ") current pass is main pass=" + this._currentPassIsMainPass(),
                ]);
            }
        }
    }
    /**
     * @internal
     */
    _viewport(x, y, width, height) {
        this._viewportCached.x = x;
        this._viewportCached.y = y;
        this._viewportCached.z = width;
        this._viewportCached.w = height;
    }
    _mustUpdateScissor() {
        const x = this._scissorCached.x, y = this._scissorCached.y, w = this._scissorCached.z, h = this._scissorCached.w;
        const update = this._scissorsCurrent.x !== x || this._scissorsCurrent.y !== y || this._scissorsCurrent.w !== w || this._scissorsCurrent.h !== h;
        if (update) {
            this._scissorsCurrent.x = this._scissorCached.x;
            this._scissorsCurrent.y = this._scissorCached.y;
            this._scissorsCurrent.w = this._scissorCached.z;
            this._scissorsCurrent.h = this._scissorCached.w;
        }
        return update;
    }
    _applyScissor(bundleList) {
        const y = this._currentRenderTarget ? this._scissorCached.y : this.getRenderHeight() - this._scissorCached.w - this._scissorCached.y;
        if (bundleList) {
            bundleList.addItem(new WebGPURenderItemScissor(this._scissorCached.x, y, this._scissorCached.z, this._scissorCached.w));
        }
        else {
            this._getCurrentRenderPass().setScissorRect(this._scissorCached.x, y, this._scissorCached.z, this._scissorCached.w);
        }
        if (this.dbgVerboseLogsForFirstFrames) {
            if (this._count === undefined) {
                this._count = 0;
            }
            if (!this._count || this._count < this.dbgVerboseLogsNumFrames) {
                Logger.Log([
                    "frame #" + this._count + " - scissor applied - (",
                    this._scissorCached.x,
                    this._scissorCached.y,
                    this._scissorCached.z,
                    this._scissorCached.w,
                    ") current pass is main pass=" + this._currentPassIsMainPass(),
                ]);
            }
        }
    }
    _scissorIsActive() {
        return this._scissorCached.x !== 0 || this._scissorCached.y !== 0 || this._scissorCached.z !== 0 || this._scissorCached.w !== 0;
    }
    enableScissor(x, y, width, height) {
        this._scissorCached.x = x;
        this._scissorCached.y = y;
        this._scissorCached.z = width;
        this._scissorCached.w = height;
    }
    disableScissor() {
        this._scissorCached.x = this._scissorCached.y = this._scissorCached.z = this._scissorCached.w = 0;
        this._scissorsCurrent.x = this._scissorsCurrent.y = this._scissorsCurrent.w = this._scissorsCurrent.h = 0;
    }
    _mustUpdateStencilRef() {
        const update = this._stencilStateComposer.funcRef !== this._stencilRefsCurrent;
        if (update) {
            this._stencilRefsCurrent = this._stencilStateComposer.funcRef;
        }
        return update;
    }
    _applyStencilRef(bundleList) {
        if (bundleList) {
            bundleList.addItem(new WebGPURenderItemStencilRef(this._stencilStateComposer.funcRef ?? 0));
        }
        else {
            this._getCurrentRenderPass().setStencilReference(this._stencilStateComposer.funcRef ?? 0);
        }
    }
    _mustUpdateBlendColor() {
        const colorBlend = this._alphaState._blendConstants;
        const update = colorBlend[0] !== this._blendColorsCurrent[0] ||
            colorBlend[1] !== this._blendColorsCurrent[1] ||
            colorBlend[2] !== this._blendColorsCurrent[2] ||
            colorBlend[3] !== this._blendColorsCurrent[3];
        if (update) {
            this._blendColorsCurrent[0] = colorBlend[0];
            this._blendColorsCurrent[1] = colorBlend[1];
            this._blendColorsCurrent[2] = colorBlend[2];
            this._blendColorsCurrent[3] = colorBlend[3];
        }
        return update;
    }
    _applyBlendColor(bundleList) {
        if (bundleList) {
            bundleList.addItem(new WebGPURenderItemBlendColor(this._alphaState._blendConstants.slice()));
        }
        else {
            this._getCurrentRenderPass().setBlendConstant(this._alphaState._blendConstants);
        }
    }
    _resetRenderPassStates() {
        this._viewportsCurrent.x = this._viewportsCurrent.y = this._viewportsCurrent.w = this._viewportsCurrent.h = 0;
        this._scissorsCurrent.x = this._scissorsCurrent.y = this._scissorsCurrent.w = this._scissorsCurrent.h = 0;
        this._stencilRefsCurrent = -1;
        this._blendColorsCurrent[0] = this._blendColorsCurrent[1] = this._blendColorsCurrent[2] = this._blendColorsCurrent[3] = null;
    }
    /**
     * Clear the current render buffer or the current render target (if any is set up)
     * @param color defines the color to use
     * @param backBuffer defines if the back buffer must be cleared
     * @param depth defines if the depth buffer must be cleared
     * @param stencil defines if the stencil buffer must be cleared
     */
    clear(color, backBuffer, depth, stencil = false) {
        // Some PGs are using color3...
        if (color && color.a === undefined) {
            color.a = 1;
        }
        const hasScissor = this._scissorIsActive();
        if (this.dbgVerboseLogsForFirstFrames) {
            if (this._count === undefined) {
                this._count = 0;
            }
            if (!this._count || this._count < this.dbgVerboseLogsNumFrames) {
                Logger.Log(["frame #" + this._count + " - clear - backBuffer=", backBuffer, " depth=", depth, " stencil=", stencil, " scissor is active=", hasScissor]);
            }
        }
        // We need to recreate the render pass so that the new parameters for clear color / depth / stencil are taken into account
        if (this._currentRenderTarget) {
            if (hasScissor) {
                if (!this._currentRenderPass) {
                    this._startRenderTargetRenderPass(this._currentRenderTarget, false, backBuffer ? color : null, depth, stencil);
                }
                this._applyScissor(!this.compatibilityMode ? this._bundleList : null);
                this._clearFullQuad(backBuffer ? color : null, depth, stencil);
            }
            else {
                if (this._currentRenderPass) {
                    this._endCurrentRenderPass();
                }
                this._startRenderTargetRenderPass(this._currentRenderTarget, true, backBuffer ? color : null, depth, stencil);
            }
        }
        else {
            if (!this._currentRenderPass || !hasScissor) {
                this._startMainRenderPass(!hasScissor, backBuffer ? color : null, depth, stencil);
            }
            if (hasScissor) {
                this._applyScissor(!this.compatibilityMode ? this._bundleList : null);
                this._clearFullQuad(backBuffer ? color : null, depth, stencil);
            }
        }
    }
    _clearFullQuad(clearColor, clearDepth, clearStencil) {
        const renderPass = !this.compatibilityMode ? null : this._getCurrentRenderPass();
        this._clearQuad.setColorFormat(this._colorFormat);
        this._clearQuad.setDepthStencilFormat(this._depthTextureFormat);
        this._clearQuad.setMRTAttachments(this._cacheRenderPipeline.mrtAttachments ?? [], this._cacheRenderPipeline.mrtTextureArray ?? [], this._cacheRenderPipeline.mrtTextureCount);
        if (!this.compatibilityMode) {
            this._bundleList.addItem(new WebGPURenderItemStencilRef(this._clearStencilValue));
        }
        else {
            renderPass.setStencilReference(this._clearStencilValue);
        }
        const bundle = this._clearQuad.clear(renderPass, clearColor, clearDepth, clearStencil, this.currentSampleCount);
        if (!this.compatibilityMode) {
            this._bundleList.addBundle(bundle);
            this._applyStencilRef(this._bundleList);
            this._reportDrawCall();
        }
        else {
            this._applyStencilRef(null);
        }
    }
    //------------------------------------------------------------------------------
    //                              Vertex/Index/Storage Buffers
    //------------------------------------------------------------------------------
    /**
     * Creates a vertex buffer
     * @param data the data or the size for the vertex buffer
     * @param _updatable whether the buffer should be created as updatable
     * @param label defines the label of the buffer (for debug purpose)
     * @returns the new buffer
     */
    createVertexBuffer(data, _updatable, label) {
        let view;
        if (data instanceof Array) {
            view = new Float32Array(data);
        }
        else if (data instanceof ArrayBuffer) {
            view = new Uint8Array(data);
        }
        else {
            view = data;
        }
        const dataBuffer = this._bufferManager.createBuffer(view, WebGPUConstants.BufferUsage.Vertex | WebGPUConstants.BufferUsage.CopyDst, label);
        return dataBuffer;
    }
    /**
     * Creates a vertex buffer
     * @param data the data for the dynamic vertex buffer
     * @param label defines the label of the buffer (for debug purpose)
     * @returns the new buffer
     */
    createDynamicVertexBuffer(data, label) {
        return this.createVertexBuffer(data, undefined, label);
    }
    /**
     * Creates a new index buffer
     * @param indices defines the content of the index buffer
     * @param _updatable defines if the index buffer must be updatable
     * @param label defines the label of the buffer (for debug purpose)
     * @returns a new buffer
     */
    createIndexBuffer(indices, _updatable, label) {
        let is32Bits = true;
        let view;
        if (indices instanceof Uint32Array || indices instanceof Int32Array) {
            view = indices;
        }
        else if (indices instanceof Uint16Array) {
            view = indices;
            is32Bits = false;
        }
        else {
            if (indices.length > 65535) {
                view = new Uint32Array(indices);
            }
            else {
                view = new Uint16Array(indices);
                is32Bits = false;
            }
        }
        const dataBuffer = this._bufferManager.createBuffer(view, WebGPUConstants.BufferUsage.Index | WebGPUConstants.BufferUsage.CopyDst, label);
        dataBuffer.is32Bits = is32Bits;
        return dataBuffer;
    }
    /**
     * Update a dynamic index buffer
     * @param indexBuffer defines the target index buffer
     * @param indices defines the data to update
     * @param offset defines the offset in the target index buffer where update should start
     */
    updateDynamicIndexBuffer(indexBuffer, indices, offset = 0) {
        const gpuBuffer = indexBuffer;
        let view;
        if (indexBuffer.is32Bits) {
            view = indices instanceof Uint32Array ? indices : new Uint32Array(indices);
        }
        else {
            view = indices instanceof Uint16Array ? indices : new Uint16Array(indices);
        }
        this._bufferManager.setSubData(gpuBuffer, offset, view);
    }
    /**
     * Updates a dynamic vertex buffer.
     * @param vertexBuffer the vertex buffer to update
     * @param data the data used to update the vertex buffer
     * @param byteOffset the byte offset of the data
     * @param byteLength the byte length of the data
     */
    updateDynamicVertexBuffer(vertexBuffer, data, byteOffset, byteLength) {
        const dataBuffer = vertexBuffer;
        if (byteOffset === undefined) {
            byteOffset = 0;
        }
        let view;
        if (byteLength === undefined) {
            if (data instanceof Array) {
                view = new Float32Array(data);
            }
            else if (data instanceof ArrayBuffer) {
                view = new Uint8Array(data);
            }
            else {
                view = data;
            }
            byteLength = view.byteLength;
        }
        else {
            if (data instanceof Array) {
                view = new Float32Array(data);
            }
            else if (data instanceof ArrayBuffer) {
                view = new Uint8Array(data);
            }
            else {
                view = data;
            }
        }
        this._bufferManager.setSubData(dataBuffer, byteOffset, view, 0, byteLength);
    }
    /**
     * @internal
     */
    _createBuffer(data, creationFlags, label) {
        let view;
        if (data instanceof Array) {
            view = new Float32Array(data);
        }
        else if (data instanceof ArrayBuffer) {
            view = new Uint8Array(data);
        }
        else {
            view = data;
        }
        let flags = 0;
        if (creationFlags & 1) {
            flags |= WebGPUConstants.BufferUsage.CopySrc;
        }
        if (creationFlags & 2) {
            flags |= WebGPUConstants.BufferUsage.CopyDst;
        }
        if (creationFlags & 4) {
            flags |= WebGPUConstants.BufferUsage.Uniform;
        }
        if (creationFlags & 8) {
            flags |= WebGPUConstants.BufferUsage.Vertex;
        }
        if (creationFlags & 16) {
            flags |= WebGPUConstants.BufferUsage.Index;
        }
        if (creationFlags & 32) {
            flags |= WebGPUConstants.BufferUsage.Storage;
        }
        if (creationFlags & 64) {
            flags |= WebGPUConstants.BufferUsage.Indirect;
        }
        return this._bufferManager.createBuffer(view, flags, label);
    }
    /**
     * @internal
     */
    bindBuffersDirectly() {
        // eslint-disable-next-line no-throw-literal
        throw "Not implemented on WebGPU";
    }
    /**
     * @internal
     */
    updateAndBindInstancesBuffer() {
        // eslint-disable-next-line no-throw-literal
        throw "Not implemented on WebGPU";
    }
    /**
     * Unbind all instance attributes
     */
    unbindInstanceAttributes() {
        // Does nothing
    }
    /**
     * Bind a list of vertex buffers with the engine
     * @param vertexBuffers defines the list of vertex buffers to bind
     * @param indexBuffer defines the index buffer to bind
     * @param effect defines the effect associated with the vertex buffers
     * @param overrideVertexBuffers defines optional list of avertex buffers that overrides the entries in vertexBuffers
     */
    bindBuffers(vertexBuffers, indexBuffer, effect, overrideVertexBuffers) {
        this._currentIndexBuffer = indexBuffer;
        this._currentOverrideVertexBuffers = overrideVertexBuffers ?? null;
        this._cacheRenderPipeline.setBuffers(vertexBuffers, indexBuffer, this._currentOverrideVertexBuffers);
    }
    /**
     * @internal
     */
    _releaseBuffer(buffer) {
        return this._bufferManager.releaseBuffer(buffer);
    }
    //------------------------------------------------------------------------------
    //                              Uniform Buffers
    //------------------------------------------------------------------------------
    /**
     * Create an uniform buffer
     * @see https://doc.babylonjs.com/setup/support/webGL2#uniform-buffer-objets
     * @param elements defines the content of the uniform buffer
     * @param label defines a name for the buffer (for debugging purpose)
     * @returns the webGL uniform buffer
     */
    createUniformBuffer(elements, label) {
        let view;
        if (elements instanceof Array) {
            view = new Float32Array(elements);
        }
        else {
            view = elements;
        }
        const dataBuffer = this._bufferManager.createBuffer(view, WebGPUConstants.BufferUsage.Uniform | WebGPUConstants.BufferUsage.CopyDst, label);
        return dataBuffer;
    }
    /**
     * Create a dynamic uniform buffer (no different from a non dynamic uniform buffer in WebGPU)
     * @see https://doc.babylonjs.com/setup/support/webGL2#uniform-buffer-objets
     * @param elements defines the content of the uniform buffer
     * @param label defines a name for the buffer (for debugging purpose)
     * @returns the webGL uniform buffer
     */
    createDynamicUniformBuffer(elements, label) {
        return this.createUniformBuffer(elements, label);
    }
    /**
     * Update an existing uniform buffer
     * @see https://doc.babylonjs.com/setup/support/webGL2#uniform-buffer-objets
     * @param uniformBuffer defines the target uniform buffer
     * @param elements defines the content to update
     * @param offset defines the offset in the uniform buffer where update should start
     * @param count defines the size of the data to update
     */
    updateUniformBuffer(uniformBuffer, elements, offset, count) {
        if (offset === undefined) {
            offset = 0;
        }
        const dataBuffer = uniformBuffer;
        let view;
        if (count === undefined) {
            if (elements instanceof Float32Array) {
                view = elements;
            }
            else {
                view = new Float32Array(elements);
            }
            count = view.byteLength;
        }
        else {
            if (elements instanceof Float32Array) {
                view = elements;
            }
            else {
                view = new Float32Array(elements);
            }
        }
        this._bufferManager.setSubData(dataBuffer, offset, view, 0, count);
    }
    /**
     * Bind a buffer to the current draw context
     * @param buffer defines the buffer to bind
     * @param _location not used in WebGPU
     * @param name Name of the uniform variable to bind
     */
    bindUniformBufferBase(buffer, _location, name) {
        this._currentDrawContext.setBuffer(name, buffer);
    }
    /**
     * Unused in WebGPU
     */
    bindUniformBlock() { }
    //------------------------------------------------------------------------------
    //                              Effects
    //------------------------------------------------------------------------------
    /**
     * Create a new effect (used to store vertex/fragment shaders)
     * @param baseName defines the base name of the effect (The name of file without .fragment.fx or .vertex.fx)
     * @param attributesNamesOrOptions defines either a list of attribute names or an IEffectCreationOptions object
     * @param uniformsNamesOrEngine defines either a list of uniform names or the engine to use
     * @param samplers defines an array of string used to represent textures
     * @param defines defines the string containing the defines to use to compile the shaders
     * @param fallbacks defines the list of potential fallbacks to use if shader compilation fails
     * @param onCompiled defines a function to call when the effect creation is successful
     * @param onError defines a function to call when the effect creation has failed
     * @param indexParameters defines an object containing the index values to use to compile shaders (like the maximum number of simultaneous lights)
     * @param shaderLanguage the language the shader is written in (default: GLSL)
     * @returns the new Effect
     */
    createEffect(baseName, attributesNamesOrOptions, uniformsNamesOrEngine, samplers, defines, fallbacks, onCompiled, onError, indexParameters, shaderLanguage = ShaderLanguage.GLSL) {
        const vertex = typeof baseName === "string" ? baseName : baseName.vertexToken || baseName.vertexSource || baseName.vertexElement || baseName.vertex;
        const fragment = typeof baseName === "string" ? baseName : baseName.fragmentToken || baseName.fragmentSource || baseName.fragmentElement || baseName.fragment;
        const globalDefines = this._getGlobalDefines();
        let fullDefines = defines ?? attributesNamesOrOptions.defines ?? "";
        if (globalDefines) {
            fullDefines += "\n" + globalDefines;
        }
        const name = vertex + "+" + fragment + "@" + fullDefines;
        if (this._compiledEffects[name]) {
            const compiledEffect = this._compiledEffects[name];
            if (onCompiled && compiledEffect.isReady()) {
                onCompiled(compiledEffect);
            }
            return compiledEffect;
        }
        const effect = new Effect(baseName, attributesNamesOrOptions, uniformsNamesOrEngine, samplers, this, defines, fallbacks, onCompiled, onError, indexParameters, name, attributesNamesOrOptions.shaderLanguage ?? shaderLanguage);
        this._compiledEffects[name] = effect;
        return effect;
    }
    _compileRawShaderToSpirV(source, type) {
        return this._glslang.compileGLSL(source, type);
    }
    _compileShaderToSpirV(source, type, defines, shaderVersion) {
        return this._compileRawShaderToSpirV(shaderVersion + (defines ? defines + "\n" : "") + source, type);
    }
    _getWGSLShader(source, type, defines) {
        if (defines) {
            defines = "//" + defines.split("\n").join("\n//") + "\n";
        }
        else {
            defines = "";
        }
        return defines + source;
    }
    _createPipelineStageDescriptor(vertexShader, fragmentShader, shaderLanguage, disableUniformityAnalysisInVertex, disableUniformityAnalysisInFragment) {
        if (this._tintWASM && shaderLanguage === ShaderLanguage.GLSL) {
            vertexShader = this._tintWASM.convertSpirV2WGSL(vertexShader, disableUniformityAnalysisInVertex);
            fragmentShader = this._tintWASM.convertSpirV2WGSL(fragmentShader, disableUniformityAnalysisInFragment);
        }
        return {
            vertexStage: {
                module: this._device.createShaderModule({
                    code: vertexShader,
                }),
                entryPoint: "main",
            },
            fragmentStage: {
                module: this._device.createShaderModule({
                    code: fragmentShader,
                }),
                entryPoint: "main",
            },
        };
    }
    _compileRawPipelineStageDescriptor(vertexCode, fragmentCode, shaderLanguage) {
        const disableUniformityAnalysisInVertex = vertexCode.indexOf(`#define DISABLE_UNIFORMITY_ANALYSIS`) >= 0;
        const disableUniformityAnalysisInFragment = fragmentCode.indexOf(`#define DISABLE_UNIFORMITY_ANALYSIS`) >= 0;
        const vertexShader = shaderLanguage === ShaderLanguage.GLSL ? this._compileRawShaderToSpirV(vertexCode, "vertex") : vertexCode;
        const fragmentShader = shaderLanguage === ShaderLanguage.GLSL ? this._compileRawShaderToSpirV(fragmentCode, "fragment") : fragmentCode;
        return this._createPipelineStageDescriptor(vertexShader, fragmentShader, shaderLanguage, disableUniformityAnalysisInVertex, disableUniformityAnalysisInFragment);
    }
    _compilePipelineStageDescriptor(vertexCode, fragmentCode, defines, shaderLanguage) {
        this.onBeforeShaderCompilationObservable.notifyObservers(this);
        const disableUniformityAnalysisInVertex = vertexCode.indexOf(`#define DISABLE_UNIFORMITY_ANALYSIS`) >= 0;
        const disableUniformityAnalysisInFragment = fragmentCode.indexOf(`#define DISABLE_UNIFORMITY_ANALYSIS`) >= 0;
        const shaderVersion = "#version 450\n";
        const vertexShader = shaderLanguage === ShaderLanguage.GLSL ? this._compileShaderToSpirV(vertexCode, "vertex", defines, shaderVersion) : this._getWGSLShader(vertexCode, "vertex", defines);
        const fragmentShader = shaderLanguage === ShaderLanguage.GLSL
            ? this._compileShaderToSpirV(fragmentCode, "fragment", defines, shaderVersion)
            : this._getWGSLShader(fragmentCode, "fragment", defines);
        const program = this._createPipelineStageDescriptor(vertexShader, fragmentShader, shaderLanguage, disableUniformityAnalysisInVertex, disableUniformityAnalysisInFragment);
        this.onAfterShaderCompilationObservable.notifyObservers(this);
        return program;
    }
    /**
     * @internal
     */
    createRawShaderProgram() {
        // eslint-disable-next-line no-throw-literal
        throw "Not available on WebGPU";
    }
    /**
     * @internal
     */
    createShaderProgram() {
        // eslint-disable-next-line no-throw-literal
        throw "Not available on WebGPU";
    }
    /**
     * Inline functions in shader code that are marked to be inlined
     * @param code code to inline
     * @returns inlined code
     */
    inlineShaderCode(code) {
        const sci = new ShaderCodeInliner(code);
        sci.debug = false;
        sci.processCode();
        return sci.code;
    }
    /**
     * Creates a new pipeline context
     * @param shaderProcessingContext defines the shader processing context used during the processing if available
     * @returns the new pipeline
     */
    createPipelineContext(shaderProcessingContext) {
        return new WebGPUPipelineContext(shaderProcessingContext, this);
    }
    /**
     * Creates a new material context
     * @returns the new context
     */
    createMaterialContext() {
        return new WebGPUMaterialContext();
    }
    /**
     * Creates a new draw context
     * @returns the new context
     */
    createDrawContext() {
        return new WebGPUDrawContext(this._bufferManager);
    }
    /**
     * @internal
     */
    _preparePipelineContext(pipelineContext, vertexSourceCode, fragmentSourceCode, createAsRaw, rawVertexSourceCode, rawFragmentSourceCode, rebuildRebind, defines) {
        const webGpuContext = pipelineContext;
        const shaderLanguage = webGpuContext.shaderProcessingContext.shaderLanguage;
        if (this.dbgShowShaderCode) {
            Logger.Log(["defines", defines]);
            Logger.Log(vertexSourceCode);
            Logger.Log(fragmentSourceCode);
            Logger.Log("***********************************************");
        }
        webGpuContext.sources = {
            fragment: fragmentSourceCode,
            vertex: vertexSourceCode,
            rawVertex: rawVertexSourceCode,
            rawFragment: rawFragmentSourceCode,
        };
        if (createAsRaw) {
            webGpuContext.stages = this._compileRawPipelineStageDescriptor(vertexSourceCode, fragmentSourceCode, shaderLanguage);
        }
        else {
            webGpuContext.stages = this._compilePipelineStageDescriptor(vertexSourceCode, fragmentSourceCode, defines, shaderLanguage);
        }
    }
    /**
     * Gets the list of active attributes for a given WebGPU program
     * @param pipelineContext defines the pipeline context to use
     * @param attributesNames defines the list of attribute names to get
     * @returns an array of indices indicating the offset of each attribute
     */
    getAttributes(pipelineContext, attributesNames) {
        const results = new Array(attributesNames.length);
        const gpuPipelineContext = pipelineContext;
        for (let i = 0; i < attributesNames.length; i++) {
            const attributeName = attributesNames[i];
            const attributeLocation = gpuPipelineContext.shaderProcessingContext.availableAttributes[attributeName];
            if (attributeLocation === undefined) {
                continue;
            }
            results[i] = attributeLocation;
        }
        return results;
    }
    /**
     * Activates an effect, making it the current one (ie. the one used for rendering)
     * @param effect defines the effect to activate
     */
    enableEffect(effect) {
        if (!effect) {
            return;
        }
        if (!IsWrapper(effect)) {
            this._currentEffect = effect;
            this._currentMaterialContext = this._defaultMaterialContext;
            this._currentDrawContext = this._defaultDrawContext;
            this._counters.numEnableEffects++;
            if (this.dbgLogIfNotDrawWrapper) {
                Logger.Warn(`enableEffect has been called with an Effect and not a Wrapper! effect.uniqueId=${effect.uniqueId}, effect.name=${effect.name}, effect.name.vertex=${typeof effect.name === "string" ? "" : effect.name.vertex}, effect.name.fragment=${typeof effect.name === "string" ? "" : effect.name.fragment}`, 10);
            }
        }
        else if (!effect.effect ||
            (effect.effect === this._currentEffect &&
                effect.materialContext === this._currentMaterialContext &&
                effect.drawContext === this._currentDrawContext &&
                !this._forceEnableEffect)) {
            if (!effect.effect && this.dbgShowEmptyEnableEffectCalls) {
                Logger.Log(["drawWrapper=", effect]);
                // eslint-disable-next-line no-throw-literal
                throw "Invalid call to enableEffect: the effect property is empty!";
            }
            return;
        }
        else {
            this._currentEffect = effect.effect;
            this._currentMaterialContext = effect.materialContext;
            this._currentDrawContext = effect.drawContext;
            this._counters.numEnableDrawWrapper++;
            if (!this._currentMaterialContext) {
                Logger.Log(["drawWrapper=", effect]);
                // eslint-disable-next-line no-throw-literal
                throw `Invalid call to enableEffect: the materialContext property is empty!`;
            }
        }
        this._stencilStateComposer.stencilMaterial = undefined;
        this._forceEnableEffect = false;
        if (this._currentEffect.onBind) {
            this._currentEffect.onBind(this._currentEffect);
        }
        if (this._currentEffect._onBindObservable) {
            this._currentEffect._onBindObservable.notifyObservers(this._currentEffect);
        }
    }
    /**
     * @internal
     */
    _releaseEffect(effect) {
        if (this._compiledEffects[effect._key]) {
            delete this._compiledEffects[effect._key];
            this._deletePipelineContext(effect.getPipelineContext());
        }
    }
    /**
     * Force the engine to release all cached effects. This means that next effect compilation will have to be done completely even if a similar effect was already compiled
     */
    releaseEffects() {
        for (const name in this._compiledEffects) {
            const webGPUPipelineContext = this._compiledEffects[name].getPipelineContext();
            this._deletePipelineContext(webGPUPipelineContext);
        }
        this._compiledEffects = {};
    }
    _deletePipelineContext(pipelineContext) {
        const webgpuPipelineContext = pipelineContext;
        if (webgpuPipelineContext) {
            resetCachedPipeline(webgpuPipelineContext);
        }
    }
    //------------------------------------------------------------------------------
    //                              Textures
    //------------------------------------------------------------------------------
    /**
     * Gets a boolean indicating that only power of 2 textures are supported
     * Please note that you can still use non power of 2 textures but in this case the engine will forcefully convert them
     */
    get needPOTTextures() {
        return false;
    }
    /** @internal */
    _createHardwareTexture() {
        return new WebGPUHardwareTexture();
    }
    /**
     * @internal
     */
    _releaseTexture(texture) {
        const index = this._internalTexturesCache.indexOf(texture);
        if (index !== -1) {
            this._internalTexturesCache.splice(index, 1);
        }
        this._textureHelper.releaseTexture(texture);
    }
    /**
     * @internal
     */
    _getRGBABufferInternalSizedFormat() {
        return 5;
    }
    updateTextureComparisonFunction(texture, comparisonFunction) {
        texture._comparisonFunction = comparisonFunction;
    }
    /**
     * Creates an internal texture without binding it to a framebuffer
     * @internal
     * @param size defines the size of the texture
     * @param options defines the options used to create the texture
     * @param delayGPUTextureCreation true to delay the texture creation the first time it is really needed. false to create it right away
     * @param source source type of the texture
     * @returns a new internal texture
     */
    _createInternalTexture(size, options, delayGPUTextureCreation = true, source = InternalTextureSource.Unknown) {
        const fullOptions = {};
        if (options !== undefined && typeof options === "object") {
            fullOptions.generateMipMaps = options.generateMipMaps;
            fullOptions.type = options.type === undefined ? 0 : options.type;
            fullOptions.samplingMode = options.samplingMode === undefined ? 3 : options.samplingMode;
            fullOptions.format = options.format === undefined ? 5 : options.format;
            fullOptions.samples = options.samples ?? 1;
            fullOptions.creationFlags = options.creationFlags ?? 0;
            fullOptions.useSRGBBuffer = options.useSRGBBuffer ?? false;
            fullOptions.label = options.label;
        }
        else {
            fullOptions.generateMipMaps = options;
            fullOptions.type = 0;
            fullOptions.samplingMode = 3;
            fullOptions.format = 5;
            fullOptions.samples = 1;
            fullOptions.creationFlags = 0;
            fullOptions.useSRGBBuffer = false;
        }
        if (fullOptions.type === 1 && !this._caps.textureFloatLinearFiltering) {
            fullOptions.samplingMode = 1;
        }
        else if (fullOptions.type === 2 && !this._caps.textureHalfFloatLinearFiltering) {
            fullOptions.samplingMode = 1;
        }
        if (fullOptions.type === 1 && !this._caps.textureFloat) {
            fullOptions.type = 0;
            Logger.Warn("Float textures are not supported. Type forced to TEXTURETYPE_UNSIGNED_BYTE");
        }
        const texture = new InternalTexture(this, source);
        const width = size.width || size;
        const height = size.height || size;
        const depth = size.depth || 0;
        const layers = size.layers || 0;
        texture.baseWidth = width;
        texture.baseHeight = height;
        texture.width = width;
        texture.height = height;
        texture.depth = depth || layers;
        texture.isReady = true;
        texture.samples = fullOptions.samples;
        texture.generateMipMaps = fullOptions.generateMipMaps ? true : false;
        texture.samplingMode = fullOptions.samplingMode;
        texture.type = fullOptions.type;
        texture.format = fullOptions.format;
        texture.is2DArray = layers > 0;
        texture.is3D = depth > 0;
        texture._cachedWrapU = 0;
        texture._cachedWrapV = 0;
        texture._useSRGBBuffer = fullOptions.useSRGBBuffer;
        texture.label = fullOptions.label;
        this._internalTexturesCache.push(texture);
        if (!delayGPUTextureCreation) {
            this._textureHelper.createGPUTextureForInternalTexture(texture, width, height, layers || 1, fullOptions.creationFlags);
        }
        return texture;
    }
    /**
     * Usually called from Texture.ts.
     * Passed information to create a hardware texture
     * @param url defines a value which contains one of the following:
     * * A conventional http URL, e.g. 'http://...' or 'file://...'
     * * A base64 string of in-line texture data, e.g. 'data:image/jpg;base64,/...'
     * * An indicator that data being passed using the buffer parameter, e.g. 'data:mytexture.jpg'
     * @param noMipmap defines a boolean indicating that no mipmaps shall be generated.  Ignored for compressed textures.  They must be in the file
     * @param invertY when true, image is flipped when loaded.  You probably want true. Certain compressed textures may invert this if their default is inverted (eg. ktx)
     * @param scene needed for loading to the correct scene
     * @param samplingMode mode with should be used sample / access the texture (Default: Texture.TRILINEAR_SAMPLINGMODE)
     * @param onLoad optional callback to be called upon successful completion
     * @param onError optional callback to be called upon failure
     * @param buffer a source of a file previously fetched as either a base64 string, an ArrayBuffer (compressed or image format), HTMLImageElement (image format), or a Blob
     * @param fallback an internal argument in case the function must be called again, due to etc1 not having alpha capabilities
     * @param format internal format.  Default: RGB when extension is '.jpg' else RGBA.  Ignored for compressed textures
     * @param forcedExtension defines the extension to use to pick the right loader
     * @param mimeType defines an optional mime type
     * @param loaderOptions options to be passed to the loader
     * @param creationFlags specific flags to use when creating the texture (1 for storage textures, for eg)
     * @param useSRGBBuffer defines if the texture must be loaded in a sRGB GPU buffer (if supported by the GPU).
     * @returns a InternalTexture for assignment back into BABYLON.Texture
     */
    createTexture(url, noMipmap, invertY, scene, samplingMode = 3, onLoad = null, onError = null, buffer = null, fallback = null, format = null, forcedExtension = null, mimeType, loaderOptions, creationFlags, useSRGBBuffer) {
        return this._createTextureBase(url, noMipmap, invertY, scene, samplingMode, onLoad, onError, (texture, extension, scene, img, invertY, noMipmap, isCompressed, processFunction) => {
            const imageBitmap = img; // we will never get an HTMLImageElement in WebGPU
            texture.baseWidth = imageBitmap.width;
            texture.baseHeight = imageBitmap.height;
            texture.width = imageBitmap.width;
            texture.height = imageBitmap.height;
            texture.format = texture.format !== -1 ? texture.format : format ?? 5;
            texture.type = texture.type !== -1 ? texture.type : 0;
            texture._creationFlags = creationFlags ?? 0;
            processFunction(texture.width, texture.height, imageBitmap, extension, texture, () => { });
            if (!texture._hardwareTexture?.underlyingResource) {
                // the texture could have been created before reaching this point so don't recreate it if already existing
                const gpuTextureWrapper = this._textureHelper.createGPUTextureForInternalTexture(texture, imageBitmap.width, imageBitmap.height, undefined, creationFlags);
                if (WebGPUTextureHelper.IsImageBitmap(imageBitmap)) {
                    this._textureHelper.updateTexture(imageBitmap, texture, imageBitmap.width, imageBitmap.height, texture.depth, gpuTextureWrapper.format, 0, 0, invertY, false, 0, 0);
                    if (!noMipmap && !isCompressed) {
                        this._generateMipmaps(texture, this._uploadEncoder);
                    }
                }
            }
            else if (!noMipmap && !isCompressed) {
                this._generateMipmaps(texture, this._uploadEncoder);
            }
            if (scene) {
                scene.removePendingData(texture);
            }
            texture.isReady = true;
            texture.onLoadedObservable.notifyObservers(texture);
            texture.onLoadedObservable.clear();
        }, () => false, buffer, fallback, format, forcedExtension, mimeType, loaderOptions, useSRGBBuffer);
    }
    /**
     * Wraps an external web gpu texture in a Babylon texture.
     * @param texture defines the external texture
     * @returns the babylon internal texture
     */
    wrapWebGPUTexture(texture) {
        const hardwareTexture = new WebGPUHardwareTexture(texture);
        const internalTexture = new InternalTexture(this, InternalTextureSource.Unknown, true);
        internalTexture._hardwareTexture = hardwareTexture;
        internalTexture.isReady = true;
        return internalTexture;
    }
    // eslint-disable-next-line jsdoc/require-returns-check
    /**
     * Wraps an external web gl texture in a Babylon texture.
     * @returns the babylon internal texture
     */
    wrapWebGLTexture() {
        throw new Error("wrapWebGLTexture is not supported, use wrapWebGPUTexture instead.");
    }
    /**
     * @internal
     */
    _getUseSRGBBuffer(useSRGBBuffer, noMipmap) {
        return useSRGBBuffer && this._caps.supportSRGBBuffers;
    }
    /**
     * @internal
     */
    _unpackFlipY(value) { }
    /**
     * Update the sampling mode of a given texture
     * @param samplingMode defines the required sampling mode
     * @param texture defines the texture to update
     * @param generateMipMaps defines whether to generate mipmaps for the texture
     */
    updateTextureSamplingMode(samplingMode, texture, generateMipMaps = false) {
        if (generateMipMaps) {
            texture.generateMipMaps = true;
            this._generateMipmaps(texture);
        }
        texture.samplingMode = samplingMode;
    }
    /**
     * Update the sampling mode of a given texture
     * @param texture defines the texture to update
     * @param wrapU defines the texture wrap mode of the u coordinates
     * @param wrapV defines the texture wrap mode of the v coordinates
     * @param wrapR defines the texture wrap mode of the r coordinates
     */
    updateTextureWrappingMode(texture, wrapU, wrapV = null, wrapR = null) {
        if (wrapU !== null) {
            texture._cachedWrapU = wrapU;
        }
        if (wrapV !== null) {
            texture._cachedWrapV = wrapV;
        }
        if ((texture.is2DArray || texture.is3D) && wrapR !== null) {
            texture._cachedWrapR = wrapR;
        }
    }
    /**
     * Update the dimensions of a texture
     * @param texture texture to update
     * @param width new width of the texture
     * @param height new height of the texture
     * @param depth new depth of the texture
     */
    updateTextureDimensions(texture, width, height, depth = 1) {
        if (!texture._hardwareTexture) {
            // the gpu texture is not created yet, so when it is it will be created with the right dimensions
            return;
        }
        if (texture.width === width && texture.height === height && texture.depth === depth) {
            return;
        }
        const additionalUsages = texture._hardwareTexture.textureAdditionalUsages;
        texture._hardwareTexture.release(); // don't defer the releasing! Else we will release at the end of this frame the gpu texture we are about to create in the next line...
        this._textureHelper.createGPUTextureForInternalTexture(texture, width, height, depth, additionalUsages);
    }
    /**
     * @internal
     */
    _setInternalTexture(name, texture, baseName) {
        baseName = baseName ?? name;
        if (this._currentEffect) {
            const webgpuPipelineContext = this._currentEffect._pipelineContext;
            const availableTexture = webgpuPipelineContext.shaderProcessingContext.availableTextures[baseName];
            this._currentMaterialContext.setTexture(name, texture);
            if (availableTexture && availableTexture.autoBindSampler) {
                const samplerName = baseName + `Sampler`;
                this._currentMaterialContext.setSampler(samplerName, texture); // we can safely cast to InternalTexture because ExternalTexture always has autoBindSampler = false
            }
        }
    }
    /**
     * Create a cube texture from prefiltered data (ie. the mipmaps contain ready to use data for PBR reflection)
     * @param rootUrl defines the url where the file to load is located
     * @param scene defines the current scene
     * @param lodScale defines scale to apply to the mip map selection
     * @param lodOffset defines offset to apply to the mip map selection
     * @param onLoad defines an optional callback raised when the texture is loaded
     * @param onError defines an optional callback raised if there is an issue to load the texture
     * @param format defines the format of the data
     * @param forcedExtension defines the extension to use to pick the right loader
     * @param createPolynomials defines wheter or not to create polynomails harmonics for the texture
     * @returns the cube texture as an InternalTexture
     */
    createPrefilteredCubeTexture(rootUrl, scene, lodScale, lodOffset, onLoad = null, onError = null, format, forcedExtension = null, createPolynomials = true) {
        const callback = (loadData) => {
            if (!loadData) {
                if (onLoad) {
                    onLoad(null);
                }
                return;
            }
            const texture = loadData.texture;
            if (!createPolynomials) {
                texture._sphericalPolynomial = new SphericalPolynomial();
            }
            else if (loadData.info.sphericalPolynomial) {
                texture._sphericalPolynomial = loadData.info.sphericalPolynomial;
            }
            texture._source = InternalTextureSource.CubePrefiltered;
            if (onLoad) {
                onLoad(texture);
            }
        };
        return this.createCubeTexture(rootUrl, scene, null, false, callback, onError, format, forcedExtension, createPolynomials, lodScale, lodOffset);
    }
    /**
     * Sets a texture to the according uniform.
     * @param channel The texture channel
     * @param unused unused parameter
     * @param texture The texture to apply
     * @param name The name of the uniform in the effect
     */
    setTexture(channel, unused, texture, name) {
        this._setTexture(channel, texture, false, false, name, name);
    }
    /**
     * Sets an array of texture to the WebGPU context
     * @param channel defines the channel where the texture array must be set
     * @param unused unused parameter
     * @param textures defines the array of textures to bind
     * @param name name of the channel
     */
    setTextureArray(channel, unused, textures, name) {
        for (let index = 0; index < textures.length; index++) {
            this._setTexture(-1, textures[index], true, false, name + index.toString(), name);
        }
    }
    /**
     * @internal
     */
    _setTexture(channel, texture, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isPartOfTextureArray = false, depthStencilTexture = false, name = "", baseName) {
        // name == baseName for a texture that is not part of a texture array
        // Else, name is something like 'myTexture0' / 'myTexture1' / ... and baseName is 'myTexture'
        // baseName is used to look up the texture in the shaderProcessingContext.availableTextures map
        // name is used to look up the texture in the _currentMaterialContext.textures map
        baseName = baseName ?? name;
        if (this._currentEffect) {
            if (!texture) {
                this._currentMaterialContext.setTexture(name, null);
                return false;
            }
            // Video
            if (texture.video) {
                texture.update();
            }
            else if (texture.delayLoadState === 4) {
                // Delay loading
                texture.delayLoad();
                return false;
            }
            let internalTexture = null;
            if (depthStencilTexture) {
                internalTexture = texture.depthStencilTexture;
            }
            else if (texture.isReady()) {
                internalTexture = texture.getInternalTexture();
            }
            else if (texture.isCube) {
                internalTexture = this.emptyCubeTexture;
            }
            else if (texture.is3D) {
                internalTexture = this.emptyTexture3D;
            }
            else if (texture.is2DArray) {
                internalTexture = this.emptyTexture2DArray;
            }
            else {
                internalTexture = this.emptyTexture;
            }
            if (internalTexture && !internalTexture.isMultiview) {
                // CUBIC_MODE and SKYBOX_MODE both require CLAMP_TO_EDGE.  All other modes use REPEAT.
                if (internalTexture.isCube && internalTexture._cachedCoordinatesMode !== texture.coordinatesMode) {
                    internalTexture._cachedCoordinatesMode = texture.coordinatesMode;
                    const textureWrapMode = texture.coordinatesMode !== 3 && texture.coordinatesMode !== 5
                        ? 1
                        : 0;
                    texture.wrapU = textureWrapMode;
                    texture.wrapV = textureWrapMode;
                }
                internalTexture._cachedWrapU = texture.wrapU;
                internalTexture._cachedWrapV = texture.wrapV;
                if (internalTexture.is3D) {
                    internalTexture._cachedWrapR = texture.wrapR;
                }
                this._setAnisotropicLevel(0, internalTexture, texture.anisotropicFilteringLevel);
            }
            this._setInternalTexture(name, internalTexture, baseName);
        }
        else {
            if (this.dbgVerboseLogsForFirstFrames) {
                if (this._count === undefined) {
                    this._count = 0;
                }
                if (!this._count || this._count < this.dbgVerboseLogsNumFrames) {
                    Logger.Log(["frame #" + this._count + " - _setTexture called with a null _currentEffect! texture=", texture]);
                }
            }
        }
        return true;
    }
    /**
     * @internal
     */
    _setAnisotropicLevel(target, internalTexture, anisotropicFilteringLevel) {
        if (internalTexture._cachedAnisotropicFilteringLevel !== anisotropicFilteringLevel) {
            internalTexture._cachedAnisotropicFilteringLevel = Math.min(anisotropicFilteringLevel, this._caps.maxAnisotropy);
        }
    }
    /**
     * @internal
     */
    _bindTexture(channel, texture, name) {
        if (channel === undefined) {
            return;
        }
        this._setInternalTexture(name, texture);
    }
    /**
     * Generates the mipmaps for a texture
     * @param texture texture to generate the mipmaps for
     */
    generateMipmaps(texture) {
        this._generateMipmaps(texture);
    }
    /**
     * @internal
     */
    _generateMipmaps(texture, commandEncoder) {
        commandEncoder = commandEncoder ?? this._renderEncoder;
        const gpuHardwareTexture = texture._hardwareTexture;
        if (!gpuHardwareTexture) {
            return;
        }
        if (commandEncoder === this._renderEncoder) {
            // We must close the current pass (if any) because we are going to use the render encoder to generate the mipmaps (so, we are going to create a new render pass)
            this._endCurrentRenderPass();
        }
        const format = texture._hardwareTexture.format;
        const mipmapCount = WebGPUTextureHelper.ComputeNumMipmapLevels(texture.width, texture.height);
        if (this.dbgVerboseLogsForFirstFrames) {
            if (this._count === undefined) {
                this._count = 0;
            }
            if (!this._count || this._count < this.dbgVerboseLogsNumFrames) {
                Logger.Log("frame #" +
                    this._count +
                    " - generate mipmaps - width=" +
                    texture.width +
                    ", height=" +
                    texture.height +
                    ", isCube=" +
                    texture.isCube +
                    ", command encoder=" +
                    (commandEncoder === this._renderEncoder ? "render" : "copy"));
            }
        }
        if (texture.isCube) {
            this._textureHelper.generateCubeMipmaps(gpuHardwareTexture, format, mipmapCount, commandEncoder);
        }
        else {
            this._textureHelper.generateMipmaps(gpuHardwareTexture, format, mipmapCount, 0, texture.is3D, commandEncoder);
        }
    }
    /**
     * Update a portion of an internal texture
     * @param texture defines the texture to update
     * @param imageData defines the data to store into the texture
     * @param xOffset defines the x coordinates of the update rectangle
     * @param yOffset defines the y coordinates of the update rectangle
     * @param width defines the width of the update rectangle
     * @param height defines the height of the update rectangle
     * @param faceIndex defines the face index if texture is a cube (0 by default)
     * @param lod defines the lod level to update (0 by default)
     * @param generateMipMaps defines whether to generate mipmaps or not
     */
    updateTextureData(texture, imageData, xOffset, yOffset, width, height, faceIndex = 0, lod = 0, generateMipMaps = false) {
        let gpuTextureWrapper = texture._hardwareTexture;
        if (!texture._hardwareTexture?.underlyingResource) {
            gpuTextureWrapper = this._textureHelper.createGPUTextureForInternalTexture(texture);
        }
        const data = new Uint8Array(imageData.buffer, imageData.byteOffset, imageData.byteLength);
        this._textureHelper.updateTexture(data, texture, width, height, texture.depth, gpuTextureWrapper.format, faceIndex, lod, texture.invertY, false, xOffset, yOffset);
        if (generateMipMaps) {
            this._generateMipmaps(texture);
        }
    }
    /**
     * @internal
     */
    _uploadCompressedDataToTextureDirectly(texture, internalFormat, width, height, imageData, faceIndex = 0, lod = 0) {
        let gpuTextureWrapper = texture._hardwareTexture;
        if (!texture._hardwareTexture?.underlyingResource) {
            texture.format = internalFormat;
            gpuTextureWrapper = this._textureHelper.createGPUTextureForInternalTexture(texture, width, height);
        }
        const data = new Uint8Array(imageData.buffer, imageData.byteOffset, imageData.byteLength);
        this._textureHelper.updateTexture(data, texture, width, height, texture.depth, gpuTextureWrapper.format, faceIndex, lod, false, false, 0, 0);
    }
    /**
     * @internal
     */
    _uploadDataToTextureDirectly(texture, imageData, faceIndex = 0, lod = 0, babylonInternalFormat, useTextureWidthAndHeight = false) {
        const lodMaxWidth = Math.round(Math.log(texture.width) * Math.LOG2E);
        const lodMaxHeight = Math.round(Math.log(texture.height) * Math.LOG2E);
        const width = useTextureWidthAndHeight ? texture.width : Math.pow(2, Math.max(lodMaxWidth - lod, 0));
        const height = useTextureWidthAndHeight ? texture.height : Math.pow(2, Math.max(lodMaxHeight - lod, 0));
        let gpuTextureWrapper = texture._hardwareTexture;
        if (!texture._hardwareTexture?.underlyingResource) {
            gpuTextureWrapper = this._textureHelper.createGPUTextureForInternalTexture(texture, width, height);
        }
        const data = new Uint8Array(imageData.buffer, imageData.byteOffset, imageData.byteLength);
        this._textureHelper.updateTexture(data, texture, width, height, texture.depth, gpuTextureWrapper.format, faceIndex, lod, texture.invertY, false, 0, 0);
    }
    /**
     * @internal
     */
    _uploadArrayBufferViewToTexture(texture, imageData, faceIndex = 0, lod = 0) {
        this._uploadDataToTextureDirectly(texture, imageData, faceIndex, lod);
    }
    /**
     * @internal
     */
    _uploadImageToTexture(texture, image, faceIndex = 0, lod = 0) {
        let gpuTextureWrapper = texture._hardwareTexture;
        if (!texture._hardwareTexture?.underlyingResource) {
            gpuTextureWrapper = this._textureHelper.createGPUTextureForInternalTexture(texture);
        }
        if (image instanceof HTMLImageElement) {
            // eslint-disable-next-line no-throw-literal
            throw "WebGPU engine: HTMLImageElement not supported in _uploadImageToTexture!";
        }
        const bitmap = image; // in WebGPU we will always get an ImageBitmap, not an HTMLImageElement
        const width = Math.ceil(texture.width / (1 << lod));
        const height = Math.ceil(texture.height / (1 << lod));
        this._textureHelper.updateTexture(bitmap, texture, width, height, texture.depth, gpuTextureWrapper.format, faceIndex, lod, texture.invertY, false, 0, 0);
    }
    /**
     * Reads pixels from the current frame buffer. Please note that this function can be slow
     * @param x defines the x coordinate of the rectangle where pixels must be read
     * @param y defines the y coordinate of the rectangle where pixels must be read
     * @param width defines the width of the rectangle where pixels must be read
     * @param height defines the height of the rectangle where pixels must be read
     * @param hasAlpha defines whether the output should have alpha or not (defaults to true)
     * @param flushRenderer true to flush the renderer from the pending commands before reading the pixels
     * @returns a ArrayBufferView promise (Uint8Array) containing RGBA colors
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    readPixels(x, y, width, height, hasAlpha = true, flushRenderer = true) {
        const renderPassWrapper = this._getCurrentRenderPassWrapper();
        const hardwareTexture = renderPassWrapper.colorAttachmentGPUTextures[0];
        if (!hardwareTexture) {
            // we are calling readPixels for a render pass with no color texture bound
            return Promise.resolve(new Uint8Array(0));
        }
        const gpuTexture = hardwareTexture.underlyingResource;
        const gpuTextureFormat = hardwareTexture.format;
        if (!gpuTexture) {
            // we are calling readPixels before startMainRenderPass has been called and no RTT is bound, so swapChainTexture is not setup yet!
            return Promise.resolve(new Uint8Array(0));
        }
        if (flushRenderer) {
            this.flushFramebuffer();
        }
        return this._textureHelper.readPixels(gpuTexture, x, y, width, height, gpuTextureFormat);
    }
    //------------------------------------------------------------------------------
    //                              Frame management
    //------------------------------------------------------------------------------
    _measureFps() {
        this._performanceMonitor.sampleFrame();
        this._fps = this._performanceMonitor.averageFPS;
        this._deltaTime = this._performanceMonitor.instantaneousFrameTime || 0;
    }
    /**
     * Gets the performance monitor attached to this engine
     * @see https://doc.babylonjs.com/features/featuresDeepDive/scene/optimize_your_scene#engineinstrumentation
     */
    get performanceMonitor() {
        return this._performanceMonitor;
    }
    /**
     * Begin a new frame
     */
    beginFrame() {
        this._measureFps();
        super.beginFrame();
    }
    /**
     * End the current frame
     */
    endFrame() {
        this._endCurrentRenderPass();
        this._snapshotRendering.endFrame();
        this._timestampQuery.endFrame(this._renderEncoder);
        this._timestampIndex = 0;
        this.flushFramebuffer();
        this._textureHelper.destroyDeferredTextures();
        this._bufferManager.destroyDeferredBuffers();
        if (this._features._collectUbosUpdatedInFrame) {
            if (this.dbgVerboseLogsForFirstFrames) {
                if (this._count === undefined) {
                    this._count = 0;
                }
                if (!this._count || this._count < this.dbgVerboseLogsNumFrames) {
                    const list = [];
                    for (const name in UniformBuffer._UpdatedUbosInFrame) {
                        list.push(name + ":" + UniformBuffer._UpdatedUbosInFrame[name]);
                    }
                    Logger.Log(["frame #" + this._count + " - updated ubos -", list.join(", ")]);
                }
            }
            UniformBuffer._UpdatedUbosInFrame = {};
        }
        this.countersLastFrame.numEnableEffects = this._counters.numEnableEffects;
        this.countersLastFrame.numEnableDrawWrapper = this._counters.numEnableDrawWrapper;
        this.countersLastFrame.numBundleCreationNonCompatMode = this._counters.numBundleCreationNonCompatMode;
        this.countersLastFrame.numBundleReuseNonCompatMode = this._counters.numBundleReuseNonCompatMode;
        this._counters.numEnableEffects = 0;
        this._counters.numEnableDrawWrapper = 0;
        this._counters.numBundleCreationNonCompatMode = 0;
        this._counters.numBundleReuseNonCompatMode = 0;
        this._cacheRenderPipeline.endFrame();
        this._cacheBindGroups.endFrame();
        this._pendingDebugCommands.length = 0;
        if (this.dbgVerboseLogsForFirstFrames) {
            if (this._count === undefined) {
                this._count = 0;
            }
            if (this._count < this.dbgVerboseLogsNumFrames) {
                Logger.Log(["%c frame #" + this._count + " - end", "background: #ffff00"]);
            }
            if (this._count < this.dbgVerboseLogsNumFrames) {
                this._count++;
                if (this._count !== this.dbgVerboseLogsNumFrames) {
                    Logger.Log(["%c frame #" + this._count + " - begin", "background: #ffff00"]);
                }
            }
        }
        super.endFrame();
    }
    /**Gets driver info if available */
    extractDriverInfo() {
        return "";
    }
    /**
     * Force a WebGPU flush (ie. a flush of all waiting commands)
     */
    flushFramebuffer() {
        // we need to end the current render pass (main or rtt) if any as we are not allowed to submit the command buffers when being in a pass
        this._endCurrentRenderPass();
        this._commandBuffers[0] = this._uploadEncoder.finish();
        this._commandBuffers[1] = this._renderEncoder.finish();
        this._device.queue.submit(this._commandBuffers);
        this._uploadEncoder = this._device.createCommandEncoder(this._uploadEncoderDescriptor);
        this._renderEncoder = this._device.createCommandEncoder(this._renderEncoderDescriptor);
        this._timestampQuery.startFrame(this._uploadEncoder);
        this._textureHelper.setCommandEncoder(this._uploadEncoder);
        this._bundleList.reset();
    }
    /** @internal */
    _currentFrameBufferIsDefaultFrameBuffer() {
        return this._currentPassIsMainPass();
    }
    //------------------------------------------------------------------------------
    //                              Render Pass
    //------------------------------------------------------------------------------
    _startRenderTargetRenderPass(renderTargetWrapper, setClearStates, clearColor, clearDepth, clearStencil) {
        this._endCurrentRenderPass();
        const rtWrapper = renderTargetWrapper;
        const depthStencilTexture = rtWrapper._depthStencilTexture;
        const gpuDepthStencilWrapper = depthStencilTexture?._hardwareTexture;
        const gpuDepthStencilTexture = gpuDepthStencilWrapper?.underlyingResource;
        const gpuDepthStencilMSAATexture = gpuDepthStencilWrapper?.getMSAATexture();
        const depthTextureView = gpuDepthStencilTexture?.createView(this._rttRenderPassWrapper.depthAttachmentViewDescriptor);
        const depthMSAATextureView = gpuDepthStencilMSAATexture?.createView(this._rttRenderPassWrapper.depthAttachmentViewDescriptor);
        const depthTextureHasStencil = gpuDepthStencilWrapper ? WebGPUTextureHelper.HasStencilAspect(gpuDepthStencilWrapper.format) : false;
        const colorAttachments = [];
        if (this.useReverseDepthBuffer) {
            this.setDepthFunctionToGreaterOrEqual();
        }
        const clearColorForIntegerRT = tempColor4;
        if (clearColor) {
            clearColorForIntegerRT.r = clearColor.r * 255;
            clearColorForIntegerRT.g = clearColor.g * 255;
            clearColorForIntegerRT.b = clearColor.b * 255;
            clearColorForIntegerRT.a = clearColor.a * 255;
        }
        const mustClearColor = setClearStates && clearColor;
        const mustClearDepth = setClearStates && clearDepth;
        const mustClearStencil = setClearStates && clearStencil;
        if (rtWrapper._attachments && rtWrapper.isMulti) {
            // multi render targets
            if (!this._mrtAttachments || this._mrtAttachments.length === 0) {
                this._mrtAttachments = rtWrapper._defaultAttachments;
            }
            for (let i = 0; i < this._mrtAttachments.length; ++i) {
                const index = this._mrtAttachments[i]; // if index == 0 it means the texture should not be written to => at render pass creation time, it means we should not clear it
                const mrtTexture = rtWrapper.textures[i];
                const gpuMRTWrapper = mrtTexture?._hardwareTexture;
                const gpuMRTTexture = gpuMRTWrapper?.underlyingResource;
                if (gpuMRTWrapper && gpuMRTTexture) {
                    const gpuMSAATexture = gpuMRTWrapper.getMSAATexture(i);
                    const layerIndex = rtWrapper.layerIndices?.[i] ?? 0;
                    const faceIndex = rtWrapper.faceIndices?.[i] ?? 0;
                    const viewDescriptor = {
                        ...this._rttRenderPassWrapper.colorAttachmentViewDescriptor,
                        dimension: mrtTexture.is3D ? WebGPUConstants.TextureViewDimension.E3d : WebGPUConstants.TextureViewDimension.E2d,
                        format: gpuMRTWrapper.format,
                        baseArrayLayer: mrtTexture.isCube ? layerIndex * 6 + faceIndex : mrtTexture.is3D ? 0 : layerIndex,
                    };
                    const msaaViewDescriptor = {
                        ...this._rttRenderPassWrapper.colorAttachmentViewDescriptor,
                        dimension: mrtTexture.is3D ? WebGPUConstants.TextureViewDimension.E3d : WebGPUConstants.TextureViewDimension.E2d,
                        format: gpuMRTWrapper.format,
                        baseArrayLayer: 0,
                    };
                    const isRTInteger = mrtTexture.type === 7 || mrtTexture.type === 5;
                    const colorTextureView = gpuMRTTexture.createView(viewDescriptor);
                    const colorMSAATextureView = gpuMSAATexture?.createView(msaaViewDescriptor);
                    colorAttachments.push({
                        view: colorMSAATextureView ? colorMSAATextureView : colorTextureView,
                        resolveTarget: gpuMSAATexture ? colorTextureView : undefined,
                        depthSlice: mrtTexture.is3D ? layerIndex : undefined,
                        clearValue: index !== 0 && mustClearColor ? (isRTInteger ? clearColorForIntegerRT : clearColor) : undefined,
                        loadOp: index !== 0 && mustClearColor ? WebGPUConstants.LoadOp.Clear : WebGPUConstants.LoadOp.Load,
                        storeOp: WebGPUConstants.StoreOp.Store,
                    });
                }
            }
            this._cacheRenderPipeline.setMRT(rtWrapper.textures, this._mrtAttachments.length);
            this._cacheRenderPipeline.setMRTAttachments(this._mrtAttachments);
        }
        else {
            // single render target
            const internalTexture = rtWrapper.texture;
            if (internalTexture) {
                const gpuWrapper = internalTexture._hardwareTexture;
                const gpuTexture = gpuWrapper.underlyingResource;
                let depthSlice = undefined;
                if (rtWrapper.is3D) {
                    depthSlice = this._rttRenderPassWrapper.colorAttachmentViewDescriptor.baseArrayLayer;
                    this._rttRenderPassWrapper.colorAttachmentViewDescriptor.baseArrayLayer = 0;
                }
                const gpuMSAATexture = gpuWrapper.getMSAATexture();
                const colorTextureView = gpuTexture.createView(this._rttRenderPassWrapper.colorAttachmentViewDescriptor);
                const colorMSAATextureView = gpuMSAATexture?.createView(this._rttRenderPassWrapper.colorAttachmentViewDescriptor);
                const isRTInteger = internalTexture.type === 7 || internalTexture.type === 5;
                colorAttachments.push({
                    view: colorMSAATextureView ? colorMSAATextureView : colorTextureView,
                    resolveTarget: gpuMSAATexture ? colorTextureView : undefined,
                    depthSlice,
                    clearValue: mustClearColor ? (isRTInteger ? clearColorForIntegerRT : clearColor) : undefined,
                    loadOp: mustClearColor ? WebGPUConstants.LoadOp.Clear : WebGPUConstants.LoadOp.Load,
                    storeOp: WebGPUConstants.StoreOp.Store,
                });
            }
            else {
                colorAttachments.push(null);
            }
        }
        this._debugPushGroup?.("render target pass" + (renderTargetWrapper.label ? " (" + renderTargetWrapper.label + ")" : ""), 1);
        this._rttRenderPassWrapper.renderPassDescriptor = {
            label: (renderTargetWrapper.label ?? "RTT") + "RenderPass",
            colorAttachments,
            depthStencilAttachment: depthStencilTexture && gpuDepthStencilTexture
                ? {
                    view: depthMSAATextureView ? depthMSAATextureView : depthTextureView,
                    depthClearValue: mustClearDepth ? (this.useReverseDepthBuffer ? this._clearReverseDepthValue : this._clearDepthValue) : undefined,
                    depthLoadOp: mustClearDepth ? WebGPUConstants.LoadOp.Clear : WebGPUConstants.LoadOp.Load,
                    depthStoreOp: WebGPUConstants.StoreOp.Store,
                    stencilClearValue: rtWrapper._depthStencilTextureWithStencil && mustClearStencil ? this._clearStencilValue : undefined,
                    stencilLoadOp: !depthTextureHasStencil
                        ? undefined
                        : rtWrapper._depthStencilTextureWithStencil && mustClearStencil
                            ? WebGPUConstants.LoadOp.Clear
                            : WebGPUConstants.LoadOp.Load,
                    stencilStoreOp: !depthTextureHasStencil ? undefined : WebGPUConstants.StoreOp.Store,
                }
                : undefined,
            occlusionQuerySet: this._occlusionQuery?.hasQueries ? this._occlusionQuery.querySet : undefined,
        };
        this._timestampQuery.startPass(this._rttRenderPassWrapper.renderPassDescriptor, this._timestampIndex);
        this._currentRenderPass = this._renderEncoder.beginRenderPass(this._rttRenderPassWrapper.renderPassDescriptor);
        if (this.dbgVerboseLogsForFirstFrames) {
            if (this._count === undefined) {
                this._count = 0;
            }
            if (!this._count || this._count < this.dbgVerboseLogsNumFrames) {
                const internalTexture = rtWrapper.texture;
                Logger.Log([
                    "frame #" +
                        this._count +
                        " - render target begin pass - rtt name=" +
                        renderTargetWrapper.label +
                        ", internalTexture.uniqueId=" +
                        internalTexture.uniqueId +
                        ", width=" +
                        internalTexture.width +
                        ", height=" +
                        internalTexture.height +
                        ", setClearStates=" +
                        setClearStates,
                    "renderPassDescriptor=",
                    this._rttRenderPassWrapper.renderPassDescriptor,
                ]);
            }
        }
        this._debugFlushPendingCommands?.();
        this._resetRenderPassStates();
        if (!gpuDepthStencilWrapper || !WebGPUTextureHelper.HasStencilAspect(gpuDepthStencilWrapper.format)) {
            this._stencilStateComposer.enabled = false;
        }
    }
    _startMainRenderPass(setClearStates, clearColor, clearDepth, clearStencil) {
        this._endCurrentRenderPass();
        if (this.useReverseDepthBuffer) {
            this.setDepthFunctionToGreaterOrEqual();
        }
        const mustClearColor = setClearStates && clearColor;
        const mustClearDepth = setClearStates && clearDepth;
        const mustClearStencil = setClearStates && clearStencil;
        this._mainRenderPassWrapper.renderPassDescriptor.colorAttachments[0].clearValue = mustClearColor ? clearColor : undefined;
        this._mainRenderPassWrapper.renderPassDescriptor.colorAttachments[0].loadOp = mustClearColor ? WebGPUConstants.LoadOp.Clear : WebGPUConstants.LoadOp.Load;
        this._mainRenderPassWrapper.renderPassDescriptor.depthStencilAttachment.depthClearValue = mustClearDepth
            ? this.useReverseDepthBuffer
                ? this._clearReverseDepthValue
                : this._clearDepthValue
            : undefined;
        this._mainRenderPassWrapper.renderPassDescriptor.depthStencilAttachment.depthLoadOp = mustClearDepth ? WebGPUConstants.LoadOp.Clear : WebGPUConstants.LoadOp.Load;
        this._mainRenderPassWrapper.renderPassDescriptor.depthStencilAttachment.stencilClearValue = mustClearStencil ? this._clearStencilValue : undefined;
        this._mainRenderPassWrapper.renderPassDescriptor.depthStencilAttachment.stencilLoadOp = !this.isStencilEnable
            ? undefined
            : mustClearStencil
                ? WebGPUConstants.LoadOp.Clear
                : WebGPUConstants.LoadOp.Load;
        this._mainRenderPassWrapper.renderPassDescriptor.occlusionQuerySet = this._occlusionQuery?.hasQueries ? this._occlusionQuery.querySet : undefined;
        const swapChainTexture = this._context.getCurrentTexture();
        this._mainRenderPassWrapper.colorAttachmentGPUTextures[0].set(swapChainTexture);
        // Resolve in case of MSAA
        if (this._options.antialias) {
            viewDescriptorSwapChainAntialiasing.format = swapChainTexture.format;
            this._mainRenderPassWrapper.renderPassDescriptor.colorAttachments[0].resolveTarget = swapChainTexture.createView(viewDescriptorSwapChainAntialiasing);
        }
        else {
            viewDescriptorSwapChain.format = swapChainTexture.format;
            this._mainRenderPassWrapper.renderPassDescriptor.colorAttachments[0].view = swapChainTexture.createView(viewDescriptorSwapChain);
        }
        if (this.dbgVerboseLogsForFirstFrames) {
            if (this._count === undefined) {
                this._count = 0;
            }
            if (!this._count || this._count < this.dbgVerboseLogsNumFrames) {
                Logger.Log([
                    "frame #" + this._count + " - main begin pass - texture width=" + this._mainTextureExtends.width,
                    " height=" + this._mainTextureExtends.height + ", setClearStates=" + setClearStates,
                    "renderPassDescriptor=",
                    this._mainRenderPassWrapper.renderPassDescriptor,
                ]);
            }
        }
        this._debugPushGroup?.("main pass", 0);
        this._timestampQuery.startPass(this._mainRenderPassWrapper.renderPassDescriptor, this._timestampIndex);
        this._currentRenderPass = this._renderEncoder.beginRenderPass(this._mainRenderPassWrapper.renderPassDescriptor);
        this._setDepthTextureFormat(this._mainRenderPassWrapper);
        this._setColorFormat(this._mainRenderPassWrapper);
        this._debugFlushPendingCommands?.();
        this._resetRenderPassStates();
        if (!this._isStencilEnable) {
            this._stencilStateComposer.enabled = false;
        }
    }
    /** @internal */
    _endCurrentRenderPass() {
        if (!this._currentRenderPass) {
            return 0;
        }
        const currentPassIndex = this._currentPassIsMainPass() ? 2 : 1;
        if (!this._snapshotRendering.endRenderPass(this._currentRenderPass) && !this.compatibilityMode) {
            this._bundleList.run(this._currentRenderPass);
            this._bundleList.reset();
        }
        this._currentRenderPass.end();
        this._timestampQuery.endPass(this._timestampIndex, (this._currentRenderTarget && this._currentRenderTarget.gpuTimeInFrame
            ? this._currentRenderTarget.gpuTimeInFrame
            : this.gpuTimeInFrameForMainPass));
        this._timestampIndex += 2;
        if (this.dbgVerboseLogsForFirstFrames) {
            if (this._count === undefined) {
                this._count = 0;
            }
            if (!this._count || this._count < this.dbgVerboseLogsNumFrames) {
                Logger.Log("frame #" +
                    this._count +
                    " - " +
                    (currentPassIndex === 2 ? "main" : "render target") +
                    " end pass" +
                    (currentPassIndex === 1 ? " - internalTexture.uniqueId=" + this._currentRenderTarget?.texture?.uniqueId : ""));
            }
        }
        this._debugPopGroup?.(0);
        this._currentRenderPass = null;
        return currentPassIndex;
    }
    /**
     * Binds the frame buffer to the specified texture.
     * @param texture The render target wrapper to render to
     * @param faceIndex The face of the texture to render to in case of cube texture
     * @param requiredWidth The width of the target to render to
     * @param requiredHeight The height of the target to render to
     * @param forceFullscreenViewport Forces the viewport to be the entire texture/screen if true
     * @param lodLevel defines the lod level to bind to the frame buffer
     * @param layer defines the 2d array index to bind to frame buffer to
     */
    bindFramebuffer(texture, faceIndex = 0, requiredWidth, requiredHeight, forceFullscreenViewport, lodLevel = 0, layer = 0) {
        const hardwareTexture = texture.texture?._hardwareTexture;
        if (this._currentRenderTarget) {
            this.unBindFramebuffer(this._currentRenderTarget);
        }
        else {
            this._endCurrentRenderPass();
        }
        this._currentRenderTarget = texture;
        const depthStencilTexture = this._currentRenderTarget._depthStencilTexture;
        this._rttRenderPassWrapper.colorAttachmentGPUTextures[0] = hardwareTexture;
        this._rttRenderPassWrapper.depthTextureFormat = depthStencilTexture ? WebGPUTextureHelper.GetWebGPUTextureFormat(-1, depthStencilTexture.format) : undefined;
        this._setDepthTextureFormat(this._rttRenderPassWrapper);
        this._setColorFormat(this._rttRenderPassWrapper);
        this._rttRenderPassWrapper.colorAttachmentViewDescriptor = {
            format: this._colorFormat,
            dimension: texture.is3D ? WebGPUConstants.TextureViewDimension.E3d : WebGPUConstants.TextureViewDimension.E2d,
            mipLevelCount: 1,
            baseArrayLayer: texture.isCube ? layer * 6 + faceIndex : layer,
            baseMipLevel: lodLevel,
            arrayLayerCount: 1,
            aspect: WebGPUConstants.TextureAspect.All,
        };
        this._rttRenderPassWrapper.depthAttachmentViewDescriptor = {
            format: this._depthTextureFormat,
            dimension: depthStencilTexture && depthStencilTexture.is3D ? WebGPUConstants.TextureViewDimension.E3d : WebGPUConstants.TextureViewDimension.E2d,
            mipLevelCount: 1,
            baseArrayLayer: depthStencilTexture ? (depthStencilTexture.isCube ? layer * 6 + faceIndex : layer) : 0,
            baseMipLevel: 0,
            arrayLayerCount: 1,
            aspect: WebGPUConstants.TextureAspect.All,
        };
        if (this.dbgVerboseLogsForFirstFrames) {
            if (this._count === undefined) {
                this._count = 0;
            }
            if (!this._count || this._count < this.dbgVerboseLogsNumFrames) {
                Logger.Log([
                    "frame #" +
                        this._count +
                        " - bindFramebuffer - rtt name=" +
                        texture.label +
                        ", internalTexture.uniqueId=" +
                        texture.texture?.uniqueId +
                        ", face=" +
                        faceIndex +
                        ", lodLevel=" +
                        lodLevel +
                        ", layer=" +
                        layer,
                    "colorAttachmentViewDescriptor=",
                    this._rttRenderPassWrapper.colorAttachmentViewDescriptor,
                    "depthAttachmentViewDescriptor=",
                    this._rttRenderPassWrapper.depthAttachmentViewDescriptor,
                ]);
            }
        }
        // We don't create the render pass just now, we do a lazy creation of the render pass, hoping the render pass will be created by a call to clear()...
        if (this._cachedViewport && !forceFullscreenViewport) {
            this.setViewport(this._cachedViewport, requiredWidth, requiredHeight);
        }
        else {
            if (!requiredWidth) {
                requiredWidth = texture.width;
                if (lodLevel) {
                    requiredWidth = requiredWidth / Math.pow(2, lodLevel);
                }
            }
            if (!requiredHeight) {
                requiredHeight = texture.height;
                if (lodLevel) {
                    requiredHeight = requiredHeight / Math.pow(2, lodLevel);
                }
            }
            this._viewport(0, 0, requiredWidth, requiredHeight);
        }
        this.wipeCaches();
    }
    /**
     * Unbind the current render target texture from the WebGPU context
     * @param texture defines the render target wrapper to unbind
     * @param disableGenerateMipMaps defines a boolean indicating that mipmaps must not be generated
     * @param onBeforeUnbind defines a function which will be called before the effective unbind
     */
    unBindFramebuffer(texture, disableGenerateMipMaps = false, onBeforeUnbind) {
        const saveCRT = this._currentRenderTarget;
        this._currentRenderTarget = null; // to be iso with abstractEngine, this._currentRenderTarget must be null when onBeforeUnbind is called
        if (onBeforeUnbind) {
            onBeforeUnbind();
        }
        this._currentRenderTarget = saveCRT;
        this._endCurrentRenderPass();
        if (texture.texture?.generateMipMaps && !disableGenerateMipMaps && !texture.isCube) {
            this._generateMipmaps(texture.texture);
        }
        this._currentRenderTarget = null;
        if (this.dbgVerboseLogsForFirstFrames) {
            if (this._count === undefined) {
                this._count = 0;
            }
            if (!this._count || this._count < this.dbgVerboseLogsNumFrames) {
                Logger.Log("frame #" + this._count + " - unBindFramebuffer - rtt name=" + texture.label + ", internalTexture.uniqueId=", texture.texture?.uniqueId);
            }
        }
        this._mrtAttachments = [];
        this._cacheRenderPipeline.setMRT([]);
        this._cacheRenderPipeline.setMRTAttachments(this._mrtAttachments);
    }
    /**
     * Unbind the current render target and bind the default framebuffer
     */
    restoreDefaultFramebuffer() {
        if (this._currentRenderTarget) {
            this.unBindFramebuffer(this._currentRenderTarget);
        }
        else if (!this._currentRenderPass) {
            this._startMainRenderPass(false);
        }
        if (this._cachedViewport) {
            this.setViewport(this._cachedViewport);
        }
        this.wipeCaches();
    }
    //------------------------------------------------------------------------------
    //                              Render
    //------------------------------------------------------------------------------
    /**
     * @internal
     */
    _setColorFormat(wrapper) {
        const format = wrapper.colorAttachmentGPUTextures[0]?.format ?? null;
        this._cacheRenderPipeline.setColorFormat(format);
        if (this._colorFormat === format) {
            return;
        }
        this._colorFormat = format;
    }
    /**
     * @internal
     */
    _setDepthTextureFormat(wrapper) {
        this._cacheRenderPipeline.setDepthStencilFormat(wrapper.depthTextureFormat);
        if (this._depthTextureFormat === wrapper.depthTextureFormat) {
            return;
        }
        this._depthTextureFormat = wrapper.depthTextureFormat;
    }
    setDitheringState() {
        // Does not exist in WebGPU
    }
    setRasterizerState() {
        // Does not exist in WebGPU
    }
    /**
     * @internal
     */
    _executeWhenRenderingStateIsCompiled(pipelineContext, action) {
        // No parallel shader compilation.
        // No Async, so direct launch
        action();
    }
    /**
     * @internal
     */
    bindSamplers() { }
    /** @internal */
    _getUnpackAlignement() {
        return 1;
    }
    /**
     * @internal
     */
    _bindTextureDirectly() {
        return false;
    }
    /**
     * Set various states to the webGL context
     * @param culling defines culling state: true to enable culling, false to disable it
     * @param zOffset defines the value to apply to zOffset (0 by default)
     * @param force defines if states must be applied even if cache is up to date
     * @param reverseSide defines if culling must be reversed (CCW if false, CW if true)
     * @param cullBackFaces true to cull back faces, false to cull front faces (if culling is enabled)
     * @param stencil stencil states to set
     * @param zOffsetUnits defines the value to apply to zOffsetUnits (0 by default)
     */
    setState(culling, zOffset = 0, force, reverseSide = false, cullBackFaces, stencil, zOffsetUnits = 0) {
        // Culling
        if (this._depthCullingState.cull !== culling || force) {
            this._depthCullingState.cull = culling;
        }
        // Cull face
        const cullFace = this.cullBackFaces ?? cullBackFaces ?? true ? 1 : 2;
        if (this._depthCullingState.cullFace !== cullFace || force) {
            this._depthCullingState.cullFace = cullFace;
        }
        // Z offset
        this.setZOffset(zOffset);
        this.setZOffsetUnits(zOffsetUnits);
        // Front face
        const frontFace = reverseSide ? (this._currentRenderTarget ? 1 : 2) : this._currentRenderTarget ? 2 : 1;
        if (this._depthCullingState.frontFace !== frontFace || force) {
            this._depthCullingState.frontFace = frontFace;
        }
        this._stencilStateComposer.stencilMaterial = stencil;
    }
    _applyRenderPassChanges(bundleList) {
        const mustUpdateStencilRef = !this._stencilStateComposer.enabled ? false : this._mustUpdateStencilRef();
        const mustUpdateBlendColor = !this._alphaState.alphaBlend ? false : this._mustUpdateBlendColor();
        if (this._mustUpdateViewport()) {
            this._applyViewport(bundleList);
        }
        if (this._mustUpdateScissor()) {
            this._applyScissor(bundleList);
        }
        if (mustUpdateStencilRef) {
            this._applyStencilRef(bundleList);
        }
        if (mustUpdateBlendColor) {
            this._applyBlendColor(bundleList);
        }
    }
    _draw(drawType, fillMode, start, count, instancesCount) {
        const renderPass = this._getCurrentRenderPass();
        const bundleList = this._bundleList;
        this.applyStates();
        const webgpuPipelineContext = this._currentEffect._pipelineContext;
        this.bindUniformBufferBase(this._currentRenderTarget ? this._ubInvertY : this._ubDontInvertY, 0, WebGPUShaderProcessor.InternalsUBOName);
        if (webgpuPipelineContext.uniformBuffer) {
            webgpuPipelineContext.uniformBuffer.update();
            this.bindUniformBufferBase(webgpuPipelineContext.uniformBuffer.getBuffer(), 0, WebGPUShaderProcessor.LeftOvertUBOName);
        }
        if (this._snapshotRendering.play) {
            this._reportDrawCall();
            return;
        }
        if (!this.compatibilityMode &&
            (this._currentDrawContext.isDirty(this._currentMaterialContext.updateId) || this._currentMaterialContext.isDirty || this._currentMaterialContext.forceBindGroupCreation)) {
            this._currentDrawContext.fastBundle = undefined;
        }
        const useFastPath = !this.compatibilityMode && this._currentDrawContext.fastBundle;
        let renderPass2 = renderPass;
        if (useFastPath || this._snapshotRendering.record) {
            this._applyRenderPassChanges(bundleList);
            if (!this._snapshotRendering.record) {
                this._counters.numBundleReuseNonCompatMode++;
                if (this._currentDrawContext.indirectDrawBuffer) {
                    this._currentDrawContext.setIndirectData(count, instancesCount || 1, start);
                }
                bundleList.addBundle(this._currentDrawContext.fastBundle);
                this._reportDrawCall();
                return;
            }
            renderPass2 = bundleList.getBundleEncoder(this._cacheRenderPipeline.colorFormats, this._depthTextureFormat, this.currentSampleCount); // for snapshot recording mode
            bundleList.numDrawCalls++;
        }
        let textureState = 0;
        if (this._currentMaterialContext.hasFloatOrDepthTextures) {
            let bitVal = 1;
            for (let i = 0; i < webgpuPipelineContext.shaderProcessingContext.textureNames.length; ++i) {
                const textureName = webgpuPipelineContext.shaderProcessingContext.textureNames[i];
                const texture = this._currentMaterialContext.textures[textureName]?.texture;
                const textureIsDepth = texture && texture.format >= 13 && texture.format <= 18;
                if ((texture?.type === 1 && !this._caps.textureFloatLinearFiltering) || textureIsDepth) {
                    textureState |= bitVal;
                }
                bitVal = bitVal << 1;
            }
        }
        this._currentMaterialContext.textureState = textureState;
        const pipeline = this._cacheRenderPipeline.getRenderPipeline(fillMode, this._currentEffect, this.currentSampleCount, textureState);
        const bindGroups = this._cacheBindGroups.getBindGroups(webgpuPipelineContext, this._currentDrawContext, this._currentMaterialContext);
        if (!this._snapshotRendering.record) {
            this._applyRenderPassChanges(!this.compatibilityMode ? bundleList : null);
            if (!this.compatibilityMode) {
                this._counters.numBundleCreationNonCompatMode++;
                renderPass2 = this._device.createRenderBundleEncoder({
                    colorFormats: this._cacheRenderPipeline.colorFormats,
                    depthStencilFormat: this._depthTextureFormat,
                    sampleCount: WebGPUTextureHelper.GetSample(this.currentSampleCount),
                });
            }
        }
        // bind pipeline
        renderPass2.setPipeline(pipeline);
        // bind index/vertex buffers
        if (this._currentIndexBuffer) {
            renderPass2.setIndexBuffer(this._currentIndexBuffer.underlyingResource, this._currentIndexBuffer.is32Bits ? WebGPUConstants.IndexFormat.Uint32 : WebGPUConstants.IndexFormat.Uint16, 0);
        }
        const vertexBuffers = this._cacheRenderPipeline.vertexBuffers;
        for (let index = 0; index < vertexBuffers.length; index++) {
            const vertexBuffer = vertexBuffers[index];
            const buffer = vertexBuffer.effectiveBuffer;
            if (buffer) {
                renderPass2.setVertexBuffer(index, buffer.underlyingResource, vertexBuffer._validOffsetRange ? 0 : vertexBuffer.byteOffset);
            }
        }
        // bind bind groups
        for (let i = 0; i < bindGroups.length; i++) {
            renderPass2.setBindGroup(i, bindGroups[i]);
        }
        // draw
        const nonCompatMode = !this.compatibilityMode && !this._snapshotRendering.record;
        if (nonCompatMode && this._currentDrawContext.indirectDrawBuffer) {
            this._currentDrawContext.setIndirectData(count, instancesCount || 1, start);
            if (drawType === 0) {
                renderPass2.drawIndexedIndirect(this._currentDrawContext.indirectDrawBuffer, 0);
            }
            else {
                renderPass2.drawIndirect(this._currentDrawContext.indirectDrawBuffer, 0);
            }
        }
        else if (drawType === 0) {
            renderPass2.drawIndexed(count, instancesCount || 1, start, 0, 0);
        }
        else {
            renderPass2.draw(count, instancesCount || 1, start, 0);
        }
        if (nonCompatMode) {
            this._currentDrawContext.fastBundle = renderPass2.finish();
            bundleList.addBundle(this._currentDrawContext.fastBundle);
        }
        this._reportDrawCall();
    }
    /**
     * Draw a list of indexed primitives
     * @param fillMode defines the primitive to use
     * @param indexStart defines the starting index
     * @param indexCount defines the number of index to draw
     * @param instancesCount defines the number of instances to draw (if instantiation is enabled)
     */
    drawElementsType(fillMode, indexStart, indexCount, instancesCount = 1) {
        this._draw(0, fillMode, indexStart, indexCount, instancesCount);
    }
    /**
     * Draw a list of unindexed primitives
     * @param fillMode defines the primitive to use
     * @param verticesStart defines the index of first vertex to draw
     * @param verticesCount defines the count of vertices to draw
     * @param instancesCount defines the number of instances to draw (if instantiation is enabled)
     */
    drawArraysType(fillMode, verticesStart, verticesCount, instancesCount = 1) {
        this._currentIndexBuffer = null;
        this._draw(1, fillMode, verticesStart, verticesCount, instancesCount);
    }
    //------------------------------------------------------------------------------
    //                              Dispose
    //------------------------------------------------------------------------------
    /**
     * Dispose and release all associated resources
     */
    dispose() {
        this._isDisposed = true;
        this._timestampQuery.dispose();
        this._mainTexture?.destroy();
        this._depthTexture?.destroy();
        this._textureHelper.destroyDeferredTextures();
        this._bufferManager.destroyDeferredBuffers();
        this._device.destroy();
        _CommonDispose(this, this._renderingCanvas);
        super.dispose();
    }
    //------------------------------------------------------------------------------
    //                              Misc
    //------------------------------------------------------------------------------
    /**
     * Gets the current render width
     * @param useScreen defines if screen size must be used (or the current render target if any)
     * @returns a number defining the current render width
     */
    getRenderWidth(useScreen = false) {
        if (!useScreen && this._currentRenderTarget) {
            return this._currentRenderTarget.width;
        }
        return this._renderingCanvas?.width ?? 0;
    }
    /**
     * Gets the current render height
     * @param useScreen defines if screen size must be used (or the current render target if any)
     * @returns a number defining the current render height
     */
    getRenderHeight(useScreen = false) {
        if (!useScreen && this._currentRenderTarget) {
            return this._currentRenderTarget.height;
        }
        return this._renderingCanvas?.height ?? 0;
    }
    //------------------------------------------------------------------------------
    //                              Errors
    //------------------------------------------------------------------------------
    /**
     * Get the current error code of the WebGPU context
     * @returns the error code
     */
    getError() {
        // TODO WEBGPU. from the webgpu errors.
        return 0;
    }
    //------------------------------------------------------------------------------
    //                              External Textures
    //------------------------------------------------------------------------------
    /**
     * Creates an external texture
     * @param video video element
     * @returns the external texture, or null if external textures are not supported by the engine
     */
    createExternalTexture(video) {
        const texture = new WebGPUExternalTexture(video);
        return texture;
    }
    /**
     * Sets an internal texture to the according uniform.
     * @param name The name of the uniform in the effect
     * @param texture The texture to apply
     */
    setExternalTexture(name, texture) {
        if (!texture) {
            this._currentMaterialContext.setTexture(name, null);
            return;
        }
        this._setInternalTexture(name, texture);
    }
    //------------------------------------------------------------------------------
    //                              Samplers
    //------------------------------------------------------------------------------
    /**
     * Sets a texture sampler to the according uniform.
     * @param name The name of the uniform in the effect
     * @param sampler The sampler to apply
     */
    setTextureSampler(name, sampler) {
        this._currentMaterialContext?.setSampler(name, sampler);
    }
    //------------------------------------------------------------------------------
    //                              Storage Buffers
    //------------------------------------------------------------------------------
    /**
     * Creates a storage buffer
     * @param data the data for the storage buffer or the size of the buffer
     * @param creationFlags flags to use when creating the buffer (see undefined). The BUFFER_CREATIONFLAG_STORAGE flag will be automatically added
     * @param label defines the label of the buffer (for debug purpose)
     * @returns the new buffer
     */
    createStorageBuffer(data, creationFlags, label) {
        return this._createBuffer(data, creationFlags | 32, label);
    }
    /**
     * Updates a storage buffer
     * @param buffer the storage buffer to update
     * @param data the data used to update the storage buffer
     * @param byteOffset the byte offset of the data
     * @param byteLength the byte length of the data
     */
    updateStorageBuffer(buffer, data, byteOffset, byteLength) {
        const dataBuffer = buffer;
        if (byteOffset === undefined) {
            byteOffset = 0;
        }
        let view;
        if (byteLength === undefined) {
            if (data instanceof Array) {
                view = new Float32Array(data);
            }
            else if (data instanceof ArrayBuffer) {
                view = new Uint8Array(data);
            }
            else {
                view = data;
            }
            byteLength = view.byteLength;
        }
        else {
            if (data instanceof Array) {
                view = new Float32Array(data);
            }
            else if (data instanceof ArrayBuffer) {
                view = new Uint8Array(data);
            }
            else {
                view = data;
            }
        }
        this._bufferManager.setSubData(dataBuffer, byteOffset, view, 0, byteLength);
    }
    /**
     * Read data from a storage buffer
     * @param storageBuffer The storage buffer to read from
     * @param offset The offset in the storage buffer to start reading from (default: 0)
     * @param size  The number of bytes to read from the storage buffer (default: capacity of the buffer)
     * @param buffer The buffer to write the data we have read from the storage buffer to (optional)
     * @param noDelay If true, a call to flushFramebuffer will be issued so that the data can be read back immediately and not in engine.onEndFrameObservable. This can speed up data retrieval, at the cost of a small perf penalty (default: false).
     * @returns If not undefined, returns the (promise) buffer (as provided by the 4th parameter) filled with the data, else it returns a (promise) Uint8Array with the data read from the storage buffer
     */
    readFromStorageBuffer(storageBuffer, offset, size, buffer, noDelay) {
        size = size || storageBuffer.capacity;
        const gpuBuffer = this._bufferManager.createRawBuffer(size, WebGPUConstants.BufferUsage.MapRead | WebGPUConstants.BufferUsage.CopyDst, undefined, "TempReadFromStorageBuffer");
        this._renderEncoder.copyBufferToBuffer(storageBuffer.underlyingResource, offset ?? 0, gpuBuffer, 0, size);
        return new Promise((resolve, reject) => {
            const readFromBuffer = () => {
                gpuBuffer.mapAsync(WebGPUConstants.MapMode.Read, 0, size).then(() => {
                    const copyArrayBuffer = gpuBuffer.getMappedRange(0, size);
                    let data = buffer;
                    if (data === undefined) {
                        data = new Uint8Array(size);
                        data.set(new Uint8Array(copyArrayBuffer));
                    }
                    else {
                        const ctor = data.constructor; // we want to create result data with the same type as buffer (Uint8Array, Float32Array, ...)
                        data = new ctor(data.buffer);
                        data.set(new ctor(copyArrayBuffer));
                    }
                    gpuBuffer.unmap();
                    this._bufferManager.releaseBuffer(gpuBuffer);
                    resolve(data);
                }, (reason) => {
                    if (this.isDisposed) {
                        resolve(new Uint8Array());
                    }
                    else {
                        reject(reason);
                    }
                });
            };
            if (noDelay) {
                this.flushFramebuffer();
                readFromBuffer();
            }
            else {
                // we are using onEndFrameObservable because we need to map the gpuBuffer AFTER the command buffers
                // have been submitted, else we get the error: "Buffer used in a submit while mapped"
                this.onEndFrameObservable.addOnce(() => {
                    readFromBuffer();
                });
            }
        });
    }
    /**
     * Sets a storage buffer in the shader
     * @param name Defines the name of the storage buffer as defined in the shader
     * @param buffer Defines the value to give to the uniform
     */
    setStorageBuffer(name, buffer) {
        this._currentDrawContext?.setBuffer(name, buffer?.getBuffer() ?? null);
    }
}
// Default glslang options.
WebGPUEngine._GLSLslangDefaultOptions = {
    jsPath: `${Tools._DefaultCdnUrl}/glslang/glslang.js`,
    wasmPath: `${Tools._DefaultCdnUrl}/glslang/glslang.wasm`,
};
WebGPUEngine._InstanceId = 0;
/** true to enable using TintWASM to convert Spir-V to WGSL */
WebGPUEngine.UseTWGSL = true;
//# sourceMappingURL=webgpuEngine.js.map