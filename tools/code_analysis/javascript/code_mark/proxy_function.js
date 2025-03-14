import { isFunction } from '../../../../javascript_utils/data_type/is_type.js';
import MarkLogs from './mark_logs.js';

export const AllMarkFunctionMessage = {};
export const AllProxyFunctionMap = new Map();
export const AllOriginalFunctionMap = new Map();

class MarkFunctionMessage {
	constructor(originalFunction, key) {
		this.originalFunction = originalFunction;
		this.key = key;

		this.used = 0;
		this.usedLogs = [];
		this.usedParentMap = {};
	}

	mark(title) {
		this.used++;
		const markNode = MarkLogs.mark(title, this.key, this);
		const { key: parentKey } = markNode.prentNotEmpty;
		this.usedLogs.push(markNode.prentNotEmpty);
		if (this.usedParentMap[parentKey]) {
			this.usedParentMap[parentKey]++;
		} else {
			this.usedParentMap[parentKey] = 1;
		}

		return markNode;
	}
	markEnd() {
		MarkLogs.markEnd();
	}

	createMarkNodeData(args, result) {
		return {
			args, result,
			used: this.used,
			originalFunction: this.originalFunction,
			markFunctionMessage: this,
		}
	}
}

let proxyFunctionIndex = 0;

export default function proxyFunction(originalFunction, key) {
	if (AllOriginalFunctionMap.has(originalFunction)) {
		return AllOriginalFunctionMap.get(originalFunction);
	}

	if (AllProxyFunctionMap.has(originalFunction)) {
		return originalFunction;
	}

	if (AllMarkFunctionMessage[key]) {
		throw new Error(`AllMarkFunctionMessage 已经存在 ${key}`);
	}

	const markFunctionMessage = new MarkFunctionMessage(originalFunction, key);
	const proxy = new Proxy(originalFunction, {
		construct(target, args, newTarget) {
			const markNode = markFunctionMessage.mark(`${key} 初始化`);
			let result = null;
			if (target === newTarget) {
				result = new target(...args);
			} else {
				result = Reflect.construct(target, args, newTarget);
			}
			markFunctionMessage.createMarkNodeData(args, result);
			markNode.mountData(markFunctionMessage.createMarkNodeData(args, result));
			markFunctionMessage.markEnd();
			return result;
		},
		apply(target, thisArg, argumentsList) {
			const markNode = markFunctionMessage.mark(key);
			const result = target.call(thisArg, ...argumentsList);
			markNode.mountData(markFunctionMessage.createMarkNodeData(argumentsList, result));
			markFunctionMessage.markEnd();
			return result;
		},
		set(target, prop, value) {
			if (isFunction(value)) {
				target[prop] = proxyFunction(value, `${key}.${prop}`);;
			} else {
				target[prop] = value;
			}
			return true;
		},
	});
	AllOriginalFunctionMap.set(originalFunction, proxy);
	AllProxyFunctionMap.set(proxy, originalFunction);
	AllMarkFunctionMessage[key] = markFunctionMessage;

	proxyFunctionIndex++;

	return proxy;
}
