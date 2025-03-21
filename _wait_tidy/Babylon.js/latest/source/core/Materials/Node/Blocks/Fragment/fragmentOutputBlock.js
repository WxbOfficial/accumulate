import { __decorate } from "../../../../tslib.es6.js";
import { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import { NodeMaterialBlockConnectionPointTypes } from "../../Enums/nodeMaterialBlockConnectionPointTypes.js";
import { NodeMaterialBlockTargets } from "../../Enums/nodeMaterialBlockTargets.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
import { editableInPropertyPage, PropertyTypeForEdition } from "../../../../Decorators/nodeDecorator.js";
import { BindLogDepth } from "../../../materialHelper.functions.js";
import { ShaderLanguage } from "../../../shaderLanguage.js";
/**
 * Block used to output the final color
 */
export class FragmentOutputBlock extends NodeMaterialBlock {
    /**
     * Create a new FragmentOutputBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name, NodeMaterialBlockTargets.Fragment, true);
        /** Gets or sets a boolean indicating if content needs to be converted to gamma space */
        this.convertToGammaSpace = false;
        /** Gets or sets a boolean indicating if content needs to be converted to linear space */
        this.convertToLinearSpace = false;
        /** Gets or sets a boolean indicating if logarithmic depth should be used */
        this.useLogarithmicDepth = false;
        this.registerInput("rgba", NodeMaterialBlockConnectionPointTypes.Color4, true);
        this.registerInput("rgb", NodeMaterialBlockConnectionPointTypes.AutoDetect, true);
        this.registerInput("a", NodeMaterialBlockConnectionPointTypes.Float, true);
        this.rgb.addExcludedConnectionPointFromAllowedTypes(NodeMaterialBlockConnectionPointTypes.Color3 | NodeMaterialBlockConnectionPointTypes.Vector3 | NodeMaterialBlockConnectionPointTypes.Float);
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "FragmentOutputBlock";
    }
    /**
     * Initialize the block and prepare the context for build
     * @param state defines the state that will be used for the build
     */
    initialize(state) {
        state._excludeVariableName("logarithmicDepthConstant");
        state._excludeVariableName("vFragmentDepth");
    }
    /**
     * Gets the rgba input component
     */
    get rgba() {
        return this._inputs[0];
    }
    /**
     * Gets the rgb input component
     */
    get rgb() {
        return this._inputs[1];
    }
    /**
     * Gets the a input component
     */
    get a() {
        return this._inputs[2];
    }
    prepareDefines(mesh, nodeMaterial, defines) {
        defines.setValue(this._linearDefineName, this.convertToLinearSpace, true);
        defines.setValue(this._gammaDefineName, this.convertToGammaSpace, true);
    }
    bind(effect, nodeMaterial, mesh) {
        if ((this.useLogarithmicDepth || nodeMaterial.useLogarithmicDepth) && mesh) {
            BindLogDepth(undefined, effect, mesh.getScene());
        }
    }
    _buildBlock(state) {
        super._buildBlock(state);
        const rgba = this.rgba;
        const rgb = this.rgb;
        const a = this.a;
        state.sharedData.hints.needAlphaBlending = rgba.isConnected || a.isConnected;
        state.sharedData.blocksWithDefines.push(this);
        if (this.useLogarithmicDepth || state.sharedData.nodeMaterial.useLogarithmicDepth) {
            state._emitUniformFromString("logarithmicDepthConstant", NodeMaterialBlockConnectionPointTypes.Float);
            state._emitVaryingFromString("vFragmentDepth", NodeMaterialBlockConnectionPointTypes.Float);
            state.sharedData.bindableBlocks.push(this);
        }
        this._linearDefineName = state._getFreeDefineName("CONVERTTOLINEAR");
        this._gammaDefineName = state._getFreeDefineName("CONVERTTOGAMMA");
        const comments = `//${this.name}`;
        state._emitFunctionFromInclude("helperFunctions", comments);
        let outputString = "gl_FragColor";
        if (state.shaderLanguage === ShaderLanguage.WGSL) {
            outputString = "fragmentOutputs.color";
        }
        const vec4 = state._getShaderType(NodeMaterialBlockConnectionPointTypes.Vector4);
        if (rgba.connectedPoint) {
            if (a.isConnected) {
                state.compilationString += `${outputString} = ${vec4}(${rgba.associatedVariableName}.rgb, ${a.associatedVariableName});\n`;
            }
            else {
                state.compilationString += `${outputString}  = ${rgba.associatedVariableName};\n`;
            }
        }
        else if (rgb.connectedPoint) {
            let aValue = "1.0";
            if (a.connectedPoint) {
                aValue = a.associatedVariableName;
            }
            if (rgb.connectedPoint.type === NodeMaterialBlockConnectionPointTypes.Float) {
                state.compilationString += `${outputString}  = ${vec4}(${rgb.associatedVariableName}, ${rgb.associatedVariableName}, ${rgb.associatedVariableName}, ${aValue});\n`;
            }
            else {
                state.compilationString += `${outputString}  = ${vec4}(${rgb.associatedVariableName}, ${aValue});\n`;
            }
        }
        else {
            state.sharedData.checks.notConnectedNonOptionalInputs.push(rgba);
        }
        state.compilationString += `#ifdef ${this._linearDefineName}\n`;
        state.compilationString += `${outputString}  = toLinearSpace(${outputString});\n`;
        state.compilationString += `#endif\n`;
        state.compilationString += `#ifdef ${this._gammaDefineName}\n`;
        state.compilationString += `${outputString}  = toGammaSpace(${outputString});\n`;
        state.compilationString += `#endif\n`;
        // TODOWGSL
        if (this.useLogarithmicDepth || state.sharedData.nodeMaterial.useLogarithmicDepth) {
            state.compilationString += `gl_FragDepthEXT = log2(vFragmentDepth) * logarithmicDepthConstant * 0.5;\n`;
        }
        // TODOWGSL
        state.compilationString += `#if defined(PREPASS)\r\n`;
        state.compilationString += `gl_FragData[0] = gl_FragColor;\r\n`;
        state.compilationString += `#endif\r\n`;
        return this;
    }
    _dumpPropertiesCode() {
        let codeString = super._dumpPropertiesCode();
        codeString += `${this._codeVariableName}.convertToGammaSpace = ${this.convertToGammaSpace};\n`;
        codeString += `${this._codeVariableName}.convertToLinearSpace = ${this.convertToLinearSpace};\n`;
        codeString += `${this._codeVariableName}.useLogarithmicDepth = ${this.useLogarithmicDepth};\n`;
        return codeString;
    }
    serialize() {
        const serializationObject = super.serialize();
        serializationObject.convertToGammaSpace = this.convertToGammaSpace;
        serializationObject.convertToLinearSpace = this.convertToLinearSpace;
        serializationObject.useLogarithmicDepth = this.useLogarithmicDepth;
        return serializationObject;
    }
    _deserialize(serializationObject, scene, rootUrl) {
        super._deserialize(serializationObject, scene, rootUrl);
        this.convertToGammaSpace = !!serializationObject.convertToGammaSpace;
        this.convertToLinearSpace = !!serializationObject.convertToLinearSpace;
        this.useLogarithmicDepth = serializationObject.useLogarithmicDepth ?? false;
    }
}
__decorate([
    editableInPropertyPage("Convert to gamma space", PropertyTypeForEdition.Boolean, "PROPERTIES", { notifiers: { update: true } })
], FragmentOutputBlock.prototype, "convertToGammaSpace", void 0);
__decorate([
    editableInPropertyPage("Convert to linear space", PropertyTypeForEdition.Boolean, "PROPERTIES", { notifiers: { update: true } })
], FragmentOutputBlock.prototype, "convertToLinearSpace", void 0);
__decorate([
    editableInPropertyPage("Use logarithmic depth", PropertyTypeForEdition.Boolean, "PROPERTIES")
], FragmentOutputBlock.prototype, "useLogarithmicDepth", void 0);
RegisterClass("BABYLON.FragmentOutputBlock", FragmentOutputBlock);
//# sourceMappingURL=fragmentOutputBlock.js.map