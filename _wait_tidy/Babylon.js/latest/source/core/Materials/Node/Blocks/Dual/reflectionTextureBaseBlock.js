import { __decorate } from "../../../../tslib.es6.js";
import { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import { NodeMaterialBlockTargets } from "../../Enums/nodeMaterialBlockTargets.js";
import { NodeMaterial } from "../../nodeMaterial.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
import { InputBlock } from "../Input/inputBlock.js";
import { NodeMaterialSystemValues } from "../../Enums/nodeMaterialSystemValues.js";

import "../../../../Shaders/ShadersInclude/reflectionFunction.js";
import { CubeTexture } from "../../../Textures/cubeTexture.js";
import { Texture } from "../../../Textures/texture.js";
import { EngineStore } from "../../../../Engines/engineStore.js";
import { editableInPropertyPage, PropertyTypeForEdition } from "../../../../Decorators/nodeDecorator.js";
import { NodeMaterialBlockConnectionPointTypes } from "../../Enums/nodeMaterialBlockConnectionPointTypes.js";
/**
 * Base block used to read a reflection texture from a sampler
 */
export class ReflectionTextureBaseBlock extends NodeMaterialBlock {
    /**
     * Gets or sets the texture associated with the node
     */
    get texture() {
        return this._texture;
    }
    set texture(texture) {
        if (this._texture === texture) {
            return;
        }
        const scene = texture?.getScene() ?? EngineStore.LastCreatedScene;
        if (!texture && scene) {
            scene.markAllMaterialsAsDirty(1, (mat) => {
                return mat.hasTexture(this._texture);
            });
        }
        this._texture = texture;
        if (texture && scene) {
            scene.markAllMaterialsAsDirty(1, (mat) => {
                return mat.hasTexture(texture);
            });
        }
    }
    static _OnGenerateOnlyFragmentCodeChanged(block, _propertyName) {
        const that = block;
        return that._onGenerateOnlyFragmentCodeChanged();
    }
    _onGenerateOnlyFragmentCodeChanged() {
        this._setTarget();
        return true;
    }
    _setTarget() {
        this._setInitialTarget(this.generateOnlyFragmentCode ? NodeMaterialBlockTargets.Fragment : NodeMaterialBlockTargets.VertexAndFragment);
    }
    /**
     * Create a new ReflectionTextureBaseBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name, NodeMaterialBlockTargets.VertexAndFragment);
        /** Indicates that no code should be generated in the vertex shader. Can be useful in some specific circumstances (like when doing ray marching for eg) */
        this.generateOnlyFragmentCode = false;
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "ReflectionTextureBaseBlock";
    }
    _getTexture() {
        return this.texture;
    }
    /**
     * Auto configure the node based on the existing material
     * @param material defines the material to configure
     * @param additionalFilteringInfo defines additional info to be used when filtering inputs (we might want to skip some non relevant blocks)
     */
    autoConfigure(material, additionalFilteringInfo = () => true) {
        if (!this.position.isConnected) {
            let positionInput = material.getInputBlockByPredicate((b) => b.isAttribute && b.name === "position" && additionalFilteringInfo(b));
            if (!positionInput) {
                positionInput = new InputBlock("position");
                positionInput.setAsAttribute();
            }
            positionInput.output.connectTo(this.position);
        }
        if (!this.world.isConnected) {
            let worldInput = material.getInputBlockByPredicate((b) => b.systemValue === NodeMaterialSystemValues.World && additionalFilteringInfo(b));
            if (!worldInput) {
                worldInput = new InputBlock("world");
                worldInput.setAsSystemValue(NodeMaterialSystemValues.World);
            }
            worldInput.output.connectTo(this.world);
        }
        if (this.view && !this.view.isConnected) {
            let viewInput = material.getInputBlockByPredicate((b) => b.systemValue === NodeMaterialSystemValues.View && additionalFilteringInfo(b));
            if (!viewInput) {
                viewInput = new InputBlock("view");
                viewInput.setAsSystemValue(NodeMaterialSystemValues.View);
            }
            viewInput.output.connectTo(this.view);
        }
    }
    prepareDefines(mesh, nodeMaterial, defines) {
        if (!defines._areTexturesDirty) {
            return;
        }
        const texture = this._getTexture();
        if (!texture || !texture.getTextureMatrix) {
            return;
        }
        defines.setValue(this._define3DName, texture.isCube, true);
        defines.setValue(this._defineLocalCubicName, texture.boundingBoxSize ? true : false, true);
        defines.setValue(this._defineExplicitName, texture.coordinatesMode === 0, true);
        defines.setValue(this._defineSkyboxName, texture.coordinatesMode === 5, true);
        defines.setValue(this._defineCubicName, texture.coordinatesMode === 3 || texture.coordinatesMode === 6, true);
        defines.setValue("INVERTCUBICMAP", texture.coordinatesMode === 6, true);
        defines.setValue(this._defineSphericalName, texture.coordinatesMode === 1, true);
        defines.setValue(this._definePlanarName, texture.coordinatesMode === 2, true);
        defines.setValue(this._defineProjectionName, texture.coordinatesMode === 4, true);
        defines.setValue(this._defineEquirectangularName, texture.coordinatesMode === 7, true);
        defines.setValue(this._defineEquirectangularFixedName, texture.coordinatesMode === 8, true);
        defines.setValue(this._defineMirroredEquirectangularFixedName, texture.coordinatesMode === 9, true);
    }
    isReady() {
        const texture = this._getTexture();
        if (texture && !texture.isReadyOrNotBlocking()) {
            return false;
        }
        return true;
    }
    bind(effect, nodeMaterial, mesh, _subMesh) {
        const texture = this._getTexture();
        if (!mesh || !texture) {
            return;
        }
        effect.setMatrix(this._reflectionMatrixName, texture.getReflectionTextureMatrix());
        if (texture.isCube) {
            effect.setTexture(this._cubeSamplerName, texture);
        }
        else {
            effect.setTexture(this._2DSamplerName, texture);
        }
        if (texture.boundingBoxSize) {
            const cubeTexture = texture;
            effect.setVector3(this._reflectionPositionName, cubeTexture.boundingBoxPosition);
            effect.setVector3(this._reflectionSizeName, cubeTexture.boundingBoxSize);
        }
    }
    /**
     * Gets the code to inject in the vertex shader
     * @param state current state of the node material building
     * @returns the shader code
     */
    handleVertexSide(state) {
        if (this.generateOnlyFragmentCode && state.target === NodeMaterialBlockTargets.Vertex) {
            return "";
        }
        this._define3DName = state._getFreeDefineName("REFLECTIONMAP_3D");
        this._defineCubicName = state._getFreeDefineName("REFLECTIONMAP_CUBIC");
        this._defineSphericalName = state._getFreeDefineName("REFLECTIONMAP_SPHERICAL");
        this._definePlanarName = state._getFreeDefineName("REFLECTIONMAP_PLANAR");
        this._defineProjectionName = state._getFreeDefineName("REFLECTIONMAP_PROJECTION");
        this._defineExplicitName = state._getFreeDefineName("REFLECTIONMAP_EXPLICIT");
        this._defineEquirectangularName = state._getFreeDefineName("REFLECTIONMAP_EQUIRECTANGULAR");
        this._defineLocalCubicName = state._getFreeDefineName("USE_LOCAL_REFLECTIONMAP_CUBIC");
        this._defineMirroredEquirectangularFixedName = state._getFreeDefineName("REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED");
        this._defineEquirectangularFixedName = state._getFreeDefineName("REFLECTIONMAP_EQUIRECTANGULAR_FIXED");
        this._defineSkyboxName = state._getFreeDefineName("REFLECTIONMAP_SKYBOX");
        this._defineOppositeZ = state._getFreeDefineName("REFLECTIONMAP_OPPOSITEZ");
        this._reflectionMatrixName = state._getFreeVariableName("reflectionMatrix");
        state._emitUniformFromString(this._reflectionMatrixName, NodeMaterialBlockConnectionPointTypes.Matrix);
        let code = "";
        this._worldPositionNameInFragmentOnlyMode = state._getFreeVariableName("worldPosition");
        const worldPosVaryingName = this.generateOnlyFragmentCode ? this._worldPositionNameInFragmentOnlyMode : "v_" + this.worldPosition.associatedVariableName;
        if (this.generateOnlyFragmentCode || state._emitVaryingFromString(worldPosVaryingName, NodeMaterialBlockConnectionPointTypes.Vector4)) {
            code += `${this.generateOnlyFragmentCode ? "vec4 " : ""}${worldPosVaryingName} = ${this.worldPosition.associatedVariableName};\n`;
        }
        this._positionUVWName = state._getFreeVariableName("positionUVW");
        this._directionWName = state._getFreeVariableName("directionW");
        if (this.generateOnlyFragmentCode || state._emitVaryingFromString(this._positionUVWName, NodeMaterialBlockConnectionPointTypes.Vector3, this._defineSkyboxName)) {
            code += `#ifdef ${this._defineSkyboxName}\n`;
            code += `${this.generateOnlyFragmentCode ? "vec3 " : ""}${this._positionUVWName} = ${this.position.associatedVariableName}.xyz;\n`;
            code += `#endif\n`;
        }
        if (this.generateOnlyFragmentCode ||
            state._emitVaryingFromString(this._directionWName, NodeMaterialBlockConnectionPointTypes.Vector3, `defined(${this._defineEquirectangularFixedName}) || defined(${this._defineMirroredEquirectangularFixedName})`)) {
            code += `#if defined(${this._defineEquirectangularFixedName}) || defined(${this._defineMirroredEquirectangularFixedName})\n`;
            code += `${this.generateOnlyFragmentCode ? "vec3 " : ""}${this._directionWName} = normalize(vec3(${this.world.associatedVariableName} * vec4(${this.position.associatedVariableName}.xyz, 0.0)));\n`;
            code += `#endif\n`;
        }
        return code;
    }
    /**
     * Handles the inits for the fragment code path
     * @param state node material build state
     */
    handleFragmentSideInits(state) {
        state.sharedData.blockingBlocks.push(this);
        state.sharedData.textureBlocks.push(this);
        // Samplers
        this._cubeSamplerName = state._getFreeVariableName(this.name + "CubeSampler");
        state.samplers.push(this._cubeSamplerName);
        this._2DSamplerName = state._getFreeVariableName(this.name + "2DSampler");
        state.samplers.push(this._2DSamplerName);
        state._samplerDeclaration += `#ifdef ${this._define3DName}\n`;
        state._samplerDeclaration += `uniform samplerCube ${this._cubeSamplerName};\n`;
        state._samplerDeclaration += `#else\n`;
        state._samplerDeclaration += `uniform sampler2D ${this._2DSamplerName};\n`;
        state._samplerDeclaration += `#endif\n`;
        // Fragment
        state.sharedData.blocksWithDefines.push(this);
        state.sharedData.bindableBlocks.push(this);
        const comments = `//${this.name}`;
        state._emitFunctionFromInclude("helperFunctions", comments);
        state._emitFunctionFromInclude("reflectionFunction", comments, {
            replaceStrings: [{ search: /vec3 computeReflectionCoords/g, replace: "void DUMMYFUNC" }],
        });
        this._reflectionColorName = state._getFreeVariableName("reflectionColor");
        this._reflectionVectorName = state._getFreeVariableName("reflectionUVW");
        this._reflectionCoordsName = state._getFreeVariableName("reflectionCoords");
        this._reflectionPositionName = state._getFreeVariableName("vReflectionPosition");
        state._emitUniformFromString(this._reflectionPositionName, NodeMaterialBlockConnectionPointTypes.Vector3);
        this._reflectionSizeName = state._getFreeVariableName("vReflectionPosition");
        state._emitUniformFromString(this._reflectionSizeName, NodeMaterialBlockConnectionPointTypes.Vector3);
    }
    /**
     * Generates the reflection coords code for the fragment code path
     * @param worldNormalVarName name of the world normal variable
     * @param worldPos name of the world position variable. If not provided, will use the world position connected to this block
     * @param onlyReflectionVector if true, generates code only for the reflection vector computation, not for the reflection coordinates
     * @param doNotEmitInvertZ if true, does not emit the invertZ code
     * @returns the shader code
     */
    handleFragmentSideCodeReflectionCoords(worldNormalVarName, worldPos, onlyReflectionVector = false, doNotEmitInvertZ = false) {
        if (!worldPos) {
            worldPos = this.generateOnlyFragmentCode ? this._worldPositionNameInFragmentOnlyMode : `v_${this.worldPosition.associatedVariableName}`;
        }
        const reflectionMatrix = this._reflectionMatrixName;
        const direction = `normalize(${this._directionWName})`;
        const positionUVW = `${this._positionUVWName}`;
        const vEyePosition = `${this.cameraPosition.associatedVariableName}`;
        const view = `${this.view.associatedVariableName}`;
        worldNormalVarName += ".xyz";
        let code = `
            #ifdef ${this._defineMirroredEquirectangularFixedName}
                vec3 ${this._reflectionVectorName} = computeMirroredFixedEquirectangularCoords(${worldPos}, ${worldNormalVarName}, ${direction});
            #endif

            #ifdef ${this._defineEquirectangularFixedName}
                vec3 ${this._reflectionVectorName} = computeFixedEquirectangularCoords(${worldPos}, ${worldNormalVarName}, ${direction});
            #endif

            #ifdef ${this._defineEquirectangularName}
                vec3 ${this._reflectionVectorName} = computeEquirectangularCoords(${worldPos}, ${worldNormalVarName}, ${vEyePosition}.xyz, ${reflectionMatrix});
            #endif

            #ifdef ${this._defineSphericalName}
                vec3 ${this._reflectionVectorName} = computeSphericalCoords(${worldPos}, ${worldNormalVarName}, ${view}, ${reflectionMatrix});
            #endif

            #ifdef ${this._definePlanarName}
                vec3 ${this._reflectionVectorName} = computePlanarCoords(${worldPos}, ${worldNormalVarName}, ${vEyePosition}.xyz, ${reflectionMatrix});
            #endif

            #ifdef ${this._defineCubicName}
                #ifdef ${this._defineLocalCubicName}
                    vec3 ${this._reflectionVectorName} = computeCubicLocalCoords(${worldPos}, ${worldNormalVarName}, ${vEyePosition}.xyz, ${reflectionMatrix}, ${this._reflectionSizeName}, ${this._reflectionPositionName});
                #else
                vec3 ${this._reflectionVectorName} = computeCubicCoords(${worldPos}, ${worldNormalVarName}, ${vEyePosition}.xyz, ${reflectionMatrix});
                #endif
            #endif

            #ifdef ${this._defineProjectionName}
                vec3 ${this._reflectionVectorName} = computeProjectionCoords(${worldPos}, ${view}, ${reflectionMatrix});
            #endif

            #ifdef ${this._defineSkyboxName}
                vec3 ${this._reflectionVectorName} = computeSkyBoxCoords(${positionUVW}, ${reflectionMatrix});
            #endif

            #ifdef ${this._defineExplicitName}
                vec3 ${this._reflectionVectorName} = vec3(0, 0, 0);
            #endif\n`;
        if (!doNotEmitInvertZ) {
            code += `#ifdef ${this._defineOppositeZ}
                ${this._reflectionVectorName}.z *= -1.0;
            #endif\n`;
        }
        if (!onlyReflectionVector) {
            code += `
                #ifdef ${this._define3DName}
                    vec3 ${this._reflectionCoordsName} = ${this._reflectionVectorName};
                #else
                    vec2 ${this._reflectionCoordsName} = ${this._reflectionVectorName}.xy;
                    #ifdef ${this._defineProjectionName}
                        ${this._reflectionCoordsName} /= ${this._reflectionVectorName}.z;
                    #endif
                    ${this._reflectionCoordsName}.y = 1.0 - ${this._reflectionCoordsName}.y;
                #endif\n`;
        }
        return code;
    }
    /**
     * Generates the reflection color code for the fragment code path
     * @param lodVarName name of the lod variable
     * @param swizzleLookupTexture swizzle to use for the final color variable
     * @returns the shader code
     */
    handleFragmentSideCodeReflectionColor(lodVarName, swizzleLookupTexture = ".rgb") {
        const colorType = "vec" + (swizzleLookupTexture.length === 0 ? "4" : swizzleLookupTexture.length - 1);
        let code = `${colorType} ${this._reflectionColorName};
            #ifdef ${this._define3DName}\n`;
        if (lodVarName) {
            code += `${this._reflectionColorName} = textureCubeLodEXT(${this._cubeSamplerName}, ${this._reflectionVectorName}, ${lodVarName})${swizzleLookupTexture};\n`;
        }
        else {
            code += `${this._reflectionColorName} = textureCube(${this._cubeSamplerName}, ${this._reflectionVectorName})${swizzleLookupTexture};\n`;
        }
        code += `
            #else\n`;
        if (lodVarName) {
            code += `${this._reflectionColorName} = texture2DLodEXT(${this._2DSamplerName}, ${this._reflectionCoordsName}, ${lodVarName})${swizzleLookupTexture};\n`;
        }
        else {
            code += `${this._reflectionColorName} = texture2D(${this._2DSamplerName}, ${this._reflectionCoordsName})${swizzleLookupTexture};\n`;
        }
        code += `#endif\n`;
        return code;
    }
    /**
     * Generates the code corresponding to the connected output points
     * @param state node material build state
     * @param varName name of the variable to output
     * @returns the shader code
     */
    writeOutputs(state, varName) {
        let code = "";
        if (state.target === NodeMaterialBlockTargets.Fragment) {
            for (const output of this._outputs) {
                if (output.hasEndpoints) {
                    code += `${state._declareOutput(output)} = ${varName}.${output.name};\n`;
                }
            }
        }
        return code;
    }
    _buildBlock(state) {
        super._buildBlock(state);
        return this;
    }
    _dumpPropertiesCode() {
        let codeString = super._dumpPropertiesCode();
        if (!this.texture) {
            return codeString;
        }
        if (this.texture.isCube) {
            const forcedExtension = this.texture.forcedExtension;
            codeString += `${this._codeVariableName}.texture = new BABYLON.CubeTexture("${this.texture.name}", undefined, undefined, ${this.texture.noMipmap}, null, undefined, undefined, undefined, ${this.texture._prefiltered}, ${forcedExtension ? '"' + forcedExtension + '"' : "null"});\n`;
        }
        else {
            codeString += `${this._codeVariableName}.texture = new BABYLON.Texture("${this.texture.name}", null);\n`;
        }
        codeString += `${this._codeVariableName}.texture.coordinatesMode = ${this.texture.coordinatesMode};\n`;
        return codeString;
    }
    serialize() {
        const serializationObject = super.serialize();
        if (this.texture && !this.texture.isRenderTarget) {
            serializationObject.texture = this.texture.serialize();
        }
        serializationObject.generateOnlyFragmentCode = this.generateOnlyFragmentCode;
        return serializationObject;
    }
    _deserialize(serializationObject, scene, rootUrl) {
        super._deserialize(serializationObject, scene, rootUrl);
        if (serializationObject.texture && !NodeMaterial.IgnoreTexturesAtLoadTime) {
            rootUrl = serializationObject.texture.url.indexOf("data:") === 0 ? "" : rootUrl;
            if (serializationObject.texture.isCube) {
                this.texture = CubeTexture.Parse(serializationObject.texture, scene, rootUrl);
            }
            else {
                this.texture = Texture.Parse(serializationObject.texture, scene, rootUrl);
            }
        }
        this.generateOnlyFragmentCode = serializationObject.generateOnlyFragmentCode;
        this._setTarget();
    }
}
__decorate([
    editableInPropertyPage("Generate only fragment code", PropertyTypeForEdition.Boolean, "ADVANCED", {
        notifiers: { rebuild: true, update: true, onValidation: ReflectionTextureBaseBlock._OnGenerateOnlyFragmentCodeChanged },
    })
], ReflectionTextureBaseBlock.prototype, "generateOnlyFragmentCode", void 0);
RegisterClass("BABYLON.ReflectionTextureBaseBlock", ReflectionTextureBaseBlock);
//# sourceMappingURL=reflectionTextureBaseBlock.js.map