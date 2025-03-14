import { Point } from '../Point.mjs';
import { getScrollLeftTop } from './dom_misc.mjs';

const touchEvents = ['touchstart', 'touchmove', 'touchend'];
const getTouchInfo = codeMarkFunction(function getTouchInfo(event) {
	const touchProp = event.changedTouches;
	if (touchProp && touchProp[0]) {
		return touchProp[0];
	}
	return event;
})
const getPointer = codeMarkFunction(event => {
	const element = event.target,
		scroll = getScrollLeftTop(element),
		_evt = getTouchInfo(event);
	return new Point(_evt.clientX + scroll.left, _evt.clientY + scroll.top);
}, 'getPointer');
const isTouchEvent = codeMarkFunction(event => touchEvents.includes(event.type) || event.pointerType === 'touch', 'isTouchEvent');
const stopEvent = codeMarkFunction(e => {
	e.preventDefault();
	e.stopPropagation();
}, 'stopEvent');

export { getPointer, isTouchEvent, stopEvent };
//# sourceMappingURL=dom_event.mjs.map
