import {
	precacheFiberNode,
  updateFiberProps,
  // getClosestInstanceFromNode,
  // getFiberFromScopeInstance,
  // getInstanceFromNode as getInstanceFromNodeDOMTree,
  // isContainerMarkedAsRoot,
} from '../react-dom/client/ReactDOMComponentTree.js';


import {
  createElement,
  // createTextNode,
  setInitialProperties,
  // diffProperties,
  // updateProperties,
  // diffHydratedProperties,
  // diffHydratedText,
  trapClickOnNonInteractiveElement,
  // checkForUnmatchedText,
  // warnForDeletedHydratableElement,
  // warnForDeletedHydratableText,
  // warnForInsertedHydratedElement,
  // warnForInsertedHydratedText,
} from '../react-dom/client/ReactDOMComponent.js';
import {
	getSelectionInformation,
	restoreSelection
} from '../react-dom/client/ReactInputSelection.js';

import { validateDOMNesting, updatedAncestorInfo } from '../react-dom/client/validateDOMNesting.js';
import {
  isEnabled as ReactBrowserEventEmitterIsEnabled,
  setEnabled as ReactBrowserEventEmitterSetEnabled,
	getEventPriority,
} from '../react-dom/events/ReactDOMEventListener.js'
import { getChildNamespace } from '../react-dom/shared/DOMNamespaces.js';
import {
  ELEMENT_NODE,
  // TEXT_NODE,
	COMMENT_NODE,
	DOCUMENT_NODE,
	DOCUMENT_FRAGMENT_NODE,
} from '../react-dom/shared/HTMLNodeType.js';






import {
	DefaultEventPriority,
	getCurrentUpdatePriority,
} from './ReactEventPriorities.old.js';


// const SUPPRESS_HYDRATION_WARNING$1 = 'suppressHydrationWarning';
// const SUSPENSE_START_DATA = '$';
// const SUSPENSE_END_DATA = '/$';
// const SUSPENSE_PENDING_START_DATA = '$?';
// const SUSPENSE_FALLBACK_START_DATA = '$!';
// const STYLE$1 = 'style';
let eventsEnabled = null;
let selectionInformation = null;

export function getRootHostContext(rootContainerInstance) {
	let type;
	let namespace;
	let nodeType = rootContainerInstance.nodeType;

	switch (nodeType) {
		case DOCUMENT_NODE:
		case DOCUMENT_FRAGMENT_NODE:
			{
				type = nodeType === DOCUMENT_NODE ? '#document' : '#fragment';
				const root = rootContainerInstance.documentElement;
				namespace = root ? root.namespaceURI : getChildNamespace(null, '');
				break;
			}

		default:
			const container = nodeType === COMMENT_NODE ? rootContainerInstance.parentNode : rootContainerInstance;
			const ownNamespace = container.namespaceURI || null;
			type = container.tagName;
			namespace = getChildNamespace(ownNamespace, type);
			break;
	}

	const validatedTag = type.toLowerCase();
	const ancestorInfo = updatedAncestorInfo(null, validatedTag);
	return {
		namespace: namespace,
		ancestorInfo: ancestorInfo
	};
}

