/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var Events = require('./events');

/**
 * @callback DataEachCallback
 *
 * @param {*} parent - The parent object of the DataManager.
 * @param {string} key - The key of the value.
 * @param {*} value - The value.
 * @param {...*} [args] - Additional arguments that will be passed to the callback, after the game object, key, and data.
 */

/**
 * @classdesc
 * The Data Manager Component features a means to store pieces of data specific to a Game Object, System or Plugin.
 * You can then search, query it, and retrieve the data. The parent must either extend EventEmitter,
 * or have a property called `events` that is an instance of it.
 *
 * @class DataManager
 * @memberof Phaser.Data
 * @constructor
 * @since 3.0.0
 *
 * @param {object} parent - The object that this DataManager belongs to.
 * @param {Phaser.Events.EventEmitter} [eventEmitter] - The DataManager's event emitter.
 */
var DataManager = new Class({

    initialize:

    function DataManager (parent, eventEmitter)
    {
        console.group('DataManager');
        /**
         * The object that this DataManager belongs to.
         *
         * @name Phaser.Data.DataManager#parent
         * @type {*}
         * @since 3.0.0
         */
        this.parent = parent;

        /**
         * The DataManager's event emitter.
         *
         * @name Phaser.Data.DataManager#events
         * @type {Phaser.Events.EventEmitter}
         * @since 3.0.0
         */
        this.events = eventEmitter;

        if (!eventEmitter)
        {
            this.events = (parent.events) ? parent.events : parent;
        }

        /**
         * The data list.
         *
         * @name Phaser.Data.DataManager#list
         * @type {Object.<string, *>}
         * @default {}
         * @since 3.0.0
         */
        this.list = {};

        /**
         * The public values list. You can use this to access anything you have stored
         * in this Data Manager. For example, if you set a value called `gold` you can
         * access it via:
         *
         * ```javascript
         * this.data.values.gold;
         * ```
         *
         * You can also modify it directly:
         *
         * ```javascript
         * this.data.values.gold += 1000;
         * ```
         *
         * Doing so will emit a `setdata` event from the parent of this Data Manager.
         *
         * Do not modify this object directly. Adding properties directly to this object will not
         * emit any events. Always use `DataManager.set` to create new items the first time around.
         *
         * @name Phaser.Data.DataManager#values
         * @type {Object.<string, *>}
         * @default {}
         * @since 3.10.0
         */
        this.values = {};

        /**
         * Whether setting data is frozen for this DataManager.
         *
         * @name Phaser.Data.DataManager#_frozen
         * @type {boolean}
         * @private
         * @default false
         * @since 3.0.0
         */
        this._frozen = false;

        if (!parent.hasOwnProperty('sys') && this.events)
        {
            this.events.once(Events.DESTROY, this.destroy, this);
        }
        console.groupEnd();
    },

    /**
     * Retrieves the value for the given key, or undefined if it doesn't exist.
     *
     * You can also access values via the `values` object. For example, if you had a key called `gold` you can do either:
     *
     * ```javascript
     * this.data.get('gold');
     * ```
     *
     * Or access the value directly:
     *
     * ```javascript
     * this.data.values.gold;
     * ```
     *
     * You can also pass in an array of keys, in which case an array of values will be returned:
     *
     * ```javascript
     * this.data.get([ 'gold', 'armor', 'health' ]);
     * ```
     *
     * This approach is useful for destructuring arrays in ES6.
     *
     * @method Phaser.Data.DataManager#get
     * @since 3.0.0
     *
     * @param {(string|string[])} key - The key of the value to retrieve, or an array of keys.
     *
     * @return {*} The value belonging to the given key, or an array of values, the order of which will match the input array.
     */
    get: function (key)
    {
        console.group('DataManager get');
        var list = this.list;

        if (Array.isArray(key))
        {
            var output = [];

            for (var i = 0; i < key.length; i++)
            {
                output.push(list[key[i]]);
            }

            console.groupEnd();
            return output;
        }
        else
        {
            console.groupEnd();
            return list[key];
        }
    },

    /**
     * Retrieves all data values in a new object.
     *
     * @method Phaser.Data.DataManager#getAll
     * @since 3.0.0
     *
     * @return {Object.<string, *>} All data values.
     */
    getAll: function ()
    {
        console.group('DataManager getAll');
        var results = {};

        for (var key in this.list)
        {
            if (this.list.hasOwnProperty(key))
            {
                results[key] = this.list[key];
            }
        }

        console.groupEnd();
        return results;
    },

    /**
     * Queries the DataManager for the values of keys matching the given regular expression.
     *
     * @method Phaser.Data.DataManager#query
     * @since 3.0.0
     *
     * @param {RegExp} search - A regular expression object. If a non-RegExp object obj is passed, it is implicitly converted to a RegExp by using new RegExp(obj).
     *
     * @return {Object.<string, *>} The values of the keys matching the search string.
     */
    query: function (search)
    {
        console.group('DataManager query');
        var results = {};

        for (var key in this.list)
        {
            if (this.list.hasOwnProperty(key) && key.match(search))
            {
                results[key] = this.list[key];
            }
        }

        console.groupEnd();
        return results;
    },

    /**
     * Sets a value for the given key. If the key doesn't already exist in the Data Manager then it is created.
     *
     * ```javascript
     * data.set('name', 'Red Gem Stone');
     * ```
     *
     * You can also pass in an object of key value pairs as the first argument:
     *
     * ```javascript
     * data.set({ name: 'Red Gem Stone', level: 2, owner: 'Link', gold: 50 });
     * ```
     *
     * To get a value back again you can call `get`:
     *
     * ```javascript
     * data.get('gold');
     * ```
     *
     * Or you can access the value directly via the `values` property, where it works like any other variable:
     *
     * ```javascript
     * data.values.gold += 50;
     * ```
     *
     * When the value is first set, a `setdata` event is emitted.
     *
     * If the key already exists, a `changedata` event is emitted instead, along an event named after the key.
     * For example, if you updated an existing key called `PlayerLives` then it would emit the event `changedata-PlayerLives`.
     * These events will be emitted regardless if you use this method to set the value, or the direct `values` setter.
     *
     * Please note that the data keys are case-sensitive and must be valid JavaScript Object property strings.
     * This means the keys `gold` and `Gold` are treated as two unique values within the Data Manager.
     *
     * @method Phaser.Data.DataManager#set
     * @fires Phaser.Data.Events#SET_DATA
     * @fires Phaser.Data.Events#CHANGE_DATA
     * @fires Phaser.Data.Events#CHANGE_DATA_KEY
     * @since 3.0.0
     *
     * @generic {any} T
     * @genericUse {(string|T)} - [key]
     *
     * @param {(string|object)} key - The key to set the value for. Or an object of key value pairs. If an object the `data` argument is ignored.
     * @param {*} [data] - The value to set for the given key. If an object is provided as the key this argument is ignored.
     *
     * @return {this} This Data Manager instance.
     */
    set: function (key, data)
    {
        console.group('DataManager set');
        if (this._frozen)
        {
            console.groupEnd();
            return this;
        }

        if (typeof key === 'string')
        {
            const result = this.setValue(key, data);
            console.groupEnd();
            return result;
        }
        else
        {
            for (var entry in key)
            {
                this.setValue(entry, key[entry]);
            }
        }

        console.groupEnd();
        return this;
    },

    /**
     * Increase a value for the given key. If the key doesn't already exist in the Data Manager then it is increased from 0.
     *
     * When the value is first set, a `setdata` event is emitted.
     *
     * @method Phaser.Data.DataManager#inc
     * @fires Phaser.Data.Events#SET_DATA
     * @fires Phaser.Data.Events#CHANGE_DATA
     * @fires Phaser.Data.Events#CHANGE_DATA_KEY
     * @since 3.23.0
     *
     * @param {string} key - The key to change the value for.
     * @param {number} [amount=1] - The amount to increase the given key by. Pass a negative value to decrease the key.
     *
     * @return {this} This Data Manager instance.
     */
    inc: function (key, amount)
    {
        console.group('DataManager inc');
        if (this._frozen)
        {
            console.groupEnd();
            return this;
        }

        if (amount === undefined)
        {
            amount = 1;
        }

        var value = this.get(key);

        if (value === undefined)
        {
            value = 0;
        }

        this.set(key, (value + amount));

        console.groupEnd();
        return this;
    },

    /**
     * Toggle a boolean value for the given key. If the key doesn't already exist in the Data Manager then it is toggled from false.
     *
     * When the value is first set, a `setdata` event is emitted.
     *
     * @method Phaser.Data.DataManager#toggle
     * @fires Phaser.Data.Events#SET_DATA
     * @fires Phaser.Data.Events#CHANGE_DATA
     * @fires Phaser.Data.Events#CHANGE_DATA_KEY
     * @since 3.23.0
     *
     * @param {string} key - The key to toggle the value for.
     *
     * @return {this} This Data Manager instance.
     */
    toggle: function (key)
    {
        console.group('DataManager toggle');
        if (this._frozen)
        {
            console.groupEnd();
            return this;
        }

        this.set(key, !this.get(key));

        console.groupEnd();
        return this;
    },

    /**
     * Internal value setter, called automatically by the `set` method.
     *
     * @method Phaser.Data.DataManager#setValue
     * @fires Phaser.Data.Events#SET_DATA
     * @fires Phaser.Data.Events#CHANGE_DATA
     * @fires Phaser.Data.Events#CHANGE_DATA_KEY
     * @private
     * @since 3.10.0
     *
     * @param {string} key - The key to set the value for.
     * @param {*} data - The value to set.
     *
     * @return {this} This Data Manager instance.
     */
    setValue: function (key, data)
    {
        console.group('DataManager setValue');
        if (this._frozen)
        {
            console.groupEnd();
            return this;
        }

        if (this.has(key))
        {
            //  Hit the key getter, which will in turn emit the events.
            this.values[key] = data;
        }
        else
        {
            var _this = this;
            var list = this.list;
            var events = this.events;
            var parent = this.parent;

            Object.defineProperty(this.values, key, {

                enumerable: true,

                configurable: true,

                get: function ()
                {
                    return list[key];
                },

                set: function (value)
                {
                    if (!_this._frozen)
                    {
                        var previousValue = list[key];
                        list[key] = value;

                        events.emit(Events.CHANGE_DATA, parent, key, value, previousValue);
                        events.emit(Events.CHANGE_DATA_KEY + key, parent, value, previousValue);
                    }
                }

            });

            list[key] = data;

            events.emit(Events.SET_DATA, parent, key, data);
        }

        console.groupEnd();
        return this;
    },

    /**
     * Passes all data entries to the given callback.
     *
     * @method Phaser.Data.DataManager#each
     * @since 3.0.0
     *
     * @param {DataEachCallback} callback - The function to call.
     * @param {*} [context] - Value to use as `this` when executing callback.
     * @param {...*} [args] - Additional arguments that will be passed to the callback, after the game object, key, and data.
     *
     * @return {this} This Data Manager instance.
     */
    each: function (callback, context)
    {
        console.group('DataManager each');
        var args = [ this.parent, null, undefined ];

        for (var i = 1; i < arguments.length; i++)
        {
            args.push(arguments[i]);
        }

        for (var key in this.list)
        {
            args[1] = key;
            args[2] = this.list[key];

            callback.apply(context, args);
        }

        console.groupEnd();
        return this;
    },

    /**
     * Merge the given object of key value pairs into this DataManager.
     *
     * Any newly created values will emit a `setdata` event. Any updated values (see the `overwrite` argument)
     * will emit a `changedata` event.
     *
     * @method Phaser.Data.DataManager#merge
     * @fires Phaser.Data.Events#SET_DATA
     * @fires Phaser.Data.Events#CHANGE_DATA
     * @fires Phaser.Data.Events#CHANGE_DATA_KEY
     * @since 3.0.0
     *
     * @param {Object.<string, *>} data - The data to merge.
     * @param {boolean} [overwrite=true] - Whether to overwrite existing data. Defaults to true.
     *
     * @return {this} This Data Manager instance.
     */
    merge: function (data, overwrite)
    {
        console.group('DataManager merge');
        if (overwrite === undefined) { overwrite = true; }

        //  Merge data from another component into this one
        for (var key in data)
        {
            if (data.hasOwnProperty(key) && (overwrite || (!overwrite && !this.has(key))))
            {
                this.setValue(key, data[key]);
            }
        }

        console.groupEnd();
        return this;
    },

    /**
     * Remove the value for the given key.
     *
     * If the key is found in this Data Manager it is removed from the internal lists and a
     * `removedata` event is emitted.
     *
     * You can also pass in an array of keys, in which case all keys in the array will be removed:
     *
     * ```javascript
     * this.data.remove([ 'gold', 'armor', 'health' ]);
     * ```
     *
     * @method Phaser.Data.DataManager#remove
     * @fires Phaser.Data.Events#REMOVE_DATA
     * @since 3.0.0
     *
     * @param {(string|string[])} key - The key to remove, or an array of keys to remove.
     *
     * @return {this} This Data Manager instance.
     */
    remove: function (key)
    {
        console.group('DataManager remove');
        if (this._frozen)
        {
            console.groupEnd();
            return this;
        }

        if (Array.isArray(key))
        {
            for (var i = 0; i < key.length; i++)
            {
                this.removeValue(key[i]);
            }
        }
        else
        {
            console.groupEnd();
            return this.removeValue(key);
        }

        console.groupEnd();
        return this;
    },

    /**
     * Internal value remover, called automatically by the `remove` method.
     *
     * @method Phaser.Data.DataManager#removeValue
     * @private
     * @fires Phaser.Data.Events#REMOVE_DATA
     * @since 3.10.0
     *
     * @param {string} key - The key to set the value for.
     *
     * @return {this} This Data Manager instance.
     */
    removeValue: function (key)
    {
        console.group('DataManager removeValue');
        if (this.has(key))
        {
            var data = this.list[key];

            delete this.list[key];
            delete this.values[key];

            this.events.emit(Events.REMOVE_DATA, this.parent, key, data);
        }

        console.groupEnd();
        return this;
    },

    /**
     * Retrieves the data associated with the given 'key', deletes it from this Data Manager, then returns it.
     *
     * @method Phaser.Data.DataManager#pop
     * @fires Phaser.Data.Events#REMOVE_DATA
     * @since 3.0.0
     *
     * @param {string} key - The key of the value to retrieve and delete.
     *
     * @return {*} The value of the given key.
     */
    pop: function (key)
    {
        console.group('DataManager pop');
        var data = undefined;

        if (!this._frozen && this.has(key))
        {
            data = this.list[key];

            delete this.list[key];
            delete this.values[key];

            this.events.emit(Events.REMOVE_DATA, this.parent, key, data);
        }

        console.groupEnd();
        return data;
    },

    /**
     * Determines whether the given key is set in this Data Manager.
     *
     * Please note that the keys are case-sensitive and must be valid JavaScript Object property strings.
     * This means the keys `gold` and `Gold` are treated as two unique values within the Data Manager.
     *
     * @method Phaser.Data.DataManager#has
     * @since 3.0.0
     *
     * @param {string} key - The key to check.
     *
     * @return {boolean} Returns `true` if the key exists, otherwise `false`.
     */
    has: function (key)
    {
        console.group('DataManager has');
        const result = this.list.hasOwnProperty(key);
        console.groupEnd();
        return result;
    },

    /**
     * Freeze or unfreeze this Data Manager. A frozen Data Manager will block all attempts
     * to create new values or update existing ones.
     *
     * @method Phaser.Data.DataManager#setFreeze
     * @since 3.0.0
     *
     * @param {boolean} value - Whether to freeze or unfreeze the Data Manager.
     *
     * @return {this} This Data Manager instance.
     */
    setFreeze: function (value)
    {
        console.group('DataManager setFreeze');
        this._frozen = value;

        console.groupEnd();
        return this;
    },

    /**
     * Delete all data in this Data Manager and unfreeze it.
     *
     * @method Phaser.Data.DataManager#reset
     * @since 3.0.0
     *
     * @return {this} This Data Manager instance.
     */
    reset: function ()
    {
        console.group('DataManager reset');
        for (var key in this.list)
        {
            delete this.list[key];
            delete this.values[key];
        }

        this._frozen = false;

        console.groupEnd();
        return this;
    },

    /**
     * Destroy this data manager.
     *
     * @method Phaser.Data.DataManager#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        console.group('DataManager destroy');
        this.reset();

        this.events.off(Events.CHANGE_DATA);
        this.events.off(Events.SET_DATA);
        this.events.off(Events.REMOVE_DATA);

        this.parent = null;
        console.groupEnd();
    },

    /**
     * Gets or sets the frozen state of this Data Manager.
     * A frozen Data Manager will block all attempts to create new values or update existing ones.
     *
     * @name Phaser.Data.DataManager#freeze
     * @type {boolean}
     * @since 3.0.0
     */
    freeze: {

        get: function ()
        {
            return this._frozen;
        },

        set: function (value)
        {
            this._frozen = (value) ? true : false;
        }

    },

    /**
     * Return the total number of entries in this Data Manager.
     *
     * @name Phaser.Data.DataManager#count
     * @type {number}
     * @since 3.0.0
     */
    count: {

        get: function ()
        {
            var i = 0;

            for (var key in this.list)
            {
                if (this.list[key] !== undefined)
                {
                    i++;
                }
            }

            return i;
        }

    }

});

module.exports = DataManager;
