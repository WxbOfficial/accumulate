/* eslint-disable @typescript-eslint/naming-convention */
/** Defines the cross module used constants to avoid circular dependencies */
export class Constants {
}
/** Sampler suffix when associated with a texture name */
Constants.AUTOSAMPLERSUFFIX = "Sampler";
/** Flag used to disable diagnostics for WebGPU */
Constants.DISABLEUA = "#define DISABLE_UNIFORMITY_ANALYSIS";
/** Defines that alpha blending is disabled */
Constants.ALPHA_DISABLE = 0;
/** Defines that alpha blending is SRC ALPHA * SRC + DEST */
Constants.ALPHA_ADD = 1;
/** Defines that alpha blending is SRC ALPHA * SRC + (1 - SRC ALPHA) * DEST */
Constants.ALPHA_COMBINE = 2;
/** Defines that alpha blending is DEST - SRC * DEST */
Constants.ALPHA_SUBTRACT = 3;
/** Defines that alpha blending is SRC * DEST */
Constants.ALPHA_MULTIPLY = 4;
/** Defines that alpha blending is SRC ALPHA * SRC + (1 - SRC) * DEST */
Constants.ALPHA_MAXIMIZED = 5;
/** Defines that alpha blending is SRC + DEST */
Constants.ALPHA_ONEONE = 6;
/** Defines that alpha blending is SRC + (1 - SRC ALPHA) * DEST */
Constants.ALPHA_PREMULTIPLIED = 7;
/**
 * Defines that alpha blending is SRC + (1 - SRC ALPHA) * DEST
 * Alpha will be set to (1 - SRC ALPHA) * DEST ALPHA
 */
Constants.ALPHA_PREMULTIPLIED_PORTERDUFF = 8;
/** Defines that alpha blending is CST * SRC + (1 - CST) * DEST */
Constants.ALPHA_INTERPOLATE = 9;
/**
 * Defines that alpha blending is SRC + (1 - SRC) * DEST
 * Alpha will be set to SRC ALPHA + (1 - SRC ALPHA) * DEST ALPHA
 */
Constants.ALPHA_SCREENMODE = 10;
/**
 * Defines that alpha blending is SRC + DST
 * Alpha will be set to SRC ALPHA + DST ALPHA
 */
Constants.ALPHA_ONEONE_ONEONE = 11;
/**
 * Defines that alpha blending is SRC * DST ALPHA + DST
 * Alpha will be set to 0
 */
Constants.ALPHA_ALPHATOCOLOR = 12;
/**
 * Defines that alpha blending is SRC * (1 - DST) + DST * (1 - SRC)
 */
Constants.ALPHA_REVERSEONEMINUS = 13;
/**
 * Defines that alpha blending is SRC + DST * (1 - SRC ALPHA)
 * Alpha will be set to SRC ALPHA + DST ALPHA * (1 - SRC ALPHA)
 */
Constants.ALPHA_SRC_DSTONEMINUSSRCALPHA = 14;
/**
 * Defines that alpha blending is SRC + DST
 * Alpha will be set to SRC ALPHA
 */
Constants.ALPHA_ONEONE_ONEZERO = 15;
/**
 * Defines that alpha blending is SRC * (1 - DST) + DST * (1 - SRC)
 * Alpha will be set to DST ALPHA
 */
Constants.ALPHA_EXCLUSION = 16;
/**
 * Defines that alpha blending is SRC * SRC ALPHA + DST * (1 - SRC ALPHA)
 * Alpha will be set to SRC ALPHA + (1 - SRC ALPHA) * DST ALPHA
 */
Constants.ALPHA_LAYER_ACCUMULATE = 17;
/** Defines that alpha blending equation a SUM */
Constants.ALPHA_EQUATION_ADD = 0;
/** Defines that alpha blending equation a SUBSTRACTION */
Constants.ALPHA_EQUATION_SUBSTRACT = 1;
/** Defines that alpha blending equation a REVERSE SUBSTRACTION */
Constants.ALPHA_EQUATION_REVERSE_SUBTRACT = 2;
/** Defines that alpha blending equation a MAX operation */
Constants.ALPHA_EQUATION_MAX = 3;
/** Defines that alpha blending equation a MIN operation */
Constants.ALPHA_EQUATION_MIN = 4;
/**
 * Defines that alpha blending equation a DARKEN operation:
 * It takes the min of the src and sums the alpha channels.
 */
