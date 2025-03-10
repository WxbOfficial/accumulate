/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2021 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @ignore
 */
function GetSize (width, height, x, y, dx, dy, mult)
{
    if (mult === undefined) { mult = 16; }

    return Math.floor((width + x) / dx) * Math.floor((height + y) / dy) * mult;
}

/**
 * @ignore
 */
function PVRTC2bppSize (width, height)
{
    width = Math.max(width, 16);
    height = Math.max(height, 8);

    return width * height / 4;
}

/**
 * @ignore
 */
function PVRTC4bppSize (width, height)
{
    width = Math.max(width, 8);
    height = Math.max(height, 8);

    return width * height / 2;
}

/**
 * @ignore
 */
function BPTCSize (width, height)
{
    return Math.ceil(width / 4) * Math.ceil(height / 4) * 16;
}

/**
 * @ignore
 */
function DXTEtcSmallSize (width, height)
{
    return GetSize(width, height, 3, 3, 4, 4, 8);
}

/**
 * @ignore
 */
function DXTEtcAstcBigSize (width, height)
{
    return GetSize(width, height, 3, 3, 4, 4);
}

/**
 * @ignore
 */
function ATC5x4Size (width, height)
{
    return GetSize(width, height, 4, 3, 5, 4);
}

/**
 * @ignore
 */
function ATC5x5Size (width, height)
{
    return GetSize(width, height, 4, 4, 5, 5);
}

/**
 * @ignore
 */
function ATC6x5Size (width, height)
{
    return GetSize(width, height, 5, 4, 6, 5);
}

/**
 * @ignore
 */
function ATC6x6Size (width, height)
{
    return GetSize(width, height, 5, 5, 6, 6);
}

/**
 * @ignore
 */
function ATC8x5Size (width, height)
{
    return GetSize(width, height, 7, 4, 8, 5);
}

/**
 * @ignore
 */
function ATC8x6Size (width, height)
{
    return GetSize(width, height, 7, 5, 8, 6);
}

/**
 * @ignore
 */
function ATC8x8Size (width, height)
{
    return GetSize(width, height, 7, 7, 8, 8);
}

/**
 * @ignore
 */
function ATC10x5Size (width, height)
{
    return GetSize(width, height, 9, 4, 10, 5);
}

/**
 * @ignore
 */
function ATC10x6Size (width, height)
{
    return GetSize(width, height, 9, 5, 10, 6);
}

/**
 * @ignore
 */
function ATC10x8Size (width, height)
{
    return GetSize(width, height, 9, 7, 10, 8);
}

/**
 * @ignore
 */
function ATC10x10Size (width, height)
{
    return GetSize(width, height, 9, 9, 10, 10);
}

/**
 * @ignore
 */
function ATC12x10Size (width, height)
{
    return GetSize(width, height, 11, 9, 12, 10);
}

/**
 * @ignore
 */
function ATC12x12Size (width, height)
{
    return GetSize(width, height, 11, 11, 12, 12);
}

