/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CONST = require('../../const');
var Smoothing = require('./Smoothing');

// The pool into which the canvas elements are placed.
var pool = [];

//  Automatically apply smoothing(false) to created Canvas elements
var _disableContextSmoothing = false;

/**
 * The CanvasPool is a global static object, that allows Phaser to recycle and pool 2D Context Canvas DOM elements.
 * It does not pool WebGL Contexts, because once the context options are set they cannot be modified again,
 * which is useless for some of the Phaser pipelines / renderer.
 *
 * This singleton is instantiated as soon as Phaser loads, before a Phaser.Game instance has even been created.
 * Which means all instances of Phaser Games on the same page can share the one single pool.
 *
 * @namespace Phaser.Display.Canvas.CanvasPool
 * @since 3.0.0
 */
var CanvasPool = function ()
{
	console.group('CanvasPool init');
    /**
     * Creates a new Canvas DOM element, or pulls one from the pool if free.
     *
     * @function Phaser.Display.Canvas.CanvasPool.create
     * @since 3.0.0
     *
     * @param {*} parent - The parent of the Canvas object.
     * @param {number} [width=1] - The width of the Canvas.
     * @param {number} [height=1] - The height of the Canvas.
     * @param {number} [canvasType=Phaser.CANVAS] - The type of the Canvas. Either `Phaser.CANVAS` or `Phaser.WEBGL`.
     * @param {boolean} [selfParent=false] - Use the generated Canvas element as the parent?
     *
     * @return {HTMLCanvasElement} The canvas element that was created or pulled from the pool
     */
    var create = function (parent, width, height, canvasType, selfParent)
    {
        console.group('CanvasPool create');
        if (width === undefined) { width = 1; }
        if (height === undefined) { height = 1; }
        if (canvasType === undefined) { canvasType = CONST.CANVAS; }
        if (selfParent === undefined) { selfParent = false; }

        var canvas;
        var container = first(canvasType);

        if (container === null)
        {
            container = {
                parent: parent,
                canvas: document.createElement('canvas'),
                type: canvasType
            };

            if (canvasType === CONST.CANVAS)
            {
                pool.push(container);
            }

            canvas = container.canvas;
        }
        else
        {
            container.parent = parent;

            canvas = container.canvas;
        }

        if (selfParent)
        {
            container.parent = canvas;
        }

        canvas.width = width;
        canvas.height = height;

        if (_disableContextSmoothing && canvasType === CONST.CANVAS)
        {
            Smoothing.disable(canvas.getContext('2d', { willReadFrequently: false }));
        }

        console.groupEnd();
        return canvas;
    };

    /**
     * Creates a new Canvas DOM element, or pulls one from the pool if free.
     *
     * @function Phaser.Display.Canvas.CanvasPool.create2D
     * @since 3.0.0
     *
     * @param {*} parent - The parent of the Canvas object.
     * @param {number} [width=1] - The width of the Canvas.
     * @param {number} [height=1] - The height of the Canvas.
     *
     * @return {HTMLCanvasElement} The created canvas.
     */
    var create2D = function (parent, width, height)
    {
        console.group('CanvasPool create2D');
        const result = create(parent, width, height, CONST.CANVAS);
        console.groupEnd();
        return result;
    };

    /**
     * Creates a new Canvas DOM element, or pulls one from the pool if free.
     *
     * @function Phaser.Display.Canvas.CanvasPool.createWebGL
     * @since 3.0.0
     *
     * @param {*} parent - The parent of the Canvas object.
     * @param {number} [width=1] - The width of the Canvas.
     * @param {number} [height=1] - The height of the Canvas.
     *
     * @return {HTMLCanvasElement} The created WebGL canvas.
     */
    var createWebGL = function (parent, width, height)
    {
        console.group('CanvasPool createWebGL');
        const result = create(parent, width, height, CONST.WEBGL);
        console.groupEnd();
        return result;
    };

    /**
     * Gets the first free canvas index from the pool.
     *
     * @function Phaser.Display.Canvas.CanvasPool.first
     * @since 3.0.0
     *
     * @param {number} [canvasType=Phaser.CANVAS] - The type of the Canvas. Either `Phaser.CANVAS` or `Phaser.WEBGL`.
     *
     * @return {HTMLCanvasElement} The first free canvas, or `null` if a WebGL canvas was requested or if the pool doesn't have free canvases.
     */
    var first = function (canvasType)
    {
        console.group('CanvasPool first');
        if (canvasType === undefined) { canvasType = CONST.CANVAS; }

        if (canvasType === CONST.WEBGL)
        {
            console.groupEnd();
            return null;
        }

        for (var i = 0; i < pool.length; i++)
        {
            var container = pool[i];

            if (!container.parent && container.type === canvasType)
            {
                console.groupEnd();
                return container;
            }
        }

        console.groupEnd();
        return null;
    };

    /**
     * Looks up a canvas based on its parent, and if found puts it back in the pool, freeing it up for re-use.
     * The canvas has its width and height set to 1, and its parent attribute nulled.
     *
     * @function Phaser.Display.Canvas.CanvasPool.remove
     * @since 3.0.0
     *
     * @param {*} parent - The canvas or the parent of the canvas to free.
     */
    var remove = function (parent)
    {
        console.group('CanvasPool remove');
        //  Check to see if the parent is a canvas object
        var isCanvas = parent instanceof HTMLCanvasElement;

        pool.forEach(function (container)
        {
            if ((isCanvas && container.canvas === parent) || (!isCanvas && container.parent === parent))
            {
                container.parent = null;
                container.canvas.width = 1;
                container.canvas.height = 1;
            }
        });
        console.groupEnd();
    };

    /**
     * Gets the total number of used canvas elements in the pool.
     *
     * @function Phaser.Display.Canvas.CanvasPool.total
     * @since 3.0.0
     *
     * @return {number} The number of used canvases.
     */
    var total = function ()
    {
        console.group('CanvasPool total');
        var c = 0;

        pool.forEach(function (container)
        {
            if (container.parent)
            {
                c++;
            }
        });

        console.groupEnd();
        return c;
    };

    /**
     * Gets the total number of free canvas elements in the pool.
     *
     * @function Phaser.Display.Canvas.CanvasPool.free
     * @since 3.0.0
     *
     * @return {number} The number of free canvases.
     */
    var free = function ()
    {
        console.group('CanvasPool free');
        const result = pool.length - total();
        console.groupEnd();
        return result;
    };

    /**
     * Disable context smoothing on any new Canvas element created.
     *
     * @function Phaser.Display.Canvas.CanvasPool.disableSmoothing
     * @since 3.0.0
     */
    var disableSmoothing = function ()
    {
        console.group('CanvasPool disableSmoothing');
        _disableContextSmoothing = true;
        console.groupEnd();
    };

    /**
     * Enable context smoothing on any new Canvas element created.
     *
     * @function Phaser.Display.Canvas.CanvasPool.enableSmoothing
     * @since 3.0.0
     */
    var enableSmoothing = function ()
    {
        console.group('CanvasPool enableSmoothing');
        _disableContextSmoothing = false;
        console.groupEnd();
    };

	console.groupEnd();
    return {
        create2D: create2D,
        create: create,
        createWebGL: createWebGL,
        disableSmoothing: disableSmoothing,
        enableSmoothing: enableSmoothing,
        first: first,
        free: free,
        pool: pool,
        remove: remove,
        total: total
    };
};

//  If we export the called function here, it'll only be invoked once (not every time it's required).
module.exports = CanvasPool();
