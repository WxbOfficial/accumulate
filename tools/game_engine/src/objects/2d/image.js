import Object2DDraw from './base/object2d_draw.js';


export default class ImageObject extends Object2DDraw {
	constructor(option = {}) {
		super(option);

		this.isLoad = false;
		this.url = option.url || '';
	}
}