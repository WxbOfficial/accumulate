
// ReactDOM.createRoot
function createRoot(container, options) {

	 var root = createContainer(container, ConcurrentRoot, null, isStrictMode, concurrentUpdatesByDefaultOverride, identifierPrefix, onRecoverableError);

		return createFiberRoot(containerInfo, tag, hydrate, initialChildren, hydrationCallbacks, isStrictMode, concurrentUpdatesByDefaultOverride, identifierPrefix, onRecoverableError);
		function createFiberRoot(containerInfo, tag, hydrate, initialChildren, hydrationCallbacks, isStrictMode, concurrentUpdatesByDefaultOverride, // TODO: We have several of these arguments that are conceptually part of the
		// host config, but because they are passed in at runtime, we have to thread
		// them through the root constructor. Perhaps we should put them all into a
		// single type, like a DynamicHostConfig that is defined by the renderer.
		identifierPrefix, onRecoverableError, transitionCallbacks) {

			var root = new FiberRootNode(containerInfo, tag, hydrate, identifierPrefix, onRecoverableError);

			var uninitializedFiber = createHostRootFiber(tag, isStrictMode);
			function createHostRootFiber(tag, isStrictMode, concurrentUpdatesByDefaultOverride) {

				return createFiber(HostRoot, null, null, mode);
				var createFiber = function (tag, pendingProps, key, mode) {

					 return new FiberNode(tag, pendingProps, key, mode);
				}
			}

			root.current = uninitializedFiber;
			uninitializedFiber.stateNode = root;

			uninitializedFiber.memoizedState = _initialState;

			initializeUpdateQueue(uninitializedFiber);
			function initializeUpdateQueue(fiber)

			return root;
		}


	markContainerAsRoot(root.current, container);
	function markContainerAsRoot(hostRoot, node)

	listenToAllSupportedEvents(rootContainerElement);
	function listenToAllSupportedEvents(rootContainerElement)

	return new ReactDOMRoot(root);
	function ReactDOMRoot(internalRoot) {
		this._internalRoot = internalRoot;
	}
}

