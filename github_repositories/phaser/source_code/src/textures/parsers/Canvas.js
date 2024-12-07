/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Adds a Canvas Element to a Texture.
 *
 * @function Phaser.Textures.Parsers.Canvas
 * @memberof Phaser.Textures.Parsers
 * @private
 * @since 3.0.0
 *
 * @param {Phaser.Textures.Texture} texture - The Texture to add the Frames to.
 * @param {number} sourceIndex - The index of the TextureSource.
 *
 * @return {Phaser.Textures.Texture} The Texture modified by this parser.
 */
var Canvas = function (texture, sourceIndex)
{
    console.group('Parsers Canvas');
    var source = texture.source[sourceIndex];

    texture.add('__BASE', sourceIndex, 0, 0, source.width, source.height);

    console.groupEnd();
    return texture;
};

module.exports = Canvas;
