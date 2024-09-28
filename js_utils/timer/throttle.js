import getNow from './now.js';
/**
 * underscore 节流函数，返回函数连续调用时，func 执行频率限定为 次 / wait
 *
 * @param  {function}   func      回调函数
 * @param  {number}     wait      表示时间窗口的间隔
 *
 * @return {function}             返回客户调用函数   
 */
 export default function throttle(func, wait) {
	let context, args, result,
			now,
			previous = null;

	function run(){
		result = func.apply(context, args);
		context = args = null;
		previous = now;
	}

	function throttle() {
		// 获得当前时间戳
		now = getNow();

		context = this;
		args = arguments;
		if ( previous === null ) {//previous 还未初始化
			run();
		}else{
			if( now - previous > wait ){
				run();
			}
		}
		return result;
	};
	return throttle;
};