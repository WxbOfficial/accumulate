/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Color = require('./Color');
var IntegerToRGB = require('./IntegerToRGB');

/**
 * Converts the given color value into an instance of a Color object.
 *
 * @function Phaser.Display.Color.IntegerToColor
 * @since 3.0.0
 *
 * @param {number} input - The color value to convert into a Color object.
 *
 * @return {Phaser.Display.Color} A Color object.
 */
var IntegerToColor = function (input)
{
    console.group('IntegerToColor');
    var rgb = IntegerToRGB(input);

    const result = new Color(rgb.r, rgb.g, rgb.b, rgb.a);
    console.groupEnd();
    return result;
};

module.exports = IntegerToColor;
