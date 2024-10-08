import {
	REACT_CONTEXT_TYPE,
	REACT_FORWARD_REF_TYPE,
	REACT_FRAGMENT_TYPE,
	REACT_PORTAL_TYPE,
	REACT_MEMO_TYPE,
	REACT_PROFILER_TYPE,
	REACT_PROVIDER_TYPE,
	REACT_STRICT_MODE_TYPE,
	REACT_SUSPENSE_TYPE,
	REACT_SUSPENSE_LIST_TYPE,
	REACT_LAZY_TYPE,
	REACT_CACHE_TYPE,
	REACT_TRACING_MARKER_TYPE,
	REACT_SERVER_CONTEXT_TYPE,
} from './ReactSymbols.js';

function getWrappedName(outerType, innerType, wrapperName) {
	var displayName = outerType.displayName;

	if (displayName) {
		return displayName;
	}

	var functionName = innerType.displayName || innerType.name || '';
	return functionName !== '' ? wrapperName + "(" + functionName + ")" : wrapperName;
} // Keep in sync with react-reconciler/getComponentNameFromFiber


function getContextName(type) {
	return type.displayName || 'Context';
} // Note that the reconciler package should generally prefer to use getComponentNameFromFiber() instead.

export default function getComponentNameFromType(type) {
	if (type == null) {
		// Host root, text node or just invalid type.
		return null;
	}

	{
		if (typeof type.tag === 'number') {
			console.error('Received an unexpected object in getComponentNameFromType(). ' + 'This is likely a bug in React. Please file an issue.');
		}
	}

	if (typeof type === 'function') {
		return type.displayName || type.name || null;
	}

	if (typeof type === 'string') {
		return type;
	}

	switch (type) {
		case REACT_FRAGMENT_TYPE:
			return 'Fragment';

		case REACT_PORTAL_TYPE:
			return 'Portal';

		case REACT_PROFILER_TYPE:
			return 'Profiler';

		case REACT_STRICT_MODE_TYPE:
			return 'StrictMode';

		case REACT_SUSPENSE_TYPE:
			return 'Suspense';

		case REACT_SUSPENSE_LIST_TYPE:
			return 'SuspenseList';

	}

	if (typeof type === 'object') {
		switch (type.$$typeof) {
			case REACT_CONTEXT_TYPE:
				var context = type;
				return getContextName(context) + '.Consumer';

			case REACT_PROVIDER_TYPE:
				var provider = type;
				return getContextName(provider._context) + '.Provider';

			case REACT_FORWARD_REF_TYPE:
				return getWrappedName(type, type.render, 'ForwardRef');

			case REACT_MEMO_TYPE:
				var outerName = type.displayName || null;

				if (outerName !== null) {
					return outerName;
				}

				return getComponentNameFromType(type.type) || 'Memo';

			case REACT_LAZY_TYPE:
				{
					var lazyComponent = type;
					var payload = lazyComponent._payload;
					var init = lazyComponent._init;

					try {
						return getComponentNameFromType(init(payload));
					} catch (x) {
						return null;
					}
				}

			// eslint-disable-next-line no-fallthrough
		}
	}

	return null;
}