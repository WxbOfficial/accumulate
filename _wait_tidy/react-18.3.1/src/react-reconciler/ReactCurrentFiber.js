

import ReactSharedInternals from '../shared/ReactSharedInternals.js';
// import { getStackByFiberInDevAndProd } from './ReactFiberComponentStack';
// import getComponentNameFromFiber from 'react-reconciler/src/getComponentNameFromFiber';

const ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;

export let current = null;
export let isRendering = false;

// export function getCurrentFiberOwnerNameInDevOrNull(): string | null {
//   if (__DEV__) {
//     if (current === null) {
//       return null;
//     }
//     const owner = current._debugOwner;
//     if (owner !== null && typeof owner !== 'undefined') {
//       return getComponentNameFromFiber(owner);
//     }
//   }
//   return null;
// }

function getCurrentFiberStackInDev() {

	if (current === null) {
		return '';
	}
	// Safe because if current fiber exists, we are reconciling,
	// and it is guaranteed to be the work-in-progress version.
	return getStackByFiberInDevAndProd(current);
}

export function resetCurrentFiber() {

	ReactDebugCurrentFrame.getCurrentStack = null;
	current = null;
	isRendering = false;
}

export function setCurrentFiber(fiber) {

	ReactDebugCurrentFrame.getCurrentStack =
		fiber === null ? null : getCurrentFiberStackInDev;
	current = fiber;
	isRendering = false;
}

export function getCurrentFiber() {

  return current;
}

// export function setIsRendering(rendering: boolean) {
//   if (__DEV__) {
//     isRendering = rendering;
//   }
// }

// export function getIsRendering() {
//   if (__DEV__) {
//     return isRendering;
//   }
// }
