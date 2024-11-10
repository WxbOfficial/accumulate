import Application from './src/engine/application.js';
import LoadingState from './src/code/loadingState.js';

$(document).ready(function () {
	new Application().Initialize(
		new LoadingState(), 320, 240
	)
});