Constants.ALPHA_EQUATION_DARKEN = 5;
/** Defines that the resource is not delayed*/
Constants.DELAYLOADSTATE_NONE = 0;
/** Defines that the resource was successfully delay loaded */
Constants.DELAYLOADSTATE_LOADED = 1;
/** Defines that the resource is currently delay loading */
Constants.DELAYLOADSTATE_LOADING = 2;
/** Defines that the resource is delayed and has not started loading */
Constants.DELAYLOADSTATE_NOTLOADED = 4;
// Depth or Stencil test Constants.
/** Passed to depthFunction or stencilFunction to specify depth or stencil tests will never pass. i.e. Nothing will be drawn */
Constants.NEVER = 0x0200;
/** Passed to depthFunction or stencilFunction to specify depth or stencil tests will always pass. i.e. Pixels will be drawn in the order they are drawn */
Constants.ALWAYS = 0x0207;
/** Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is less than the stored value */
Constants.LESS = 0x0201;
/** Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is equals to the stored value */
Constants.EQUAL = 0x0202;
/** Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is less than or equal to the stored value */
Constants.LEQUAL = 0x0203;
/** Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is greater than the stored value */
Constants.GREATER = 0x0204;
/** Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is greater than or equal to the stored value */
Constants.GEQUAL = 0x0206;
/** Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is not equal to the stored value */
Constants.NOTEQUAL = 0x0205;
// Stencil Actions Constants.
/** Passed to stencilOperation to specify that stencil value must be kept */
Constants.KEEP = 0x1e00;
/** Passed to stencilOperation to specify that stencil value must be zero */
Constants.ZERO = 0x0000;
/** Passed to stencilOperation to specify that stencil value must be replaced */
Constants.REPLACE = 0x1e01;
/** Passed to stencilOperation to specify that stencil value must be incremented */
Constants.INCR = 0x1e02;
/** Passed to stencilOperation to specify that stencil value must be decremented */
Constants.DECR = 0x1e03;
/** Passed to stencilOperation to specify that stencil value must be inverted */
Constants.INVERT = 0x150a;
/** Passed to stencilOperation to specify that stencil value must be incremented with wrapping */
Constants.INCR_WRAP = 0x8507;
/** Passed to stencilOperation to specify that stencil value must be decremented with wrapping */
Constants.DECR_WRAP = 0x8508;
/** Texture is not repeating outside of 0..1 UVs */
Constants.TEXTURE_CLAMP_ADDRESSMODE = 0;
/** Texture is repeating outside of 0..1 UVs */
Constants.TEXTURE_WRAP_ADDRESSMODE = 1;
/** Texture is repeating and mirrored */
Constants.TEXTURE_MIRROR_ADDRESSMODE = 2;
/** Flag to create a storage texture */
Constants.TEXTURE_CREATIONFLAG_STORAGE = 1;
/** ALPHA */
Constants.TEXTUREFORMAT_ALPHA = 0;
/** LUMINANCE */
Constants.TEXTUREFORMAT_LUMINANCE = 1;
/** LUMINANCE_ALPHA */
Constants.TEXTUREFORMAT_LUMINANCE_ALPHA = 2;
/** RGB */
Constants.TEXTUREFORMAT_RGB = 4;
/** RGBA */
Constants.TEXTUREFORMAT_RGBA = 5;
/** RED */
Constants.TEXTUREFORMAT_RED = 6;
/** RED (2nd reference) */
Constants.TEXTUREFORMAT_R = 6;
/** RG */
Constants.TEXTUREFORMAT_RG = 7;
/** RED_INTEGER */
Constants.TEXTUREFORMAT_RED_INTEGER = 8;
/** RED_INTEGER (2nd reference) */
Constants.TEXTUREFORMAT_R_INTEGER = 8;
/** RG_INTEGER */
Constants.TEXTUREFORMAT_RG_INTEGER = 9;
/** RGB_INTEGER */
Constants.TEXTUREFORMAT_RGB_INTEGER = 10;
/** RGBA_INTEGER */
Constants.TEXTUREFORMAT_RGBA_INTEGER = 11;
/** BGRA */
Constants.TEXTUREFORMAT_BGRA = 12;
/** Depth 24 bits + Stencil 8 bits */
Constants.TEXTUREFORMAT_DEPTH24_STENCIL8 = 13;
/** Depth 32 bits float */
Constants.TEXTUREFORMAT_DEPTH32_FLOAT = 14;
/** Depth 16 bits */
Constants.TEXTUREFORMAT_DEPTH16 = 15;
/** Depth 24 bits */
Constants.TEXTUREFORMAT_DEPTH24 = 16;
/** Depth 24 bits unorm + Stencil 8 bits */
Constants.TEXTUREFORMAT_DEPTH24UNORM_STENCIL8 = 17;
/** Depth 32 bits float + Stencil 8 bits */
Constants.TEXTUREFORMAT_DEPTH32FLOAT_STENCIL8 = 18;
/** Stencil 8 bits */
Constants.TEXTUREFORMAT_STENCIL8 = 19;
/** UNDEFINED */
Constants.TEXTUREFORMAT_UNDEFINED = 0xffffffff;
/** Compressed BC7 */
Constants.TEXTUREFORMAT_COMPRESSED_RGBA_BPTC_UNORM = 36492;
/** Compressed BC7 (SRGB) */
Constants.TEXTUREFORMAT_COMPRESSED_SRGB_ALPHA_BPTC_UNORM = 36493;
/** Compressed BC6 unsigned float */
Constants.TEXTUREFORMAT_COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT = 36495;
/** Compressed BC6 signed float */
Constants.TEXTUREFORMAT_COMPRESSED_RGB_BPTC_SIGNED_FLOAT = 36494;
/** Compressed BC3 */
Constants.TEXTUREFORMAT_COMPRESSED_RGBA_S3TC_DXT5 = 33779;
/** Compressed BC3 (SRGB) */
Constants.TEXTUREFORMAT_COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT = 35919;
/** Compressed BC2 */
Constants.TEXTUREFORMAT_COMPRESSED_RGBA_S3TC_DXT3 = 33778;
/** Compressed BC2 (SRGB) */
Constants.TEXTUREFORMAT_COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT = 35918;
/** Compressed BC1 (RGBA) */
Constants.TEXTUREFORMAT_COMPRESSED_RGBA_S3TC_DXT1 = 33777;
/** Compressed BC1 (RGB) */
Constants.TEXTUREFORMAT_COMPRESSED_RGB_S3TC_DXT1 = 33776;
/** Compressed BC1 (SRGB+A) */
Constants.TEXTUREFORMAT_COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT = 35917;
/** Compressed BC1 (SRGB) */
Constants.TEXTUREFORMAT_COMPRESSED_SRGB_S3TC_DXT1_EXT = 35916;
/** Compressed ASTC 4x4 */
Constants.TEXTUREFORMAT_COMPRESSED_RGBA_ASTC_4x4 = 37808;
/** Compressed ASTC 4x4 (SRGB) */
Constants.TEXTUREFORMAT_COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR = 37840;
/** Compressed ETC1 (RGB) */
Constants.TEXTUREFORMAT_COMPRESSED_RGB_ETC1_WEBGL = 36196;
/** Compressed ETC2 (RGB) */
Constants.TEXTUREFORMAT_COMPRESSED_RGB8_ETC2 = 37492;
/** Compressed ETC2 (SRGB) */
Constants.TEXTUREFORMAT_COMPRESSED_SRGB8_ETC2 = 37493;
/** Compressed ETC2 (RGB+A1) */
Constants.TEXTUREFORMAT_COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2 = 37494;
/** Compressed ETC2 (SRGB+A1)*/
Constants.TEXTUREFORMAT_COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2 = 37495;
/** Compressed ETC2 (RGB+A) */
Constants.TEXTUREFORMAT_COMPRESSED_RGBA8_ETC2_EAC = 37496;
/** Compressed ETC2 (SRGB+1) */
Constants.TEXTUREFORMAT_COMPRESSED_SRGB8_ALPHA8_ETC2_EAC = 37497;
/** UNSIGNED_BYTE */
Constants.TEXTURETYPE_UNSIGNED_BYTE = 0;
/** UNSIGNED_BYTE (2nd reference) */
Constants.TEXTURETYPE_UNSIGNED_INT = 0;
/** FLOAT */
Constants.TEXTURETYPE_FLOAT = 1;
/** HALF_FLOAT */
Constants.TEXTURETYPE_HALF_FLOAT = 2;
/** BYTE */
Constants.TEXTURETYPE_BYTE = 3;
/** SHORT */
Constants.TEXTURETYPE_SHORT = 4;
/** UNSIGNED_SHORT */
Constants.TEXTURETYPE_UNSIGNED_SHORT = 5;
/** INT */
Constants.TEXTURETYPE_INT = 6;
/** UNSIGNED_INT */
Constants.TEXTURETYPE_UNSIGNED_INTEGER = 7;
/** UNSIGNED_SHORT_4_4_4_4 */
Constants.TEXTURETYPE_UNSIGNED_SHORT_4_4_4_4 = 8;
/** UNSIGNED_SHORT_5_5_5_1 */
Constants.TEXTURETYPE_UNSIGNED_SHORT_5_5_5_1 = 9;
/** UNSIGNED_SHORT_5_6_5 */
Constants.TEXTURETYPE_UNSIGNED_SHORT_5_6_5 = 10;
/** UNSIGNED_INT_2_10_10_10_REV */
Constants.TEXTURETYPE_UNSIGNED_INT_2_10_10_10_REV = 11;
/** UNSIGNED_INT_24_8 */
Constants.TEXTURETYPE_UNSIGNED_INT_24_8 = 12;
/** UNSIGNED_INT_10F_11F_11F_REV */
Constants.TEXTURETYPE_UNSIGNED_INT_10F_11F_11F_REV = 13;
/** UNSIGNED_INT_5_9_9_9_REV */
Constants.TEXTURETYPE_UNSIGNED_INT_5_9_9_9_REV = 14;
/** FLOAT_32_UNSIGNED_INT_24_8_REV */
Constants.TEXTURETYPE_FLOAT_32_UNSIGNED_INT_24_8_REV = 15;
/** UNDEFINED */
Constants.TEXTURETYPE_UNDEFINED = 16;
/** 2D Texture target*/
Constants.TEXTURE_2D = 3553;
/** 2D Array Texture target */
Constants.TEXTURE_2D_ARRAY = 35866;
/** Cube Map Texture target */
Constants.TEXTURE_CUBE_MAP = 34067;
/** Cube Map Array Texture target */
Constants.TEXTURE_CUBE_MAP_ARRAY = 0xdeadbeef;
/** 3D Texture target */
Constants.TEXTURE_3D = 32879;
/** nearest is mag = nearest and min = nearest and no mip */
Constants.TEXTURE_NEAREST_SAMPLINGMODE = 1;
/** mag = nearest and min = nearest and mip = none */
Constants.TEXTURE_NEAREST_NEAREST = 1;
/** Bilinear is mag = linear and min = linear and no mip */
Constants.TEXTURE_BILINEAR_SAMPLINGMODE = 2;
/** mag = linear and min = linear and mip = none */
Constants.TEXTURE_LINEAR_LINEAR = 2;
/** Trilinear is mag = linear and min = linear and mip = linear */
Constants.TEXTURE_TRILINEAR_SAMPLINGMODE = 3;
/** Trilinear is mag = linear and min = linear and mip = linear */
Constants.TEXTURE_LINEAR_LINEAR_MIPLINEAR = 3;
/** mag = nearest and min = nearest and mip = nearest */
Constants.TEXTURE_NEAREST_NEAREST_MIPNEAREST = 4;
/** mag = nearest and min = linear and mip = nearest */
Constants.TEXTURE_NEAREST_LINEAR_MIPNEAREST = 5;
/** mag = nearest and min = linear and mip = linear */
Constants.TEXTURE_NEAREST_LINEAR_MIPLINEAR = 6;
/** mag = nearest and min = linear and mip = none */
Constants.TEXTURE_NEAREST_LINEAR = 7;
/** nearest is mag = nearest and min = nearest and mip = linear */
Constants.TEXTURE_NEAREST_NEAREST_MIPLINEAR = 8;
/** mag = linear and min = nearest and mip = nearest */
Constants.TEXTURE_LINEAR_NEAREST_MIPNEAREST = 9;
/** mag = linear and min = nearest and mip = linear */
Constants.TEXTURE_LINEAR_NEAREST_MIPLINEAR = 10;
/** Bilinear is mag = linear and min = linear and mip = nearest */
Constants.TEXTURE_LINEAR_LINEAR_MIPNEAREST = 11;
/** mag = linear and min = nearest and mip = none */
Constants.TEXTURE_LINEAR_NEAREST = 12;
/** Explicit coordinates mode */
Constants.TEXTURE_EXPLICIT_MODE = 0;
/** Spherical coordinates mode */
Constants.TEXTURE_SPHERICAL_MODE = 1;
/** Planar coordinates mode */
Constants.TEXTURE_PLANAR_MODE = 2;
/** Cubic coordinates mode */
Constants.TEXTURE_CUBIC_MODE = 3;
/** Projection coordinates mode */
Constants.TEXTURE_PROJECTION_MODE = 4;
/** Skybox coordinates mode */
Constants.TEXTURE_SKYBOX_MODE = 5;
/** Inverse Cubic coordinates mode */
Constants.TEXTURE_INVCUBIC_MODE = 6;
/** Equirectangular coordinates mode */
Constants.TEXTURE_EQUIRECTANGULAR_MODE = 7;
/** Equirectangular Fixed coordinates mode */
Constants.TEXTURE_FIXED_EQUIRECTANGULAR_MODE = 8;
/** Equirectangular Fixed Mirrored coordinates mode */
Constants.TEXTURE_FIXED_EQUIRECTANGULAR_MIRRORED_MODE = 9;
/** Offline (baking) quality for texture filtering */
Constants.TEXTURE_FILTERING_QUALITY_OFFLINE = 4096;
/** High quality for texture filtering */
Constants.TEXTURE_FILTERING_QUALITY_HIGH = 64;
/** Medium quality for texture filtering */
Constants.TEXTURE_FILTERING_QUALITY_MEDIUM = 16;
/** Low quality for texture filtering */
Constants.TEXTURE_FILTERING_QUALITY_LOW = 8;
// Texture rescaling mode
/** Defines that texture rescaling will use a floor to find the closer power of 2 size */
Constants.SCALEMODE_FLOOR = 1;
/** Defines that texture rescaling will look for the nearest power of 2 size */
Constants.SCALEMODE_NEAREST = 2;
/** Defines that texture rescaling will use a ceil to find the closer power of 2 size */
Constants.SCALEMODE_CEILING = 3;
/**
 * The dirty texture flag value
 */