export function getChildHostContext(parentHostContext, type, rootContainerInstance) {

	const parentHostContextDev = parentHostContext;
	const namespace = getChildNamespace(parentHostContextDev.namespace, type);
	const ancestorInfo = updatedAncestorInfo(parentHostContextDev.ancestorInfo, type);

	return {
		namespace: namespace,
		ancestorInfo: ancestorInfo
	};
}
// function getPublicInstance(instance) {
// 	return instance;
// }
export function prepareForCommit(containerInfo) {
	eventsEnabled = ReactBrowserEventEmitterIsEnabled();
	selectionInformation = getSelectionInformation();
	var activeInstance = null;

	ReactBrowserEventEmitterSetEnabled(false);
	return activeInstance;
}
export function resetAfterCommit(containerInfo) {
	restoreSelection(selectionInformation);
	ReactBrowserEventEmitterSetEnabled(eventsEnabled);
	eventsEnabled = null;
	selectionInformation = null;
}
export function createInstance(type, props, rootContainerInstance, hostContext, internalInstanceHandle) {
	let parentNamespace;

	// TODO: take namespace into account when validating.
	const hostContextDev = hostContext;
	validateDOMNesting(type, null, hostContextDev.ancestorInfo);

	if (typeof props.children === 'string' || typeof props.children === 'number') {
		const string = '' + props.children;
		const ownAncestorInfo = updatedAncestorInfo(hostContextDev.ancestorInfo, type);
		validateDOMNesting(null, string, ownAncestorInfo);
	}

	parentNamespace = hostContextDev.namespace;

	const domElement = createElement(type, props, rootContainerInstance, parentNamespace);
	precacheFiberNode(internalInstanceHandle, domElement);
	updateFiberProps(domElement, props);
	return domElement;
}
// function appendInitialChild(parentInstance, child) {
// 	parentInstance.appendChild(child);
// }
export function finalizeInitialChildren(domElement, type, props, rootContainerInstance, hostContext) {
	setInitialProperties(domElement, type, props, rootContainerInstance);

	switch (type) {
		case 'button':
		case 'input':
		case 'select':
		case 'textarea':
			return !!props.autoFocus;

		case 'img':
			return true;

		default:
			return false;
	}
}
// function prepareUpdate(domElement, type, oldProps, newProps, rootContainerInstance, hostContext) {
// 	{
// 		const hostContextDev = hostContext;

// 		if (typeof newProps.children !== typeof oldProps.children && (typeof newProps.children === 'string' || typeof newProps.children === 'number')) {
// 			const string = '' + newProps.children;
// 			const ownAncestorInfo = updatedAncestorInfo(hostContextDev.ancestorInfo, type);
// 			validateDOMNesting(null, string, ownAncestorInfo);
// 		}
// 	}

// 	return diffProperties(domElement, type, oldProps, newProps);
// }
export function shouldSetTextContent(type, props) {
	return type === 'textarea' || type === 'noscript' || typeof props.children === 'string' || typeof props.children === 'number' || typeof props.dangerouslySetInnerHTML === 'object' && props.dangerouslySetInnerHTML !== null && props.dangerouslySetInnerHTML.__html != null;
}
// function createTextInstance(text, rootContainerInstance, hostContext, internalInstanceHandle) {
// 	{
// 		const hostContextDev = hostContext;
// 		validateDOMNesting(null, text, hostContextDev.ancestorInfo);
// 	}

// 	const textNode = createTextNode(text, rootContainerInstance);
// 	precacheFiberNode(internalInstanceHandle, textNode);
// 	return textNode;
// }

export function getCurrentEventPriority() {
	const currentEvent = window.event;

	if (currentEvent === undefined) {
		return DefaultEventPriority;
	}

	return getEventPriority(currentEvent.type);
}
// // if a component just imports ReactDOM (e.g. for findDOMNode).
// // Some environments might not have setTimeout or clearTimeout.

// const scheduleTimeout = typeof setTimeout === 'function' ? setTimeout : undefined;
// const cancelTimeout = typeof clearTimeout === 'function' ? clearTimeout : undefined;
export const noTimeout = -1;
// const localPromise = typeof Promise === 'function' ? Promise : undefined; // -------------------
// const scheduleMicrotask = typeof queueMicrotask === 'function' ? queueMicrotask : typeof localPromise !== 'undefined' ? function (callback) {
// 	return localPromise.resolve(null).then(callback).catch(handleErrorInNextTick);
// } : scheduleTimeout; // TODO: Determine the best fallback here.

// function handleErrorInNextTick(error) {
// 	setTimeout(function () {
// 		throw error;
// 	});
// } // -------------------
// function commitMount(domElement, type, newProps, internalInstanceHandle) {
// 	// Despite the naming that might imply otherwise, this method only
// 	// fires if there is an `Update` effect scheduled during mounting.
// 	// This happens if `finalizeInitialChildren` returns `true` (which it
// 	// does to implement the `autoFocus` attribute on the client). But
// 	// there are also other cases when this might happen (such as patching
// 	// up text content during hydration mismatch). So we'll check this again.
// 	switch (type) {
// 		case 'button':
// 		case 'input':
// 		case 'select':
// 		case 'textarea':
// 			if (newProps.autoFocus) {
// 				domElement.focus();
// 			}

// 			return;

// 		case 'img':
// 			{
// 				if (newProps.src) {
// 					domElement.src = newProps.src;
// 				}

