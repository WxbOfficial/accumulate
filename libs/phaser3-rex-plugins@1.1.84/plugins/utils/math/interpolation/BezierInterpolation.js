/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */
import Bernstein from '../Bernstein.js';

/**
 * A bezier interpolation method.
 *
 * @function Phaser.Math.Interpolation.Bezier
 * @since 3.0.0
 *
 * @param {number[]} v - The input array of values to interpolate between.
 * @param {number} k - The percentage of interpolation, between 0 and 1.
 *
 * @return {number} The interpolated value.
 */
var BezierInterpolation = function (v, k) {
    var b = 0;
    var n = v.length - 1;

    for (var i = 0; i <= n; i++) {
        b += Math.pow(1 - k, n - i) * Math.pow(k, i) * v[i] * Bernstein(n, i);
    }

    return b;
};

export default BezierInterpolation;