Constants.MATERIAL_TextureDirtyFlag = 1;
/**
 * The dirty light flag value
 */
Constants.MATERIAL_LightDirtyFlag = 2;
/**
 * The dirty fresnel flag value
 */
Constants.MATERIAL_FresnelDirtyFlag = 4;
/**
 * The dirty attribute flag value
 */
Constants.MATERIAL_AttributesDirtyFlag = 8;
/**
 * The dirty misc flag value
 */
Constants.MATERIAL_MiscDirtyFlag = 16;
/**
 * The dirty prepass flag value
 */
Constants.MATERIAL_PrePassDirtyFlag = 32;
/**
 * The all dirty flag value
 */
Constants.MATERIAL_AllDirtyFlag = 63;
/**
 * Returns the triangle fill mode
 */
Constants.MATERIAL_TriangleFillMode = 0;
/**
 * Returns the wireframe mode
 */
Constants.MATERIAL_WireFrameFillMode = 1;
/**
 * Returns the point fill mode
 */
Constants.MATERIAL_PointFillMode = 2;
/**
 * Returns the point list draw mode
 */
Constants.MATERIAL_PointListDrawMode = 3;
/**
 * Returns the line list draw mode
 */
Constants.MATERIAL_LineListDrawMode = 4;
/**
 * Returns the line loop draw mode
 */