// 				return;
// 			}
// 	}
// }
// function commitUpdate(domElement, updatePayload, type, oldProps, newProps, internalInstanceHandle) {
// 	// Apply the diff to the DOM node.
// 	updateProperties(domElement, updatePayload, type, oldProps, newProps); // Update the props handle so that we know which props are the ones with
// 	// with current event handlers.

// 	updateFiberProps(domElement, newProps);
// }
// function resetTextContent(domElement) {
// 	setTextContent(domElement, '');
// }
// function commitTextUpdate(textInstance, oldText, newText) {
// 	textInstance.nodeValue = newText;
// }
// function appendChild(parentInstance, child) {
// 	parentInstance.appendChild(child);
// }
export function appendChildToContainer(container, child) {
	var parentNode;

	if (container.nodeType === COMMENT_NODE) {
		parentNode = container.parentNode;
		parentNode.insertBefore(child, container);
	} else {
		parentNode = container;
		parentNode.appendChild(child);
	} // This container might be used for a portal.
	// If something inside a portal is clicked, that click should bubble
	// through the React tree. However, on Mobile Safari the click would
	// never bubble through the *DOM* tree unless an ancestor with onclick
	// event exists. So we wouldn't see it and dispatch it.
	// This is why we ensure that non React root containers have inline onclick
	// defined.
	// https://github.com/facebook/react/issues/11918


	var reactRootContainer = container._reactRootContainer;

	if ((reactRootContainer === null || reactRootContainer === undefined) && parentNode.onclick === null) {
		// TODO: This cast may not be sound for SVG, MathML or custom elements.
		trapClickOnNonInteractiveElement(parentNode);
	}
}
// function insertBefore(parentInstance, child, beforeChild) {
// 	parentInstance.insertBefore(child, beforeChild);
// }
// function insertInContainerBefore(container, child, beforeChild) {
// 	if (container.nodeType === COMMENT_NODE) {
// 		container.parentNode.insertBefore(child, beforeChild);
// 	} else {
// 		container.insertBefore(child, beforeChild);
// 	}
// }

// function removeChild(parentInstance, child) {
// 	parentInstance.removeChild(child);
// }
// function removeChildFromContainer(container, child) {
// 	if (container.nodeType === COMMENT_NODE) {
// 		container.parentNode.removeChild(child);
// 	} else {
// 		container.removeChild(child);
// 	}
// }
// function clearSuspenseBoundary(parentInstance, suspenseInstance) {
// 	var node = suspenseInstance; // Delete all nodes within this suspense boundary.
// 	// There might be nested nodes so we need to keep track of how
// 	// deep we are and only break out when we're back on top.

// 	var depth = 0;

// 	do {
// 		var nextNode = node.nextSibling;
// 		parentInstance.removeChild(node);

// 		if (nextNode && nextNode.nodeType === COMMENT_NODE) {
// 			var data = nextNode.data;

// 			if (data === SUSPENSE_END_DATA) {
// 				if (depth === 0) {
// 					parentInstance.removeChild(nextNode); // Retry if any event replaying was blocked on this.

// 					retryIfBlockedOn(suspenseInstance);
// 					return;
// 				} else {
// 					depth--;
// 				}
// 			} else if (data === SUSPENSE_START_DATA || data === SUSPENSE_PENDING_START_DATA || data === SUSPENSE_FALLBACK_START_DATA) {
// 				depth++;
// 			}
// 		}

// 		node = nextNode;
// 	} while (node); // TODO: Warn, we didn't find the end comment boundary.
// 	// Retry if any event replaying was blocked on this.


// 	retryIfBlockedOn(suspenseInstance);
// }
// function clearSuspenseBoundaryFromContainer(container, suspenseInstance) {
// 	if (container.nodeType === COMMENT_NODE) {
// 		clearSuspenseBoundary(container.parentNode, suspenseInstance);
// 	} else if (container.nodeType === ELEMENT_NODE) {
// 		clearSuspenseBoundary(container, suspenseInstance);
// 	} // Retry if any event replaying was blocked on this.


// 	retryIfBlockedOn(container);
// }
// function hideInstance(instance) {
// 	// TODO: Does this work for all element types? What about MathML? Should we
// 	// pass host context to this method?
// 	instance = instance;
// 	var style = instance.style;

