import { SerializationHelper } from "../Misc/decorators.serialization.js";
import { Scene } from "../scene.js";
import { Matrix, Vector3, Vector2, Vector4, Quaternion } from "../Maths/math.vector.js";
import { VertexBuffer } from "../Buffers/buffer.js";
import { Texture } from "../Materials/Textures/texture.js";
import { RegisterClass } from "../Misc/typeStore.js";
import { Color3, Color4 } from "../Maths/math.color.js";
import { EffectFallbacks } from "./effectFallbacks.js";
import { WebRequest } from "../Misc/webRequest.js";
import { PushMaterial } from "./pushMaterial.js";
import { EngineStore } from "../Engines/engineStore.js";

import { addClipPlaneUniforms, bindClipPlane, prepareStringDefinesForClipPlanes } from "./clipPlaneMaterialHelper.js";
import { BindBonesParameters, BindFogParameters, BindLogDepth, BindMorphTargetParameters, BindSceneUniformBuffer, PrepareAttributesForBakedVertexAnimation, PushAttributesForInstances, } from "./materialHelper.functions.js";
const onCreatedEffectParameters = { effect: null, subMesh: null };
/**
 * The ShaderMaterial object has the necessary methods to pass data from your scene to the Vertex and Fragment Shaders and returns a material that can be applied to any mesh.
 *
 * This returned material effects how the mesh will look based on the code in the shaders.
 *
 * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/shaders/shaderMaterial
 */