// root.render
ReactDOMRoot.prototype.render = function (children) {

	var root = this._internalRoot;

	var container = root.containerInfo;

	var hostInstance = findHostInstanceWithNoPortals(root.current);
	function findHostInstanceWithNoPortals(fiber) {

		var hostFiber = findCurrentHostFiberWithNoPortals(fiber);
		function findCurrentHostFiberWithNoPortals(parent) {

			var currentParent = findCurrentFiberUsingSlowPath(parent);

			return currentParent !== null ? findCurrentHostFiberWithNoPortalsImpl(currentParent) : null;

		 return hostFiber.stateNode;
		}
	}

	updateContainer(children, root, null, null);
	function updateContainer(element, container, parentComponent, callback) {

		onScheduleRoot(container, element);
		function onScheduleRoot(root, children) {

			injectedHook.onScheduleFiberRoot(rendererID, root, children);
		}

		var current$1 = container.current;

		var eventTime = requestEventTime();
		function requestEventTime() {

			currentEventTime = now();
			return currentEventTime;
		}

		var lane = requestUpdateLane(current$1);
		function requestUpdateLane(fiber) {

			return SyncLane;

			return pickArbitraryLane(workInProgressRootRenderLanes);

			var isTransition = requestCurrentTransition() !== NoTransition;

			currentEventTransitionLane = claimNextTransitionLane();
			return currentEventTransitionLane;

			var updateLane = getCurrentUpdatePriority();
			return updateLane;

			var eventLane = getCurrentEventPriority();
			function getCurrentEventPriority() {

				return DefaultEventPriority;

				return getEventPriority(currentEvent.type);
			}
			return eventLane;
		}

		markRenderScheduled(lane);
		function markRenderScheduled(lane) {

			injectedProfilingHooks.markRenderScheduled(lane);
		}

		var context = getContextForSubtree(parentComponent);
		function getContextForSubtree(parentComponent) {

			return emptyContextObject;
			// 慢慢完善
		}

		var update = createUpdate(eventTime, lane); // Caution: React DevTools currently depends on this property
		function createUpdate(eventTime, lane) {
		}

		var root = enqueueUpdate(current$1, update, lane);
		function enqueueUpdate(fiber, update, lane) {

			return unsafe_markUpdateLaneFromFiberToRoot(fiber, lane);

			return enqueueConcurrentClassUpdate(fiber, sharedQueue, update, lane);
			function enqueueConcurrentClassUpdate(fiber, queue, update, lane) {

				pushConcurrentUpdateQueue(queue);

				return markUpdateLaneFromFiberToRoot(fiber, lane);
				function markUpdateLaneFromFiberToRoot(sourceFiber, lane) {

				}
			}
		}

		scheduleUpdateOnFiber(root, current$1, lane, eventTime);
		function scheduleUpdateOnFiber(root, fiber, lane, eventTime) {

			checkForNestedUpdates();

			markRootUpdated(root, lane, eventTime);
			function markRootUpdated(root, updateLane, eventTime) {

				var index = laneToIndex(updateLane); // We can always overwrite an existing timestamp because we prefer the most
				function laneToIndex(lane) {

					return pickArbitraryLaneIndex(lane);
					function pickArbitraryLaneIndex(lanes) {

						return 31 - clz32(lanes);
					}
				}
			}

			warnIfUpdatesNotWrappedWithActDEV(fiber);
			function warnIfUpdatesNotWrappedWithActDEV(fiber) {
				// 以后完善
			}

			mergeLanes(workInProgressRootInterleavedUpdatedLanes, lane);

			markRootSuspended$1(root, workInProgressRootRenderLanes);

			ensureRootIsScheduled(root, eventTime);
			function ensureRootIsScheduled(root, currentTime) {

				markStarvedLanesAsExpired(root, currentTime); // Determine the next lanes to work on, and their priority.

				var nextLanes = getNextLanes(root, root === workInProgressRoot ? workInProgressRootRenderLanes : NoLanes);
				function getNextLanes(root, wipLanes) {
				}

				cancelCallback$1(existingCallbackNode);
				function cancelCallback$1(callbackNode) {

					return cancelCallback(callbackNode);
				}

				var newCallbackPriority = getHighestPriorityLane(nextLanes); // Check if there's an existing task. We may be able to reuse it.
				function getHighestPriorityLane(lanes) {
					return lanes & -lanes;
				}

				cancelCallback$1(existingCallbackNode);

				lanesToEventPriority(nextLanes);
				function lanesToEventPriority(lanes) {
					var lane = getHighestPriorityLane(lanes);
				}

				newCallbackNode = scheduleCallback$1(schedulerPriorityLevel, performConcurrentWorkOnRoot.bind(null, root));
				function scheduleCallback$1(priorityLevel, callback) {

					return fakeActCallbackNode;

					return scheduleCallback(priorityLevel, callback);
					function unstable_scheduleCallback(priorityLevel, callback, options) {

					}
				}
				function performConcurrentWorkOnRoot(root, didTimeout) {
				}

				root.callbackPriority = newCallbackPriority;
				root.callbackNode = newCallbackNode;
			}

			resetRenderTimer();
			flushSyncCallbacksOnlyInLegacyMode();
		}

		entangleTransitions(root, current$1, lane);
		function entangleTransitions(root, fiber, lane) {
		}

		return lane;
	}
}


function performConcurrentWorkOnRoot(root, didTimeout) {

	resetNestedUpdateFlag();

	var didFlushPassiveEffects = flushPassiveEffects();

	var lanes = getNextLanes(root, root === workInProgressRoot ? workInProgressRootRenderLanes : NoLanes);

	var shouldTimeSlice = !includesBlockingLane(root, lanes) && !includesExpiredLane(root, lanes) && ( !didTimeout);
	var exitStatus = shouldTimeSlice ? renderRootConcurrent(root, lanes) : renderRootSync(root, lanes);

	var renderWasConcurrent = !includesBlockingLane(root, lanes);
	function renderRootSync(root, lanes) {

		var prevDispatcher = pushDispatcher(); // If the root or lanes have changed, throw out the existing stack
		function pushDispatcher() {

		}

		restorePendingUpdaters(root, workInProgressRootRenderLanes);
	}

	finishConcurrentRender(root, exitStatus, lanes);
	function finishConcurrentRender(root, exitStatus, lanes) {
	}

	ensureRootIsScheduled(root, now());
}