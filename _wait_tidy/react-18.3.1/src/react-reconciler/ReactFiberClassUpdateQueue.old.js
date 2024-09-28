
import {
	// NoLane,
	NoLanes,
	isSubsetOfLanes,
	// mergeLanes,
	isTransitionLane,
	// intersectLanes,
	// markRootEntangled,
} from './ReactFiberLane.old.js';
// import {
//   enterDisallowedContextReadInDEV,
//   exitDisallowedContextReadInDEV,
// } from './ReactFiberNewContext.old';
// import {Callback, ShouldCapture, DidCapture} from './ReactFiberFlags';

// import {debugRenderPhaseSideEffectsForStrictMode} from 'shared/ReactFeatureFlags';

// import {StrictLegacyMode} from './ReactTypeOfMode';
import {
  markSkippedUpdateLanes,
  isUnsafeClassRenderPhaseUpdate,
} from './ReactFiberWorkLoop.old.js';
import {
  enqueueConcurrentClassUpdate,
//   unsafe_markUpdateLaneFromFiberToRoot,
} from './ReactFiberConcurrentUpdates.old.js';
// import {setIsStrictModeForDevtools} from './ReactFiberDevToolsHook.old';

import assign from '../shared/assign.js';

// export type Update<State> = {|
//   // TODO: Temporary field. Will remove this by storing a map of
//   // transition -> event time on the root.
//   eventTime: number,
//   lane: Lane,

//   tag: 0 | 1 | 2 | 3,
//   payload: any,
//   callback: (() => mixed) | null,

//   next: Update<State> | null,
// |};

// export type SharedQueue<State> = {|
//   pending: Update<State> | null,
//   interleaved: Update<State> | null,
//   lanes: Lanes,
// |};

// export type UpdateQueue<State> = {|
//   baseState: State,
//   firstBaseUpdate: Update<State> | null,
//   lastBaseUpdate: Update<State> | null,
//   shared: SharedQueue<State>,
//   effects: Array<Update<State>> | null,
// |};

export const UpdateState = 0;
export const ReplaceState = 1;
// export const ForceUpdate = 2;
export const CaptureUpdate = 3;

// // Global state that is reset at the beginning of calling `processUpdateQueue`.
// // It should only be read right after calling `processUpdateQueue`, via
// // `checkHasForceUpdateAfterProcessing`.
let hasForceUpdate = false;

// let didWarnUpdateInsideUpdate;
let currentlyProcessingQueue;
// export let resetCurrentlyProcessingQueue;

// didWarnUpdateInsideUpdate = false;
currentlyProcessingQueue = null;
// resetCurrentlyProcessingQueue = () => {
//   currentlyProcessingQueue = null;
// };

export function initializeUpdateQueue(fiber) {
	const queue = {
		baseState: fiber.memoizedState,
		firstBaseUpdate: null,
		lastBaseUpdate: null,
		shared: {
			pending: null,
			interleaved: null,
			lanes: NoLanes,
		},
		effects: null,
	};
	fiber.updateQueue = queue;
}

export function cloneUpdateQueue(
  current,
  workInProgress,
) {
  // Clone the update queue from current. Unless it's already a clone.
  const queue = workInProgress.updateQueue;
  const currentQueue = current.updateQueue;
  if (queue === currentQueue) {
    const clone = {
      baseState: currentQueue.baseState,
      firstBaseUpdate: currentQueue.firstBaseUpdate,
      lastBaseUpdate: currentQueue.lastBaseUpdate,
      shared: currentQueue.shared,
      effects: currentQueue.effects,
    };
    workInProgress.updateQueue = clone;
  }
}

export function createUpdate(eventTime, lane) {
	const update = {
		eventTime,
		lane,

		tag: UpdateState,
		payload: null,
		callback: null,

		next: null,
	};
	return update;
}

export function enqueueUpdate(
	fiber,
	update,
	lane,
) {
	const updateQueue = fiber.updateQueue;
	if (updateQueue === null) {
		// Only occurs if the fiber has been unmounted.
		return null;
	}

	const sharedQueue = updateQueue.shared;

	if (
		currentlyProcessingQueue === sharedQueue &&
		!didWarnUpdateInsideUpdate
	) {
		console.error(
			'An update (setState, replaceState, or forceUpdate) was scheduled ' +
				'from inside an update function. Update functions should be pure, ' +
				'with zero side-effects. Consider using componentDidUpdate or a ' +
				'callback.',
		);
		didWarnUpdateInsideUpdate = true;
	}

	if (isUnsafeClassRenderPhaseUpdate(fiber)) {
		// This is an unsafe render phase update. Add directly to the update
		// queue so we can process it immediately during the current render.
		const pending = sharedQueue.pending;
		if (pending === null) {
			// This is the first update. Create a circular list.
			update.next = update;
		} else {
			update.next = pending.next;
			pending.next = update;
		}
		sharedQueue.pending = update;

		// Update the childLanes even though we're most likely already rendering
		// this fiber. This is for backwards compatibility in the case where you
		// update a different component during render phase than the one that is
		// currently renderings (a pattern that is accompanied by a warning).
		return unsafe_markUpdateLaneFromFiberToRoot(fiber, lane);
	} else {
		return enqueueConcurrentClassUpdate(fiber, sharedQueue, update, lane);
	}
}