export class ShaderMaterial extends PushMaterial {
    /**
     * Instantiate a new shader material.
     * The ShaderMaterial object has the necessary methods to pass data from your scene to the Vertex and Fragment Shaders and returns a material that can be applied to any mesh.
     * This returned material effects how the mesh will look based on the code in the shaders.
     * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/shaders/shaderMaterial
     * @param name Define the name of the material in the scene
     * @param scene Define the scene the material belongs to
     * @param shaderPath Defines  the route to the shader code.
     * @param options Define the options used to create the shader
     * @param storeEffectOnSubMeshes true to store effect on submeshes, false to store the effect directly in the material class.
     */
    constructor(name, scene, shaderPath, options = {}, storeEffectOnSubMeshes = true) {
        super(name, scene, storeEffectOnSubMeshes);
        this._textures = {};
        this._textureArrays = {};
        this._externalTextures = {};
        this._floats = {};
        this._ints = {};
        this._uints = {};
        this._floatsArrays = {};
        this._colors3 = {};
        this._colors3Arrays = {};
        this._colors4 = {};
        this._colors4Arrays = {};
        this._vectors2 = {};
        this._vectors3 = {};
        this._vectors4 = {};
        this._quaternions = {};
        this._quaternionsArrays = {};
        this._matrices = {};
        this._matrixArrays = {};
        this._matrices3x3 = {};
        this._matrices2x2 = {};
        this._vectors2Arrays = {};
        this._vectors3Arrays = {};
        this._vectors4Arrays = {};
        this._uniformBuffers = {};
        this._textureSamplers = {};
        this._storageBuffers = {};
        this._cachedWorldViewMatrix = new Matrix();
        this._cachedWorldViewProjectionMatrix = new Matrix();
        this._multiview = false;
        /**
         * @internal
         */
        this._materialHelperNeedsPreviousMatrices = false;
        this._shaderPath = shaderPath;
        this._options = {
            needAlphaBlending: false,
            needAlphaTesting: false,
            attributes: ["position", "normal", "uv"],
            uniforms: ["worldViewProjection"],
            uniformBuffers: [],
            samplers: [],
            externalTextures: [],
            samplerObjects: [],
            storageBuffers: [],
            defines: [],
            useClipPlane: false,
            ...options,
        };
    }
    /**
     * Gets the shader path used to define the shader code
     * It can be modified to trigger a new compilation
     */
    get shaderPath() {
        return this._shaderPath;
    }
    /**
     * Sets the shader path used to define the shader code
     * It can be modified to trigger a new compilation
     */
    set shaderPath(shaderPath) {
        this._shaderPath = shaderPath;
    }
    /**
     * Gets the options used to compile the shader.
     * They can be modified to trigger a new compilation
     */
    get options() {
        return this._options;
    }
    /**
     * is multiview set to true?
     */
    get isMultiview() {
        return this._multiview;
    }
    /**
     * Gets the current class name of the material e.g. "ShaderMaterial"
     * Mainly use in serialization.
     * @returns the class name
     */
    getClassName() {
        return "ShaderMaterial";
    }
    /**
     * Specifies if the material will require alpha blending
     * @returns a boolean specifying if alpha blending is needed
     */
    needAlphaBlending() {
        return this.alpha < 1.0 || this._options.needAlphaBlending;
    }
    /**
     * Specifies if this material should be rendered in alpha test mode
     * @returns a boolean specifying if an alpha test is needed.
     */
    needAlphaTesting() {
        return this._options.needAlphaTesting;
    }
    _checkUniform(uniformName) {
        if (this._options.uniforms.indexOf(uniformName) === -1) {
            this._options.uniforms.push(uniformName);
        }
    }
    /**
     * Set a texture in the shader.
     * @param name Define the name of the uniform samplers as defined in the shader
     * @param texture Define the texture to bind to this sampler
     * @returns the material itself allowing "fluent" like uniform updates
     */
    setTexture(name, texture) {
        if (this._options.samplers.indexOf(name) === -1) {
            this._options.samplers.push(name);
        }
        this._textures[name] = texture;
        return this;
    }
    /**
     * Set a texture array in the shader.
     * @param name Define the name of the uniform sampler array as defined in the shader
     * @param textures Define the list of textures to bind to this sampler
     * @returns the material itself allowing "fluent" like uniform updates
     */
    setTextureArray(name, textures) {
        if (this._options.samplers.indexOf(name) === -1) {
            this._options.samplers.push(name);
        }
        this._checkUniform(name);
        this._textureArrays[name] = textures;
        return this;
    }
    /**
     * Set an internal texture in the shader.
     * @param name Define the name of the uniform samplers as defined in the shader
     * @param texture Define the texture to bind to this sampler
     * @returns the material itself allowing "fluent" like uniform updates
     */
    setExternalTexture(name, texture) {
        if (this._options.externalTextures.indexOf(name) === -1) {
            this._options.externalTextures.push(name);
        }
        this._externalTextures[name] = texture;
        return this;
    }
    /**
     * Set a float in the shader.
     * @param name Define the name of the uniform as defined in the shader
     * @param value Define the value to give to the uniform
     * @returns the material itself allowing "fluent" like uniform updates
     */
    setFloat(name, value) {
        this._checkUniform(name);
        this._floats[name] = value;
        return this;
    }
    /**
     * Set a int in the shader.
     * @param name Define the name of the uniform as defined in the shader
     * @param value Define the value to give to the uniform
     * @returns the material itself allowing "fluent" like uniform updates
     */
    setInt(name, value) {
        this._checkUniform(name);
        this._ints[name] = value;
        return this;
    }
    /**
     * Set a unsigned int in the shader.
     * @param name Define the name of the uniform as defined in the shader
     * @param value Define the value to give to the uniform
     * @returns the material itself allowing "fluent" like uniform updates
     */
    setUInt(name, value) {
        this._checkUniform(name);
        this._uints[name] = value;
        return this;
    }
    /**
     * Set an array of floats in the shader.
     * @param name Define the name of the uniform as defined in the shader
     * @param value Define the value to give to the uniform
     * @returns the material itself allowing "fluent" like uniform updates
     */
    setFloats(name, value) {
        this._checkUniform(name);
        this._floatsArrays[name] = value;
        return this;
    }
    /**
     * Set a vec3 in the shader from a Color3.
     * @param name Define the name of the uniform as defined in the shader
     * @param value Define the value to give to the uniform
     * @returns the material itself allowing "fluent" like uniform updates
     */
    setColor3(name, value) {
        this._checkUniform(name);
        this._colors3[name] = value;
        return this;
    }
    /**
     * Set a vec3 array in the shader from a Color3 array.
     * @param name Define the name of the uniform as defined in the shader
     * @param value Define the value to give to the uniform
     * @returns the material itself allowing "fluent" like uniform updates
     */
    setColor3Array(name, value) {
        this._checkUniform(name);
        this._colors3Arrays[name] = value.reduce((arr, color) => {
            color.toArray(arr, arr.length);
            return arr;
        }, []);
        return this;
    }
    /**
     * Set a vec4 in the shader from a Color4.
     * @param name Define the name of the uniform as defined in the shader
     * @param value Define the value to give to the uniform
     * @returns the material itself allowing "fluent" like uniform updates
     */
    setColor4(name, value) {
        this._checkUniform(name);
        this._colors4[name] = value;
        return this;
    }
    /**
     * Set a vec4 array in the shader from a Color4 array.
     * @param name Define the name of the uniform as defined in the shader
     * @param value Define the value to give to the uniform
     * @returns the material itself allowing "fluent" like uniform updates
     */
    setColor4Array(name, value) {
        this._checkUniform(name);
        this._colors4Arrays[name] = value.reduce((arr, color) => {
            color.toArray(arr, arr.length);
            return arr;
        }, []);
        return this;
    }
    /**
     * Set a vec2 in the shader from a Vector2.
     * @param name Define the name of the uniform as defined in the shader
     * @param value Define the value to give to the uniform
     * @returns the material itself allowing "fluent" like uniform updates
     */
    setVector2(name, value) {
        this._checkUniform(name);
        this._vectors2[name] = value;
        return this;
    }
    /**
     * Set a vec3 in the shader from a Vector3.
     * @param name Define the name of the uniform as defined in the shader
     * @param value Define the value to give to the uniform
     * @returns the material itself allowing "fluent" like uniform updates
     */
    setVector3(name, value) {
        this._checkUniform(name);
        this._vectors3[name] = value;
        return this;
    }
    /**
     * Set a vec4 in the shader from a Vector4.
     * @param name Define the name of the uniform as defined in the shader
     * @param value Define the value to give to the uniform
     * @returns the material itself allowing "fluent" like uniform updates
     */
    setVector4(name, value) {
        this._checkUniform(name);
        this._vectors4[name] = value;
        return this;
    }
    /**
     * Set a vec4 in the shader from a Quaternion.
     * @param name Define the name of the uniform as defined in the shader
     * @param value Define the value to give to the uniform
     * @returns the material itself allowing "fluent" like uniform updates
     */
    setQuaternion(name, value) {
        this._checkUniform(name);
        this._quaternions[name] = value;
        return this;
    }
    /**
     * Set a vec4 array in the shader from a Quaternion array.
     * @param name Define the name of the uniform as defined in the shader
     * @param value Define the value to give to the uniform
     * @returns the material itself allowing "fluent" like uniform updates
     */
    setQuaternionArray(name, value) {
        this._checkUniform(name);
        this._quaternionsArrays[name] = value.reduce((arr, quaternion) => {
            quaternion.toArray(arr, arr.length);
            return arr;
        }, []);
        return this;
    }
    /**
     * Set a mat4 in the shader from a Matrix.
     * @param name Define the name of the uniform as defined in the shader
     * @param value Define the value to give to the uniform
     * @returns the material itself allowing "fluent" like uniform updates
     */
    setMatrix(name, value) {
        this._checkUniform(name);
        this._matrices[name] = value;
        return this;
    }
    /**
     * Set a float32Array in the shader from a matrix array.
     * @param name Define the name of the uniform as defined in the shader
     * @param value Define the value to give to the uniform
     * @returns the material itself allowing "fluent" like uniform updates
     */
    setMatrices(name, value) {
        this._checkUniform(name);
        const float32Array = new Float32Array(value.length * 16);
        for (let index = 0; index < value.length; index++) {
            const matrix = value[index];
            matrix.copyToArray(float32Array, index * 16);
        }
        this._matrixArrays[name] = float32Array;
        return this;
    }
    /**
     * Set a mat3 in the shader from a Float32Array.
     * @param name Define the name of the uniform as defined in the shader
     * @param value Define the value to give to the uniform
     * @returns the material itself allowing "fluent" like uniform updates
     */
    setMatrix3x3(name, value) {
        this._checkUniform(name);
        this._matrices3x3[name] = value;
        return this;
    }
    /**
     * Set a mat2 in the shader from a Float32Array.
     * @param name Define the name of the uniform as defined in the shader
     * @param value Define the value to give to the uniform
     * @returns the material itself allowing "fluent" like uniform updates
     */
    setMatrix2x2(name, value) {
        this._checkUniform(name);
        this._matrices2x2[name] = value;
        return this;
    }
    /**
     * Set a vec2 array in the shader from a number array.
     * @param name Define the name of the uniform as defined in the shader
     * @param value Define the value to give to the uniform
     * @returns the material itself allowing "fluent" like uniform updates
     */
    setArray2(name, value) {
        this._checkUniform(name);
        this._vectors2Arrays[name] = value;
        return this;
    }
    /**
     * Set a vec3 array in the shader from a number array.
     * @param name Define the name of the uniform as defined in the shader
     * @param value Define the value to give to the uniform
     * @returns the material itself allowing "fluent" like uniform updates
     */
    setArray3(name, value) {
        this._checkUniform(name);
        this._vectors3Arrays[name] = value;
        return this;
    }
    /**
     * Set a vec4 array in the shader from a number array.
     * @param name Define the name of the uniform as defined in the shader
     * @param value Define the value to give to the uniform
     * @returns the material itself allowing "fluent" like uniform updates
     */
    setArray4(name, value) {
        this._checkUniform(name);
        this._vectors4Arrays[name] = value;
        return this;
    }
    /**
     * Set a uniform buffer in the shader
     * @param name Define the name of the uniform as defined in the shader
     * @param buffer Define the value to give to the uniform
     * @returns the material itself allowing "fluent" like uniform updates
     */
    setUniformBuffer(name, buffer) {
        if (this._options.uniformBuffers.indexOf(name) === -1) {
            this._options.uniformBuffers.push(name);
        }
        this._uniformBuffers[name] = buffer;
        return this;
    }
    /**
     * Set a texture sampler in the shader
     * @param name Define the name of the uniform as defined in the shader
     * @param sampler Define the value to give to the uniform
     * @returns the material itself allowing "fluent" like uniform updates
     */
    setTextureSampler(name, sampler) {
        if (this._options.samplerObjects.indexOf(name) === -1) {
            this._options.samplerObjects.push(name);
        }
        this._textureSamplers[name] = sampler;
        return this;
    }
    /**
     * Set a storage buffer in the shader
     * @param name Define the name of the storage buffer as defined in the shader
     * @param buffer Define the value to give to the uniform
     * @returns the material itself allowing "fluent" like uniform updates
     */
    setStorageBuffer(name, buffer) {
        if (this._options.storageBuffers.indexOf(name) === -1) {
            this._options.storageBuffers.push(name);
        }
        this._storageBuffers[name] = buffer;
        return this;
    }
    /**
     * Adds, removes, or replaces the specified shader define and value.
     * * setDefine("MY_DEFINE", true); // enables a boolean define
     * * setDefine("MY_DEFINE", "0.5"); // adds "#define MY_DEFINE 0.5" to the shader (or sets and replaces the value of any existing define with that name)
     * * setDefine("MY_DEFINE", false); // disables and removes the define
     * Note if the active defines do change, the shader will be recompiled and this can be expensive.
     * @param define the define name e.g., "OUTPUT_TO_SRGB" or "#define OUTPUT_TO_SRGB". If the define was passed into the constructor already, the version used should match that, and in either case, it should not include any appended value.
     * @param value either the value of the define (e.g. a numerical value) or for booleans, true if the define should be enabled or false if it should be disabled
     * @returns the material itself allowing "fluent" like uniform updates
     */
    setDefine(define, value) {
        // First remove any existing define with this name.
        const defineName = define.trimEnd() + " ";
        const existingDefineIdx = this.options.defines.findIndex((x) => x === define || x.startsWith(defineName));
        if (existingDefineIdx >= 0) {
            this.options.defines.splice(existingDefineIdx, 1);
        }
        // Then add the new define value. (If it's a boolean value and false, don't add it.)
        if (typeof value !== "boolean" || value) {
            this.options.defines.push(defineName + value);
        }
        return this;
    }
    /**
     * Specifies that the submesh is ready to be used
     * @param mesh defines the mesh to check
     * @param subMesh defines which submesh to check
     * @param useInstances specifies that instances should be used
     * @returns a boolean indicating that the submesh is ready or not
     */
    isReadyForSubMesh(mesh, subMesh, useInstances) {
        return this.isReady(mesh, useInstances, subMesh);
    }
    /**
     * Checks if the material is ready to render the requested mesh
     * @param mesh Define the mesh to render
     * @param useInstances Define whether or not the material is used with instances
     * @param subMesh defines which submesh to render
     * @returns true if ready, otherwise false
     */
    isReady(mesh, useInstances, subMesh) {
        const storeEffectOnSubMeshes = subMesh && this._storeEffectOnSubMeshes;
        if (this.isFrozen) {
            const drawWrapper = storeEffectOnSubMeshes ? subMesh._drawWrapper : this._drawWrapper;
            if (drawWrapper.effect && drawWrapper._wasPreviouslyReady && drawWrapper._wasPreviouslyUsingInstances === useInstances) {
                return true;
            }
        }
        const scene = this.getScene();
        const engine = scene.getEngine();
        // Instances
        const defines = [];
        const attribs = [];
        const fallbacks = new EffectFallbacks();
        let shaderName = this._shaderPath, uniforms = this._options.uniforms, uniformBuffers = this._options.uniformBuffers, samplers = this._options.samplers;
        // global multiview
        if (engine.getCaps().multiview && scene.activeCamera && scene.activeCamera.outputRenderTarget && scene.activeCamera.outputRenderTarget.getViewCount() > 1) {
            this._multiview = true;
            defines.push("#define MULTIVIEW");
            if (uniforms.indexOf("viewProjection") !== -1 && uniforms.indexOf("viewProjectionR") === -1) {
                uniforms.push("viewProjectionR");
            }
        }
        for (let index = 0; index < this._options.defines.length; index++) {
            const defineToAdd = this._options.defines[index].indexOf("#define") === 0 ? this._options.defines[index] : `#define ${this._options.defines[index]}`;
            defines.push(defineToAdd);
        }
        for (let index = 0; index < this._options.attributes.length; index++) {
            attribs.push(this._options.attributes[index]);
        }
        if (mesh && mesh.isVerticesDataPresent(VertexBuffer.ColorKind)) {
            if (attribs.indexOf(VertexBuffer.ColorKind) === -1) {
                attribs.push(VertexBuffer.ColorKind);
            }
            defines.push("#define VERTEXCOLOR");
        }
        if (useInstances) {
            defines.push("#define INSTANCES");
            PushAttributesForInstances(attribs, this._materialHelperNeedsPreviousMatrices);
            if (mesh?.hasThinInstances) {
                defines.push("#define THIN_INSTANCES");
                if (mesh && mesh.isVerticesDataPresent(VertexBuffer.ColorInstanceKind)) {
                    attribs.push(VertexBuffer.ColorInstanceKind);
                    defines.push("#define INSTANCESCOLOR");
                }
            }
        }
        // Bones
        if (mesh && mesh.useBones && mesh.computeBonesUsingShaders && mesh.skeleton) {
            attribs.push(VertexBuffer.MatricesIndicesKind);
            attribs.push(VertexBuffer.MatricesWeightsKind);
            if (mesh.numBoneInfluencers > 4) {
                attribs.push(VertexBuffer.MatricesIndicesExtraKind);
                attribs.push(VertexBuffer.MatricesWeightsExtraKind);
            }
            const skeleton = mesh.skeleton;
            defines.push("#define NUM_BONE_INFLUENCERS " + mesh.numBoneInfluencers);
            fallbacks.addCPUSkinningFallback(0, mesh);
            if (skeleton.isUsingTextureForMatrices) {
                defines.push("#define BONETEXTURE");
                if (uniforms.indexOf("boneTextureWidth") === -1) {
                    uniforms.push("boneTextureWidth");
                }
                if (this._options.samplers.indexOf("boneSampler") === -1) {
                    this._options.samplers.push("boneSampler");
                }
            }
            else {
                defines.push("#define BonesPerMesh " + (skeleton.bones.length + 1));
                if (uniforms.indexOf("mBones") === -1) {
                    uniforms.push("mBones");
                }
            }
        }
        else {
            defines.push("#define NUM_BONE_INFLUENCERS 0");
        }
        // Morph
        let numInfluencers = 0;
        const manager = mesh ? mesh.morphTargetManager : null;
        if (manager) {
            const uv = manager.supportsUVs && defines.indexOf("#define UV1") !== -1;
            const tangent = manager.supportsTangents && defines.indexOf("#define TANGENT") !== -1;
            const normal = manager.supportsNormals && defines.indexOf("#define NORMAL") !== -1;
            numInfluencers = manager.numMaxInfluencers || manager.numInfluencers;
            if (uv) {
                defines.push("#define MORPHTARGETS_UV");
            }
            if (tangent) {
                defines.push("#define MORPHTARGETS_TANGENT");
            }
            if (normal) {
                defines.push("#define MORPHTARGETS_NORMAL");
            }
            if (numInfluencers > 0) {
                defines.push("#define MORPHTARGETS");
            }
            if (manager.isUsingTextureForTargets) {
                defines.push("#define MORPHTARGETS_TEXTURE");
                if (uniforms.indexOf("morphTargetTextureIndices") === -1) {
                    uniforms.push("morphTargetTextureIndices");
                }
                if (this._options.samplers.indexOf("morphTargets") === -1) {
                    this._options.samplers.push("morphTargets");
                }
            }
            defines.push("#define NUM_MORPH_INFLUENCERS " + numInfluencers);
            for (let index = 0; index < numInfluencers; index++) {
                attribs.push(VertexBuffer.PositionKind + index);
                if (normal) {
                    attribs.push(VertexBuffer.NormalKind + index);
                }
                if (tangent) {
                    attribs.push(VertexBuffer.TangentKind + index);
                }
                if (uv) {
                    attribs.push(VertexBuffer.UVKind + "_" + index);
                }
            }
            if (numInfluencers > 0) {
                uniforms = uniforms.slice();
                uniforms.push("morphTargetInfluences");
                uniforms.push("morphTargetCount");
                uniforms.push("morphTargetTextureInfo");
                uniforms.push("morphTargetTextureIndices");
            }
        }
        else {
            defines.push("#define NUM_MORPH_INFLUENCERS 0");
        }
        // Baked Vertex Animation
        if (mesh) {
            const bvaManager = mesh.bakedVertexAnimationManager;
            if (bvaManager && bvaManager.isEnabled) {
                defines.push("#define BAKED_VERTEX_ANIMATION_TEXTURE");
                if (uniforms.indexOf("bakedVertexAnimationSettings") === -1) {
                    uniforms.push("bakedVertexAnimationSettings");
                }
                if (uniforms.indexOf("bakedVertexAnimationTextureSizeInverted") === -1) {
                    uniforms.push("bakedVertexAnimationTextureSizeInverted");
                }
                if (uniforms.indexOf("bakedVertexAnimationTime") === -1) {
                    uniforms.push("bakedVertexAnimationTime");
                }
                if (this._options.samplers.indexOf("bakedVertexAnimationTexture") === -1) {
                    this._options.samplers.push("bakedVertexAnimationTexture");
                }
            }
            PrepareAttributesForBakedVertexAnimation(attribs, mesh, defines);
        }
        // Textures
        for (const name in this._textures) {
            if (!this._textures[name].isReady()) {
                return false;
            }
        }
        // Alpha test
        if (mesh && this._shouldTurnAlphaTestOn(mesh)) {
            defines.push("#define ALPHATEST");
        }
        // Clip planes
        if (this._options.useClipPlane !== false) {
            addClipPlaneUniforms(uniforms);
            prepareStringDefinesForClipPlanes(this, scene, defines);
        }
        // Fog
        if (scene.fogEnabled && mesh?.applyFog && scene.fogMode !== Scene.FOGMODE_NONE) {
            defines.push("#define FOG");
            if (uniforms.indexOf("view") === -1) {
                uniforms.push("view");
            }
            if (uniforms.indexOf("vFogInfos") === -1) {
                uniforms.push("vFogInfos");
            }
            if (uniforms.indexOf("vFogColor") === -1) {
                uniforms.push("vFogColor");
            }
        }
        // Misc
        if (this._useLogarithmicDepth) {
            defines.push("#define LOGARITHMICDEPTH");
            if (uniforms.indexOf("logarithmicDepthConstant") === -1) {
                uniforms.push("logarithmicDepthConstant");
            }
        }
        if (this.customShaderNameResolve) {
            uniforms = uniforms.slice();
            uniformBuffers = uniformBuffers.slice();
            samplers = samplers.slice();
            shaderName = this.customShaderNameResolve(this.name, uniforms, uniformBuffers, samplers, defines, attribs);
        }
        const drawWrapper = storeEffectOnSubMeshes ? subMesh._getDrawWrapper(undefined, true) : this._drawWrapper;
        const previousEffect = drawWrapper?.effect ?? null;
        const previousDefines = drawWrapper?.defines ?? null;
        const join = defines.join("\n");
        let effect = previousEffect;
        if (previousDefines !== join) {
            effect = engine.createEffect(shaderName, {
                attributes: attribs,
                uniformsNames: uniforms,
                uniformBuffersNames: uniformBuffers,
                samplers: samplers,
                defines: join,
                fallbacks: fallbacks,
                onCompiled: this.onCompiled,
                onError: this.onError,
                indexParameters: { maxSimultaneousMorphTargets: numInfluencers },
                shaderLanguage: this._options.shaderLanguage,
            }, engine);
            if (storeEffectOnSubMeshes) {
                subMesh.setEffect(effect, join, this._materialContext);
            }
            else if (drawWrapper) {
                drawWrapper.setEffect(effect, join);
            }
            if (this._onEffectCreatedObservable) {
                onCreatedEffectParameters.effect = effect;
                onCreatedEffectParameters.subMesh = subMesh ?? mesh?.subMeshes[0] ?? null;
                this._onEffectCreatedObservable.notifyObservers(onCreatedEffectParameters);
            }
        }
        drawWrapper._wasPreviouslyUsingInstances = !!useInstances;
        if (!effect?.isReady() ?? true) {
            return false;
        }
        if (previousEffect !== effect) {
            scene.resetCachedMaterial();
        }
        drawWrapper._wasPreviouslyReady = true;
        return true;
    }
    /**
     * Binds the world matrix to the material
     * @param world defines the world transformation matrix
     * @param effectOverride - If provided, use this effect instead of internal effect
     */
    bindOnlyWorldMatrix(world, effectOverride) {
        const scene = this.getScene();
        const effect = effectOverride ?? this.getEffect();
        if (!effect) {
            return;
        }
        if (this._options.uniforms.indexOf("world") !== -1) {
            effect.setMatrix("world", world);
        }
        if (this._options.uniforms.indexOf("worldView") !== -1) {
            world.multiplyToRef(scene.getViewMatrix(), this._cachedWorldViewMatrix);
            effect.setMatrix("worldView", this._cachedWorldViewMatrix);
        }
        if (this._options.uniforms.indexOf("worldViewProjection") !== -1) {
            world.multiplyToRef(scene.getTransformMatrix(), this._cachedWorldViewProjectionMatrix);
            effect.setMatrix("worldViewProjection", this._cachedWorldViewProjectionMatrix);
        }
        if (this._options.uniforms.indexOf("view") !== -1) {
            effect.setMatrix("view", scene.getViewMatrix());
        }
    }
    /**
     * Binds the submesh to this material by preparing the effect and shader to draw
     * @param world defines the world transformation matrix
     * @param mesh defines the mesh containing the submesh
     * @param subMesh defines the submesh to bind the material to
     */
    bindForSubMesh(world, mesh, subMesh) {
        this.bind(world, mesh, subMesh._drawWrapperOverride?.effect, subMesh);
    }
    /**
     * Binds the material to the mesh
     * @param world defines the world transformation matrix
     * @param mesh defines the mesh to bind the material to
     * @param effectOverride - If provided, use this effect instead of internal effect
     * @param subMesh defines the submesh to bind the material to
     */
    bind(world, mesh, effectOverride, subMesh) {
        // Std values
        const storeEffectOnSubMeshes = subMesh && this._storeEffectOnSubMeshes;
        const effect = effectOverride ?? (storeEffectOnSubMeshes ? subMesh.effect : this.getEffect());
        if (!effect) {
            return;
        }
        const scene = this.getScene();
        this._activeEffect = effect;
        this.bindOnlyWorldMatrix(world, effectOverride);
        const uniformBuffers = this._options.uniformBuffers;
        let useSceneUBO = false;
        if (effect && uniformBuffers && uniformBuffers.length > 0 && scene.getEngine().supportsUniformBuffers) {
            for (let i = 0; i < uniformBuffers.length; ++i) {
                const bufferName = uniformBuffers[i];
                switch (bufferName) {
                    case "Mesh":
                        if (mesh) {
                            mesh.getMeshUniformBuffer().bindToEffect(effect, "Mesh");
                            mesh.transferToEffect(world);
                        }
                        break;
                    case "Scene":
                        BindSceneUniformBuffer(effect, scene.getSceneUniformBuffer());
                        scene.finalizeSceneUbo();
                        useSceneUBO = true;
                        break;
                }
            }
        }
        const mustRebind = mesh && storeEffectOnSubMeshes ? this._mustRebind(scene, effect, subMesh, mesh.visibility) : scene.getCachedMaterial() !== this;
        if (effect && mustRebind) {
            if (!useSceneUBO && this._options.uniforms.indexOf("view") !== -1) {
                effect.setMatrix("view", scene.getViewMatrix());
            }
            if (!useSceneUBO && this._options.uniforms.indexOf("projection") !== -1) {
                effect.setMatrix("projection", scene.getProjectionMatrix());
            }
            if (!useSceneUBO && this._options.uniforms.indexOf("viewProjection") !== -1) {
                effect.setMatrix("viewProjection", scene.getTransformMatrix());
                if (this._multiview) {
                    effect.setMatrix("viewProjectionR", scene._transformMatrixR);
                }
            }
            if (scene.activeCamera && this._options.uniforms.indexOf("cameraPosition") !== -1) {
                effect.setVector3("cameraPosition", scene.activeCamera.globalPosition);
            }
            // Bones
            BindBonesParameters(mesh, effect);
            // Clip plane
            bindClipPlane(effect, this, scene);
            // Misc
            if (this._useLogarithmicDepth) {
                BindLogDepth(storeEffectOnSubMeshes ? subMesh.materialDefines : effect.defines, effect, scene);
            }
            // Fog
            if (mesh) {
                BindFogParameters(scene, mesh, effect);
            }
            let name;
            // Texture
            for (name in this._textures) {
                effect.setTexture(name, this._textures[name]);
            }
            // Texture arrays
            for (name in this._textureArrays) {
                effect.setTextureArray(name, this._textureArrays[name]);
            }
            // Int
            for (name in this._ints) {
                effect.setInt(name, this._ints[name]);
            }
            // UInt
            for (name in this._uints) {
                effect.setUInt(name, this._uints[name]);
            }
            // Float
            for (name in this._floats) {
                effect.setFloat(name, this._floats[name]);
            }
            // Floats
            for (name in this._floatsArrays) {
                effect.setArray(name, this._floatsArrays[name]);
            }
            // Color3
            for (name in this._colors3) {
                effect.setColor3(name, this._colors3[name]);
            }
            // Color3Array
            for (name in this._colors3Arrays) {
                effect.setArray3(name, this._colors3Arrays[name]);
            }
            // Color4
            for (name in this._colors4) {
                const color = this._colors4[name];
                effect.setFloat4(name, color.r, color.g, color.b, color.a);
            }
            // Color4Array
            for (name in this._colors4Arrays) {
                effect.setArray4(name, this._colors4Arrays[name]);
            }
            // Vector2
            for (name in this._vectors2) {
                effect.setVector2(name, this._vectors2[name]);
            }
            // Vector3
            for (name in this._vectors3) {
                effect.setVector3(name, this._vectors3[name]);
            }
            // Vector4
            for (name in this._vectors4) {
                effect.setVector4(name, this._vectors4[name]);
            }
            // Quaternion
            for (name in this._quaternions) {
                effect.setQuaternion(name, this._quaternions[name]);
            }
            // Matrix
            for (name in this._matrices) {
                effect.setMatrix(name, this._matrices[name]);
            }
            // MatrixArray
            for (name in this._matrixArrays) {
                effect.setMatrices(name, this._matrixArrays[name]);
            }
            // Matrix 3x3
            for (name in this._matrices3x3) {
                effect.setMatrix3x3(name, this._matrices3x3[name]);
            }
            // Matrix 2x2
            for (name in this._matrices2x2) {
                effect.setMatrix2x2(name, this._matrices2x2[name]);
            }
            // Vector2Array
            for (name in this._vectors2Arrays) {
                effect.setArray2(name, this._vectors2Arrays[name]);
            }
            // Vector3Array
            for (name in this._vectors3Arrays) {
                effect.setArray3(name, this._vectors3Arrays[name]);
            }
            // Vector4Array
            for (name in this._vectors4Arrays) {
                effect.setArray4(name, this._vectors4Arrays[name]);
            }
            // QuaternionArray
            for (name in this._quaternionsArrays) {
                effect.setArray4(name, this._quaternionsArrays[name]);
            }
            // Uniform buffers
            for (name in this._uniformBuffers) {
                const buffer = this._uniformBuffers[name].getBuffer();
                if (buffer) {
                    effect.bindUniformBuffer(buffer, name);
                }
            }
            const engineWebGPU = scene.getEngine();
            // External texture
            const setExternalTexture = engineWebGPU.setExternalTexture;
            if (setExternalTexture) {
                for (name in this._externalTextures) {
                    setExternalTexture.call(engineWebGPU, name, this._externalTextures[name]);
                }
            }
            // Samplers
            const setTextureSampler = engineWebGPU.setTextureSampler;
            if (setTextureSampler) {
                for (name in this._textureSamplers) {
                    setTextureSampler.call(engineWebGPU, name, this._textureSamplers[name]);
                }
            }
            // Storage buffers
            const setStorageBuffer = engineWebGPU.setStorageBuffer;
            if (setStorageBuffer) {
                for (name in this._storageBuffers) {
                    setStorageBuffer.call(engineWebGPU, name, this._storageBuffers[name]);
                }
            }
        }
        if (effect && mesh && (mustRebind || !this.isFrozen)) {
            // Morph targets
            const manager = mesh.morphTargetManager;
            if (manager && manager.numInfluencers > 0) {
                BindMorphTargetParameters(mesh, effect);
            }
            const bvaManager = mesh.bakedVertexAnimationManager;
            if (bvaManager && bvaManager.isEnabled) {
                const drawWrapper = storeEffectOnSubMeshes ? subMesh._drawWrapper : this._drawWrapper;
                mesh.bakedVertexAnimationManager?.bind(effect, !!drawWrapper._wasPreviouslyUsingInstances);
            }
        }
        this._afterBind(mesh, effect, subMesh);
    }
    /**
     * Gets the active textures from the material
     * @returns an array of textures
     */
    getActiveTextures() {
        const activeTextures = super.getActiveTextures();
        for (const name in this._textures) {
            activeTextures.push(this._textures[name]);
        }
        for (const name in this._textureArrays) {
            const array = this._textureArrays[name];
            for (let index = 0; index < array.length; index++) {
                activeTextures.push(array[index]);
            }
        }
        return activeTextures;
    }
    /**
     * Specifies if the material uses a texture
     * @param texture defines the texture to check against the material
     * @returns a boolean specifying if the material uses the texture
     */
    hasTexture(texture) {
        if (super.hasTexture(texture)) {
            return true;
        }
        for (const name in this._textures) {
            if (this._textures[name] === texture) {
                return true;
            }
        }
        for (const name in this._textureArrays) {
            const array = this._textureArrays[name];
            for (let index = 0; index < array.length; index++) {
                if (array[index] === texture) {
                    return true;
                }
            }
        }
        return false;
    }
    /**
     * Makes a duplicate of the material, and gives it a new name
     * @param name defines the new name for the duplicated material
     * @returns the cloned material
     */
    clone(name) {
        const result = SerializationHelper.Clone(() => new ShaderMaterial(name, this.getScene(), this._shaderPath, this._options, this._storeEffectOnSubMeshes), this);
        result.name = name;
        result.id = name;
        // Shader code path
        if (typeof result._shaderPath === "object") {
            result._shaderPath = { ...result._shaderPath };
        }
        // Options
        this._options = { ...this._options };
        Object.keys(this._options).forEach((propName) => {
            const propValue = this._options[propName];
            if (Array.isArray(propValue)) {
                this._options[propName] = propValue.slice(0);
            }
        });
        // Stencil
        this.stencil.copyTo(result.stencil);
        // Texture
        for (const key in this._textures) {
            result.setTexture(key, this._textures[key]);
        }
        // TextureArray
        for (const key in this._textureArrays) {
            result.setTextureArray(key, this._textureArrays[key]);
        }
        // External texture
        for (const key in this._externalTextures) {
            result.setExternalTexture(key, this._externalTextures[key]);
        }
        // Int
        for (const key in this._ints) {
            result.setInt(key, this._ints[key]);
        }
        // UInt
        for (const key in this._uints) {
            result.setUInt(key, this._uints[key]);
        }
        // Float
        for (const key in this._floats) {
            result.setFloat(key, this._floats[key]);
        }
        // Floats
        for (const key in this._floatsArrays) {
            result.setFloats(key, this._floatsArrays[key]);
        }
        // Color3
        for (const key in this._colors3) {
            result.setColor3(key, this._colors3[key]);
        }
        // Color3Array
        for (const key in this._colors3Arrays) {
            result._colors3Arrays[key] = this._colors3Arrays[key];
        }
        // Color4
        for (const key in this._colors4) {
            result.setColor4(key, this._colors4[key]);
        }
        // Color4Array
        for (const key in this._colors4Arrays) {
            result._colors4Arrays[key] = this._colors4Arrays[key];
        }
        // Vector2
        for (const key in this._vectors2) {
            result.setVector2(key, this._vectors2[key]);
        }
        // Vector3
        for (const key in this._vectors3) {
            result.setVector3(key, this._vectors3[key]);
        }
        // Vector4
        for (const key in this._vectors4) {
            result.setVector4(key, this._vectors4[key]);
        }
        // Quaternion
        for (const key in this._quaternions) {
            result.setQuaternion(key, this._quaternions[key]);
        }
        // QuaternionArray
        for (const key in this._quaternionsArrays) {
            result._quaternionsArrays[key] = this._quaternionsArrays[key];
        }
        // Matrix
        for (const key in this._matrices) {
            result.setMatrix(key, this._matrices[key]);
        }
        // MatrixArray
        for (const key in this._matrixArrays) {
            result._matrixArrays[key] = this._matrixArrays[key].slice();
        }
        // Matrix 3x3
        for (const key in this._matrices3x3) {
            result.setMatrix3x3(key, this._matrices3x3[key]);
        }
        // Matrix 2x2
        for (const key in this._matrices2x2) {
            result.setMatrix2x2(key, this._matrices2x2[key]);
        }
        // Vector2Array
        for (const key in this._vectors2Arrays) {
            result.setArray2(key, this._vectors2Arrays[key]);
        }
        // Vector3Array
        for (const key in this._vectors3Arrays) {
            result.setArray3(key, this._vectors3Arrays[key]);
        }
        // Vector4Array
        for (const key in this._vectors4Arrays) {
            result.setArray4(key, this._vectors4Arrays[key]);
        }
        // Uniform buffers
        for (const key in this._uniformBuffers) {
            result.setUniformBuffer(key, this._uniformBuffers[key]);
        }
        // Samplers
        for (const key in this._textureSamplers) {
            result.setTextureSampler(key, this._textureSamplers[key]);
        }
        // Storag buffers
        for (const key in this._storageBuffers) {
            result.setStorageBuffer(key, this._storageBuffers[key]);
        }
        return result;
    }
    /**
     * Disposes the material
     * @param forceDisposeEffect specifies if effects should be forcefully disposed
     * @param forceDisposeTextures specifies if textures should be forcefully disposed
     * @param notBoundToMesh specifies if the material that is being disposed is known to be not bound to any mesh
     */
    dispose(forceDisposeEffect, forceDisposeTextures, notBoundToMesh) {
        if (forceDisposeTextures) {
            let name;
            for (name in this._textures) {
                this._textures[name].dispose();
            }
            for (name in this._textureArrays) {
                const array = this._textureArrays[name];
                for (let index = 0; index < array.length; index++) {
                    array[index].dispose();
                }
            }
        }
        this._textures = {};
        super.dispose(forceDisposeEffect, forceDisposeTextures, notBoundToMesh);
    }
    /**
     * Serializes this material in a JSON representation
     * @returns the serialized material object
     */
    serialize() {
        const serializationObject = SerializationHelper.Serialize(this);
        serializationObject.customType = "BABYLON.ShaderMaterial";
        serializationObject.uniqueId = this.uniqueId;
        serializationObject.options = this._options;
        serializationObject.shaderPath = this._shaderPath;
        serializationObject.storeEffectOnSubMeshes = this._storeEffectOnSubMeshes;
        let name;
        // Stencil
        serializationObject.stencil = this.stencil.serialize();
        // Texture
        serializationObject.textures = {};
        for (name in this._textures) {
            serializationObject.textures[name] = this._textures[name].serialize();
        }
        // Texture arrays
        serializationObject.textureArrays = {};
        for (name in this._textureArrays) {
            serializationObject.textureArrays[name] = [];
            const array = this._textureArrays[name];
            for (let index = 0; index < array.length; index++) {
                serializationObject.textureArrays[name].push(array[index].serialize());
            }
        }
        // Int
        serializationObject.ints = {};
        for (name in this._ints) {
            serializationObject.ints[name] = this._ints[name];
        }
        // UInt
        serializationObject.uints = {};
        for (name in this._uints) {
            serializationObject.uints[name] = this._uints[name];
        }
        // Float
        serializationObject.floats = {};
        for (name in this._floats) {
            serializationObject.floats[name] = this._floats[name];
        }
        // Floats
        serializationObject.floatsArrays = {};
        for (name in this._floatsArrays) {
            serializationObject.floatsArrays[name] = this._floatsArrays[name];
        }
        // Color3
        serializationObject.colors3 = {};
        for (name in this._colors3) {
            serializationObject.colors3[name] = this._colors3[name].asArray();
        }
        // Color3 array
        serializationObject.colors3Arrays = {};
        for (name in this._colors3Arrays) {
            serializationObject.colors3Arrays[name] = this._colors3Arrays[name];
        }
        // Color4
        serializationObject.colors4 = {};
        for (name in this._colors4) {
            serializationObject.colors4[name] = this._colors4[name].asArray();
        }
        // Color4 array
        serializationObject.colors4Arrays = {};
        for (name in this._colors4Arrays) {
            serializationObject.colors4Arrays[name] = this._colors4Arrays[name];
        }
        // Vector2
        serializationObject.vectors2 = {};
        for (name in this._vectors2) {
            serializationObject.vectors2[name] = this._vectors2[name].asArray();
        }
        // Vector3
        serializationObject.vectors3 = {};
        for (name in this._vectors3) {
            serializationObject.vectors3[name] = this._vectors3[name].asArray();
        }
        // Vector4
        serializationObject.vectors4 = {};
        for (name in this._vectors4) {
            serializationObject.vectors4[name] = this._vectors4[name].asArray();
        }
        // Quaternion
        serializationObject.quaternions = {};
        for (name in this._quaternions) {
            serializationObject.quaternions[name] = this._quaternions[name].asArray();
        }
        // Matrix
        serializationObject.matrices = {};
        for (name in this._matrices) {
            serializationObject.matrices[name] = this._matrices[name].asArray();
        }
        // MatrixArray
        serializationObject.matrixArray = {};
        for (name in this._matrixArrays) {
            serializationObject.matrixArray[name] = this._matrixArrays[name];
        }
        // Matrix 3x3
        serializationObject.matrices3x3 = {};
        for (name in this._matrices3x3) {
            serializationObject.matrices3x3[name] = this._matrices3x3[name];
        }
        // Matrix 2x2
        serializationObject.matrices2x2 = {};
        for (name in this._matrices2x2) {
            serializationObject.matrices2x2[name] = this._matrices2x2[name];
        }
        // Vector2Array
        serializationObject.vectors2Arrays = {};
        for (name in this._vectors2Arrays) {
            serializationObject.vectors2Arrays[name] = this._vectors2Arrays[name];
        }
        // Vector3Array
        serializationObject.vectors3Arrays = {};
        for (name in this._vectors3Arrays) {
            serializationObject.vectors3Arrays[name] = this._vectors3Arrays[name];
        }
        // Vector4Array
        serializationObject.vectors4Arrays = {};
        for (name in this._vectors4Arrays) {
            serializationObject.vectors4Arrays[name] = this._vectors4Arrays[name];
        }
        // QuaternionArray
        serializationObject.quaternionsArrays = {};
        for (name in this._quaternionsArrays) {
            serializationObject.quaternionsArrays[name] = this._quaternionsArrays[name];
        }
        return serializationObject;
    }
    /**
     * Creates a shader material from parsed shader material data
     * @param source defines the JSON representation of the material
     * @param scene defines the hosting scene
     * @param rootUrl defines the root URL to use to load textures and relative dependencies
     * @returns a new material
     */
    static Parse(source, scene, rootUrl) {
        const material = SerializationHelper.Parse(() => new ShaderMaterial(source.name, scene, source.shaderPath, source.options, source.storeEffectOnSubMeshes), source, scene, rootUrl);
        let name;
        // Stencil
        if (source.stencil) {
            material.stencil.parse(source.stencil, scene, rootUrl);
        }
        // Texture
        for (name in source.textures) {
            material.setTexture(name, Texture.Parse(source.textures[name], scene, rootUrl));
        }
        // Texture arrays
        for (name in source.textureArrays) {
            const array = source.textureArrays[name];
            const textureArray = [];
            for (let index = 0; index < array.length; index++) {
                textureArray.push(Texture.Parse(array[index], scene, rootUrl));
            }
            material.setTextureArray(name, textureArray);
        }
        // Int
        for (name in source.ints) {
            material.setInt(name, source.ints[name]);
        }
        // UInt
        for (name in source.uints) {
            material.setUInt(name, source.uints[name]);
        }
        // Float
        for (name in source.floats) {
            material.setFloat(name, source.floats[name]);
        }
        // Floats
        for (name in source.floatsArrays) {
            material.setFloats(name, source.floatsArrays[name]);
        }
        // Color3
        for (name in source.colors3) {
            material.setColor3(name, Color3.FromArray(source.colors3[name]));
        }
        // Color3 arrays
        for (name in source.colors3Arrays) {
            const colors = source.colors3Arrays[name]
                .reduce((arr, num, i) => {
                if (i % 3 === 0) {
                    arr.push([num]);
                }
                else {
                    arr[arr.length - 1].push(num);
                }
                return arr;
            }, [])
                .map((color) => Color3.FromArray(color));
            material.setColor3Array(name, colors);
        }
        // Color4
        for (name in source.colors4) {
            material.setColor4(name, Color4.FromArray(source.colors4[name]));
        }
        // Color4 arrays
        for (name in source.colors4Arrays) {
            const colors = source.colors4Arrays[name]
                .reduce((arr, num, i) => {
                if (i % 4 === 0) {
                    arr.push([num]);
                }
                else {
                    arr[arr.length - 1].push(num);
                }
                return arr;
            }, [])
                .map((color) => Color4.FromArray(color));
            material.setColor4Array(name, colors);
        }
        // Vector2
        for (name in source.vectors2) {
            material.setVector2(name, Vector2.FromArray(source.vectors2[name]));
        }
        // Vector3
        for (name in source.vectors3) {
            material.setVector3(name, Vector3.FromArray(source.vectors3[name]));
        }
        // Vector4
        for (name in source.vectors4) {
            material.setVector4(name, Vector4.FromArray(source.vectors4[name]));
        }
        // Quaternion
        for (name in source.quaternions) {
            material.setQuaternion(name, Quaternion.FromArray(source.quaternions[name]));
        }
        // Matrix
        for (name in source.matrices) {
            material.setMatrix(name, Matrix.FromArray(source.matrices[name]));
        }
        // MatrixArray
        for (name in source.matrixArray) {
            material._matrixArrays[name] = new Float32Array(source.matrixArray[name]);
        }
        // Matrix 3x3
        for (name in source.matrices3x3) {
            material.setMatrix3x3(name, source.matrices3x3[name]);
        }
        // Matrix 2x2
        for (name in source.matrices2x2) {
            material.setMatrix2x2(name, source.matrices2x2[name]);
        }
        // Vector2Array
        for (name in source.vectors2Arrays) {
            material.setArray2(name, source.vectors2Arrays[name]);
        }
        // Vector3Array
        for (name in source.vectors3Arrays) {
            material.setArray3(name, source.vectors3Arrays[name]);
        }
        // Vector4Array
        for (name in source.vectors4Arrays) {
            material.setArray4(name, source.vectors4Arrays[name]);
        }
        // QuaternionArray
        for (name in source.quaternionsArrays) {
            material.setArray4(name, source.quaternionsArrays[name]);
        }
        return material;
    }
    /**
     * Creates a new ShaderMaterial from a snippet saved in a remote file
     * @param name defines the name of the ShaderMaterial to create (can be null or empty to use the one from the json data)
     * @param url defines the url to load from
     * @param scene defines the hosting scene
     * @param rootUrl defines the root URL to use to load textures and relative dependencies
     * @returns a promise that will resolve to the new ShaderMaterial
     */
    static ParseFromFileAsync(name, url, scene, rootUrl = "") {
        return new Promise((resolve, reject) => {
            const request = new WebRequest();
            request.addEventListener("readystatechange", () => {
                if (request.readyState == 4) {
                    if (request.status == 200) {
                        const serializationObject = JSON.parse(request.responseText);
                        const output = this.Parse(serializationObject, scene || EngineStore.LastCreatedScene, rootUrl);
                        if (name) {
                            output.name = name;
                        }
                        resolve(output);
                    }
                    else {
                        reject("Unable to load the ShaderMaterial");
                    }
                }
            });
            request.open("GET", url);
            request.send();
        });
    }
    /**
     * Creates a ShaderMaterial from a snippet saved by the Inspector
     * @param snippetId defines the snippet to load
     * @param scene defines the hosting scene
     * @param rootUrl defines the root URL to use to load textures and relative dependencies
     * @returns a promise that will resolve to the new ShaderMaterial
     */
    static ParseFromSnippetAsync(snippetId, scene, rootUrl = "") {
        return new Promise((resolve, reject) => {
            const request = new WebRequest();
            request.addEventListener("readystatechange", () => {
                if (request.readyState == 4) {
                    if (request.status == 200) {
                        const snippet = JSON.parse(JSON.parse(request.responseText).jsonPayload);
                        const serializationObject = JSON.parse(snippet.shaderMaterial);
                        const output = this.Parse(serializationObject, scene || EngineStore.LastCreatedScene, rootUrl);
                        output.snippetId = snippetId;
                        resolve(output);
                    }
                    else {
                        reject("Unable to load the snippet " + snippetId);
                    }
                }
            });
            request.open("GET", this.SnippetUrl + "/" + snippetId.replace(/#/g, "/"));
            request.send();
        });
    }
}
/** Define the Url to load snippets */
ShaderMaterial.SnippetUrl = `https://snippet.babylonjs.com`;
/**
 * Creates a ShaderMaterial from a snippet saved by the Inspector
 * @deprecated Please use ParseFromSnippetAsync instead
 * @param snippetId defines the snippet to load
 * @param scene defines the hosting scene
 * @param rootUrl defines the root URL to use to load textures and relative dependencies
 * @returns a promise that will resolve to the new ShaderMaterial
 */
ShaderMaterial.CreateFromSnippetAsync = ShaderMaterial.ParseFromSnippetAsync;
RegisterClass("BABYLON.ShaderMaterial", ShaderMaterial);
//# sourceMappingURL=shaderMaterial.js.map