// 	if (typeof style.setProperty === 'function') {
// 		style.setProperty('display', 'none', 'important');
// 	} else {
// 		style.display = 'none';
// 	}
// }
// function hideTextInstance(textInstance) {
// 	textInstance.nodeValue = '';
// }
// function unhideInstance(instance, props) {
// 	instance = instance;
// 	var styleProp = props[STYLE$1];
// 	var display = styleProp !== undefined && styleProp !== null && styleProp.hasOwnProperty('display') ? styleProp.display : null;
// 	instance.style.display = dangerousStyleValue('display', display);
// }
// function unhideTextInstance(textInstance, text) {
// 	textInstance.nodeValue = text;
// }

export function clearContainer(container) {
	if (container.nodeType === ELEMENT_NODE) {
		container.textContent = '';
	} else if (container.nodeType === DOCUMENT_NODE) {
		if (container.documentElement) {
			container.removeChild(container.documentElement);
		}
	}
}

// function canHydrateInstance(instance, type, props) {
// 	if (instance.nodeType !== ELEMENT_NODE || type.toLowerCase() !== instance.nodeName.toLowerCase()) {
// 		return null;
// 	} // This has now been refined to an element node.


// 	return instance;
// }
// function canHydrateTextInstance(instance, text) {
// 	if (text === '' || instance.nodeType !== TEXT_NODE) {
// 		// Empty strings are not parsed by HTML so there won't be a correct match here.
// 		return null;
// 	} // This has now been refined to a text node.


// 	return instance;
// }
// function canHydrateSuspenseInstance(instance) {
// 	if (instance.nodeType !== COMMENT_NODE) {
// 		// Empty strings are not parsed by HTML so there won't be a correct match here.
// 		return null;
// 	} // This has now been refined to a suspense node.


// 	return instance;
// }
// function isSuspenseInstancePending(instance) {
// 	return instance.data === SUSPENSE_PENDING_START_DATA;
// }
// function isSuspenseInstanceFallback(instance) {
// 	return instance.data === SUSPENSE_FALLBACK_START_DATA;
// }
// function getSuspenseInstanceFallbackErrorDetails(instance) {
// 	var dataset = instance.nextSibling && instance.nextSibling.dataset;
// 	var digest, message, stack;

// 	if (dataset) {
// 		digest = dataset.dgst;

// 		{
// 			message = dataset.msg;
// 			stack = dataset.stck;
// 		}
// 	}

// 	{
// 		return {
// 			message: message,
// 			digest: digest,
// 			stack: stack
// 		};
// 	} // let value = {message: undefined, hash: undefined};
// 	// const nextSibling = instance.nextSibling;
// 	// if (nextSibling) {
// 	//   const dataset = ((nextSibling: any): HTMLTemplateElement).dataset;
// 	//   value.message = dataset.msg;
// 	//   value.hash = dataset.hash;
// 	//   if (true) {
// 	//     value.stack = dataset.stack;
// 	//   }
// 	// }
// 	// return value;

// }
// function registerSuspenseInstanceRetry(instance, callback) {
// 	instance._reactRetry = callback;
// }

// function getNextHydratable(node) {
// 	// Skip non-hydratable nodes.
// 	for (; node != null; node = node.nextSibling) {
// 		var nodeType = node.nodeType;

// 		if (nodeType === ELEMENT_NODE || nodeType === TEXT_NODE) {
// 			break;
// 		}

// 		if (nodeType === COMMENT_NODE) {
// 			var nodeData = node.data;

// 			if (nodeData === SUSPENSE_START_DATA || nodeData === SUSPENSE_FALLBACK_START_DATA || nodeData === SUSPENSE_PENDING_START_DATA) {
// 				break;
// 			}

// 			if (nodeData === SUSPENSE_END_DATA) {
// 				return null;
// 			}
// 		}
// 	}

// 	return node;
// }

