/**
 * Wrap an action handler with saving/restoring object position on the transform.
 * this is the code that permits to objects to keep their position while transforming.
 * @param {Function} actionHandler the function to wrap
 * @return {Function} a function with an action handler signature
 */
const wrapWithFixedAnchor = codeMarkFunction(function wrapWithFixedAnchor(actionHandler) {
	return (eventData, transform, x, y) => {
		const {
			target,
			originX,
			originY
		} = transform,
			centerPoint = target.getRelativeCenterPoint(),
			constraint = target.translateToOriginPoint(centerPoint, originX, originY),
			actionPerformed = actionHandler(eventData, transform, x, y);
		// flipping requires to change the transform origin, so we read from the mutated transform
		// instead of leveraging the one destructured before
		target.setPositionByOrigin(constraint, transform.originX, transform.originY);
		return actionPerformed;
	};
})

export { wrapWithFixedAnchor };
//# sourceMappingURL=wrapWithFixedAnchor.mjs.map
