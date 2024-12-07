/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var NOOP = require('../utils/NOOP');

/**
 * @classdesc
 * Abstracts away the use of RAF or setTimeOut for the core game update loop.
 *
 * This is invoked automatically by the Phaser.Game instance.
 *
 * @class RequestAnimationFrame
 * @memberof Phaser.DOM
 * @constructor
 * @since 3.0.0
 */
var RequestAnimationFrame = new Class({

    initialize:

    function RequestAnimationFrame ()
    {
        console.group('RequestAnimationFrame');
        /**
         * True if RequestAnimationFrame is running, otherwise false.
         *
         * @name Phaser.DOM.RequestAnimationFrame#isRunning
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.isRunning = false;

        /**
         * The callback to be invoked each step.
         *
         * @name Phaser.DOM.RequestAnimationFrame#callback
         * @type {FrameRequestCallback}
         * @since 3.0.0
         */
        this.callback = NOOP;

        /**
         * True if the step is using setTimeout instead of RAF.
         *
         * @name Phaser.DOM.RequestAnimationFrame#isSetTimeOut
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.isSetTimeOut = false;

        /**
         * The setTimeout or RAF callback ID used when canceling them.
         *
         * @name Phaser.DOM.RequestAnimationFrame#timeOutID
         * @type {?number}
         * @default null
         * @since 3.0.0
         */
        this.timeOutID = null;

        /**
         * The delay rate in ms for setTimeOut.
         *
         * @name Phaser.DOM.RequestAnimationFrame#delay
         * @type {number}
         * @default 0
         * @since 3.60.0
         */
        this.delay = 0;

        var _this = this;

        /**
         * The RAF step function.
         *
         * Invokes the callback and schedules another call to requestAnimationFrame.
         *
         * @name Phaser.DOM.RequestAnimationFrame#step
         * @type {FrameRequestCallback}
         * @since 3.0.0
         *
         * @param {number} time - The timestamp passed in from RequestAnimationFrame.
         */
        this.step = function step (time)
        {
            _this.callback(time);

            if (_this.isRunning)
            {   
                console.warn('%cRequestAnimationFrame 为了方便阅读打印信息, 将代码注释了', 'font-size: 18px; color: #ffffff; background-color: #000000;');
                // _this.timeOutID = window.requestAnimationFrame(step);
            }
        };

        /**
         * The SetTimeout step function.
         *
         * Invokes the callback and schedules another call to setTimeout.
         *
         * @name Phaser.DOM.RequestAnimationFrame#stepTimeout
         * @type {function}
         * @since 3.0.0
         */
        this.stepTimeout = function stepTimeout ()
        {
            if (_this.isRunning)
            {
                //  Make the next request before the callback, so that timing is maintained
                _this.timeOutID = window.setTimeout(stepTimeout, _this.delay);
            }

            _this.callback(window.performance.now());
        };
        console.groupEnd();
    },

    /**
     * Starts the requestAnimationFrame or setTimeout process running.
     *
     * @method Phaser.DOM.RequestAnimationFrame#start
     * @since 3.0.0
     *
     * @param {FrameRequestCallback} callback - The callback to invoke each step.
     * @param {boolean} forceSetTimeOut - Should it use SetTimeout, even if RAF is available?
     * @param {number} delay - The setTimeout delay rate in ms.
     */
    start: function (callback, forceSetTimeOut, delay)
    {
        console.group('RequestAnimationFrame start');
        if (this.isRunning)
        {
            console.groupEnd();
            return;
        }

        this.callback = callback;

        this.isSetTimeOut = forceSetTimeOut;

        this.delay = delay;

        this.isRunning = true;

        this.timeOutID = (forceSetTimeOut) ? window.setTimeout(this.stepTimeout, 0) : window.requestAnimationFrame(this.step);
        console.groupEnd();
    },

    /**
     * Stops the requestAnimationFrame or setTimeout from running.
     *
     * @method Phaser.DOM.RequestAnimationFrame#stop
     * @since 3.0.0
     */
    stop: function ()
    {
        console.group('RequestAnimationFrame stop');
        this.isRunning = false;

        if (this.isSetTimeOut)
        {
            clearTimeout(this.timeOutID);
        }
        else
        {
            window.cancelAnimationFrame(this.timeOutID);
        }
        console.groupEnd();
    },

    /**
     * Stops the step from running and clears the callback reference.
     *
     * @method Phaser.DOM.RequestAnimationFrame#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        console.group('RequestAnimationFrame destroy');
        this.stop();

        this.callback = NOOP;
        console.groupEnd();
    }

});

module.exports = RequestAnimationFrame;
