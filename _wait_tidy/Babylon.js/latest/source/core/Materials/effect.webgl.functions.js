import { _processShaderCode, createAndPreparePipelineContext } from "./effect.functions.js";
import { _executeWhenRenderingStateIsCompiled, _preparePipelineContext, createPipelineContext, getStateObject } from "../Engines/thinEngine.functions.js";
import { ShaderLanguage } from "./shaderLanguage.js";
import { _getGlobalDefines } from "../Engines/abstractEngine.functions.js";
import { ShaderStore } from "../Engines/shaderStore.js";
/**
 * Generate a pipeline context from the provided options
 * Note - at the moment only WebGL is supported
 * @param options the options to be used when generating the pipeline
 * @param context the context to be used when creating the pipeline
 * @param createPipelineContextInjection the function to create the pipeline context
 * @param _preparePipelineContextInjection the function to prepare the pipeline context
 * @returns a promise that resolves to the pipeline context
 */
export async function generatePipelineContext(options, context, createPipelineContextInjection = createPipelineContext.bind(null, context), _preparePipelineContextInjection = _preparePipelineContext) {
    // make sure the state object exists
    getStateObject(context);
    const platformName = options.platformName || "WEBGL2";
    let processor = options.extendedProcessingOptions?.processor;
    const language = options.shaderLanguage || ShaderLanguage.GLSL;
    // auto-populate the processor if not provided
    // Note - async but can be synchronous if we load all dependencies at the start
    if (!processor) {
        switch (platformName) {
            case "WEBGL1":
                processor = new (await import("../Engines/WebGL/webGLShaderProcessors.js")).WebGLShaderProcessor();
                break;
            case "WEBGL2":
            default:
                processor = new (await import("../Engines/WebGL/webGL2ShaderProcessors.js")).WebGL2ShaderProcessor();
                break;
        }
    }
    const shaderDef = options.shaderNameOrContent;
    const vertex = shaderDef.vertex || shaderDef.vertexSource || shaderDef;
    const fragment = shaderDef.fragment || shaderDef.fragmentSource || shaderDef;
    const globalDefines = _getGlobalDefines()?.split("\n") || [];
    const defines = [...(options.defines || []), ...(options.addGlobalDefines ? globalDefines : [])];
    const key = options.key?.replace(/\r/g, "").replace(/\n/g, "|") || vertex + "+" + fragment + "@" + defines.join("|");
    // defaults, extended with optionally provided options
    const processorOptions = {
        defines,
        indexParameters: undefined,
        isFragment: false,
        shouldUseHighPrecisionShader: true,
        processor,
        supportsUniformBuffers: false,
        shadersRepository: ShaderStore.GetShadersRepository(language),
        includesShadersStore: ShaderStore.GetIncludesShadersStore(language),
        version: platformName === "WEBGL2" ? "200" : "100",
        platformName,
        processingContext: null,
        isNDCHalfZRange: false,
        useReverseDepthBuffer: false,
        ...options.extendedProcessingOptions,
    };
    return new Promise((resolve, reject) => {
        try {
            _processShaderCode(processorOptions, shaderDef, undefined, function (vertexCode, fragmentCode) {
                try {
                    const pipeline = createAndPreparePipelineContext({
                        name: key,
                        vertex: vertexCode,
                        fragment: fragmentCode,
                        context,
                        defines: defines.length ? defines.join("\n") : null,
                        shaderProcessingContext: options.extendedProcessingOptions?.processingContext || null,
                        transformFeedbackVaryings: null,
                        ...options.extendedCreatePipelineOptions,
                    }, createPipelineContextInjection, _preparePipelineContext, _executeWhenRenderingStateIsCompiled);
                    resolve(pipeline);
                }
                catch (e) {
                    reject(e);
                }
            }, language);
        }
        catch (e) {
            reject(e);
        }
    });
}
//# sourceMappingURL=effect.webgl.functions.js.map