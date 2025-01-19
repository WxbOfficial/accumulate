import { selectorMatches } from './selectorMatches.mjs';

const doesSomeParentMatch = codeMarkFunction(function doesSomeParentMatch(element, selectors) {
	let selector,
		parentMatching = true;
	while (element.parentElement && element.parentElement.nodeType === 1 && selectors.length) {
		if (parentMatching) {
			selector = selectors.pop();
		}
		element = element.parentElement;
		parentMatching = selectorMatches(element, selector);
	}
	return selectors.length === 0;
})

export { doesSomeParentMatch };
//# sourceMappingURL=doesSomeParentMatch.mjs.map
