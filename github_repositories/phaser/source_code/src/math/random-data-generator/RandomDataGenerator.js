/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');

/**
 * @classdesc
 * A seeded Random Data Generator.
 *
 * Access via `Phaser.Math.RND` which is an instance of this class pre-defined
 * by Phaser. Or, create your own instance to use as you require.
 *
 * The `Math.RND` generator is seeded by the Game Config property value `seed`.
 * If no such config property exists, a random number is used.
 *
 * If you create your own instance of this class you should provide a seed for it.
 * If no seed is given it will use a 'random' one based on Date.now.
 *
 * @class RandomDataGenerator
 * @memberof Phaser.Math
 * @constructor
 * @since 3.0.0
 *
 * @param {(string|string[])} [seeds] - The seeds to use for the random number generator.
 */
var RandomDataGenerator = new Class({

    initialize:

    function RandomDataGenerator (seeds)
    {
        console.group('RandomDataGenerator');
        if (seeds === undefined) { seeds = [ (Date.now() * Math.random()).toString() ]; }

        /**
         * Internal var.
         *
         * @name Phaser.Math.RandomDataGenerator#c
         * @type {number}
         * @default 1
         * @private
         * @since 3.0.0
         */
        this.c = 1;

        /**
         * Internal var.
         *
         * @name Phaser.Math.RandomDataGenerator#s0
         * @type {number}
         * @default 0
         * @private
         * @since 3.0.0
         */
        this.s0 = 0;

        /**
         * Internal var.
         *
         * @name Phaser.Math.RandomDataGenerator#s1
         * @type {number}
         * @default 0
         * @private
         * @since 3.0.0
         */
        this.s1 = 0;

        /**
         * Internal var.
         *
         * @name Phaser.Math.RandomDataGenerator#s2
         * @type {number}
         * @default 0
         * @private
         * @since 3.0.0
         */
        this.s2 = 0;

        /**
         * Internal var.
         *
         * @name Phaser.Math.RandomDataGenerator#n
         * @type {number}
         * @default 0
         * @private
         * @since 3.2.0
         */
        this.n = 0;

        /**
         * Signs to choose from.
         *
         * @name Phaser.Math.RandomDataGenerator#signs
         * @type {number[]}
         * @since 3.0.0
         */
        this.signs = [ -1, 1 ];

        if (seeds)
        {
            this.init(seeds);
        }
        console.groupEnd();
    },

    /**
     * Private random helper.
     *
     * @method Phaser.Math.RandomDataGenerator#rnd
     * @since 3.0.0
     * @private
     *
     * @return {number} A random number.
     */
    rnd: function ()
    {
        console.group('RandomDataGenerator rnd');
        var t = 2091639 * this.s0 + this.c * 2.3283064365386963e-10; // 2^-32

        this.c = t | 0;
        this.s0 = this.s1;
        this.s1 = this.s2;
        this.s2 = t - this.c;

        console.groupEnd();
        return this.s2;
    },

    /**
     * Internal method that creates a seed hash.
     *
     * @method Phaser.Math.RandomDataGenerator#hash
     * @since 3.0.0
     * @private
     *
     * @param {string} data - The value to hash.
     *
     * @return {number} The hashed value.
     */
    hash: function (data)
    {
        console.group('RandomDataGenerator hash');
        var h;
        var n = this.n;

        data = data.toString();

        for (var i = 0; i < data.length; i++)
        {
            n += data.charCodeAt(i);
            h = 0.02519603282416938 * n;
            n = h >>> 0;
            h -= n;
            h *= n;
            n = h >>> 0;
            h -= n;
            n += h * 0x100000000;// 2^32
        }

        this.n = n;

        console.groupEnd();
        return (n >>> 0) * 2.3283064365386963e-10;// 2^-32
    },

    /**
     * Initialize the state of the random data generator.
     *
     * @method Phaser.Math.RandomDataGenerator#init
     * @since 3.0.0
     *
     * @param {(string|string[])} seeds - The seeds to initialize the random data generator with.
     */
    init: function (seeds)
    {
        console.group('RandomDataGenerator init');
        if (typeof seeds === 'string')
        {
            this.state(seeds);
        }
        else
        {
            this.sow(seeds);
        }
        console.groupEnd();
    },

    /**
     * Reset the seed of the random data generator.
     *
     * _Note_: the seed array is only processed up to the first `undefined` (or `null`) value, should such be present.
     *
     * @method Phaser.Math.RandomDataGenerator#sow
     * @since 3.0.0
     *
     * @param {string[]} seeds - The array of seeds: the `toString()` of each value is used.
     */
    sow: function (seeds)
    {
        console.group('RandomDataGenerator sow');
        // Always reset to default seed
        this.n = 0xefc8249d;
        this.s0 = this.hash(' ');
        this.s1 = this.hash(' ');
        this.s2 = this.hash(' ');
        this.c = 1;

        if (!seeds)
        {
        	console.groupEnd();
            return;
        }

        // Apply any seeds
        for (var i = 0; i < seeds.length && (seeds[i] != null); i++)
        {
            var seed = seeds[i];

            this.s0 -= this.hash(seed);
            this.s0 += ~~(this.s0 < 0);
            this.s1 -= this.hash(seed);
            this.s1 += ~~(this.s1 < 0);
            this.s2 -= this.hash(seed);
            this.s2 += ~~(this.s2 < 0);
        }
        console.groupEnd();
    },

    /**
     * Returns a random integer between 0 and 2^32.
     *
     * @method Phaser.Math.RandomDataGenerator#integer
     * @since 3.0.0
     *
     * @return {number} A random integer between 0 and 2^32.
     */
    integer: function ()
    {
        console.group('RandomDataGenerator integer');
        // 2^32
        const result = this.rnd() * 0x100000000;
        console.groupEnd();
        return result;
    },

    /**
     * Returns a random real number between 0 and 1.
     *
     * @method Phaser.Math.RandomDataGenerator#frac
     * @since 3.0.0
     *
     * @return {number} A random real number between 0 and 1.
     */
    frac: function ()
    {
        console.group('RandomDataGenerator frac');
        // 2^-53
        const result = this.rnd() + (this.rnd() * 0x200000 | 0) * 1.1102230246251565e-16;
        console.groupEnd();
        return result;
    },

    /**
     * Returns a random real number between 0 and 2^32.
     *
     * @method Phaser.Math.RandomDataGenerator#real
     * @since 3.0.0
     *
     * @return {number} A random real number between 0 and 2^32.
     */
    real: function ()
    {
        console.group('RandomDataGenerator real');
        const result = this.integer() + this.frac();
        console.groupEnd();
        return result;
    },

    /**
     * Returns a random integer between and including min and max.
     *
     * @method Phaser.Math.RandomDataGenerator#integerInRange
     * @since 3.0.0
     *
     * @param {number} min - The minimum value in the range.
     * @param {number} max - The maximum value in the range.
     *
     * @return {number} A random number between min and max.
     */
    integerInRange: function (min, max)
    {
        console.group('RandomDataGenerator integerInRange');
        const result = Math.floor(this.realInRange(0, max - min + 1) + min);
        console.groupEnd();
        return result;
    },

    /**
     * Returns a random integer between and including min and max.
     * This method is an alias for RandomDataGenerator.integerInRange.
     *
     * @method Phaser.Math.RandomDataGenerator#between
     * @since 3.0.0
     *
     * @param {number} min - The minimum value in the range.
     * @param {number} max - The maximum value in the range.
     *
     * @return {number} A random number between min and max.
     */
    between: function (min, max)
    {
        console.group('RandomDataGenerator between');
        const result = Math.floor(this.realInRange(0, max - min + 1) + min);
        console.groupEnd();
        return result;
    },

    /**
     * Returns a random real number between min and max.
     *
     * @method Phaser.Math.RandomDataGenerator#realInRange
     * @since 3.0.0
     *
     * @param {number} min - The minimum value in the range.
     * @param {number} max - The maximum value in the range.
     *
     * @return {number} A random number between min and max.
     */
    realInRange: function (min, max)
    {
        console.group('RandomDataGenerator realInRange');
        const result = this.frac() * (max - min) + min;
        console.groupEnd();
        return result;
    },

    /**
     * Returns a random real number between -1 and 1.
     *
     * @method Phaser.Math.RandomDataGenerator#normal
     * @since 3.0.0
     *
     * @return {number} A random real number between -1 and 1.
     */
    normal: function ()
    {
        console.group('RandomDataGenerator normal');
        const result = 1 - (2 * this.frac());
        console.groupEnd();
        return result;
    },

    /**
     * Returns a valid RFC4122 version4 ID hex string from https://gist.github.com/1308368
     *
     * @method Phaser.Math.RandomDataGenerator#uuid
     * @since 3.0.0
     *
     * @return {string} A valid RFC4122 version4 ID hex string
     */
    uuid: function ()
    {
        console.group('RandomDataGenerator uuid');
        var a = '';
        var b = '';

        for (b = a = ''; a++ < 36; b += ~a % 5 | a * 3 & 4 ? (a ^ 15 ? 8 ^ this.frac() * (a ^ 20 ? 16 : 4) : 4).toString(16) : '-')
        {
            // eslint-disable-next-line no-empty
        }

        console.groupEnd();
        return b;
    },

    /**
     * Returns a random element from within the given array.
     *
     * @method Phaser.Math.RandomDataGenerator#pick
     * @since 3.0.0
     *
     * @generic T
     * @genericUse {T[]} - [array]
     * @genericUse {T} - [$return]
     *
     * @param {T[]} array - The array to pick a random element from.
     *
     * @return {T} A random member of the array.
     */
    pick: function (array)
    {
        console.group('RandomDataGenerator pick');
        const result = array[this.integerInRange(0, array.length - 1)];
        console.groupEnd();
        return result;
    },

    /**
     * Returns a sign to be used with multiplication operator.
     *
     * @method Phaser.Math.RandomDataGenerator#sign
     * @since 3.0.0
     *
     * @return {number} -1 or +1.
     */
    sign: function ()
    {
        console.group('RandomDataGenerator sign');
        const result = this.pick(this.signs);
        console.groupEnd();
        return result;
    },

    /**
     * Returns a random element from within the given array, favoring the earlier entries.
     *
     * @method Phaser.Math.RandomDataGenerator#weightedPick
     * @since 3.0.0
     *
     * @generic T
     * @genericUse {T[]} - [array]
     * @genericUse {T} - [$return]
     *
     * @param {T[]} array - The array to pick a random element from.
     *
     * @return {T} A random member of the array.
     */
    weightedPick: function (array)
    {
        console.group('RandomDataGenerator weightedPick');
        const result = array[~~(Math.pow(this.frac(), 2) * (array.length - 0.5) + 0.5)];
        console.groupEnd();
        return result;
    },

    /**
     * Returns a random timestamp between min and max, or between the beginning of 2000 and the end of 2020 if min and max aren't specified.
     *
     * @method Phaser.Math.RandomDataGenerator#timestamp
     * @since 3.0.0
     *
     * @param {number} min - The minimum value in the range.
     * @param {number} max - The maximum value in the range.
     *
     * @return {number} A random timestamp between min and max.
     */
    timestamp: function (min, max)
    {
        console.group('RandomDataGenerator timestamp');
        const result = this.realInRange(min || 946684800000, max || 1577862000000);
        console.groupEnd();
        return result;
    },

    /**
     * Returns a random angle between -180 and 180.
     *
     * @method Phaser.Math.RandomDataGenerator#angle
     * @since 3.0.0
     *
     * @return {number} A random number between -180 and 180.
     */
    angle: function ()
    {
        console.group('RandomDataGenerator angle');
        const result = this.integerInRange(-180, 180);
        console.groupEnd();
        return result;
    },

    /**
     * Returns a random rotation in radians, between -3.141 and 3.141
     *
     * @method Phaser.Math.RandomDataGenerator#rotation
     * @since 3.0.0
     *
     * @return {number} A random number between -3.141 and 3.141
     */
    rotation: function ()
    {
        console.group('RandomDataGenerator rotation');
        const result = this.realInRange(-3.1415926, 3.1415926);
        console.groupEnd();
        return result;
    },

    /**
     * Gets or Sets the state of the generator. This allows you to retain the values
     * that the generator is using between games, i.e. in a game save file.
     *
     * To seed this generator with a previously saved state you can pass it as the
     * `seed` value in your game config, or call this method directly after Phaser has booted.
     *
     * Call this method with no parameters to return the current state.
     *
     * If providing a state it should match the same format that this method
     * returns, which is a string with a header `!rnd` followed by the `c`,
     * `s0`, `s1` and `s2` values respectively, each comma-delimited.
     *
     * @method Phaser.Math.RandomDataGenerator#state
     * @since 3.0.0
     *
     * @param {string} [state] - Generator state to be set.
     *
     * @return {string} The current state of the generator.
     */
    state: function (state)
    {
        console.group('RandomDataGenerator state');
        if (typeof state === 'string' && state.match(/^!rnd/))
        {
            state = state.split(',');

            this.c = parseFloat(state[1]);
            this.s0 = parseFloat(state[2]);
            this.s1 = parseFloat(state[3]);
            this.s2 = parseFloat(state[4]);
        }

        console.groupEnd();
        return [ '!rnd', this.c, this.s0, this.s1, this.s2 ].join(',');
    },

    /**
     * Shuffles the given array, using the current seed.
     *
     * @method Phaser.Math.RandomDataGenerator#shuffle
     * @since 3.7.0
     *
     * @generic T
     * @genericUse {T[]} - [array,$return]
     *
     * @param {T[]} [array] - The array to be shuffled.
     *
     * @return {T[]} The shuffled array.
     */
    shuffle: function (array)
    {
        console.group('RandomDataGenerator shuffle');
        var len = array.length - 1;

        for (var i = len; i > 0; i--)
        {
            var randomIndex = Math.floor(this.frac() * (i + 1));
            var itemAtIndex = array[randomIndex];

            array[randomIndex] = array[i];
            array[i] = itemAtIndex;
        }

        console.groupEnd();
        return array;
    }

});

module.exports = RandomDataGenerator;