export function entangleTransitions(root, fiber, lane) {
  const updateQueue = fiber.updateQueue;
  if (updateQueue === null) {
    // Only occurs if the fiber has been unmounted.
    return;
  }

  const sharedQueue = updateQueue.shared;
  if (isTransitionLane(lane)) {
    let queueLanes = sharedQueue.lanes;

    // If any entangled lanes are no longer pending on the root, then they must
    // have finished. We can remove them from the shared queue, which represents
    // a superset of the actually pending lanes. In some cases we may entangle
    // more than we need to, but that's OK. In fact it's worse if we *don't*
    // entangle when we should.
    queueLanes = intersectLanes(queueLanes, root.pendingLanes);

    // Entangle the new transition lane with the other transition lanes.
    const newQueueLanes = mergeLanes(queueLanes, lane);
    sharedQueue.lanes = newQueueLanes;
    // Even if queue.lanes already include lane, we don't know for certain if
    // the lane finished since the last time we entangled it. So we need to
    // entangle it again, just to be sure.
    markRootEntangled(root, newQueueLanes);
  }
}

// export function enqueueCapturedUpdate<State>(
//   workInProgress: Fiber,
//   capturedUpdate: Update<State>,
// ) {
//   // Captured updates are updates that are thrown by a child during the render
//   // phase. They should be discarded if the render is aborted. Therefore,
//   // we should only put them on the work-in-progress queue, not the current one.
//   let queue: UpdateQueue<State> = (workInProgress.updateQueue: any);

//   // Check if the work-in-progress queue is a clone.
//   const current = workInProgress.alternate;
//   if (current !== null) {
//     const currentQueue: UpdateQueue<State> = (current.updateQueue: any);
//     if (queue === currentQueue) {
//       // The work-in-progress queue is the same as current. This happens when
//       // we bail out on a parent fiber that then captures an error thrown by
//       // a child. Since we want to append the update only to the work-in
//       // -progress queue, we need to clone the updates. We usually clone during
//       // processUpdateQueue, but that didn't happen in this case because we
//       // skipped over the parent when we bailed out.
//       let newFirst = null;
//       let newLast = null;
//       const firstBaseUpdate = queue.firstBaseUpdate;
//       if (firstBaseUpdate !== null) {
//         // Loop through the updates and clone them.
//         let update = firstBaseUpdate;
//         do {
//           const clone: Update<State> = {
//             eventTime: update.eventTime,
//             lane: update.lane,

//             tag: update.tag,
//             payload: update.payload,
//             callback: update.callback,

//             next: null,
//           };
//           if (newLast === null) {
//             newFirst = newLast = clone;
//           } else {
//             newLast.next = clone;
//             newLast = clone;
//           }
//           update = update.next;
//         } while (update !== null);

//         // Append the captured update the end of the cloned list.
//         if (newLast === null) {
//           newFirst = newLast = capturedUpdate;
//         } else {
//           newLast.next = capturedUpdate;
//           newLast = capturedUpdate;
//         }
//       } else {
//         // There are no base updates.
//         newFirst = newLast = capturedUpdate;
//       }
//       queue = {
//         baseState: currentQueue.baseState,
//         firstBaseUpdate: newFirst,
//         lastBaseUpdate: newLast,
//         shared: currentQueue.shared,
//         effects: currentQueue.effects,
//       };
//       workInProgress.updateQueue = queue;
//       return;
//     }
//   }

//   // Append the update to the end of the list.
//   const lastBaseUpdate = queue.lastBaseUpdate;
//   if (lastBaseUpdate === null) {
//     queue.firstBaseUpdate = capturedUpdate;
//   } else {
//     lastBaseUpdate.next = capturedUpdate;
//   }
//   queue.lastBaseUpdate = capturedUpdate;
// }

