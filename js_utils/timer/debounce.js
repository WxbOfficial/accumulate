import getNow from './now.js';
/**
 * underscore 防抖函数，返回函数连续调用时，空闲时间必须大于或等于 wait，func 才会执行
 *
 * @param  {function} func        回调函数
 * @param  {number}   wait        表示时间窗口的间隔
 * @return {function}             返回客户调用函数
 */
export default function debounce(func, wait) {
	let timeout, args, context, timestamp, result;
 
 	function run() {
		// 现在和上一次时间戳比较
		let gap = getNow() - timestamp;
		// 如果当前间隔时间少于设定时间且大于0就重新设置定时器
		if (gap < wait && gap >= 0) {
			timeout = setTimeout(run, wait - gap);
		} else {
			// 否则的话就是时间到了执行回调函数
			result = func.apply(context, args);
			timeout = context = args = null;
		}
	};
 
	function debounce() {
		context = this;
		args = arguments;
		// 设置最近一次函数触发的时间戳
		timestamp = getNow();
		// 如果定时器不存在就创建一个
		if (!timeout) {
			timeout = setTimeout(run, wait);
		}
		return result;
	};

	return debounce;
};