Constants.MATERIAL_LineLoopDrawMode = 5;
/**
 * Returns the line strip draw mode
 */
Constants.MATERIAL_LineStripDrawMode = 6;
/**
 * Returns the triangle strip draw mode
 */
Constants.MATERIAL_TriangleStripDrawMode = 7;
/**
 * Returns the triangle fan draw mode
 */
Constants.MATERIAL_TriangleFanDrawMode = 8;
/**
 * Stores the clock-wise side orientation
 */
Constants.MATERIAL_ClockWiseSideOrientation = 0;
/**
 * Stores the counter clock-wise side orientation
 */
Constants.MATERIAL_CounterClockWiseSideOrientation = 1;
/**
 * Nothing
 * @see https://doc.babylonjs.com/features/featuresDeepDive/events/actions#triggers
 */
Constants.ACTION_NothingTrigger = 0;
/**
 * On pick
 * @see https://doc.babylonjs.com/features/featuresDeepDive/events/actions#triggers
 */
Constants.ACTION_OnPickTrigger = 1;
/**
 * On left pick
 * @see https://doc.babylonjs.com/features/featuresDeepDive/events/actions#triggers
 */
Constants.ACTION_OnLeftPickTrigger = 2;
/**
 * On right pick
 * @see https://doc.babylonjs.com/features/featuresDeepDive/events/actions#triggers
 */
