/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import Contains from './Contains.js';

/**
 * Check to see if the Ellipse contains all four points of the given Rectangle object.
 *
 * @function Phaser.Geom.Ellipse.ContainsRect
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Ellipse} ellipse - The Ellipse to check.
 * @param {(Phaser.Geom.Rectangle|object)} rect - The Rectangle object to check if it's within the Ellipse or not.
 *
 * @return {boolean} True if all of the Rectangle coordinates are within the ellipse, otherwise false.
 */
var ContainsRect = function (ellipse, rect) {
    return (
        Contains(ellipse, rect.x, rect.y) &&
        Contains(ellipse, rect.right, rect.y) &&
        Contains(ellipse, rect.x, rect.bottom) &&
        Contains(ellipse, rect.right, rect.bottom)
    );
};

export default ContainsRect;
