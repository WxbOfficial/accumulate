import { Vector3 } from "@babylonjs/core/Maths/math.vector.js";
import { Tools } from "@babylonjs/core/Misc/tools.js";
import { AnimationEvent } from "@babylonjs/core/Animations/animationEvent.js";
import { Sound } from "@babylonjs/core/Audio/sound.js";
import { WeightedSound } from "@babylonjs/core/Audio/weightedsound.js";
import { GLTFLoader, ArrayItem } from "../glTFLoader.js";
const NAME = "MSFT_audio_emitter";
/**
 * [Specification](https://github.com/najadojo/glTF/blob/MSFT_audio_emitter/extensions/2.0/Vendor/MSFT_audio_emitter/README.md)
 * !!! Experimental Extension Subject to Changes !!!
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export class MSFT_audio_emitter {
    /**
     * @internal
     */
    constructor(loader) {
        /**
         * The name of this extension.
         */
        this.name = NAME;
        this._loader = loader;
        this.enabled = this._loader.isExtensionUsed(NAME);
    }
    /** @internal */
    dispose() {
        this._loader = null;
        this._clips = null;
        this._emitters = null;
    }
    /** @internal */
    onLoading() {
        const extensions = this._loader.gltf.extensions;
        if (extensions && extensions[this.name]) {
            const extension = extensions[this.name];
            this._clips = extension.clips;
            this._emitters = extension.emitters;
            ArrayItem.Assign(this._clips);
            ArrayItem.Assign(this._emitters);
        }
    }
    /**
     * @internal
     */
    loadSceneAsync(context, scene) {
        return GLTFLoader.LoadExtensionAsync(context, scene, this.name, (extensionContext, extension) => {
            const promises = new Array();
            promises.push(this._loader.loadSceneAsync(context, scene));
            for (const emitterIndex of extension.emitters) {
                const emitter = ArrayItem.Get(`${extensionContext}/emitters`, this._emitters, emitterIndex);
                if (emitter.refDistance != undefined ||
                    emitter.maxDistance != undefined ||
                    emitter.rolloffFactor != undefined ||
                    emitter.distanceModel != undefined ||
                    emitter.innerAngle != undefined ||
                    emitter.outerAngle != undefined) {
                    throw new Error(`${extensionContext}: Direction or Distance properties are not allowed on emitters attached to a scene`);
                }
                promises.push(this._loadEmitterAsync(`${extensionContext}/emitters/${emitter.index}`, emitter));
            }
            return Promise.all(promises).then(() => { });
        });
    }
    /**
     * @internal
     */
    loadNodeAsync(context, node, assign) {
        return GLTFLoader.LoadExtensionAsync(context, node, this.name, (extensionContext, extension) => {
            const promises = new Array();
            return this._loader
                .loadNodeAsync(extensionContext, node, (babylonMesh) => {
                for (const emitterIndex of extension.emitters) {
                    const emitter = ArrayItem.Get(`${extensionContext}/emitters`, this._emitters, emitterIndex);
                    promises.push(this._loadEmitterAsync(`${extensionContext}/emitters/${emitter.index}`, emitter).then(() => {
                        for (const sound of emitter._babylonSounds) {
                            sound.attachToMesh(babylonMesh);
                            if (emitter.innerAngle != undefined || emitter.outerAngle != undefined) {
                                sound.setLocalDirectionToMesh(Vector3.Forward());
                                sound.setDirectionalCone(2 * Tools.ToDegrees(emitter.innerAngle == undefined ? Math.PI : emitter.innerAngle), 2 * Tools.ToDegrees(emitter.outerAngle == undefined ? Math.PI : emitter.outerAngle), 0);
                            }
                        }
                    }));
                }
                assign(babylonMesh);
            })
                .then((babylonMesh) => {
                return Promise.all(promises).then(() => {
                    return babylonMesh;
                });
            });
        });
    }
    /**
     * @internal
     */
    loadAnimationAsync(context, animation) {
        return GLTFLoader.LoadExtensionAsync(context, animation, this.name, (extensionContext, extension) => {
            return this._loader.loadAnimationAsync(context, animation).then((babylonAnimationGroup) => {
                const promises = new Array();
                ArrayItem.Assign(extension.events);
                for (const event of extension.events) {
                    promises.push(this._loadAnimationEventAsync(`${extensionContext}/events/${event.index}`, context, animation, event, babylonAnimationGroup));
                }
                return Promise.all(promises).then(() => {
                    return babylonAnimationGroup;
                });
            });
        });
    }
    _loadClipAsync(context, clip) {
        if (clip._objectURL) {
            return clip._objectURL;
        }
        let promise;
        if (clip.uri) {
            promise = this._loader.loadUriAsync(context, clip, clip.uri);
        }
        else {
            const bufferView = ArrayItem.Get(`${context}/bufferView`, this._loader.gltf.bufferViews, clip.bufferView);
            promise = this._loader.loadBufferViewAsync(`/bufferViews/${bufferView.index}`, bufferView);
        }
        clip._objectURL = promise.then((data) => {
            return URL.createObjectURL(new Blob([data], { type: clip.mimeType }));
        });
        return clip._objectURL;
    }
    _loadEmitterAsync(context, emitter) {
        emitter._babylonSounds = emitter._babylonSounds || [];
        if (!emitter._babylonData) {
            const clipPromises = new Array();
            const name = emitter.name || `emitter${emitter.index}`;
            const options = {
                loop: false,
                autoplay: false,
                volume: emitter.volume == undefined ? 1 : emitter.volume,
            };
            for (let i = 0; i < emitter.clips.length; i++) {
                const clipContext = `/extensions/${this.name}/clips`;
                const clip = ArrayItem.Get(clipContext, this._clips, emitter.clips[i].clip);
                clipPromises.push(this._loadClipAsync(`${clipContext}/${emitter.clips[i].clip}`, clip).then((objectURL) => {
                    const sound = (emitter._babylonSounds[i] = new Sound(name, objectURL, this._loader.babylonScene, null, options));
                    sound.refDistance = emitter.refDistance || 1;
                    sound.maxDistance = emitter.maxDistance || 256;
                    sound.rolloffFactor = emitter.rolloffFactor || 1;
                    sound.distanceModel = emitter.distanceModel || "exponential";
                }));
            }
            const promise = Promise.all(clipPromises).then(() => {
                const weights = emitter.clips.map((clip) => {
                    return clip.weight || 1;
                });
                const weightedSound = new WeightedSound(emitter.loop || false, emitter._babylonSounds, weights);
                if (emitter.innerAngle) {
                    weightedSound.directionalConeInnerAngle = 2 * Tools.ToDegrees(emitter.innerAngle);
                }
                if (emitter.outerAngle) {
                    weightedSound.directionalConeOuterAngle = 2 * Tools.ToDegrees(emitter.outerAngle);
                }
                if (emitter.volume) {
                    weightedSound.volume = emitter.volume;
                }
                emitter._babylonData.sound = weightedSound;
            });
            emitter._babylonData = {
                loaded: promise,
            };
        }
        return emitter._babylonData.loaded;
    }
    _getEventAction(context, sound, action, time, startOffset) {
        switch (action) {
            case "play" /* IMSFTAudioEmitter_AnimationEventAction.play */: {
                return (currentFrame) => {
                    const frameOffset = (startOffset || 0) + (currentFrame - time);
                    sound.play(frameOffset);
                };
            }
            case "stop" /* IMSFTAudioEmitter_AnimationEventAction.stop */: {
                return () => {
                    sound.stop();
                };
            }
            case "pause" /* IMSFTAudioEmitter_AnimationEventAction.pause */: {
                return () => {
                    sound.pause();
                };
            }
            default: {
                throw new Error(`${context}: Unsupported action ${action}`);
            }
        }
    }
    _loadAnimationEventAsync(context, animationContext, animation, event, babylonAnimationGroup) {
        if (babylonAnimationGroup.targetedAnimations.length == 0) {
            return Promise.resolve();
        }
        const babylonAnimation = babylonAnimationGroup.targetedAnimations[0];
        const emitterIndex = event.emitter;
        const emitter = ArrayItem.Get(`/extensions/${this.name}/emitters`, this._emitters, emitterIndex);
        return this._loadEmitterAsync(context, emitter).then(() => {
            const sound = emitter._babylonData.sound;
            if (sound) {
                const babylonAnimationEvent = new AnimationEvent(event.time, this._getEventAction(context, sound, event.action, event.time, event.startOffset));
                babylonAnimation.animation.addEvent(babylonAnimationEvent);
                // Make sure all started audio stops when this animation is terminated.
                babylonAnimationGroup.onAnimationGroupEndObservable.add(() => {
                    sound.stop();
                });
                babylonAnimationGroup.onAnimationGroupPauseObservable.add(() => {
                    sound.pause();
                });
            }
        });
    }
}
GLTFLoader.RegisterExtension(NAME, (loader) => new MSFT_audio_emitter(loader));
//# sourceMappingURL=MSFT_audio_emitter.js.map