// function getNextHydratableSibling(instance) {
// 	return getNextHydratable(instance.nextSibling);
// }
// function getFirstHydratableChild(parentInstance) {
// 	return getNextHydratable(parentInstance.firstChild);
// }
// function getFirstHydratableChildWithinContainer(parentContainer) {
// 	return getNextHydratable(parentContainer.firstChild);
// }
// function getFirstHydratableChildWithinSuspenseInstance(parentInstance) {
// 	return getNextHydratable(parentInstance.nextSibling);
// }
// function hydrateInstance(instance, type, props, rootContainerInstance, hostContext, internalInstanceHandle, shouldWarnDev) {
// 	precacheFiberNode(internalInstanceHandle, instance); // TODO: Possibly defer this until the commit phase where all the events
// 	// get attached.

// 	updateFiberProps(instance, props);
// 	var parentNamespace;

// 	{
// 		var hostContextDev = hostContext;
// 		parentNamespace = hostContextDev.namespace;
// 	} // TODO: Temporary hack to check if we're in a concurrent root. We can delete
// 	// when the legacy root API is removed.


// 	var isConcurrentMode = (internalInstanceHandle.mode & ConcurrentMode) !== NoMode;
// 	return diffHydratedProperties(instance, type, props, parentNamespace, rootContainerInstance, isConcurrentMode, shouldWarnDev);
// }
// function hydrateTextInstance(textInstance, text, internalInstanceHandle, shouldWarnDev) {
// 	precacheFiberNode(internalInstanceHandle, textInstance); // TODO: Temporary hack to check if we're in a concurrent root. We can delete
// 	// when the legacy root API is removed.

// 	var isConcurrentMode = (internalInstanceHandle.mode & ConcurrentMode) !== NoMode;
// 	return diffHydratedText(textInstance, text);
// }
// function hydrateSuspenseInstance(suspenseInstance, internalInstanceHandle) {
// 	precacheFiberNode(internalInstanceHandle, suspenseInstance);
// }
// function getNextHydratableInstanceAfterSuspenseInstance(suspenseInstance) {
// 	var node = suspenseInstance.nextSibling; // Skip past all nodes within this suspense boundary.
// 	// There might be nested nodes so we need to keep track of how
// 	// deep we are and only break out when we're back on top.

// 	var depth = 0;

// 	while (node) {
// 		if (node.nodeType === COMMENT_NODE) {
// 			var data = node.data;

// 			if (data === SUSPENSE_END_DATA) {
// 				if (depth === 0) {
// 					return getNextHydratableSibling(node);
// 				} else {
// 					depth--;
// 				}
// 			} else if (data === SUSPENSE_START_DATA || data === SUSPENSE_FALLBACK_START_DATA || data === SUSPENSE_PENDING_START_DATA) {
// 				depth++;
// 			}
// 		}

// 		node = node.nextSibling;
// 	} // TODO: Warn, we didn't find the end comment boundary.


// 	return null;
// } // Returns the SuspenseInstance if this node is a direct child of a
// // SuspenseInstance. I.e. if its previous sibling is a Comment with
// // SUSPENSE_x_START_DATA. Otherwise, null.

// function getParentSuspenseInstance(targetInstance) {
// 	var node = targetInstance.previousSibling; // Skip past all nodes within this suspense boundary.
// 	// There might be nested nodes so we need to keep track of how
// 	// deep we are and only break out when we're back on top.

// 	var depth = 0;

// 	while (node) {
// 		if (node.nodeType === COMMENT_NODE) {
// 			var data = node.data;

// 			if (data === SUSPENSE_START_DATA || data === SUSPENSE_FALLBACK_START_DATA || data === SUSPENSE_PENDING_START_DATA) {
// 				if (depth === 0) {
// 					return node;
// 				} else {
// 					depth--;
// 				}
// 			} else if (data === SUSPENSE_END_DATA) {
// 				depth++;
// 			}
// 		}

// 		node = node.previousSibling;
// 	}

