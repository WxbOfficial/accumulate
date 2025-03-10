/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import Point from './Point.js';
import GetMagnitudeSq from './GetMagnitudeSq.js';

/**
 * [description]
 *
 * @function Phaser.Geom.Point.Project
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point} O - [out,$return]
 *
 * @param {Phaser.Geom.Point} pointA - [description]
 * @param {Phaser.Geom.Point} pointB - [description]
 * @param {Phaser.Geom.Point} [out] - [description]
 *
 * @return {Phaser.Geom.Point} [description]
 */
var Project = function (pointA, pointB, out) {
    if (out === undefined) { out = new Point(); }

    var dot = ((pointA.x * pointB.x) + (pointA.y * pointB.y));
    var amt = dot / GetMagnitudeSq(pointB);

    if (amt !== 0) {
        out.x = amt * pointB.x;
        out.y = amt * pointB.y;
    }

    return out;
};

export default Project;
