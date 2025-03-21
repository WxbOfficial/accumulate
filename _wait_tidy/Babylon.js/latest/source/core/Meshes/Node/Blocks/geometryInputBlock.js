import { Observable } from "../../../Misc/observable.js";
import { NodeGeometryBlockConnectionPointTypes } from "../Enums/nodeGeometryConnectionPointTypes.js";
import { NodeGeometryBlock } from "../nodeGeometryBlock.js";
import { GetClass, RegisterClass } from "../../../Misc/typeStore.js";
import { Matrix, Vector2, Vector3, Vector4 } from "../../../Maths/math.vector.js";
import { NodeGeometryContextualSources } from "../Enums/nodeGeometryContextualSources.js";
/**
 * Block used to expose an input value
 */
export class GeometryInputBlock extends NodeGeometryBlock {
    /**
     * Gets or sets the connection point type (default is float)
     */
    get type() {
        if (this._type === NodeGeometryBlockConnectionPointTypes.AutoDetect) {
            if (this.value != null) {
                if (!isNaN(this.value)) {
                    this._type = NodeGeometryBlockConnectionPointTypes.Float;
                    return this._type;
                }
                switch (this.value.getClassName()) {
                    case "Vector2":
                        this._type = NodeGeometryBlockConnectionPointTypes.Vector2;
                        return this._type;
                    case "Vector3":
                        this._type = NodeGeometryBlockConnectionPointTypes.Vector3;
                        return this._type;
                    case "Vector4":
                        this._type = NodeGeometryBlockConnectionPointTypes.Vector4;
                        return this._type;
                    case "Matrix":
                        this._type = NodeGeometryBlockConnectionPointTypes.Matrix;
                        return this._type;
                }
            }
        }
        return this._type;
    }
    /**
     * Gets a boolean indicating that the current connection point is a contextual value
     */
    get isContextual() {
        return this._contextualSource !== NodeGeometryContextualSources.None;
    }
    /**
     * Gets or sets the current contextual value
     */
    get contextualValue() {
        return this._contextualSource;
    }
    set contextualValue(value) {
        this._contextualSource = value;
        switch (value) {
            case NodeGeometryContextualSources.Positions:
            case NodeGeometryContextualSources.Normals:
                this._type = NodeGeometryBlockConnectionPointTypes.Vector3;
                break;
            case NodeGeometryContextualSources.Colors:
            case NodeGeometryContextualSources.Tangents:
                this._type = NodeGeometryBlockConnectionPointTypes.Vector4;
                break;
            case NodeGeometryContextualSources.UV:
            case NodeGeometryContextualSources.UV2:
            case NodeGeometryContextualSources.UV3:
            case NodeGeometryContextualSources.UV4:
            case NodeGeometryContextualSources.UV5:
            case NodeGeometryContextualSources.UV6:
                this._type = NodeGeometryBlockConnectionPointTypes.Vector2;
                break;
            case NodeGeometryContextualSources.VertexID:
            case NodeGeometryContextualSources.GeometryID:
            case NodeGeometryContextualSources.CollectionID:
            case NodeGeometryContextualSources.FaceID:
            case NodeGeometryContextualSources.LoopID:
            case NodeGeometryContextualSources.InstanceID:
                this._type = NodeGeometryBlockConnectionPointTypes.Int;
                break;
        }
        if (this.output) {
            this.output.type = this._type;
        }
    }
    /**
     * Creates a new InputBlock
     * @param name defines the block name
     * @param type defines the type of the input (can be set to NodeGeometryBlockConnectionPointTypes.AutoDetect)
     */
    constructor(name, type = NodeGeometryBlockConnectionPointTypes.AutoDetect) {
        super(name);
        this._type = NodeGeometryBlockConnectionPointTypes.Undefined;
        this._contextualSource = NodeGeometryContextualSources.None;
        /** Gets or set a value used to limit the range of float values */
        this.min = 0;
        /** Gets or set a value used to limit the range of float values */
        this.max = 0;
        /** Gets or sets the group to use to display this block in the Inspector */
        this.groupInInspector = "";
        /** Gets an observable raised when the value is changed */
        this.onValueChangedObservable = new Observable();
        this._type = type;
        this._isInput = true;
        this.setDefaultValue();
        this.registerOutput("output", type);
    }
    /**
     * Gets or sets the value of that point.
     * Please note that this value will be ignored if valueCallback is defined
     */
    get value() {
        return this._storedValue;
    }
    set value(value) {
        if (this.type === NodeGeometryBlockConnectionPointTypes.Float) {
            if (this.min !== this.max) {
                value = Math.max(this.min, value);
                value = Math.min(this.max, value);
            }
        }
        this._storedValue = value;
        this.onValueChangedObservable.notifyObservers(this);
    }
    /**
     * Gets or sets a callback used to get the value of that point.
     * Please note that setting this value will force the connection point to ignore the value property
     */
    get valueCallback() {
        return this._valueCallback;
    }
    set valueCallback(value) {
        this._valueCallback = value;
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "GeometryInputBlock";
    }
    /**
     * Gets the geometry output component
     */
    get output() {
        return this._outputs[0];
    }
    /**
     * Set the input block to its default value (based on its type)
     */
    setDefaultValue() {
        this.contextualValue = NodeGeometryContextualSources.None;
        switch (this.type) {
            case NodeGeometryBlockConnectionPointTypes.Int:
            case NodeGeometryBlockConnectionPointTypes.Float:
                this.value = 0;
                break;
            case NodeGeometryBlockConnectionPointTypes.Vector2:
                this.value = Vector2.Zero();
                break;
            case NodeGeometryBlockConnectionPointTypes.Vector3:
                this.value = Vector3.Zero();
                break;
            case NodeGeometryBlockConnectionPointTypes.Vector4:
                this.value = Vector4.Zero();
                break;
            case NodeGeometryBlockConnectionPointTypes.Matrix:
                this.value = Matrix.Identity();
                break;
        }
    }
    _buildBlock(state) {
        super._buildBlock(state);
        if (this.isContextual) {
            this.output._storedValue = null;
            this.output._storedFunction = (state) => {
                return state.getContextualValue(this._contextualSource);
            };
        }
        else {
            this.output._storedFunction = null;
            this.output._storedValue = this.value;
        }
    }
    dispose() {
        this.onValueChangedObservable.clear();
        super.dispose();
    }
    _dumpPropertiesCode() {
        const variableName = this._codeVariableName;
        if (this.isContextual) {
            return (super._dumpPropertiesCode() + `${variableName}.contextualValue = BABYLON.NodeGeometryContextualSources.${NodeGeometryContextualSources[this._contextualSource]};\n`);
        }
        const codes = [];
        let valueString = "";
        switch (this.type) {
            case NodeGeometryBlockConnectionPointTypes.Float:
            case NodeGeometryBlockConnectionPointTypes.Int:
                valueString = `${this.value}`;
                break;
            case NodeGeometryBlockConnectionPointTypes.Vector2:
                valueString = `new BABYLON.Vector2(${this.value.x}, ${this.value.y})`;
                break;
            case NodeGeometryBlockConnectionPointTypes.Vector3:
                valueString = `new BABYLON.Vector3(${this.value.x}, ${this.value.y}, ${this.value.z})`;
                break;
            case NodeGeometryBlockConnectionPointTypes.Vector4:
                valueString = `new BABYLON.Vector4(${this.value.x}, ${this.value.y}, ${this.value.z}, ${this.value.w})`;
                break;
        }
        // Common Property "Value"
        codes.push(`${variableName}.value = ${valueString}`);
        // Float-Value-Specific Properties
        if (this.type === NodeGeometryBlockConnectionPointTypes.Float || this.type === NodeGeometryBlockConnectionPointTypes.Int) {
            codes.push(`${variableName}.min = ${this.min}`, `${variableName}.max = ${this.max}`);
        }
        codes.push("");
        return super._dumpPropertiesCode() + codes.join(";\n");
    }
    serialize() {
        const serializationObject = super.serialize();
        serializationObject.type = this.type;
        serializationObject.contextualValue = this.contextualValue;
        serializationObject.min = this.min;
        serializationObject.max = this.max;
        serializationObject.groupInInspector = this.groupInInspector;
        if (this._storedValue !== null && !this.isContextual) {
            if (this._storedValue.asArray) {
                serializationObject.valueType = "BABYLON." + this._storedValue.getClassName();
                serializationObject.value = this._storedValue.asArray();
            }
            else {
                serializationObject.valueType = "number";
                serializationObject.value = this._storedValue;
            }
        }
        return serializationObject;
    }
    _deserialize(serializationObject) {
        super._deserialize(serializationObject);
        this._type = serializationObject.type;
        this.contextualValue = serializationObject.contextualValue;
        this.min = serializationObject.min || 0;
        this.max = serializationObject.max || 0;
        this.groupInInspector = serializationObject.groupInInspector || "";
        if (!serializationObject.valueType) {
            return;
        }
        if (serializationObject.valueType === "number") {
            this._storedValue = serializationObject.value;
        }
        else {
            const valueType = GetClass(serializationObject.valueType);
            if (valueType) {
                this._storedValue = valueType.FromArray(serializationObject.value);
            }
        }
    }
}
RegisterClass("BABYLON.GeometryInputBlock", GeometryInputBlock);
//# sourceMappingURL=geometryInputBlock.js.map