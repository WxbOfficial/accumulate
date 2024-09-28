// /**
//  * Copyright (c) Facebook, Inc. and its affiliates.
//  *
//  * This source code is licensed under the MIT license found in the
//  * LICENSE file in the root directory of this source tree.
//  *
//  * @flow
//  */

// import type {ReactNodeList} from 'shared/ReactTypes';
// import type {
//   FiberRoot,
//   SuspenseHydrationCallbacks,
//   TransitionTracingCallbacks,
// } from './ReactInternalTypes';
// import type {RootTag} from './ReactRootTags';
// import type {Cache} from './ReactFiberCacheComponent.old';
// import type {
//   PendingSuspenseBoundaries,
//   Transition,
// } from './ReactFiberTracingMarkerComponent.old';

import { noTimeout } from './ReactFiberHostConfig.js';
import { createHostRootFiber } from './ReactFiber.old.js';
import {
  NoLane,
  NoLanes,
  NoTimestamp,
  TotalLanes,
  createLaneMap,
} from './ReactFiberLane.old.js';
// import {
//   enableSuspenseCallback,
//   enableCache,
//   enableProfilerCommitHooks,
//   enableProfilerTimer,
//   enableUpdaterTracking,
//   enableTransitionTracing,
// } from 'shared/ReactFeatureFlags';
import { initializeUpdateQueue } from './ReactFiberClassUpdateQueue.old.js';
import { LegacyRoot, ConcurrentRoot } from './ReactRootTags.js';
// import {createCache, retainCache} from './ReactFiberCacheComponent.old';

// export type RootState = {
//   element: any,
//   isDehydrated: boolean,
//   cache: Cache,
//   pendingSuspenseBoundaries: PendingSuspenseBoundaries | null,
//   transitions: Set<Transition> | null,
// };

function FiberRootNode(
	containerInfo,
	tag,
	hydrate,
	identifierPrefix,
	onRecoverableError,
) {
	this.tag = tag;
	this.containerInfo = containerInfo;
	this.pendingChildren = null;
	this.current = null;
	this.pingCache = null;
	this.finishedWork = null;
	this.timeoutHandle = noTimeout;
	this.context = null;
	this.pendingContext = null;
	this.callbackNode = null;
	this.callbackPriority = NoLane;
	this.eventTimes = createLaneMap(NoLanes);
	this.expirationTimes = createLaneMap(NoTimestamp);

	this.pendingLanes = NoLanes;
	this.suspendedLanes = NoLanes;
	this.pingedLanes = NoLanes;
	this.expiredLanes = NoLanes;
	this.mutableReadLanes = NoLanes;
	this.finishedLanes = NoLanes;

	this.entangledLanes = NoLanes;
	this.entanglements = createLaneMap(NoLanes);

	this.identifierPrefix = identifierPrefix;
	this.onRecoverableError = onRecoverableError;

	this.mutableSourceEagerHydrationData = null;

	this.effectDuration = 0;
	this.passiveEffectDuration = 0;

	this.memoizedUpdaters = new Set();
	const pendingUpdatersLaneMap = (this.pendingUpdatersLaneMap = []);
	for (let i = 0; i < TotalLanes; i++) {
		pendingUpdatersLaneMap.push(new Set());
	}

	switch (tag) {
		case ConcurrentRoot:
			this._debugRootType = hydrate ? 'hydrateRoot()' : 'createRoot()';
			break;
		case LegacyRoot:
			this._debugRootType = hydrate ? 'hydrate()' : 'render()';
			break;
	}
}

export function createFiberRoot(
	containerInfo,
	tag,
	hydrate,
	initialChildren,
	hydrationCallbacks,
	isStrictMode,
	concurrentUpdatesByDefaultOverride,
	// TODO: We have several of these arguments that are conceptually part of the
	// host config, but because they are passed in at runtime, we have to thread
	// them through the root constructor. Perhaps we should put them all into a
	// single type, like a DynamicHostConfig that is defined by the renderer.
	identifierPrefix,
	onRecoverableError,
	transitionCallbacks,
) {
	const root = new FiberRootNode(
		containerInfo,
		tag,
		hydrate,
		identifierPrefix,
		onRecoverableError,
	);

	// Cyclic construction. This cheats the type system right now because
	// stateNode is any.
	const uninitializedFiber = createHostRootFiber(
		tag,
		isStrictMode,
		concurrentUpdatesByDefaultOverride,
	);
	root.current = uninitializedFiber;
	uninitializedFiber.stateNode = root;

	const initialState = {
		element: initialChildren,
		isDehydrated: hydrate,
		cache: null, // not enabled yet
		transitions: null,
		pendingSuspenseBoundaries: null,
	};
	uninitializedFiber.memoizedState = initialState;

	initializeUpdateQueue(uninitializedFiber);

	return root;
}