Constants.ACTION_OnRightPickTrigger = 3;
/**
 * On center pick
 * @see https://doc.babylonjs.com/features/featuresDeepDive/events/actions#triggers
 */
Constants.ACTION_OnCenterPickTrigger = 4;
/**
 * On pick down
 * @see https://doc.babylonjs.com/features/featuresDeepDive/events/actions#triggers
 */
Constants.ACTION_OnPickDownTrigger = 5;
/**
 * On double pick
 * @see https://doc.babylonjs.com/features/featuresDeepDive/events/actions#triggers
 */
Constants.ACTION_OnDoublePickTrigger = 6;
/**
 * On pick up
 * @see https://doc.babylonjs.com/features/featuresDeepDive/events/actions#triggers
 */
Constants.ACTION_OnPickUpTrigger = 7;
/**
 * On pick out.
 * This trigger will only be raised if you also declared a OnPickDown
 * @see https://doc.babylonjs.com/features/featuresDeepDive/events/actions#triggers
 */
Constants.ACTION_OnPickOutTrigger = 16;
/**
 * On long press
 * @see https://doc.babylonjs.com/features/featuresDeepDive/events/actions#triggers
 */
Constants.ACTION_OnLongPressTrigger = 8;
/**
 * On pointer over
 * @see https://doc.babylonjs.com/features/featuresDeepDive/events/actions#triggers
 */
Constants.ACTION_OnPointerOverTrigger = 9;
/**
 * On pointer out
 * @see https://doc.babylonjs.com/features/featuresDeepDive/events/actions#triggers
 */
Constants.ACTION_OnPointerOutTrigger = 10;
/**
 * On every frame
 * @see https://doc.babylonjs.com/features/featuresDeepDive/events/actions#triggers
 */
Constants.ACTION_OnEveryFrameTrigger = 11;
/**
 * On intersection enter
 * @see https://doc.babylonjs.com/features/featuresDeepDive/events/actions#triggers
 */
Constants.ACTION_OnIntersectionEnterTrigger = 12;
/**
 * On intersection exit
 * @see https://doc.babylonjs.com/features/featuresDeepDive/events/actions#triggers
 */
Constants.ACTION_OnIntersectionExitTrigger = 13;
/**
 * On key down
 * @see https://doc.babylonjs.com/features/featuresDeepDive/events/actions#triggers
 */
Constants.ACTION_OnKeyDownTrigger = 14;
/**
 * On key up
 * @see https://doc.babylonjs.com/features/featuresDeepDive/events/actions#triggers
 */
Constants.ACTION_OnKeyUpTrigger = 15;
/**
 * Billboard mode will only apply to Y axis
 */
Constants.PARTICLES_BILLBOARDMODE_Y = 2;
/**
 * Billboard mode will apply to all axes
 */
Constants.PARTICLES_BILLBOARDMODE_ALL = 7;
/**
 * Special billboard mode where the particle will be biilboard to the camera but rotated to align with direction
 */
Constants.PARTICLES_BILLBOARDMODE_STRETCHED = 8;
/**
 * Special billboard mode where the particle will be billboard to the camera but only around the axis of the direction of particle emission
 */
