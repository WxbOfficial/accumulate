import ReactCurrentDispatcher from './ReactCurrentDispatcher.js';
import ReactCurrentBatchConfig from './ReactCurrentBatchConfig.js';
import ReactCurrentActQueue from './ReactCurrentActQueue.js';
import ReactCurrentOwner from './ReactCurrentOwner.js';
import ReactDebugCurrentFrame from './ReactDebugCurrentFrame.js';

const ReactSharedInternals = {
	ReactCurrentDispatcher,
	ReactCurrentBatchConfig,
	ReactCurrentOwner,
};

ReactSharedInternals.ReactDebugCurrentFrame = ReactDebugCurrentFrame;
ReactSharedInternals.ReactCurrentActQueue = ReactCurrentActQueue;

export default ReactSharedInternals;