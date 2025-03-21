/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import Factorial from './Factorial.js';

/**
 * Calculates the Bernstein basis from the three factorial coefficients.
 *
 * @function Phaser.Math.Bernstein
 * @since 3.0.0
 *
 * @param {number} n - The first value.
 * @param {number} i - The second value.
 *
 * @return {number} The Bernstein basis of Factorial(n) / Factorial(i) / Factorial(n - i)
 */
var Bernstein = function (n, i) {
    return Factorial(n) / Factorial(i) / Factorial(n - i);
};

export default Bernstein;
