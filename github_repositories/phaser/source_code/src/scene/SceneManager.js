/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var CONST = require('./const');
var Events = require('./events');
var GameEvents = require('../core/events');
var GetValue = require('../utils/object/GetValue');
var LoaderEvents = require('../loader/events');
var NOOP = require('../utils/NOOP');
var Scene = require('./Scene');
var Systems = require('./Systems');

/**
 * @classdesc
 * The Scene Manager.
 *
 * The Scene Manager is a Game level system, responsible for creating, processing and updating all of the
 * Scenes in a Game instance.
 *
 * You should not usually interact directly with the Scene Manager at all. Instead, you should use
 * the Scene Plugin, which is available from every Scene in your game via the `this.scene` property.
 *
 * Using methods in this Scene Manager directly will break queued operations and can cause runtime
 * errors. Instead, go via the Scene Plugin. Every feature this Scene Manager provides is also
 * available via the Scene Plugin.
 *
 * @class SceneManager
 * @memberof Phaser.Scenes
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Game} game - The Phaser.Game instance this Scene Manager belongs to.
 * @param {object} sceneConfig - Scene specific configuration settings.
 */
var SceneManager = new Class({

    initialize:

    function SceneManager (game, sceneConfig)
    {
        console.group('SceneManager');
        /**
         * The Game that this SceneManager belongs to.
         *
         * @name Phaser.Scenes.SceneManager#game
         * @type {Phaser.Game}
         * @since 3.0.0
         */
        this.game = game;

        /**
         * An object that maps the keys to the scene so we can quickly get a scene from a key without iteration.
         *
         * @name Phaser.Scenes.SceneManager#keys
         * @type {Record<string, Phaser.Scene>}
         * @since 3.0.0
         */
        this.keys = {};

        /**
         * The array in which all of the scenes are kept.
         *
         * @name Phaser.Scenes.SceneManager#scenes
         * @type {Phaser.Scene[]}
         * @since 3.0.0
         */
        this.scenes = [];

        /**
         * Scenes pending to be added are stored in here until the manager has time to add it.
         *
         * @name Phaser.Scenes.SceneManager#_pending
         * @type {array}
         * @private
         * @since 3.0.0
         */
        this._pending = [];

        /**
         * An array of scenes waiting to be started once the game has booted.
         *
         * @name Phaser.Scenes.SceneManager#_start
         * @type {array}
         * @private
         * @since 3.0.0
         */
        this._start = [];

        /**
         * An operations queue, because we don't manipulate the scenes array during processing.
         *
         * @name Phaser.Scenes.SceneManager#_queue
         * @type {array}
         * @private
         * @since 3.0.0
         */
        this._queue = [];

        /**
         * Boot time data to merge.
         *
         * @name Phaser.Scenes.SceneManager#_data
         * @type {object}
         * @private
         * @since 3.4.0
         */
        this._data = {};

        /**
         * Is the Scene Manager actively processing the Scenes list?
         *
         * @name Phaser.Scenes.SceneManager#isProcessing
         * @type {boolean}
         * @default false
         * @readonly
         * @since 3.0.0
         */
        this.isProcessing = false;

        /**
         * Has the Scene Manager properly started?
         *
         * @name Phaser.Scenes.SceneManager#isBooted
         * @type {boolean}
         * @default false
         * @readonly
         * @since 3.4.0
         */
        this.isBooted = false;

        /**
         * Do any of the Cameras in any of the Scenes require a custom viewport?
         * If not we can skip scissor tests.
         *
         * @name Phaser.Scenes.SceneManager#customViewports
         * @type {number}
         * @default 0
         * @since 3.12.0
         */
        this.customViewports = 0;

        /**
         * This system Scene is created during `bootQueue` and is a default
         * empty Scene that lives outside of the Scene list, but can be used
         * by plugins and managers that need access to a live Scene, without
         * being tied to one.
         *
         * @name Phaser.Scenes.SceneManager#systemScene
         * @type {Phaser.Scene}
         * @since 3.60.0
         */
        this.systemScene;

        if (sceneConfig)
        {
            if (!Array.isArray(sceneConfig))
            {
                sceneConfig = [ sceneConfig ];
            }

            for (var i = 0; i < sceneConfig.length; i++)
            {
                //  The i === 0 part just autostarts the first Scene given (unless it says otherwise in its config)
                this._pending.push({
                    key: 'default',
                    scene: sceneConfig[i],
                    autoStart: (i === 0),
                    data: {}
                });
            }
        }

        game.events.once(GameEvents.READY, this.bootQueue, this);
        console.groupEnd();
    },

    /**
     * Internal first-time Scene boot handler.
     *
     * @method Phaser.Scenes.SceneManager#bootQueue
     * @private
     * @fires Phaser.Core.Events#SYSTEM_READY
     * @since 3.2.0
     */
    bootQueue: function ()
    {
        console.group('SceneManager bootQueue');
        if (this.isBooted)
        {
            console.groupEnd();
            return;
        }

        //  Create the system Scene
        this.systemScene = this.createSceneFromInstance('__SYSTEM', new Scene());

        this.game.events.emit(GameEvents.SYSTEM_READY, this.systemScene, this);

        var i;
        var entry;
        var key;
        var sceneConfig;

        for (i = 0; i < this._pending.length; i++)
        {
            entry = this._pending[i];

            key = entry.key;
            sceneConfig = entry.scene;

            var newScene;

            if (sceneConfig instanceof Scene)
            {
                newScene = this.createSceneFromInstance(key, sceneConfig);
            }
            else if (typeof sceneConfig === 'object')
            {
                newScene = this.createSceneFromObject(key, sceneConfig);
            }
            else if (typeof sceneConfig === 'function')
            {
                newScene = this.createSceneFromFunction(key, sceneConfig);
            }

            //  Replace key in case the scene changed it
            key = newScene.sys.settings.key;

            this.keys[key] = newScene;

            this.scenes.push(newScene);

            //  Any data to inject?
            if (this._data[key])
            {
                newScene.sys.settings.data = this._data[key].data;

                if (this._data[key].autoStart)
                {
                    entry.autoStart = true;
                }
            }

            if (entry.autoStart || newScene.sys.settings.active)
            {
                this._start.push(key);
            }
        }

        //  Clear the pending lists
        this._pending.length = 0;

        this._data = {};

        this.isBooted = true;

        //  _start might have been populated by the above
        for (i = 0; i < this._start.length; i++)
        {
            entry = this._start[i];

            this.start(entry);
        }

        this._start.length = 0;
        console.groupEnd();
    },

    /**
     * Process the Scene operations queue.
     *
     * @method Phaser.Scenes.SceneManager#processQueue
     * @since 3.0.0
     */
    processQueue: function ()
    {
        console.group('SceneManager processQueue');
        var pendingLength = this._pending.length;
        var queueLength = this._queue.length;

        if (pendingLength === 0 && queueLength === 0)
        {
            console.groupEnd();
            return;
        }

        var i;
        var entry;

        if (pendingLength)
        {
            for (i = 0; i < pendingLength; i++)
            {
                entry = this._pending[i];

                this.add(entry.key, entry.scene, entry.autoStart, entry.data);
            }

            //  _start might have been populated by this.add
            for (i = 0; i < this._start.length; i++)
            {
                entry = this._start[i];

                this.start(entry);
            }

            //  Clear the pending lists
            this._start.length = 0;
            this._pending.length = 0;
        }

        for (i = 0; i < this._queue.length; i++)
        {
            entry = this._queue[i];

            this[entry.op](entry.keyA, entry.keyB, entry.data);
        }

        this._queue.length = 0;
        console.groupEnd();
    },

    /**
     * Adds a new Scene into the SceneManager.
     * You must give each Scene a unique key by which you'll identify it.
     *
     * The `sceneConfig` can be:
     *
     * * A `Phaser.Scene` object, or an object that extends it.
     * * A plain JavaScript object
     * * A JavaScript ES6 Class that extends `Phaser.Scene`
     * * A JavaScript ES5 prototype based Class
     * * A JavaScript function
     *
     * If a function is given then a new Scene will be created by calling it.
     *
     * @method Phaser.Scenes.SceneManager#add
     * @since 3.0.0
     *
     * @param {string} key - A unique key used to reference the Scene, i.e. `MainMenu` or `Level1`.
     * @param {(Phaser.Types.Scenes.SceneType)} sceneConfig - The config for the Scene
     * @param {boolean} [autoStart=false] - If `true` the Scene will be started immediately after being added.
     * @param {object} [data] - Optional data object. This will be set as `Scene.settings.data` and passed to `Scene.init`, and `Scene.create`.
     *
     * @return {?Phaser.Scene} The added Scene, if it was added immediately, otherwise `null`.
     */
    add: function (key, sceneConfig, autoStart, data)
    {
        console.group('SceneManager add');
        if (autoStart === undefined) { autoStart = false; }
        if (data === undefined) { data = {}; }

        //  If processing or not booted then put scene into a holding pattern
        if (this.isProcessing || !this.isBooted)
        {
            this._pending.push({
                key: key,
                scene: sceneConfig,
                autoStart: autoStart,
                data: data
            });

            if (!this.isBooted)
            {
                this._data[key] = { data: data };
            }

            console.groupEnd();
            return null;
        }

        key = this.getKey(key, sceneConfig);

        var newScene;

        if (sceneConfig instanceof Scene)
        {
            newScene = this.createSceneFromInstance(key, sceneConfig);
        }
        else if (typeof sceneConfig === 'object')
        {
            sceneConfig.key = key;

            newScene = this.createSceneFromObject(key, sceneConfig);
        }
        else if (typeof sceneConfig === 'function')
        {
            newScene = this.createSceneFromFunction(key, sceneConfig);
        }

        //  Any data to inject?
        newScene.sys.settings.data = data;

        //  Replace key in case the scene changed it
        key = newScene.sys.settings.key;

        this.keys[key] = newScene;

        this.scenes.push(newScene);

        if (autoStart || newScene.sys.settings.active)
        {
            if (this._pending.length)
            {
                this._start.push(key);
            }
            else
            {
                this.start(key);
            }
        }

        console.groupEnd();
        return newScene;
    },

    /**
     * Removes a Scene from the SceneManager.
     *
     * The Scene is removed from the local scenes array, it's key is cleared from the keys
     * cache and Scene.Systems.destroy is then called on it.
     *
     * If the SceneManager is processing the Scenes when this method is called it will
     * queue the operation for the next update sequence.
     *
     * @method Phaser.Scenes.SceneManager#remove
     * @since 3.2.0
     *
     * @param {string} key - A unique key used to reference the Scene, i.e. `MainMenu` or `Level1`.
     *
     * @return {this} This Scene Manager instance.
     */
    remove: function (key)
    {
        console.group('SceneManager remove');
        if (this.isProcessing)
        {
            const result = this.queueOp('remove', key);
            console.groupEnd();
            return result;
        }

        var sceneToRemove = this.getScene(key);

        if (!sceneToRemove || sceneToRemove.sys.isTransitioning())
        {
            console.groupEnd();
            return this;
        }

        var index = this.scenes.indexOf(sceneToRemove);
        var sceneKey = sceneToRemove.sys.settings.key;

        if (index > -1)
        {
            delete this.keys[sceneKey];
            this.scenes.splice(index, 1);

            if (this._start.indexOf(sceneKey) > -1)
            {
                index = this._start.indexOf(sceneKey);
                this._start.splice(index, 1);
            }

            sceneToRemove.sys.destroy();
        }

        console.groupEnd();
        return this;
    },

    /**
     * Boot the given Scene.
     *
     * @method Phaser.Scenes.SceneManager#bootScene
     * @private
     * @fires Phaser.Scenes.Events#TRANSITION_INIT
     * @since 3.0.0
     *
     * @param {Phaser.Scene} scene - The Scene to boot.
     */
    bootScene: function (scene)
    {
        console.group('SceneManager bootScene');
        var sys = scene.sys;
        var settings = sys.settings;

        sys.sceneUpdate = NOOP;

        if (scene.init)
        {
            scene.init.call(scene, settings.data);

            settings.status = CONST.INIT;

            if (settings.isTransition)
            {
                sys.events.emit(Events.TRANSITION_INIT, settings.transitionFrom, settings.transitionDuration);
            }
        }

        var loader;

        if (sys.load)
        {
            loader = sys.load;

            loader.reset();
        }

        if (loader && scene.preload)
        {
            scene.preload.call(scene);

            settings.status = CONST.LOADING;

            //  Start the loader going as we have something in the queue
            loader.once(LoaderEvents.COMPLETE, this.loadComplete, this);

            loader.start();
        }
        else
        {
            //  No preload? Then there was nothing to load either
            this.create(scene);
        }
        console.groupEnd();
    },

    /**
     * Handles load completion for a Scene's Loader.
     *
     * Starts the Scene that the Loader belongs to.
     *
     * @method Phaser.Scenes.SceneManager#loadComplete
     * @private
     * @since 3.0.0
     *
     * @param {Phaser.Loader.LoaderPlugin} loader - The loader that has completed loading.
     */
    loadComplete: function (loader)
    {
        console.group('SceneManager loadComplete');
        this.create(loader.scene);
        console.groupEnd();
    },

    /**
     * Handle payload completion for a Scene.
     *
     * @method Phaser.Scenes.SceneManager#payloadComplete
     * @private
     * @since 3.0.0
     *
     * @param {Phaser.Loader.LoaderPlugin} loader - The loader that has completed loading its Scene's payload.
     */
    payloadComplete: function (loader)
    {
        console.group('SceneManager payloadComplete');
        this.bootScene(loader.scene);
        console.groupEnd();
    },

    /**
     * Updates the Scenes.
     *
     * @method Phaser.Scenes.SceneManager#update
     * @since 3.0.0
     *
     * @param {number} time - Time elapsed.
     * @param {number} delta - Delta time from the last update.
     */
    update: function (time, delta)
    {
        console.group('SceneManager update');
        this.processQueue();

        this.isProcessing = true;

        //  Loop through the active scenes in reverse order
        for (var i = this.scenes.length - 1; i >= 0; i--)
        {
            var sys = this.scenes[i].sys;

            if (sys.settings.status > CONST.START && sys.settings.status <= CONST.RUNNING)
            {
                sys.step(time, delta);
            }

            if (sys.scenePlugin && sys.scenePlugin._target)
            {
                sys.scenePlugin.step(time, delta);
            }
        }
        console.groupEnd();
    },

    /**
     * Renders the Scenes.
     *
     * @method Phaser.Scenes.SceneManager#render
     * @since 3.0.0
     *
     * @param {(Phaser.Renderer.Canvas.CanvasRenderer|Phaser.Renderer.WebGL.WebGLRenderer)} renderer - The renderer to use.
     */
    render: function (renderer)
    {
        console.group('SceneManager render');
        //  Loop through the scenes in forward order
        for (var i = 0; i < this.scenes.length; i++)
        {
            var sys = this.scenes[i].sys;

            if (sys.settings.visible && sys.settings.status >= CONST.LOADING && sys.settings.status < CONST.SLEEPING)
            {
                sys.render(renderer);
            }
        }

        this.isProcessing = false;
        console.groupEnd();
    },

    /**
     * Calls the given Scene's {@link Phaser.Scene#create} method and updates its status.
     *
     * @method Phaser.Scenes.SceneManager#create
     * @private
     * @fires Phaser.Scenes.Events#CREATE
     * @fires Phaser.Scenes.Events#TRANSITION_INIT
     * @since 3.0.0
     *
     * @param {Phaser.Scene} scene - The Scene to create.
     */
    create: function (scene)
    {
        console.group('SceneManager create');
        var sys = scene.sys;
        var settings = sys.settings;

        if (scene.create)
        {
            settings.status = CONST.CREATING;

            scene.create.call(scene, settings.data);

            if (settings.status === CONST.DESTROYED)
            {
                console.groupEnd();
                return;
            }
        }

        if (settings.isTransition)
        {
            sys.events.emit(Events.TRANSITION_START, settings.transitionFrom, settings.transitionDuration);
        }

        //  If the Scene has an update function we'll set it now, otherwise it'll remain as NOOP
        if (scene.update)
        {
            sys.sceneUpdate = scene.update;
        }

        settings.status = CONST.RUNNING;

        sys.events.emit(Events.CREATE, scene);
        console.groupEnd();
    },

    /**
     * Creates and initializes a Scene from a function.
     *
     * @method Phaser.Scenes.SceneManager#createSceneFromFunction
     * @private
     * @since 3.0.0
     *
     * @param {string} key - The key of the Scene.
     * @param {function} scene - The function to create the Scene from.
     *
     * @return {Phaser.Scene} The created Scene.
     */
    createSceneFromFunction: function (key, scene)
    {
        console.group('SceneManager createSceneFromFunction');
        var newScene = new scene();

        if (newScene instanceof Scene)
        {
            var configKey = newScene.sys.settings.key;

            if (configKey !== '')
            {
                key = configKey;
            }

            if (this.keys.hasOwnProperty(key))
            {
                throw new Error('Cannot add Scene with duplicate key: ' + key);
            }

            const result = this.createSceneFromInstance(key, newScene);
            console.groupEnd();
            return result;
        }
        else
        {
            newScene.sys = new Systems(newScene);

            newScene.sys.settings.key = key;

            newScene.sys.init(this.game);

            console.groupEnd();
            return newScene;
        }
    },

    /**
     * Creates and initializes a Scene instance.
     *
     * @method Phaser.Scenes.SceneManager#createSceneFromInstance
     * @private
     * @since 3.0.0
     *
     * @param {string} key - The key of the Scene.
     * @param {Phaser.Scene} newScene - The Scene instance.
     *
     * @return {Phaser.Scene} The created Scene.
     */
    createSceneFromInstance: function (key, newScene)
    {
        console.group('SceneManager createSceneFromInstance');
        var configKey = newScene.sys.settings.key;

        if (configKey === '')
        {
            newScene.sys.settings.key = key;
        }

        newScene.sys.init(this.game);

        console.groupEnd();
        return newScene;
    },

    /**
     * Creates and initializes a Scene from an Object definition.
     *
     * @method Phaser.Scenes.SceneManager#createSceneFromObject
     * @private
     * @since 3.0.0
     *
     * @param {string} key - The key of the Scene.
     * @param {(string|Phaser.Types.Scenes.SettingsConfig|Phaser.Types.Scenes.CreateSceneFromObjectConfig)} sceneConfig - The Scene config.
     *
     * @return {Phaser.Scene} The created Scene.
     */
    createSceneFromObject: function (key, sceneConfig)
    {
        console.group('SceneManager createSceneFromObject');
        var newScene = new Scene(sceneConfig);

        var configKey = newScene.sys.settings.key;

        if (configKey !== '')
        {
            key = configKey;
        }
        else
        {
            newScene.sys.settings.key = key;
        }

        newScene.sys.init(this.game);

        //  Extract callbacks

        var defaults = [ 'init', 'preload', 'create', 'update', 'render' ];

        for (var i = 0; i < defaults.length; i++)
        {
            var sceneCallback = GetValue(sceneConfig, defaults[i], null);

            if (sceneCallback)
            {
                newScene[defaults[i]] = sceneCallback;
            }
        }

        //  Now let's move across any other functions or properties that may exist in the extend object:

        /*
        scene: {
            preload: preload,
            create: create,
            extend: {
                hello: 1,
                test: 'atari',
                addImage: addImage
            }
        }
        */

        if (sceneConfig.hasOwnProperty('extend'))
        {
            for (var propertyKey in sceneConfig.extend)
            {
                if (!sceneConfig.extend.hasOwnProperty(propertyKey))
                {
                    continue;
                }

                var value = sceneConfig.extend[propertyKey];

                if (propertyKey === 'data' && newScene.hasOwnProperty('data') && typeof value === 'object')
                {
                    //  Populate the DataManager
                    newScene.data.merge(value);
                }
                else if (propertyKey !== 'sys')
                {
                    newScene[propertyKey] = value;
                }
            }
        }

        console.groupEnd();
        return newScene;
    },

    /**
     * Retrieves the key of a Scene from a Scene config.
     *
     * @method Phaser.Scenes.SceneManager#getKey
     * @private
     * @since 3.0.0
     *
     * @param {string} key - The key to check in the Scene config.
     * @param {(Phaser.Scene|Phaser.Types.Scenes.SettingsConfig|function)} sceneConfig - The Scene config.
     *
     * @return {string} The Scene key.
     */
    getKey: function (key, sceneConfig)
    {
        console.group('SceneManager getKey');
        if (!key) { key = 'default'; }

        if (typeof sceneConfig === 'function')
        {
            console.groupEnd();
            return key;
        }
        else if (sceneConfig instanceof Scene)
        {
            key = sceneConfig.sys.settings.key;
        }
        else if (typeof sceneConfig === 'object' && sceneConfig.hasOwnProperty('key'))
        {
            key = sceneConfig.key;
        }

        //  By this point it's either 'default' or extracted from the Scene

        if (this.keys.hasOwnProperty(key))
        {
            console.groupEnd();
            throw new Error('Cannot add Scene with duplicate key: ' + key);
        }
        else
        {
            console.groupEnd();
            return key;
        }
    },

    /**
     * Returns an array of all the current Scenes being managed by this Scene Manager.
     *
     * You can filter the output by the active state of the Scene and choose to have
     * the array returned in normal or reversed order.
     *
     * @method Phaser.Scenes.SceneManager#getScenes
     * @since 3.16.0
     *
     * @generic {Phaser.Scene[]} T - [$return]
     * @genericUse {T} - [$return]
     *
     * @param {boolean} [isActive=true] - Only include Scene's that are currently active?
     * @param {boolean} [inReverse=false] - Return the array of Scenes in reverse?
     *
     * @return {Phaser.Scene[]} An array containing all of the Scenes in the Scene Manager.
     */
    getScenes: function (isActive, inReverse)
    {
        console.group('SceneManager getScenes');
        if (isActive === undefined) { isActive = true; }
        if (inReverse === undefined) { inReverse = false; }

        var out = [];
        var scenes = this.scenes;

        for (var i = 0; i < scenes.length; i++)
        {
            var scene = scenes[i];

            if (scene && (!isActive || (isActive && scene.sys.isActive())))
            {
                out.push(scene);
            }
        }

        const result = (inReverse) ? out.reverse() : out;
        console.groupEnd();
        return result;
    },

    /**
     * Retrieves a Scene based on the given key.
     *
     * If an actual Scene is passed to this method, it can be used to check if
     * its currently within the Scene Manager, or not.
     *
     * @method Phaser.Scenes.SceneManager#getScene
     * @since 3.0.0
     *
     * @generic {Phaser.Scene} T
     * @genericUse {(T|string)} - [key]
     * @genericUse {T} - [$return]
     *
     * @param {(string|Phaser.Scene)} key - The key of the Scene to retrieve.
     *
     * @return {?Phaser.Scene} The Scene, or `null` if no matching Scene was found.
     */
    getScene: function (key)
    {
        console.group('SceneManager getScene');
        if (typeof key === 'string')
        {
            if (this.keys[key])
            {
                console.groupEnd();
                return this.keys[key];
            }
        }
        else
        {
            for (var i = 0; i < this.scenes.length; i++)
            {
                if (key === this.scenes[i])
                {
                    console.groupEnd();
                    return key;
                }
            }
        }

        console.groupEnd();
        return null;
    },

    /**
     * Determines whether a Scene is running.
     *
     * @method Phaser.Scenes.SceneManager#isActive
     * @since 3.0.0
     *
     * @generic {Phaser.Scene} T
     * @genericUse {(T|string)} - [key]
     *
     * @param {(string|Phaser.Scene)} key - The Scene to check.
     *
     * @return {boolean} Whether the Scene is running, or `null` if no matching Scene was found.
     */
    isActive: function (key)
    {
        console.group('SceneManager isActive');
        var scene = this.getScene(key);

        if (scene)
        {
            const result = scene.sys.isActive();
            console.groupEnd();
            return result;
        }

        console.groupEnd();
        return null;
    },

    /**
     * Determines whether a Scene is paused.
     *
     * @method Phaser.Scenes.SceneManager#isPaused
     * @since 3.17.0
     *
     * @generic {Phaser.Scene} T
     * @genericUse {(T|string)} - [key]
     *
     * @param {(string|Phaser.Scene)} key - The Scene to check.
     *
     * @return {boolean} Whether the Scene is paused, or `null` if no matching Scene was found.
     */
    isPaused: function (key)
    {
        console.group('SceneManager isPaused');
        var scene = this.getScene(key);

        if (scene)
        {
            const result = scene.sys.isPaused();
            console.groupEnd();
            return result;
        }

        console.groupEnd();
        return null;
    },

    /**
     * Determines whether a Scene is visible.
     *
     * @method Phaser.Scenes.SceneManager#isVisible
     * @since 3.0.0
     *
     * @generic {Phaser.Scene} T
     * @genericUse {(T|string)} - [key]
     *
     * @param {(string|Phaser.Scene)} key - The Scene to check.
     *
     * @return {boolean} Whether the Scene is visible, or `null` if no matching Scene was found.
     */
    isVisible: function (key)
    {
        console.group('SceneManager isVisible');
        var scene = this.getScene(key);

        if (scene)
        {
            const result = scene.sys.isVisible();
            console.groupEnd();
            return result;
        }

        console.groupEnd();
        return null;
    },

    /**
     * Determines whether a Scene is sleeping.
     *
     * @method Phaser.Scenes.SceneManager#isSleeping
     * @since 3.0.0
     *
     * @generic {Phaser.Scene} T
     * @genericUse {(T|string)} - [key]
     *
     * @param {(string|Phaser.Scene)} key - The Scene to check.
     *
     * @return {boolean} Whether the Scene is sleeping, or `null` if no matching Scene was found.
     */
    isSleeping: function (key)
    {
        console.group('SceneManager isSleeping');
        var scene = this.getScene(key);

        if (scene)
        {
            const result = scene.sys.isSleeping();
            console.groupEnd();
            return result;
        }

        console.groupEnd();
        return null;
    },

    /**
     * Pauses the given Scene.
     *
     * @method Phaser.Scenes.SceneManager#pause
     * @since 3.0.0
     *
     * @generic {Phaser.Scene} T
     * @genericUse {(T|string)} - [key]
     *
     * @param {(string|Phaser.Scene)} key - The Scene to pause.
     * @param {object} [data] - An optional data object that will be passed to the Scene and emitted by its pause event.
     *
     * @return {this} This Scene Manager instance.
     */
    pause: function (key, data)
    {
        console.group('SceneManager pause');
        var scene = this.getScene(key);

        if (scene)
        {
            scene.sys.pause(data);
        }

        console.groupEnd();
        return this;
    },

    /**
     * Resumes the given Scene.
     *
     * @method Phaser.Scenes.SceneManager#resume
     * @since 3.0.0
     *
     * @generic {Phaser.Scene} T
     * @genericUse {(T|string)} - [key]
     *
     * @param {(string|Phaser.Scene)} key - The Scene to resume.
     * @param {object} [data] - An optional data object that will be passed to the Scene and emitted by its resume event.
     *
     * @return {this} This Scene Manager instance.
     */
    resume: function (key, data)
    {
        console.group('SceneManager resume');
        var scene = this.getScene(key);

        if (scene)
        {
            scene.sys.resume(data);
        }

        console.groupEnd();
        return this;
    },

    /**
     * Puts the given Scene to sleep.
     *
     * @method Phaser.Scenes.SceneManager#sleep
     * @since 3.0.0
     *
     * @generic {Phaser.Scene} T
     * @genericUse {(T|string)} - [key]
     *
     * @param {(string|Phaser.Scene)} key - The Scene to put to sleep.
     * @param {object} [data] - An optional data object that will be passed to the Scene and emitted by its sleep event.
     *
     * @return {this} This Scene Manager instance.
     */
    sleep: function (key, data)
    {
        console.group('SceneManager sleep');
        var scene = this.getScene(key);

        if (scene && !scene.sys.isTransitioning())
        {
            scene.sys.sleep(data);
        }

        console.groupEnd();
        return this;
    },

    /**
     * Awakens the given Scene.
     *
     * @method Phaser.Scenes.SceneManager#wake
     * @since 3.0.0
     *
     * @generic {Phaser.Scene} T
     * @genericUse {(T|string)} - [key]
     *
     * @param {(string|Phaser.Scene)} key - The Scene to wake up.
     * @param {object} [data] - An optional data object that will be passed to the Scene and emitted by its wake event.
     *
     * @return {this} This Scene Manager instance.
     */
    wake: function (key, data)
    {
        console.group('SceneManager wake');
        var scene = this.getScene(key);

        if (scene)
        {
            scene.sys.wake(data);
        }

        console.groupEnd();
        return this;
    },

    /**
     * Runs the given Scene.
     *
     * If the given Scene is paused, it will resume it. If sleeping, it will wake it.
     * If not running at all, it will be started.
     *
     * Use this if you wish to open a modal Scene by calling `pause` on the current
     * Scene, then `run` on the modal Scene.
     *
     * @method Phaser.Scenes.SceneManager#run
     * @since 3.10.0
     *
     * @generic {Phaser.Scene} T
     * @genericUse {(T|string)} - [key]
     *
     * @param {(string|Phaser.Scene)} key - The Scene to run.
     * @param {object} [data] - A data object that will be passed to the Scene on start, wake, or resume.
     *
     * @return {this} This Scene Manager instance.
     */
    run: function (key, data)
    {
        console.group('SceneManager run');
        var scene = this.getScene(key);

        if (!scene)
        {
            for (var i = 0; i < this._pending.length; i++)
            {
                if (this._pending[i].key === key)
                {
                    this.queueOp('start', key, data);
                    break;
                }
            }
            console.groupEnd();
            return this;
        }

        if (scene.sys.isSleeping())
        {
            //  Sleeping?
            scene.sys.wake(data);
        }
        else if (scene.sys.isPaused())
        {
            //  Paused?
            scene.sys.resume(data);
        }
        else
        {
            //  Not actually running?
            this.start(key, data);
        }
        console.groupEnd();
    },

    /**
     * Starts the given Scene, if it is not starting, loading, or creating.
     *
     * If the Scene is running, paused, or sleeping, it will be shutdown and then started.
     *
     * @method Phaser.Scenes.SceneManager#start
     * @since 3.0.0
     *
     * @generic {Phaser.Scene} T
     * @genericUse {(T|string)} - [key]
     *
     * @param {(string|Phaser.Scene)} key - The Scene to start.
     * @param {object} [data] - Optional data object to pass to `Scene.Settings` and `Scene.init`, and `Scene.create`.
     *
     * @return {this} This Scene Manager instance.
     */
    start: function (key, data)
    {
        console.group('SceneManager start');
        //  If the Scene Manager is not running, then put the Scene into a holding pattern
        if (!this.isBooted)
        {
            this._data[key] = {
                autoStart: true,
                data: data
            };

            console.groupEnd();
            return this;
        }

        var scene = this.getScene(key);

        if (!scene)
        {
            console.warn('Scene key not found: ' + key);
            console.groupEnd();
            return this;
        }

        var sys = scene.sys;
        var status = sys.settings.status;

        //  If the scene is already started but not yet running,
        //  let it continue.
        if (status >= CONST.START && status <= CONST.CREATING)
        {
            console.groupEnd();
            return this;
        }

        //  If the Scene is already running, paused, or sleeping,
        //  close it down before starting it again.
        else if (status >= CONST.RUNNING && status <= CONST.SLEEPING)
        {
            sys.shutdown();

            sys.sceneUpdate = NOOP;

            sys.start(data);
        }

        //  If the Scene is INIT or SHUTDOWN,
        //  start it directly.
        else
        {
            sys.sceneUpdate = NOOP;

            sys.start(data);

            var loader;

            if (sys.load)
            {
                loader = sys.load;
            }

            //  Files payload?
            if (loader && sys.settings.hasOwnProperty('pack'))
            {
                loader.reset();

                if (loader.addPack({ payload: sys.settings.pack }))
                {
                    sys.settings.status = CONST.LOADING;

                    loader.once(LoaderEvents.COMPLETE, this.payloadComplete, this);

                    loader.start();

                    console.groupEnd();
                    return this;
                }
            }
        }

        this.bootScene(scene);

        console.groupEnd();
        return this;
    },

    /**
     * Stops the given Scene.
     *
     * @method Phaser.Scenes.SceneManager#stop
     * @since 3.0.0
     *
     * @generic {Phaser.Scene} T
     * @genericUse {(T|string)} - [key]
     *
     * @param {(string|Phaser.Scene)} key - The Scene to stop.
     * @param {object} [data] - Optional data object to pass to Scene.shutdown.
     *
     * @return {this} This Scene Manager instance.
     */
    stop: function (key, data)
    {
        console.group('SceneManager stop');
        var scene = this.getScene(key);

        if (scene && !scene.sys.isTransitioning() && scene.sys.settings.status !== CONST.SHUTDOWN)
        {
            var loader = scene.sys.load;

            if (loader)
            {
                loader.off(LoaderEvents.COMPLETE, this.loadComplete, this);
                loader.off(LoaderEvents.COMPLETE, this.payloadComplete, this);
            }

            scene.sys.shutdown(data);
        }

        console.groupEnd();
        return this;
    },

    /**
     * Sleeps one one Scene and starts the other.
     *
     * @method Phaser.Scenes.SceneManager#switch
     * @since 3.0.0
     *
     * @generic {Phaser.Scene} T
     * @genericUse {(T|string)} - [from,to]
     *
     * @param {(string|Phaser.Scene)} from - The Scene to sleep.
     * @param {(string|Phaser.Scene)} to - The Scene to start.
     * @param {object} [data] - Optional data object to pass to `Scene.Settings` and `Scene.init`, and `Scene.create`. It is only passed when the scene starts for the first time.
     *
     * @return {this} This Scene Manager instance.
     */
    switch: function (from, to, data)
    {
        console.group('SceneManager switch');
        var sceneA = this.getScene(from);
        var sceneB = this.getScene(to);

        if (sceneA && sceneB && sceneA !== sceneB)
        {
            this.sleep(from);

            if (this.isSleeping(to))
            {
                this.wake(to, data);
            }
            else
            {
                this.start(to, data);
            }
        }

        console.groupEnd();
        return this;
    },

    /**
     * Retrieves a Scene by numeric index.
     *
     * @method Phaser.Scenes.SceneManager#getAt
     * @since 3.0.0
     *
     * @generic {Phaser.Scene} T
     * @genericUse {T} - [$return]
     *
     * @param {number} index - The index of the Scene to retrieve.
     *
     * @return {(Phaser.Scene|undefined)} The Scene.
     */
    getAt: function (index)
    {
        console.group('SceneManager getAt');
        console.groupEnd();
        return this.scenes[index];
    },

    /**
     * Retrieves the numeric index of a Scene.
     *
     * @method Phaser.Scenes.SceneManager#getIndex
     * @since 3.0.0
     *
     * @generic {Phaser.Scene} T
     * @genericUse {(T|string)} - [key]
     *
     * @param {(string|Phaser.Scene)} key - The key of the Scene.
     *
     * @return {number} The index of the Scene.
     */
    getIndex: function (key)
    {
        console.group('SceneManager getIndex');
        var scene = this.getScene(key);

        console.groupEnd();
        return this.scenes.indexOf(scene);
    },

    /**
     * Brings a Scene to the top of the Scenes list.
     *
     * This means it will render above all other Scenes.
     *
     * @method Phaser.Scenes.SceneManager#bringToTop
     * @since 3.0.0
     *
     * @generic {Phaser.Scene} T
     * @genericUse {(T|string)} - [key]
     *
     * @param {(string|Phaser.Scene)} key - The Scene to move.
     *
     * @return {this} This Scene Manager instance.
     */
    bringToTop: function (key)
    {
        console.group('SceneManager bringToTop');
        if (this.isProcessing)
        {
            const result = this.queueOp('bringToTop', key);
            console.groupEnd();
            return result;
        }

        var index = this.getIndex(key);
        var scenes = this.scenes;

        if (index !== -1 && index < scenes.length)
        {
            var scene = this.getScene(key);

            scenes.splice(index, 1);
            scenes.push(scene);
        }

        console.groupEnd();
        return this;
    },

    /**
     * Sends a Scene to the back of the Scenes list.
     *
     * This means it will render below all other Scenes.
     *
     * @method Phaser.Scenes.SceneManager#sendToBack
     * @since 3.0.0
     *
     * @generic {Phaser.Scene} T
     * @genericUse {(T|string)} - [key]
     *
     * @param {(string|Phaser.Scene)} key - The Scene to move.
     *
     * @return {this} This Scene Manager instance.
     */
    sendToBack: function (key)
    {
        console.group('SceneManager sendToBack');
        if (this.isProcessing)
        {
            const result = this.queueOp('sendToBack', key);
            console.groupEnd();
            return result;
        }

        var index = this.getIndex(key);

        if (index !== -1 && index > 0)
        {
            var scene = this.getScene(key);

            this.scenes.splice(index, 1);
            this.scenes.unshift(scene);
        }

        console.groupEnd();
        return this;
    },

    /**
     * Moves a Scene down one position in the Scenes list.
     *
     * @method Phaser.Scenes.SceneManager#moveDown
     * @since 3.0.0
     *
     * @generic {Phaser.Scene} T
     * @genericUse {(T|string)} - [key]
     *
     * @param {(string|Phaser.Scene)} key - The Scene to move.
     *
     * @return {this} This Scene Manager instance.
     */
    moveDown: function (key)
    {
        console.group('SceneManager moveDown');
        if (this.isProcessing)
        {
            const result = this.queueOp('moveDown', key);
            console.groupEnd();
            return result;
        }

        var indexA = this.getIndex(key);

        if (indexA > 0)
        {
            var indexB = indexA - 1;
            var sceneA = this.getScene(key);
            var sceneB = this.getAt(indexB);

            this.scenes[indexA] = sceneB;
            this.scenes[indexB] = sceneA;
        }

        console.groupEnd();
        return this;
    },

    /**
     * Moves a Scene up one position in the Scenes list.
     *
     * @method Phaser.Scenes.SceneManager#moveUp
     * @since 3.0.0
     *
     * @generic {Phaser.Scene} T
     * @genericUse {(T|string)} - [key]
     *
     * @param {(string|Phaser.Scene)} key - The Scene to move.
     *
     * @return {this} This Scene Manager instance.
     */
    moveUp: function (key)
    {
        console.group('SceneManager moveUp');
        if (this.isProcessing)
        {
            const result = this.queueOp('moveUp', key);
            console.groupEnd();
            return result;
        }

        var indexA = this.getIndex(key);

        if (indexA < this.scenes.length - 1)
        {
            var indexB = indexA + 1;
            var sceneA = this.getScene(key);
            var sceneB = this.getAt(indexB);

            this.scenes[indexA] = sceneB;
            this.scenes[indexB] = sceneA;
        }

        console.groupEnd();
        return this;
    },

    /**
     * Moves a Scene so it is immediately above another Scene in the Scenes list.
     * If the Scene is already above the other, it isn't moved.
     *
     * This means it will render over the top of the other Scene.
     *
     * @method Phaser.Scenes.SceneManager#moveAbove
     * @since 3.2.0
     *
     * @generic {Phaser.Scene} T
     * @genericUse {(T|string)} - [keyA,keyB]
     *
     * @param {(string|Phaser.Scene)} keyA - The Scene that Scene B will be moved above.
     * @param {(string|Phaser.Scene)} keyB - The Scene to be moved.
     *
     * @return {this} This Scene Manager instance.
     */
    moveAbove: function (keyA, keyB)
    {
        console.group('SceneManager moveAbove');
        if (keyA === keyB)
        {
            console.groupEnd();
            return this;
        }

        if (this.isProcessing)
        {
            const result = this.queueOp('moveAbove', keyA, keyB);
            console.groupEnd();
            return result;
        }

        var indexA = this.getIndex(keyA);
        var indexB = this.getIndex(keyB);

        if (indexA !== -1 && indexB !== -1 && indexB < indexA)
        {
            var tempScene = this.getAt(indexB);

            //  Remove
            this.scenes.splice(indexB, 1);

            //  Add in new location
            this.scenes.splice(indexA + (indexB > indexA), 0, tempScene);
        }

        console.groupEnd();
        return this;
    },

    /**
     * Moves a Scene so it is immediately below another Scene in the Scenes list.
     * If the Scene is already below the other, it isn't moved.
     *
     * This means it will render behind the other Scene.
     *
     * @method Phaser.Scenes.SceneManager#moveBelow
     * @since 3.2.0
     *
     * @generic {Phaser.Scene} T
     * @genericUse {(T|string)} - [keyA,keyB]
     *
     * @param {(string|Phaser.Scene)} keyA - The Scene that Scene B will be moved below.
     * @param {(string|Phaser.Scene)} keyB - The Scene to be moved.
     *
     * @return {this} This Scene Manager instance.
     */
    moveBelow: function (keyA, keyB)
    {
        console.group('SceneManager moveBelow');
        if (keyA === keyB)
        {
            console.groupEnd();
            return this;
        }

        if (this.isProcessing)
        {
            const result = this.queueOp('moveBelow', keyA, keyB);
            console.groupEnd();
            return result;
        }

        var indexA = this.getIndex(keyA);
        var indexB = this.getIndex(keyB);

        if (indexA !== -1 && indexB !== -1 && indexB > indexA)
        {
            var tempScene = this.getAt(indexB);

            //  Remove
            this.scenes.splice(indexB, 1);

            if (indexA === 0)
            {
                this.scenes.unshift(tempScene);
            }
            else
            {
                //  Add in new location
                this.scenes.splice(indexA - (indexB < indexA), 0, tempScene);
            }
        }

        console.groupEnd();
        return this;
    },

    /**
     * Queue a Scene operation for the next update.
     *
     * @method Phaser.Scenes.SceneManager#queueOp
     * @private
     * @since 3.0.0
     *
     * @param {string} op - The operation to perform.
     * @param {(string|Phaser.Scene)} keyA - Scene A.
     * @param {(any|string|Phaser.Scene)} [keyB] - Scene B, or a data object.
     * @param {any} [data] - Optional data object to pass.
     *
     * @return {this} This Scene Manager instance.
     */
    queueOp: function (op, keyA, keyB, data)
    {
        console.group('SceneManager queueOp');
        this._queue.push({ op: op, keyA: keyA, keyB: keyB, data: data });

        console.groupEnd();
        return this;
    },

    /**
     * Swaps the positions of two Scenes in the Scenes list.
     *
     * @method Phaser.Scenes.SceneManager#swapPosition
     * @since 3.0.0
     *
     * @generic {Phaser.Scene} T
     * @genericUse {(T|string)} - [keyA,keyB]
     *
     * @param {(string|Phaser.Scene)} keyA - The first Scene to swap.
     * @param {(string|Phaser.Scene)} keyB - The second Scene to swap.
     *
     * @return {this} This Scene Manager instance.
     */
    swapPosition: function (keyA, keyB)
    {
        console.group('SceneManager swapPosition');
        if (keyA === keyB)
        {
            console.groupEnd();
            return this;
        }

        if (this.isProcessing)
        {
            const result = this.queueOp('swapPosition', keyA, keyB);
            console.groupEnd();
            return result;
        }

        var indexA = this.getIndex(keyA);
        var indexB = this.getIndex(keyB);

        if (indexA !== indexB && indexA !== -1 && indexB !== -1)
        {
            var tempScene = this.getAt(indexA);

            this.scenes[indexA] = this.scenes[indexB];
            this.scenes[indexB] = tempScene;
        }

        console.groupEnd();
        return this;
    },

    /**
     * Dumps debug information about each Scene to the developer console.
     *
     * @method Phaser.Scenes.SceneManager#dump
     * @since 3.2.0
     */
    dump: function ()
    {
        console.group('SceneManager dump');
        var out = [];
        var map = [ 'pending', 'init', 'start', 'loading', 'creating', 'running', 'paused', 'sleeping', 'shutdown', 'destroyed' ];

        for (var i = 0; i < this.scenes.length; i++)
        {
            var sys = this.scenes[i].sys;

            var key = (sys.settings.visible && (sys.settings.status === CONST.RUNNING || sys.settings.status === CONST.PAUSED)) ? '[*] ' : '[-] ';
            key += sys.settings.key + ' (' + map[sys.settings.status] + ')';

            out.push(key);
        }

        console.log(out.join('\n'));
        console.groupEnd();
    },

    /**
     * Destroy this Scene Manager and all of its systems.
     *
     * This process cannot be reversed.
     *
     * This method is called automatically when a Phaser Game instance is destroyed.
     *
     * @method Phaser.Scenes.SceneManager#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        console.group('SceneManager destroy');
        for (var i = 0; i < this.scenes.length; i++)
        {
            var sys = this.scenes[i].sys;

            sys.destroy();
        }

        this.systemScene.sys.destroy();

        this.update = NOOP;

        this.scenes = [];

        this._pending = [];
        this._start = [];
        this._queue = [];

        this.game = null;
        this.systemScene = null;
        console.groupEnd();
    }

});

module.exports = SceneManager;