function getStateFromUpdate(
  workInProgress,
  queue,
  update,
  prevState,
  nextProps,
  instance,
) {
  switch (update.tag) {
    case ReplaceState: {

      const payload = update.payload;

      if (typeof payload === 'function') {
        // Updater function

        enterDisallowedContextReadInDEV();

        const nextState = payload.call(instance, prevState, nextProps);

        if (
          workInProgress.mode & StrictLegacyMode
        ) {
          setIsStrictModeForDevtools(true);
          try {
            payload.call(instance, prevState, nextProps);
          } finally {
            setIsStrictModeForDevtools(false);
          }
        }
        exitDisallowedContextReadInDEV();

        return nextState;
      }
      // State object
      return payload;
    }
    case CaptureUpdate: {
      workInProgress.flags =
        (workInProgress.flags & ~ShouldCapture) | DidCapture;
    }
    // Intentional fallthrough
    case UpdateState: {
      const payload = update.payload;
      let partialState;
      if (typeof payload === 'function') {
        // Updater function

        enterDisallowedContextReadInDEV();

        partialState = payload.call(instance, prevState, nextProps);

        if (
          debugRenderPhaseSideEffectsForStrictMode &&
          workInProgress.mode & StrictLegacyMode
        ) {
          setIsStrictModeForDevtools(true);
          try {
            payload.call(instance, prevState, nextProps);
          } finally {
            setIsStrictModeForDevtools(false);
          }
        }
        exitDisallowedContextReadInDEV();

      } else {
        // Partial state object
        partialState = payload;
      }
      if (partialState === null || partialState === undefined) {
        // Null and undefined are treated as no-ops.
        return prevState;
      }
      // Merge the partial state and the previous state.
      return assign({}, prevState, partialState);
    }
    case ForceUpdate: {
      hasForceUpdate = true;
      return prevState;
    }
  }
  return prevState;
}