/*
 * 0: COMPRESSED_RGB_PVRTC_2BPPV1_IMG
 * 1: COMPRESSED_RGBA_PVRTC_2BPPV1_IMG
 * 2: COMPRESSED_RGB_PVRTC_4BPPV1_IMG
 * 3: COMPRESSED_RGBA_PVRTC_4BPPV1_IMG
 * 6: COMPRESSED_RGB_ETC1
 * 7: COMPRESSED_RGB_S3TC_DXT1_EXT or COMPRESSED_SRGB_S3TC_DXT1_EXT
 * 8: COMPRESSED_RGBA_S3TC_DXT1_EXT or COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT
 * 9: COMPRESSED_RGBA_S3TC_DXT3_EXT or COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT
 * 11: COMPRESSED_RGBA_S3TC_DXT5_EXT or COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT
 * 14: COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT or COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT
 * 15: COMPRESSED_RGBA_BPTC_UNORM_EXT or COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT
 * 22: COMPRESSED_RGB8_ETC2 or COMPRESSED_SRGB8_ETC2
 * 23: COMPRESSED_RGBA8_ETC2_EAC or COMPRESSED_SRGB8_ALPHA8_ETC2_EAC
 * 24: COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2 or COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2
 * 25: COMPRESSED_R11_EAC
 * 26: COMPRESSED_RG11_EAC
 * 27: COMPRESSED_RGBA_ASTC_4x4_KHR or COMPRESSED_SRGB8_ALPHA8_ASTC_4X4_KHR
 * 28: COMPRESSED_RGBA_ASTC_5x4_KHR or COMPRESSED_SRGB8_ALPHA8_ASTC_5X4_KHR
 * 29: COMPRESSED_RGBA_ASTC_5x5_KHR or COMPRESSED_SRGB8_ALPHA8_ASTC_5X5_KHR
 * 30: COMPRESSED_RGBA_ASTC_6x5_KHR or COMPRESSED_SRGB8_ALPHA8_ASTC_6X5_KHR
 * 31: COMPRESSED_RGBA_ASTC_6x6_KHR or COMPRESSED_SRGB8_ALPHA8_ASTC_6X6_KHR
 * 32: COMPRESSED_RGBA_ASTC_8x5_KHR or COMPRESSED_SRGB8_ALPHA8_ASTC_8X5_KHR
 * 33: COMPRESSED_RGBA_ASTC_8x6_KHR or COMPRESSED_SRGB8_ALPHA8_ASTC_8X6_KHR
 * 34: COMPRESSED_RGBA_ASTC_8x8_KHR or COMPRESSED_SRGB8_ALPHA8_ASTC_8X8_KHR
 * 35: COMPRESSED_RGBA_ASTC_10x5_KHR or COMPRESSED_SRGB8_ALPHA8_ASTC_10X5_KHR
 * 36: COMPRESSED_RGBA_ASTC_10x6_KHR or COMPRESSED_SRGB8_ALPHA8_ASTC_10X6_KHR
 * 37: COMPRESSED_RGBA_ASTC_10x8_KHR or COMPRESSED_SRGB8_ALPHA8_ASTC_10X8_KHR
 * 38: COMPRESSED_RGBA_ASTC_10x10_KHR or COMPRESSED_SRGB8_ALPHA8_ASTC_10X10_KHR
 * 39: COMPRESSED_RGBA_ASTC_12x10_KHR or COMPRESSED_SRGB8_ALPHA8_ASTC_12X10_KHR
 * 40: COMPRESSED_RGBA_ASTC_12x12_KHR or COMPRESSED_SRGB8_ALPHA8_ASTC_12X12_KHR
 */

/**
 * @ignore
 */
