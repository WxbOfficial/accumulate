import { Tools } from "../Misc/tools.js";
import { Observable } from "../Misc/observable.js";
import { Scene } from "../scene.js";
import { EngineStore } from "../Engines/engineStore.js";
import { Logger } from "../Misc/logger.js";

import { SceneLoaderFlags } from "./sceneLoaderFlags.js";
import { IsBase64DataUrl } from "../Misc/fileTools.js";
import { RuntimeError, ErrorCodes } from "../Misc/error.js";
import { RandomGUID } from "../Misc/guid.js";
import { Engine } from "../Engines/engine.js";
/**
 * Mode that determines how to handle old animation groups before loading new ones.
 */
export var SceneLoaderAnimationGroupLoadingMode;
(function (SceneLoaderAnimationGroupLoadingMode) {
    /**
     * Reset all old animations to initial state then dispose them.
     */
    SceneLoaderAnimationGroupLoadingMode[SceneLoaderAnimationGroupLoadingMode["Clean"] = 0] = "Clean";
    /**
     * Stop all old animations.
     */
    SceneLoaderAnimationGroupLoadingMode[SceneLoaderAnimationGroupLoadingMode["Stop"] = 1] = "Stop";
    /**
     * Restart old animations from first frame.
     */
    SceneLoaderAnimationGroupLoadingMode[SceneLoaderAnimationGroupLoadingMode["Sync"] = 2] = "Sync";
    /**
     * Old animations remains untouched.
     */
    SceneLoaderAnimationGroupLoadingMode[SceneLoaderAnimationGroupLoadingMode["NoSync"] = 3] = "NoSync";
})(SceneLoaderAnimationGroupLoadingMode || (SceneLoaderAnimationGroupLoadingMode = {}));
/**
 * Class used to load scene from various file formats using registered plugins
 * @see https://doc.babylonjs.com/features/featuresDeepDive/importers/loadingFileTypes
 */