export function processUpdateQueue(
  workInProgress,
  props,
  instance,
  renderLanes,
) {
  // This is always non-null on a ClassComponent or HostRoot
  const queue = workInProgress.updateQueue;

  hasForceUpdate = false;

  currentlyProcessingQueue = queue.shared;

  let firstBaseUpdate = queue.firstBaseUpdate;
  let lastBaseUpdate = queue.lastBaseUpdate;

  // Check if there are pending updates. If so, transfer them to the base queue.
  let pendingQueue = queue.shared.pending;
  if (pendingQueue !== null) {
    queue.shared.pending = null;

    // The pending queue is circular. Disconnect the pointer between first
    // and last so that it's non-circular.
    const lastPendingUpdate = pendingQueue;
    const firstPendingUpdate = lastPendingUpdate.next;
    lastPendingUpdate.next = null;
    // Append pending updates to base queue
    if (lastBaseUpdate === null) {
      firstBaseUpdate = firstPendingUpdate;
    } else {
      lastBaseUpdate.next = firstPendingUpdate;
    }
    lastBaseUpdate = lastPendingUpdate;

    // If there's a current queue, and it's different from the base queue, then
    // we need to transfer the updates to that queue, too. Because the base
    // queue is a singly-linked list with no cycles, we can append to both
    // lists and take advantage of structural sharing.
    // TODO: Pass `current` as argument
    const current = workInProgress.alternate;
    if (current !== null) {
      // This is always non-null on a ClassComponent or HostRoot
      const currentQueue = current.updateQueue;
      const currentLastBaseUpdate = currentQueue.lastBaseUpdate;
      if (currentLastBaseUpdate !== lastBaseUpdate) {
        if (currentLastBaseUpdate === null) {
          currentQueue.firstBaseUpdate = firstPendingUpdate;
        } else {
          currentLastBaseUpdate.next = firstPendingUpdate;
        }
        currentQueue.lastBaseUpdate = lastPendingUpdate;
      }
    }
  }

  // These values may change as we process the queue.
  if (firstBaseUpdate !== null) {
    // Iterate through the list of updates to compute the result.
    let newState = queue.baseState;
    // TODO: Don't need to accumulate this. Instead, we can remove renderLanes
    // from the original lanes.
    let newLanes = NoLanes;

    let newBaseState = null;
    let newFirstBaseUpdate = null;
    let newLastBaseUpdate = null;

    let update = firstBaseUpdate;
    do {
      const updateLane = update.lane;
      const updateEventTime = update.eventTime;
      if (!isSubsetOfLanes(renderLanes, updateLane)) {
        // Priority is insufficient. Skip this update. If this is the first
        // skipped update, the previous update/state is the new base
        // update/state.
        const clone = {
          eventTime: updateEventTime,
          lane: updateLane,

          tag: update.tag,
          payload: update.payload,
          callback: update.callback,

          next: null,
        };
        if (newLastBaseUpdate === null) {
          newFirstBaseUpdate = newLastBaseUpdate = clone;
          newBaseState = newState;
        } else {
          newLastBaseUpdate = newLastBaseUpdate.next = clone;
        }
        // Update the remaining priority in the queue.
        newLanes = mergeLanes(newLanes, updateLane);
      } else {
        // This update does have sufficient priority.

        if (newLastBaseUpdate !== null) {
          const clone = {
            eventTime: updateEventTime,
            // This update is going to be committed so we never want uncommit
            // it. Using NoLane works because 0 is a subset of all bitmasks, so
            // this will never be skipped by the check above.
            lane: NoLane,

            tag: update.tag,
            payload: update.payload,
            callback: update.callback,

            next: null,
          };
          newLastBaseUpdate = newLastBaseUpdate.next = clone;
        }

        // Process this update.
        newState = getStateFromUpdate(
          workInProgress,
          queue,
          update,
          newState,
          props,
          instance,
        );
        const callback = update.callback;
        if (
          callback !== null &&
          // If the update was already committed, we should not queue its
          // callback again.
          update.lane !== NoLane
        ) {
          workInProgress.flags |= Callback;
          const effects = queue.effects;
          if (effects === null) {
            queue.effects = [update];
          } else {
            effects.push(update);
          }
        }
      }
      update = update.next;
      if (update === null) {
        pendingQueue = queue.shared.pending;
        if (pendingQueue === null) {
          break;
        } else {
          // An update was scheduled from inside a reducer. Add the new
          // pending updates to the end of the list and keep processing.
          const lastPendingUpdate = pendingQueue;
          // Intentionally unsound. Pending updates form a circular list, but we
          // unravel them when transferring them to the base queue.
          const firstPendingUpdate = lastPendingUpdate.next;
          lastPendingUpdate.next = null;
          update = firstPendingUpdate;
          queue.lastBaseUpdate = lastPendingUpdate;
          queue.shared.pending = null;
        }
      }
    } while (true);

    if (newLastBaseUpdate === null) {
      newBaseState = newState;
    }

    queue.baseState = newBaseState;
    queue.firstBaseUpdate = newFirstBaseUpdate;
    queue.lastBaseUpdate = newLastBaseUpdate;

    // Interleaved updates are stored on a separate queue. We aren't going to
    // process them during this render, but we do need to track which lanes
    // are remaining.
    const lastInterleaved = queue.shared.interleaved;
    if (lastInterleaved !== null) {
      let interleaved = lastInterleaved;
      do {
        newLanes = mergeLanes(newLanes, interleaved.lane);
        interleaved = interleaved.next;
      } while (interleaved !== lastInterleaved);
    } else if (firstBaseUpdate === null) {
      // `queue.lanes` is used for entangling transitions. We can set it back to
      // zero once the queue is empty.
      queue.shared.lanes = NoLanes;
    }

    // Set the remaining expiration time to be whatever is remaining in the queue.
    // This should be fine because the only two other things that contribute to
    // expiration time are props and context. We're already in the middle of the
    // begin phase by the time we start processing the queue, so we've already
    // dealt with the props. Context in components that specify
    // shouldComponentUpdate is tricky; but we'll have to account for
    // that regardless.
    markSkippedUpdateLanes(newLanes);
    workInProgress.lanes = newLanes;
    workInProgress.memoizedState = newState;
  }

  currentlyProcessingQueue = null;
}

// function callCallback(callback, context) {
//   if (typeof callback !== 'function') {
//     throw new Error(
//       'Invalid argument passed as callback. Expected a function. Instead ' +
//         `received: ${callback}`,
//     );
//   }

//   callback.call(context);
// }

// export function resetHasForceUpdateBeforeProcessing() {
//   hasForceUpdate = false;
// }

// export function checkHasForceUpdateAfterProcessing(): boolean {
//   return hasForceUpdate;
// }

// export function commitUpdateQueue<State>(
//   finishedWork: Fiber,
//   finishedQueue: UpdateQueue<State>,
//   instance: any,
// ): void {
//   // Commit the effects
//   const effects = finishedQueue.effects;
//   finishedQueue.effects = null;
//   if (effects !== null) {
//     for (let i = 0; i < effects.length; i++) {
//       const effect = effects[i];
//       const callback = effect.callback;
//       if (callback !== null) {
//         effect.callback = null;
//         callCallback(callback, instance);
//       }
//     }
//   }
// }