Constants.PARTICLES_BILLBOARDMODE_STRETCHED_LOCAL = 9;
/** Default culling strategy : this is an exclusion test and it's the more accurate.
 *  Test order :
 *  Is the bounding sphere outside the frustum ?
 *  If not, are the bounding box vertices outside the frustum ?
 *  It not, then the cullable object is in the frustum.
 */
Constants.MESHES_CULLINGSTRATEGY_STANDARD = 0;
/** Culling strategy : Bounding Sphere Only.
 *  This is an exclusion test. It's faster than the standard strategy because the bounding box is not tested.
 *  It's also less accurate than the standard because some not visible objects can still be selected.
 *  Test : is the bounding sphere outside the frustum ?
 *  If not, then the cullable object is in the frustum.
 */
Constants.MESHES_CULLINGSTRATEGY_BOUNDINGSPHERE_ONLY = 1;
/** Culling strategy : Optimistic Inclusion.
 *  This in an inclusion test first, then the standard exclusion test.
 *  This can be faster when a cullable object is expected to be almost always in the camera frustum.
 *  This could also be a little slower than the standard test when the tested object center is not the frustum but one of its bounding box vertex is still inside.
 *  Anyway, it's as accurate as the standard strategy.
 *  Test :
 *  Is the cullable object bounding sphere center in the frustum ?
 *  If not, apply the default culling strategy.
 */
Constants.MESHES_CULLINGSTRATEGY_OPTIMISTIC_INCLUSION = 2;
/** Culling strategy : Optimistic Inclusion then Bounding Sphere Only.
 *  This in an inclusion test first, then the bounding sphere only exclusion test.
 *  This can be the fastest test when a cullable object is expected to be almost always in the camera frustum.
 *  This could also be a little slower than the BoundingSphereOnly strategy when the tested object center is not in the frustum but its bounding sphere still intersects it.
 *  It's less accurate than the standard strategy and as accurate as the BoundingSphereOnly strategy.
 *  Test :
 *  Is the cullable object bounding sphere center in the frustum ?
 *  If not, apply the Bounding Sphere Only strategy. No Bounding Box is tested here.
 */
Constants.MESHES_CULLINGSTRATEGY_OPTIMISTIC_INCLUSION_THEN_BSPHERE_ONLY = 3;
/**
 * No logging while loading
 */
Constants.SCENELOADER_NO_LOGGING = 0;
/**
 * Minimal logging while loading
 */
Constants.SCENELOADER_MINIMAL_LOGGING = 1;
/**
 * Summary logging while loading
 */
Constants.SCENELOADER_SUMMARY_LOGGING = 2;
/**
 * Detailed logging while loading
 */
Constants.SCENELOADER_DETAILED_LOGGING = 3;
/**
 * Constant used to retrieve the irradiance texture index in the textures array in the prepass
 * using getIndex(Constants.PREPASS_IRRADIANCE_TEXTURE_TYPE)
 */
Constants.PREPASS_IRRADIANCE_TEXTURE_TYPE = 0;
/**
 * Constant used to retrieve the position texture index in the textures array in the prepass
 * using getIndex(Constants.PREPASS_POSITION_TEXTURE_INDEX)
 */
Constants.PREPASS_POSITION_TEXTURE_TYPE = 1;
/**
 * Constant used to retrieve the velocity texture index in the textures array in the prepass
 * using getIndex(Constants.PREPASS_VELOCITY_TEXTURE_INDEX)
 */
Constants.PREPASS_VELOCITY_TEXTURE_TYPE = 2;
/**
 * Constant used to retrieve the reflectivity texture index in the textures array in the prepass
 * using the getIndex(Constants.PREPASS_REFLECTIVITY_TEXTURE_TYPE)
 */
Constants.PREPASS_REFLECTIVITY_TEXTURE_TYPE = 3;
/**
 * Constant used to retrieve the lit color texture index in the textures array in the prepass
 * using the getIndex(Constants.PREPASS_COLOR_TEXTURE_TYPE)
 */
Constants.PREPASS_COLOR_TEXTURE_TYPE = 4;
/**
 * Constant used to retrieve depth index in the textures array in the prepass
 * using the getIndex(Constants.PREPASS_DEPTH_TEXTURE_TYPE)
 */
Constants.PREPASS_DEPTH_TEXTURE_TYPE = 5;
/**
 * Constant used to retrieve normal index in the textures array in the prepass
 * using the getIndex(Constants.PREPASS_NORMAL_TEXTURE_TYPE)
 */
Constants.PREPASS_NORMAL_TEXTURE_TYPE = 6;
/**
 * Constant used to retrieve albedo index in the textures array in the prepass
 * using the getIndex(Constants.PREPASS_ALBEDO_SQRT_TEXTURE_TYPE)
 */