// 	return null;
// }
// function commitHydratedContainer(container) {
// 	// Retry if any event replaying was blocked on this.
// 	retryIfBlockedOn(container);
// }
// function commitHydratedSuspenseInstance(suspenseInstance) {
// 	// Retry if any event replaying was blocked on this.
// 	retryIfBlockedOn(suspenseInstance);
// }
// function shouldDeleteUnhydratedTailInstances(parentType) {
// 	return parentType !== 'head' && parentType !== 'body';
// }
// function didNotMatchHydratedContainerTextInstance(parentContainer, textInstance, text, isConcurrentMode) {
// 	var shouldWarnDev = true;
// 	checkForUnmatchedText(textInstance.nodeValue, text, isConcurrentMode, shouldWarnDev);
// }
// function didNotMatchHydratedTextInstance(parentType, parentProps, parentInstance, textInstance, text, isConcurrentMode) {
// 	if (parentProps[SUPPRESS_HYDRATION_WARNING$1] !== true) {
// 		var shouldWarnDev = true;
// 		checkForUnmatchedText(textInstance.nodeValue, text, isConcurrentMode, shouldWarnDev);
// 	}
// }
// function didNotHydrateInstanceWithinContainer(parentContainer, instance) {
// 	{
// 		if (instance.nodeType === ELEMENT_NODE) {
// 			warnForDeletedHydratableElement(parentContainer, instance);
// 		} else if (instance.nodeType === COMMENT_NODE) ; else {
// 			warnForDeletedHydratableText(parentContainer, instance);
// 		}
// 	}
// }
// function didNotHydrateInstanceWithinSuspenseInstance(parentInstance, instance) {
// 	{
// 		// $FlowFixMe: Only Element or Document can be parent nodes.
// 		var parentNode = parentInstance.parentNode;

// 		if (parentNode !== null) {
// 			if (instance.nodeType === ELEMENT_NODE) {
// 				warnForDeletedHydratableElement(parentNode, instance);
// 			} else if (instance.nodeType === COMMENT_NODE) ; else {
// 				warnForDeletedHydratableText(parentNode, instance);
// 			}
// 		}
// 	}
// }
// function didNotHydrateInstance(parentType, parentProps, parentInstance, instance, isConcurrentMode) {
// 	{
// 		if (isConcurrentMode || parentProps[SUPPRESS_HYDRATION_WARNING$1] !== true) {
// 			if (instance.nodeType === ELEMENT_NODE) {
// 				warnForDeletedHydratableElement(parentInstance, instance);
// 			} else if (instance.nodeType === COMMENT_NODE) ; else {
// 				warnForDeletedHydratableText(parentInstance, instance);
// 			}
// 		}
// 	}
// }
// function didNotFindHydratableInstanceWithinContainer(parentContainer, type, props) {
// 	{
// 		warnForInsertedHydratedElement(parentContainer, type);
// 	}
// }
// function didNotFindHydratableTextInstanceWithinContainer(parentContainer, text) {
// 	{
// 		warnForInsertedHydratedText(parentContainer, text);
// 	}
// }
// function didNotFindHydratableInstanceWithinSuspenseInstance(parentInstance, type, props) {
// 	{
// 		// $FlowFixMe: Only Element or Document can be parent nodes.
// 		var parentNode = parentInstance.parentNode;
// 		if (parentNode !== null) warnForInsertedHydratedElement(parentNode, type);
// 	}
// }
// function didNotFindHydratableTextInstanceWithinSuspenseInstance(parentInstance, text) {
// 	{
// 		// $FlowFixMe: Only Element or Document can be parent nodes.
// 		var parentNode = parentInstance.parentNode;
// 		if (parentNode !== null) warnForInsertedHydratedText(parentNode, text);
// 	}
// }
// function didNotFindHydratableInstance(parentType, parentProps, parentInstance, type, props, isConcurrentMode) {
// 	{
// 		if (isConcurrentMode || parentProps[SUPPRESS_HYDRATION_WARNING$1] !== true) {
// 			warnForInsertedHydratedElement(parentInstance, type);
// 		}
// 	}
// }
// function didNotFindHydratableTextInstance(parentType, parentProps, parentInstance, text, isConcurrentMode) {
// 	{
// 		if (isConcurrentMode || parentProps[SUPPRESS_HYDRATION_WARNING$1] !== true) {
// 			warnForInsertedHydratedText(parentInstance, text);
// 		}
// 	}
// }
// function errorHydratingContainer(parentContainer) {
// 	{
// 		// TODO: This gets logged by onRecoverableError, too, so we should be
// 		// able to remove it.
// 		error('An error occurred during hydration. The server HTML was replaced with client content in <%s>.', parentContainer.nodeName.toLowerCase());
// 	}
// }
// function preparePortalMount(portalInstance) {
// 	listenToAllSupportedEvents(portalInstance);
// }
