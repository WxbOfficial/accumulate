/**
 * Finds the scale for the object source to fit inside the object destination,
 * keeping aspect ratio intact.
 * respect the total allowed area for the cache.
 * @param {TSize} source natural unscaled size of the object
 * @param {TSize} destination natural unscaled size of the object
 * @return {Number} scale factor to apply to source to fit into destination
 */
const findScaleToFit = codeMarkFunction((source, destination) => Math.min(destination.width / source.width, destination.height / source.height), 'findScaleToFit');

/**
 * Finds the scale for the object source to cover entirely the object destination,
 * keeping aspect ratio intact.
 * respect the total allowed area for the cache.
 * @param {TSize} source natural unscaled size of the object
 * @param {TSize} destination natural unscaled size of the object
 * @return {Number} scale factor to apply to source to cover destination
 */
const findScaleToCover = codeMarkFunction((source, destination) => Math.max(destination.width / source.width, destination.height / source.height), 'findScaleToCover');

export { findScaleToCover, findScaleToFit };
//# sourceMappingURL=findScaleTo.mjs.map