Constants.PREPASS_ALBEDO_SQRT_TEXTURE_TYPE = 7;
/** Flag to create a readable buffer (the buffer can be the source of a copy) */
Constants.BUFFER_CREATIONFLAG_READ = 1;
/** Flag to create a writable buffer (the buffer can be the destination of a copy) */
Constants.BUFFER_CREATIONFLAG_WRITE = 2;
/** Flag to create a readable and writable buffer */
Constants.BUFFER_CREATIONFLAG_READWRITE = 3;
/** Flag to create a buffer suitable to be used as a uniform buffer */
Constants.BUFFER_CREATIONFLAG_UNIFORM = 4;
/** Flag to create a buffer suitable to be used as a vertex buffer */
Constants.BUFFER_CREATIONFLAG_VERTEX = 8;
/** Flag to create a buffer suitable to be used as an index buffer */
Constants.BUFFER_CREATIONFLAG_INDEX = 16;
/** Flag to create a buffer suitable to be used as a storage buffer */
Constants.BUFFER_CREATIONFLAG_STORAGE = 32;
/** Flag to create a buffer suitable to be used for indirect calls, such as `dispatchIndirect` */
Constants.BUFFER_CREATIONFLAG_INDIRECT = 64;
/**
 * Prefixes used by the engine for sub mesh draw wrappers
 */
/** @internal */
Constants.RENDERPASS_MAIN = 0;
/**
 * Constant used as key code for Alt key
 */
Constants.INPUT_ALT_KEY = 18;
/**
 * Constant used as key code for Ctrl key
 */
Constants.INPUT_CTRL_KEY = 17;
/**
 * Constant used as key code for Meta key (Left Win, Left Cmd)
 */
Constants.INPUT_META_KEY1 = 91;
/**
 * Constant used as key code for Meta key (Right Win)
 */
Constants.INPUT_META_KEY2 = 92;
/**
 * Constant used as key code for Meta key (Right Win, Right Cmd)
 */
Constants.INPUT_META_KEY3 = 93;
/**
 * Constant used as key code for Shift key
 */
Constants.INPUT_SHIFT_KEY = 16;
/** Standard snapshot rendering. In this mode, some form of dynamic behavior is possible (for eg, uniform buffers are still updated) */
Constants.SNAPSHOTRENDERING_STANDARD = 0;
/** Fast snapshot rendering. In this mode, everything is static and only some limited form of dynamic behaviour is possible */
Constants.SNAPSHOTRENDERING_FAST = 1;
/**
 * This is the default projection mode used by the cameras.
 * It helps recreating a feeling of perspective and better appreciate depth.
 * This is the best way to simulate real life cameras.
 */
Constants.PERSPECTIVE_CAMERA = 0;
/**
 * This helps creating camera with an orthographic mode.
 * Orthographic is commonly used in engineering as a means to produce object specifications that communicate dimensions unambiguously, each line of 1 unit length (cm, meter..whatever) will appear to have the same length everywhere on the drawing. This allows the drafter to dimension only a subset of lines and let the reader know that other lines of that length on the drawing are also that length in reality. Every parallel line in the drawing is also parallel in the object.
 */
Constants.ORTHOGRAPHIC_CAMERA = 1;
/**
 * This is the default FOV mode for perspective cameras.
 * This setting aligns the upper and lower bounds of the viewport to the upper and lower bounds of the camera frustum.
 */
Constants.FOVMODE_VERTICAL_FIXED = 0;
/**
 * This setting aligns the left and right bounds of the viewport to the left and right bounds of the camera frustum.
 */
Constants.FOVMODE_HORIZONTAL_FIXED = 1;
/**
 * This specifies there is no need for a camera rig.
 * Basically only one eye is rendered corresponding to the camera.
 */
Constants.RIG_MODE_NONE = 0;
/**
 * Simulates a camera Rig with one blue eye and one red eye.
 * This can be use with 3d blue and red glasses.
 */
Constants.RIG_MODE_STEREOSCOPIC_ANAGLYPH = 10;
/**
 * Defines that both eyes of the camera will be rendered side by side with a parallel target.
 */
Constants.RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_PARALLEL = 11;
/**
 * Defines that both eyes of the camera will be rendered side by side with a none parallel target.
 */
Constants.RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_CROSSEYED = 12;
/**
 * Defines that both eyes of the camera will be rendered over under each other.
 */
Constants.RIG_MODE_STEREOSCOPIC_OVERUNDER = 13;
/**
 * Defines that both eyes of the camera will be rendered on successive lines interlaced for passive 3d monitors.
 */
Constants.RIG_MODE_STEREOSCOPIC_INTERLACED = 14;
/**
 * Defines that both eyes of the camera should be renderered in a VR mode (carbox).
 */
Constants.RIG_MODE_VR = 20;
/**
 * Custom rig mode allowing rig cameras to be populated manually with any number of cameras
 */
Constants.RIG_MODE_CUSTOM = 22;
/**
 * Maximum number of uv sets supported
 */
Constants.MAX_SUPPORTED_UV_SETS = 6;
/**
 * GL constants
 */
