import ImageTask from './task/image_task.js';


export class LoaderManager {
	constructor() {
		this.onLoaded = this.onLoaded.bind(this);
		this.onError = this.onError.bind(this);

		this.queue = [];

		this.nextLoadingIndex = 0;
		this.nowLoadingCount = 0;
		this.maxLoadingCount = 5;

		this.totalTask = 0;
		this.totalLoaded = 0;
		this.totalError = 0;

		this.failedReloadTime = 3;

		this.imageCache = {};
	}

	onLoaded(task) {
		this.totalLoaded++;
		this.nowLoadingCount--;

		this.loadingNextTask();
	}
	onError(task) {
		if (task.errorTime < this.failedReloadTime) {
			task.loading();
		} else {
			this.totalError++;
			this.nowLoadingCount--;
			this.loadingNextTask();
		}
	}

	addTask(task) {
		this.queue.push(task);
		this.totalTask++;

		this.loadingNextTask();

		return task;
	}
	loadingNextTask() {
		if (
			this.nowLoadingCount < this.maxLoadingCount &&
			this.nextLoadingIndex < this.queue.length
		) {
			this.queue[this.nextLoadingIndex++].loading();
			this.nowLoadingCount++;
		}
	}

	addImage(src, crossOrigin, onLoaded, onError) {
		if (this.imageCache.hasOwnProperty(src)) {
			return this.imageCache[src];
		} else {
			const task = new ImageTask(onLoaded, onError, this.totalTask, src, crossOrigin);
			this.imageCache[src] = task;
			this.addTask(task);
			return task;
		}
	}

	destroy() {
		this.onLoaded =
			this.onError =

			this.queue =

			this.nextLoadingIndex =
			this.nowLoadingCount =
			this.maxLoadingCount =

			this.totalToLoad =
			this.totalComplete =
			this.totalError =

			this.failedReloadTime =

			this.imageCache = null;
	}
}

const loaderManager = new LoaderManager();
export default loaderManager;