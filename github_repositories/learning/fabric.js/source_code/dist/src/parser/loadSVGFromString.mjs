import { getFabricWindow } from '../env/index.mjs';
import { parseSVGDocument } from './parseSVGDocument.mjs';

/**
 * Takes string corresponding to an SVG document, and parses it into a set of fabric objects
 * @memberOf fabric
 * @param {String} string representing the svg
 * @param {TSvgParsedCallback} callback Invoked when the parsing is done, with null if parsing wasn't possible with the list of svg nodes.
 * {@link TSvgParsedCallback} also receives `allElements` array as the last argument. This is the full list of svg nodes available in the document.
 * You may want to use it if you are trying to regroup the objects as they were originally grouped in the SVG. ( This was the reason why it was added )
 * @param {TSvgReviverCallback} [reviver] Extra callback for further parsing of SVG elements, called after each fabric object has been created.
 * Takes as input the original svg element and the generated `FabricObject` as arguments. Used to inspect extra properties not parsed by fabric,
 * or extra custom manipulation
 * @param {Object} [options] Object containing options for parsing
 * @param {String} [options.crossOrigin] crossOrigin setting to use for external resources
 * @param {AbortSignal} [options.signal] handle aborting, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
 */
const loadSVGFromString = codeMarkFunction(function loadSVGFromString(string, reviver, options) {
	const parser = new (getFabricWindow().DOMParser)(),
		// should we use `image/svg+xml` here?
		doc = parser.parseFromString(string.trim(), 'text/xml');
	return parseSVGDocument(doc, reviver, options);
})

export { loadSVGFromString };
//# sourceMappingURL=loadSVGFromString.mjs.map