/** Alpha blend equation: ADD */
Constants.GL_ALPHA_EQUATION_ADD = 0x8006;
/** Alpha equation: MIN */
Constants.GL_ALPHA_EQUATION_MIN = 0x8007;
/** Alpha equation: MAX */
Constants.GL_ALPHA_EQUATION_MAX = 0x8008;
/** Alpha equation: SUBTRACT */
Constants.GL_ALPHA_EQUATION_SUBTRACT = 0x800a;
/** Alpha equation: REVERSE_SUBTRACT */
Constants.GL_ALPHA_EQUATION_REVERSE_SUBTRACT = 0x800b;
/** Alpha blend function: SRC */
Constants.GL_ALPHA_FUNCTION_SRC = 0x0300;
/** Alpha blend function: ONE_MINUS_SRC */
Constants.GL_ALPHA_FUNCTION_ONE_MINUS_SRC_COLOR = 0x0301;
/** Alpha blend function: SRC_ALPHA */
Constants.GL_ALPHA_FUNCTION_SRC_ALPHA = 0x0302;
/** Alpha blend function: ONE_MINUS_SRC_ALPHA */
Constants.GL_ALPHA_FUNCTION_ONE_MINUS_SRC_ALPHA = 0x0303;
/** Alpha blend function: DST_ALPHA */
Constants.GL_ALPHA_FUNCTION_DST_ALPHA = 0x0304;
/** Alpha blend function: ONE_MINUS_DST_ALPHA */
Constants.GL_ALPHA_FUNCTION_ONE_MINUS_DST_ALPHA = 0x0305;
/** Alpha blend function: ONE_MINUS_DST */
Constants.GL_ALPHA_FUNCTION_DST_COLOR = 0x0306;
/** Alpha blend function: ONE_MINUS_DST */
Constants.GL_ALPHA_FUNCTION_ONE_MINUS_DST_COLOR = 0x0307;
/** Alpha blend function: SRC_ALPHA_SATURATED */
Constants.GL_ALPHA_FUNCTION_SRC_ALPHA_SATURATED = 0x0308;
/** Alpha blend function: CONSTANT */
Constants.GL_ALPHA_FUNCTION_CONSTANT_COLOR = 0x8001;
/** Alpha blend function: ONE_MINUS_CONSTANT */
Constants.GL_ALPHA_FUNCTION_ONE_MINUS_CONSTANT_COLOR = 0x8002;
/** Alpha blend function: CONSTANT_ALPHA */
Constants.GL_ALPHA_FUNCTION_CONSTANT_ALPHA = 0x8003;
/** Alpha blend function: ONE_MINUS_CONSTANT_ALPHA */
Constants.GL_ALPHA_FUNCTION_ONE_MINUS_CONSTANT_ALPHA = 0x8004;
/** URL to the snippet server. Points to the public snippet server by default */
Constants.SnippetUrl = "https://snippet.babylonjs.com";
/** The fog is deactivated */
Constants.FOGMODE_NONE = 0;
/** The fog density is following an exponential function */
Constants.FOGMODE_EXP = 1;
/** The fog density is following an exponential function faster than FOGMODE_EXP */
Constants.FOGMODE_EXP2 = 2;
/** The fog density is following a linear function. */
Constants.FOGMODE_LINEAR = 3;
/**
 * The byte type.
 */
Constants.BYTE = 5120;
/**
 * The unsigned byte type.
 */
Constants.UNSIGNED_BYTE = 5121;
/**
 * The short type.
 */
Constants.SHORT = 5122;
/**
 * The unsigned short type.
 */
Constants.UNSIGNED_SHORT = 5123;
/**
 * The integer type.
 */
Constants.INT = 5124;
/**
 * The unsigned integer type.
 */
Constants.UNSIGNED_INT = 5125;
/**
 * The float type.
 */
Constants.FLOAT = 5126;
/**
 * Positions
 */
Constants.PositionKind = "position";
/**
 * Normals
 */
Constants.NormalKind = "normal";
/**
 * Tangents
 */
Constants.TangentKind = "tangent";
/**
 * Texture coordinates
 */
Constants.UVKind = "uv";
/**
 * Texture coordinates 2
 */
Constants.UV2Kind = "uv2";
/**
 * Texture coordinates 3
 */
Constants.UV3Kind = "uv3";
/**
 * Texture coordinates 4
 */
Constants.UV4Kind = "uv4";
/**
 * Texture coordinates 5
 */
Constants.UV5Kind = "uv5";
/**
 * Texture coordinates 6
 */
Constants.UV6Kind = "uv6";
/**
 * Colors
 */
Constants.ColorKind = "color";
/**
 * Instance Colors
 */
Constants.ColorInstanceKind = "instanceColor";
/**
 * Matrix indices (for bones)
 */
Constants.MatricesIndicesKind = "matricesIndices";
/**
 * Matrix weights (for bones)
 */
Constants.MatricesWeightsKind = "matricesWeights";
/**
 * Additional matrix indices (for bones)
 */
Constants.MatricesIndicesExtraKind = "matricesIndicesExtra";
/**
 * Additional matrix weights (for bones)
 */
Constants.MatricesWeightsExtraKind = "matricesWeightsExtra";
//# sourceMappingURL=constants.js.map