export class SceneLoader {
    /**
     * Gets or sets a boolean indicating if entire scene must be loaded even if scene contains incremental data
     */
    static get ForceFullSceneLoadingForIncremental() {
        return SceneLoaderFlags.ForceFullSceneLoadingForIncremental;
    }
    static set ForceFullSceneLoadingForIncremental(value) {
        SceneLoaderFlags.ForceFullSceneLoadingForIncremental = value;
    }
    /**
     * Gets or sets a boolean indicating if loading screen must be displayed while loading a scene
     */
    static get ShowLoadingScreen() {
        return SceneLoaderFlags.ShowLoadingScreen;
    }
    static set ShowLoadingScreen(value) {
        SceneLoaderFlags.ShowLoadingScreen = value;
    }
    /**
     * Defines the current logging level (while loading the scene)
     * @ignorenaming
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    static get loggingLevel() {
        return SceneLoaderFlags.loggingLevel;
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    static set loggingLevel(value) {
        SceneLoaderFlags.loggingLevel = value;
    }
    /**
     * Gets or set a boolean indicating if matrix weights must be cleaned upon loading
     */
    static get CleanBoneMatrixWeights() {
        return SceneLoaderFlags.CleanBoneMatrixWeights;
    }
    static set CleanBoneMatrixWeights(value) {
        SceneLoaderFlags.CleanBoneMatrixWeights = value;
    }
    /**
     * Gets the default plugin (used to load Babylon files)
     * @returns the .babylon plugin
     */
    static GetDefaultPlugin() {
        return SceneLoader._RegisteredPlugins[".babylon"];
    }
    static _GetPluginForExtension(extension) {
        const registeredPlugin = SceneLoader._RegisteredPlugins[extension];
        if (registeredPlugin) {
            return registeredPlugin;
        }
        Logger.Warn("Unable to find a plugin to load " +
            extension +
            " files. Trying to use .babylon default plugin. To load from a specific filetype (eg. gltf) see: https://doc.babylonjs.com/features/featuresDeepDive/importers/loadingFileTypes");
        return SceneLoader.GetDefaultPlugin();
    }
    static _GetPluginForDirectLoad(data) {
        for (const extension in SceneLoader._RegisteredPlugins) {
            const plugin = SceneLoader._RegisteredPlugins[extension].plugin;
            if (plugin.canDirectLoad && plugin.canDirectLoad(data)) {
                return SceneLoader._RegisteredPlugins[extension];
            }
        }
        return SceneLoader.GetDefaultPlugin();
    }
    static _GetPluginForFilename(sceneFilename) {
        const queryStringPosition = sceneFilename.indexOf("?");
        if (queryStringPosition !== -1) {
            sceneFilename = sceneFilename.substring(0, queryStringPosition);
        }
        const dotPosition = sceneFilename.lastIndexOf(".");
        const extension = sceneFilename.substring(dotPosition, sceneFilename.length).toLowerCase();
        return SceneLoader._GetPluginForExtension(extension);
    }
    static _GetDirectLoad(sceneFilename) {
        if (sceneFilename.substr(0, 5) === "data:") {
            return sceneFilename.substr(5);
        }
        return null;
    }
    static _FormatErrorMessage(fileInfo, message, exception) {
        const fromLoad = fileInfo.rawData ? "binary data" : fileInfo.url;
        let errorMessage = "Unable to load from " + fromLoad;
        if (message) {
            errorMessage += `: ${message}`;
        }
        else if (exception) {
            errorMessage += `: ${exception}`;
        }
        return errorMessage;
    }
    static _LoadData(fileInfo, scene, onSuccess, onProgress, onError, onDispose, pluginExtension, name) {
        const directLoad = SceneLoader._GetDirectLoad(fileInfo.url);
        if (fileInfo.rawData && !pluginExtension) {
            // eslint-disable-next-line no-throw-literal
            throw "When using ArrayBufferView to load data the file extension must be provided.";
        }
        const registeredPlugin = pluginExtension
            ? SceneLoader._GetPluginForExtension(pluginExtension)
            : directLoad
                ? SceneLoader._GetPluginForDirectLoad(fileInfo.url)
                : SceneLoader._GetPluginForFilename(fileInfo.url);
        if (fileInfo.rawData && !registeredPlugin.isBinary) {
            // eslint-disable-next-line no-throw-literal
            throw "Loading from ArrayBufferView can not be used with plugins that don't support binary loading.";
        }
        const plugin = registeredPlugin.plugin.createPlugin?.() ?? registeredPlugin.plugin;
        if (!plugin) {
            // eslint-disable-next-line no-throw-literal
            throw "The loader plugin corresponding to the file type you are trying to load has not been found. If using es6, please import the plugin you wish to use before.";
        }
        SceneLoader.OnPluginActivatedObservable.notifyObservers(plugin);
        // Check if we have a direct load url. If the plugin is registered to handle
        // it or it's not a base64 data url, then pass it through the direct load path.
        if (directLoad && ((plugin.canDirectLoad && plugin.canDirectLoad(fileInfo.url)) || !IsBase64DataUrl(fileInfo.url))) {
            if (plugin.directLoad) {
                const result = plugin.directLoad(scene, directLoad);
                if (result instanceof Promise) {
                    result
                        .then((data) => {
                        onSuccess(plugin, data);
                    })
                        .catch((error) => {
                        onError("Error in directLoad of _loadData: " + error, error);
                    });
                }
                else {
                    onSuccess(plugin, result);
                }
            }
            else {
                onSuccess(plugin, directLoad);
            }
            return plugin;
        }
        const useArrayBuffer = registeredPlugin.isBinary;
        const dataCallback = (data, responseURL) => {
            if (scene.isDisposed) {
                onError("Scene has been disposed");
                return;
            }
            onSuccess(plugin, data, responseURL);
        };
        let request = null;
        let pluginDisposed = false;
        plugin.onDisposeObservable?.add(() => {
            pluginDisposed = true;
            if (request) {
                request.abort();
                request = null;
            }
            onDispose();
        });
        const manifestChecked = () => {
            if (pluginDisposed) {
                return;
            }
            const errorCallback = (request, exception) => {
                onError(request?.statusText, exception);
            };
            if (!plugin.loadFile && fileInfo.rawData) {
                // eslint-disable-next-line no-throw-literal
                throw "Plugin does not support loading ArrayBufferView.";
            }
            request = plugin.loadFile
                ? plugin.loadFile(scene, fileInfo.rawData || fileInfo.file || fileInfo.url, fileInfo.rootUrl, dataCallback, onProgress, useArrayBuffer, errorCallback, name)
                : scene._loadFile(fileInfo.file || fileInfo.url, dataCallback, onProgress, true, useArrayBuffer, errorCallback);
        };
        const engine = scene.getEngine();
        let canUseOfflineSupport = engine.enableOfflineSupport;
        if (canUseOfflineSupport) {
            // Also check for exceptions
            let exceptionFound = false;
            for (const regex of scene.disableOfflineSupportExceptionRules) {
                if (regex.test(fileInfo.url)) {
                    exceptionFound = true;
                    break;
                }
            }
            canUseOfflineSupport = !exceptionFound;
        }
        if (canUseOfflineSupport && Engine.OfflineProviderFactory) {
            // Checking if a manifest file has been set for this scene and if offline mode has been requested
            scene.offlineProvider = Engine.OfflineProviderFactory(fileInfo.url, manifestChecked, engine.disableManifestCheck);
        }
        else {
            manifestChecked();
        }
        return plugin;
    }
    static _GetFileInfo(rootUrl, sceneFilename) {
        let url;
        let name;
        let file = null;
        let rawData = null;
        if (!sceneFilename) {
            url = rootUrl;
            name = Tools.GetFilename(rootUrl);
            rootUrl = Tools.GetFolderPath(rootUrl);
        }
        else if (sceneFilename.name) {
            const sceneFile = sceneFilename;
            url = `file:${sceneFile.name}`;
            name = sceneFile.name;
            file = sceneFile;
        }
        else if (ArrayBuffer.isView(sceneFilename)) {
            url = "";
            name = RandomGUID();
            rawData = sceneFilename;
        }
        else if (typeof sceneFilename === "string" && sceneFilename.startsWith("data:")) {
            url = sceneFilename;
            name = "";
        }
        else {
            const filename = sceneFilename;
            if (filename.substr(0, 1) === "/") {
                Tools.Error("Wrong sceneFilename parameter");
                return null;
            }
            url = rootUrl + filename;
            name = filename;
        }
        return {
            url: url,
            rootUrl: rootUrl,
            name: name,
            file: file,
            rawData,
        };
    }
    // Public functions
    /**
     * Gets a plugin that can load the given extension
     * @param extension defines the extension to load
     * @returns a plugin or null if none works
     */
    static GetPluginForExtension(extension) {
        return SceneLoader._GetPluginForExtension(extension).plugin;
    }
    /**
     * Gets a boolean indicating that the given extension can be loaded
     * @param extension defines the extension to load
     * @returns true if the extension is supported
     */
    static IsPluginForExtensionAvailable(extension) {
        return !!SceneLoader._RegisteredPlugins[extension];
    }
    /**
     * Adds a new plugin to the list of registered plugins
     * @param plugin defines the plugin to add
     */
    static RegisterPlugin(plugin) {
        if (typeof plugin.extensions === "string") {
            const extension = plugin.extensions;
            SceneLoader._RegisteredPlugins[extension.toLowerCase()] = {
                plugin: plugin,
                isBinary: false,
            };
        }
        else {
            const extensions = plugin.extensions;
            Object.keys(extensions).forEach((extension) => {
                SceneLoader._RegisteredPlugins[extension.toLowerCase()] = {
                    plugin: plugin,
                    isBinary: extensions[extension].isBinary,
                };
            });
        }
    }
    /**
     * Import meshes into a scene
     * @param meshNames an array of mesh names, a single mesh name, or empty string for all meshes that filter what meshes are imported
     * @param rootUrl a string that defines the root url for the scene and resources or the concatenation of rootURL and filename (e.g. http://example.com/test.glb)
     * @param sceneFilename a string that defines the name of the scene file or starts with "data:" following by the stringified version of the scene or a File object (default: empty string)
     * @param scene the instance of BABYLON.Scene to append to
     * @param onSuccess a callback with a list of imported meshes, particleSystems, skeletons, and animationGroups when import succeeds
     * @param onProgress a callback with a progress event for each file being loaded
     * @param onError a callback with the scene, a message, and possibly an exception when import fails
     * @param pluginExtension the extension used to determine the plugin
     * @param name defines the name of the file, if the data is binary
     * @returns The loaded plugin
     */
    static ImportMesh(meshNames, rootUrl, sceneFilename = "", scene = EngineStore.LastCreatedScene, onSuccess = null, onProgress = null, onError = null, pluginExtension = null, name = "") {
        if (!scene) {
            Logger.Error("No scene available to import mesh to");
            return null;
        }
        const fileInfo = SceneLoader._GetFileInfo(rootUrl, sceneFilename);
        if (!fileInfo) {
            return null;
        }
        const loadingToken = {};
        scene.addPendingData(loadingToken);
        const disposeHandler = () => {
            scene.removePendingData(loadingToken);
        };
        const errorHandler = (message, exception) => {
            const errorMessage = SceneLoader._FormatErrorMessage(fileInfo, message, exception);
            if (onError) {
                onError(scene, errorMessage, new RuntimeError(errorMessage, ErrorCodes.SceneLoaderError, exception));
            }
            else {
                Logger.Error(errorMessage);
                // should the exception be thrown?
            }
            disposeHandler();
        };
        const progressHandler = onProgress
            ? (event) => {
                try {
                    onProgress(event);
                }
                catch (e) {
                    errorHandler("Error in onProgress callback: " + e, e);
                }
            }
            : undefined;
        const successHandler = (meshes, particleSystems, skeletons, animationGroups, transformNodes, geometries, lights, spriteManagers) => {
            scene.importedMeshesFiles.push(fileInfo.url);
            if (onSuccess) {
                try {
                    onSuccess(meshes, particleSystems, skeletons, animationGroups, transformNodes, geometries, lights, spriteManagers);
                }
                catch (e) {
                    errorHandler("Error in onSuccess callback: " + e, e);
                }
            }
            scene.removePendingData(loadingToken);
        };
        return SceneLoader._LoadData(fileInfo, scene, (plugin, data, responseURL) => {
            if (plugin.rewriteRootURL) {
                fileInfo.rootUrl = plugin.rewriteRootURL(fileInfo.rootUrl, responseURL);
            }
            if (plugin.importMesh) {
                const syncedPlugin = plugin;
                const meshes = [];
                const particleSystems = [];
                const skeletons = [];
                if (!syncedPlugin.importMesh(meshNames, scene, data, fileInfo.rootUrl, meshes, particleSystems, skeletons, errorHandler)) {
                    return;
                }
                scene.loadingPluginName = plugin.name;
                successHandler(meshes, particleSystems, skeletons, [], [], [], [], []);
            }
            else {
                const asyncedPlugin = plugin;
                asyncedPlugin
                    .importMeshAsync(meshNames, scene, data, fileInfo.rootUrl, progressHandler, fileInfo.name)
                    .then((result) => {
                    scene.loadingPluginName = plugin.name;
                    successHandler(result.meshes, result.particleSystems, result.skeletons, result.animationGroups, result.transformNodes, result.geometries, result.lights, result.spriteManagers);
                })
                    .catch((error) => {
                    errorHandler(error.message, error);
                });
            }
        }, progressHandler, errorHandler, disposeHandler, pluginExtension, name);
    }
    /**
     * Import meshes into a scene
     * @param meshNames an array of mesh names, a single mesh name, or empty string for all meshes that filter what meshes are imported
     * @param rootUrl a string that defines the root url for the scene and resources or the concatenation of rootURL and filename (e.g. http://example.com/test.glb)
     * @param sceneFilename a string that defines the name of the scene file or starts with "data:" following by the stringified version of the scene or a File object (default: empty string)
     * @param scene the instance of BABYLON.Scene to append to
     * @param onProgress a callback with a progress event for each file being loaded
     * @param pluginExtension the extension used to determine the plugin
     * @param name defines the name of the file
     * @returns The loaded list of imported meshes, particle systems, skeletons, and animation groups
     */
    static ImportMeshAsync(meshNames, rootUrl, sceneFilename = "", scene = EngineStore.LastCreatedScene, onProgress = null, pluginExtension = null, name = "") {
        return new Promise((resolve, reject) => {
            SceneLoader.ImportMesh(meshNames, rootUrl, sceneFilename, scene, (meshes, particleSystems, skeletons, animationGroups, transformNodes, geometries, lights, spriteManagers) => {
                resolve({
                    meshes: meshes,
                    particleSystems: particleSystems,
                    skeletons: skeletons,
                    animationGroups: animationGroups,
                    transformNodes: transformNodes,
                    geometries: geometries,
                    lights: lights,
                    spriteManagers: spriteManagers,
                });
            }, onProgress, (scene, message, exception) => {
                reject(exception || new Error(message));
            }, pluginExtension, name);
        });
    }
    /**
     * Load a scene
     * @param rootUrl a string that defines the root url for the scene and resources or the concatenation of rootURL and filename (e.g. http://example.com/test.glb)
     * @param sceneFilename a string that defines the name of the scene file or starts with "data:" following by the stringified version of the scene or a File object (default: empty string)
     * @param engine is the instance of BABYLON.Engine to use to create the scene
     * @param onSuccess a callback with the scene when import succeeds
     * @param onProgress a callback with a progress event for each file being loaded
     * @param onError a callback with the scene, a message, and possibly an exception when import fails
     * @param pluginExtension the extension used to determine the plugin
     * @param name defines the filename, if the data is binary
     * @returns The loaded plugin
     */
    static Load(rootUrl, sceneFilename = "", engine = EngineStore.LastCreatedEngine, onSuccess = null, onProgress = null, onError = null, pluginExtension = null, name = "") {
        if (!engine) {
            Tools.Error("No engine available");
            return null;
        }
        return SceneLoader.Append(rootUrl, sceneFilename, new Scene(engine), onSuccess, onProgress, onError, pluginExtension, name);
    }
    /**
     * Load a scene
     * @param rootUrl a string that defines the root url for the scene and resources or the concatenation of rootURL and filename (e.g. http://example.com/test.glb)
     * @param sceneFilename a string that defines the name of the scene file or starts with "data:" following by the stringified version of the scene or a File object (default: empty string)
     * @param engine is the instance of BABYLON.Engine to use to create the scene
     * @param onProgress a callback with a progress event for each file being loaded
     * @param pluginExtension the extension used to determine the plugin
     * @param name defines the filename, if the data is binary
     * @returns The loaded scene
     */
    static LoadAsync(rootUrl, sceneFilename = "", engine = EngineStore.LastCreatedEngine, onProgress = null, pluginExtension = null, name = "") {
        return new Promise((resolve, reject) => {
            SceneLoader.Load(rootUrl, sceneFilename, engine, (scene) => {
                resolve(scene);
            }, onProgress, (scene, message, exception) => {
                reject(exception || new Error(message));
            }, pluginExtension, name);
        });
    }
    /**
     * Append a scene
     * @param rootUrl a string that defines the root url for the scene and resources or the concatenation of rootURL and filename (e.g. http://example.com/test.glb)
     * @param sceneFilename a string that defines the name of the scene file or starts with "data:" following by the stringified version of the scene or a File object (default: empty string)
     * @param scene is the instance of BABYLON.Scene to append to
     * @param onSuccess a callback with the scene when import succeeds
     * @param onProgress a callback with a progress event for each file being loaded
     * @param onError a callback with the scene, a message, and possibly an exception when import fails
     * @param pluginExtension the extension used to determine the plugin
     * @param name defines the name of the file, if the data is binary
     * @returns The loaded plugin
     */
    static Append(rootUrl, sceneFilename = "", scene = EngineStore.LastCreatedScene, onSuccess = null, onProgress = null, onError = null, pluginExtension = null, name = "") {
        if (!scene) {
            Logger.Error("No scene available to append to");
            return null;
        }
        const fileInfo = SceneLoader._GetFileInfo(rootUrl, sceneFilename);
        if (!fileInfo) {
            return null;
        }
        const loadingToken = {};
        scene.addPendingData(loadingToken);
        const disposeHandler = () => {
            scene.removePendingData(loadingToken);
        };
        if (SceneLoader.ShowLoadingScreen && !this._ShowingLoadingScreen) {
            this._ShowingLoadingScreen = true;
            scene.getEngine().displayLoadingUI();
            scene.executeWhenReady(() => {
                scene.getEngine().hideLoadingUI();
                this._ShowingLoadingScreen = false;
            });
        }
        const errorHandler = (message, exception) => {
            const errorMessage = SceneLoader._FormatErrorMessage(fileInfo, message, exception);
            if (onError) {
                onError(scene, errorMessage, new RuntimeError(errorMessage, ErrorCodes.SceneLoaderError, exception));
            }
            else {
                Logger.Error(errorMessage);
                // should the exception be thrown?
            }
            disposeHandler();
        };
        const progressHandler = onProgress
            ? (event) => {
                try {
                    onProgress(event);
                }
                catch (e) {
                    errorHandler("Error in onProgress callback", e);
                }
            }
            : undefined;
        const successHandler = () => {
            if (onSuccess) {
                try {
                    onSuccess(scene);
                }
                catch (e) {
                    errorHandler("Error in onSuccess callback", e);
                }
            }
            scene.removePendingData(loadingToken);
        };
        return SceneLoader._LoadData(fileInfo, scene, (plugin, data) => {
            if (plugin.load) {
                const syncedPlugin = plugin;
                if (!syncedPlugin.load(scene, data, fileInfo.rootUrl, errorHandler)) {
                    return;
                }
                scene.loadingPluginName = plugin.name;
                successHandler();
            }
            else {
                const asyncedPlugin = plugin;
                asyncedPlugin
                    .loadAsync(scene, data, fileInfo.rootUrl, progressHandler, fileInfo.name)
                    .then(() => {
                    scene.loadingPluginName = plugin.name;
                    successHandler();
                })
                    .catch((error) => {
                    errorHandler(error.message, error);
                });
            }
        }, progressHandler, errorHandler, disposeHandler, pluginExtension, name);
    }
    /**
     * Append a scene
     * @param rootUrl a string that defines the root url for the scene and resources or the concatenation of rootURL and filename (e.g. http://example.com/test.glb)
     * @param sceneFilename a string that defines the name of the scene file or starts with "data:" following by the stringified version of the scene or a File object (default: empty string)
     * @param scene is the instance of BABYLON.Scene to append to
     * @param onProgress a callback with a progress event for each file being loaded
     * @param pluginExtension the extension used to determine the plugin
     * @param name defines the name of the file, if the data is binary
     * @returns The given scene
     */
    static AppendAsync(rootUrl, sceneFilename = "", scene = EngineStore.LastCreatedScene, onProgress = null, pluginExtension = null, name = "") {
        return new Promise((resolve, reject) => {
            SceneLoader.Append(rootUrl, sceneFilename, scene, (scene) => {
                resolve(scene);
            }, onProgress, (scene, message, exception) => {
                reject(exception || new Error(message));
            }, pluginExtension, name);
        });
    }
    /**
     * Load a scene into an asset container
     * @param rootUrl a string that defines the root url for the scene and resources or the concatenation of rootURL and filename (e.g. http://example.com/test.glb)
     * @param sceneFilename a string that defines the name of the scene file or starts with "data:" following by the stringified version of the scene or a File object (default: empty string)
     * @param scene is the instance of BABYLON.Scene to append to (default: last created scene)
     * @param onSuccess a callback with the scene when import succeeds
     * @param onProgress a callback with a progress event for each file being loaded
     * @param onError a callback with the scene, a message, and possibly an exception when import fails
     * @param pluginExtension the extension used to determine the plugin
     * @param name defines the filename, if the data is binary
     * @returns The loaded plugin
     */
    static LoadAssetContainer(rootUrl, sceneFilename = "", scene = EngineStore.LastCreatedScene, onSuccess = null, onProgress = null, onError = null, pluginExtension = null, name = "") {
        if (!scene) {
            Logger.Error("No scene available to load asset container to");
            return null;
        }
        const fileInfo = SceneLoader._GetFileInfo(rootUrl, sceneFilename);
        if (!fileInfo) {
            return null;
        }
        const loadingToken = {};
        scene.addPendingData(loadingToken);
        const disposeHandler = () => {
            scene.removePendingData(loadingToken);
        };
        const errorHandler = (message, exception) => {
            const errorMessage = SceneLoader._FormatErrorMessage(fileInfo, message, exception);
            if (onError) {
                onError(scene, errorMessage, new RuntimeError(errorMessage, ErrorCodes.SceneLoaderError, exception));
            }
            else {
                Logger.Error(errorMessage);
                // should the exception be thrown?
            }
            disposeHandler();
        };
        const progressHandler = onProgress
            ? (event) => {
                try {
                    onProgress(event);
                }
                catch (e) {
                    errorHandler("Error in onProgress callback", e);
                }
            }
            : undefined;
        const successHandler = (assets) => {
            if (onSuccess) {
                try {
                    onSuccess(assets);
                }
                catch (e) {
                    errorHandler("Error in onSuccess callback", e);
                }
            }
            scene.removePendingData(loadingToken);
        };
        return SceneLoader._LoadData(fileInfo, scene, (plugin, data) => {
            if (plugin.loadAssetContainer) {
                const syncedPlugin = plugin;
                const assetContainer = syncedPlugin.loadAssetContainer(scene, data, fileInfo.rootUrl, errorHandler);
                if (!assetContainer) {
                    return;
                }
                assetContainer.populateRootNodes();
                scene.loadingPluginName = plugin.name;
                successHandler(assetContainer);
            }
            else if (plugin.loadAssetContainerAsync) {
                const asyncedPlugin = plugin;
                asyncedPlugin
                    .loadAssetContainerAsync(scene, data, fileInfo.rootUrl, progressHandler, fileInfo.name)
                    .then((assetContainer) => {
                    assetContainer.populateRootNodes();
                    scene.loadingPluginName = plugin.name;
                    successHandler(assetContainer);
                })
                    .catch((error) => {
                    errorHandler(error.message, error);
                });
            }
            else {
                errorHandler("LoadAssetContainer is not supported by this plugin. Plugin did not provide a loadAssetContainer or loadAssetContainerAsync method.");
            }
        }, progressHandler, errorHandler, disposeHandler, pluginExtension, name);
    }
    /**
     * Load a scene into an asset container
     * @param rootUrl a string that defines the root url for the scene and resources or the concatenation of rootURL and filename (e.g. http://example.com/test.glb)
     * @param sceneFilename a string that defines the name of the scene file or starts with "data:" following by the stringified version of the scene (default: empty string)
     * @param scene is the instance of Scene to append to
     * @param onProgress a callback with a progress event for each file being loaded
     * @param pluginExtension the extension used to determine the plugin
     * @returns The loaded asset container
     */
    static LoadAssetContainerAsync(rootUrl, sceneFilename = "", scene = EngineStore.LastCreatedScene, onProgress = null, pluginExtension = null) {
        return new Promise((resolve, reject) => {
            SceneLoader.LoadAssetContainer(rootUrl, sceneFilename, scene, (assetContainer) => {
                resolve(assetContainer);
            }, onProgress, (scene, message, exception) => {
                reject(exception || new Error(message));
            }, pluginExtension);
        });
    }
    /**
     * Import animations from a file into a scene
     * @param rootUrl a string that defines the root url for the scene and resources or the concatenation of rootURL and filename (e.g. http://example.com/test.glb)
     * @param sceneFilename a string that defines the name of the scene file or starts with "data:" following by the stringified version of the scene or a File object (default: empty string)
     * @param scene is the instance of BABYLON.Scene to append to (default: last created scene)
     * @param overwriteAnimations when true, animations are cleaned before importing new ones. Animations are appended otherwise
     * @param animationGroupLoadingMode defines how to handle old animations groups before importing new ones
     * @param targetConverter defines a function used to convert animation targets from loaded scene to current scene (default: search node by name)
     * @param onSuccess a callback with the scene when import succeeds
     * @param onProgress a callback with a progress event for each file being loaded
     * @param onError a callback with the scene, a message, and possibly an exception when import fails
     * @param pluginExtension the extension used to determine the plugin
     */
    static ImportAnimations(rootUrl, sceneFilename = "", scene = EngineStore.LastCreatedScene, overwriteAnimations = true, animationGroupLoadingMode = SceneLoaderAnimationGroupLoadingMode.Clean, targetConverter = null, onSuccess = null, onProgress = null, onError = null, pluginExtension = null) {
        if (!scene) {
            Logger.Error("No scene available to load animations to");
            return;
        }
        if (overwriteAnimations) {
            // Reset, stop and dispose all animations before loading new ones
            for (const animatable of scene.animatables) {
                animatable.reset();
            }
            scene.stopAllAnimations();
            scene.animationGroups.slice().forEach((animationGroup) => {
                animationGroup.dispose();
            });
            const nodes = scene.getNodes();
            nodes.forEach((node) => {
                if (node.animations) {
                    node.animations = [];
                }
            });
        }
        else {
            switch (animationGroupLoadingMode) {
                case SceneLoaderAnimationGroupLoadingMode.Clean:
                    scene.animationGroups.slice().forEach((animationGroup) => {
                        animationGroup.dispose();
                    });
                    break;
                case SceneLoaderAnimationGroupLoadingMode.Stop:
                    scene.animationGroups.forEach((animationGroup) => {
                        animationGroup.stop();
                    });
                    break;
                case SceneLoaderAnimationGroupLoadingMode.Sync:
                    scene.animationGroups.forEach((animationGroup) => {
                        animationGroup.reset();
                        animationGroup.restart();
                    });
                    break;
                case SceneLoaderAnimationGroupLoadingMode.NoSync:
                    // nothing to do
                    break;
                default:
                    Logger.Error("Unknown animation group loading mode value '" + animationGroupLoadingMode + "'");
                    return;
            }
        }
        const startingIndexForNewAnimatables = scene.animatables.length;
        const onAssetContainerLoaded = (container) => {
            container.mergeAnimationsTo(scene, scene.animatables.slice(startingIndexForNewAnimatables), targetConverter);
            container.dispose();
            scene.onAnimationFileImportedObservable.notifyObservers(scene);
            if (onSuccess) {
                onSuccess(scene);
            }
        };
        this.LoadAssetContainer(rootUrl, sceneFilename, scene, onAssetContainerLoaded, onProgress, onError, pluginExtension);
    }
    /**
     * Import animations from a file into a scene
     * @param rootUrl a string that defines the root url for the scene and resources or the concatenation of rootURL and filename (e.g. http://example.com/test.glb)
     * @param sceneFilename a string that defines the name of the scene file or starts with "data:" following by the stringified version of the scene or a File object (default: empty string)
     * @param scene is the instance of BABYLON.Scene to append to (default: last created scene)
     * @param overwriteAnimations when true, animations are cleaned before importing new ones. Animations are appended otherwise
     * @param animationGroupLoadingMode defines how to handle old animations groups before importing new ones
     * @param targetConverter defines a function used to convert animation targets from loaded scene to current scene (default: search node by name)
     * @param onSuccess a callback with the scene when import succeeds
     * @param onProgress a callback with a progress event for each file being loaded
     * @param onError a callback with the scene, a message, and possibly an exception when import fails
     * @param pluginExtension the extension used to determine the plugin
     * @returns the updated scene with imported animations
     */
    static ImportAnimationsAsync(rootUrl, sceneFilename = "", scene = EngineStore.LastCreatedScene, overwriteAnimations = true, animationGroupLoadingMode = SceneLoaderAnimationGroupLoadingMode.Clean, targetConverter = null, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSuccess = null, onProgress = null, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onError = null, pluginExtension = null) {
        return new Promise((resolve, reject) => {
            SceneLoader.ImportAnimations(rootUrl, sceneFilename, scene, overwriteAnimations, animationGroupLoadingMode, targetConverter, (_scene) => {
                resolve(_scene);
            }, onProgress, (_scene, message, exception) => {
                reject(exception || new Error(message));
            }, pluginExtension);
        });
    }
}
/**
 * No logging while loading
 */
SceneLoader.NO_LOGGING = 0;
/**
 * Minimal logging while loading
 */
SceneLoader.MINIMAL_LOGGING = 1;
/**
 * Summary logging while loading
 */
SceneLoader.SUMMARY_LOGGING = 2;
/**
 * Detailed logging while loading
 */
SceneLoader.DETAILED_LOGGING = 3;
// Members
/**
 * Event raised when a plugin is used to load a scene
 */
SceneLoader.OnPluginActivatedObservable = new Observable();
SceneLoader._RegisteredPlugins = {};
SceneLoader._ShowingLoadingScreen = false;
//# sourceMappingURL=sceneLoader.js.map