var FORMATS = {
    0: { sizeFunc: PVRTC2bppSize, glFormat: [ 0x8C01 ] },
    1: { sizeFunc: PVRTC2bppSize, glFormat: [ 0x8C03 ] },
    2: { sizeFunc: PVRTC4bppSize, glFormat: [ 0x8C00 ] },
    3: { sizeFunc: PVRTC4bppSize, glFormat: [ 0x8C02 ] },
    6: { sizeFunc: DXTEtcSmallSize , glFormat: [ 0x8D64 ] },
    7: { sizeFunc: DXTEtcSmallSize, glFormat: [ 0x83F0, 0x8C4C ] },
    8: { sizeFunc: DXTEtcAstcBigSize, glFormat: [ 0x83F1, 0x8C4D ] },
    9: { sizeFunc: DXTEtcAstcBigSize, glFormat: [ 0x83F2, 0x8C4E ] },
    11: { sizeFunc: DXTEtcAstcBigSize, glFormat: [ 0x83F3, 0x8C4F ] },
    14: { sizeFunc: BPTCSize, glFormat: [ 0x8E8E, 0x8E8F ] },
    15: { sizeFunc: BPTCSize, glFormat: [ 0x8E8C, 0x8E8D ] },
    22: { sizeFunc: DXTEtcSmallSize , glFormat: [ 0x9274, 0x9275 ] },
    23: { sizeFunc: DXTEtcAstcBigSize, glFormat: [ 0x9278, 0x9279 ] },
    24: { sizeFunc: DXTEtcSmallSize, glFormat: [ 0x9276, 0x9277 ] },
    25: { sizeFunc: DXTEtcSmallSize, glFormat: [ 0x9270 ] },
    26: { sizeFunc: DXTEtcAstcBigSize, glFormat: [ 0x9272 ] },
    27: { sizeFunc: DXTEtcAstcBigSize, glFormat: [ 0x93B0, 0x93D0 ] },
    28: { sizeFunc: ATC5x4Size, glFormat: [ 0x93B1, 0x93D1 ] },
    29: { sizeFunc: ATC5x5Size, glFormat: [ 0x93B2, 0x93D2 ] },
    30: { sizeFunc: ATC6x5Size, glFormat: [ 0x93B3, 0x93D3 ] },
    31: { sizeFunc: ATC6x6Size, glFormat: [ 0x93B4, 0x93D4 ] },
    32: { sizeFunc: ATC8x5Size, glFormat: [ 0x93B5, 0x93D5 ] },
    33: { sizeFunc: ATC8x6Size, glFormat: [ 0x93B6, 0x93D6 ] },
    34: { sizeFunc: ATC8x8Size, glFormat: [ 0x93B7, 0x93D7 ] },
    35: { sizeFunc: ATC10x5Size, glFormat: [ 0x93B8, 0x93D8 ] },
    36: { sizeFunc: ATC10x6Size, glFormat: [ 0x93B9, 0x93D9 ] },
    37: { sizeFunc: ATC10x8Size, glFormat: [ 0x93BA, 0x93DA ] },
    38: { sizeFunc: ATC10x10Size, glFormat: [ 0x93BB, 0x93DB ] },
    39: { sizeFunc: ATC12x10Size, glFormat: [ 0x93BC, 0x93DC ] },
    40: { sizeFunc: ATC12x12Size, glFormat: [ 0x93BD, 0x93DD ] }
};

/**
 * Parses a PVR format Compressed Texture file and generates texture data suitable for WebGL from it.
 *
 * @function Phaser.Textures.Parsers.PVRParser
 * @memberof Phaser.Textures.Parsers
 * @since 3.60.0
 *
 * @param {ArrayBuffer} data - The data object created by the Compressed Texture File Loader.
 *
 * @return {Phaser.Types.Textures.CompressedTextureData} The Compressed Texture data.
 */
var PVRParser = function (data)
{
    var header = new Uint32Array(data, 0, 13);

    // VERSION
    var version = header[0];
    var versionMatch = version === 0x03525650;

    //  PIXEL_FORMAT_INDEX
    var pvrFormat = versionMatch ? header[2] : header[3];

    // Colour Space
    var colorSpace = header[4];

    var internalFormat = FORMATS[pvrFormat].glFormat[colorSpace];
    var sizeFunction = FORMATS[pvrFormat].sizeFunc;

    //  MIPMAPCOUNT_INDEX
    var mipmapLevels = header[11];

    //  WIDTH_INDEX
    var width = header[7];

    //  HEIGHT_INDEX
    var height = header[6];

    //  HEADER_SIZE + METADATA_SIZE_INDEX
    var dataOffset = 52 + header[12];

    var image = new Uint8Array(data, dataOffset);

    var mipmaps = new Array(mipmapLevels);

    var offset = 0;
    var levelWidth = width;
    var levelHeight = height;

    for (var i = 0; i < mipmapLevels; i++)
    {
        var levelSize = sizeFunction(levelWidth, levelHeight);

        mipmaps[i] = {
            data: new Uint8Array(image.buffer, image.byteOffset + offset, levelSize),
            width: levelWidth,
            height: levelHeight
        };

        levelWidth = Math.max(1, levelWidth >> 1);
        levelHeight = Math.max(1, levelHeight >> 1);

        offset += levelSize;
    }

    return {
        mipmaps: mipmaps,
        width: width,
        height: height,
        internalFormat: internalFormat,
        compressed: true,
        generateMipmap: false
    };
};

module.exports = phaserFunctionMark(PVRParser);
