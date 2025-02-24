import { Camera } from "../../Cameras/camera.js";
import { ArcRotateCamera } from "../../Cameras/arcRotateCamera.js";
import { VRCameraMetrics } from "./vrCameraMetrics.js";
import { Vector3 } from "../../Maths/math.vector.js";
import { Node } from "../../node.js";
import { setVRRigMode } from "../RigModes/vrRigMode.js";
import "../Inputs/arcRotateCameraVRDeviceOrientationInput.js";
Node.AddNodeConstructor("VRDeviceOrientationArcRotateCamera", (name, scene) => {
    return () => new VRDeviceOrientationArcRotateCamera(name, 0, 0, 1.0, Vector3.Zero(), scene);
});
/**
 * Camera used to simulate VR rendering (based on ArcRotateCamera)
 * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_introduction#vr-device-orientation-cameras
 */
export class VRDeviceOrientationArcRotateCamera extends ArcRotateCamera {
    /**
     * Creates a new VRDeviceOrientationArcRotateCamera
     * @param name defines camera name
     * @param alpha defines the camera rotation along the longitudinal axis
     * @param beta defines the camera rotation along the latitudinal axis
     * @param radius defines the camera distance from its target
     * @param target defines the camera target
     * @param scene defines the scene the camera belongs to
     * @param compensateDistortion defines if the camera needs to compensate the lens distortion
     * @param vrCameraMetrics defines the vr metrics associated to the camera
     */
    constructor(name, alpha, beta, radius, target, scene, compensateDistortion = true, vrCameraMetrics = VRCameraMetrics.GetDefault()) {
        super(name, alpha, beta, radius, target, scene);
        this._setRigMode = (rigParams) => setVRRigMode(this, rigParams);
        vrCameraMetrics.compensateDistortion = compensateDistortion;
        this.setCameraRigMode(Camera.RIG_MODE_VR, { vrCameraMetrics: vrCameraMetrics });
        this.inputs.addVRDeviceOrientation();
    }
    /**
     * Gets camera class name
     * @returns VRDeviceOrientationArcRotateCamera
     */
    getClassName() {
        return "VRDeviceOrientationArcRotateCamera";
    }
}
//# sourceMappingURL=vrDeviceOrientationArcRotateCamera.js.map