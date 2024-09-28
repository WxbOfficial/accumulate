import Anchor2d from './anchor2d.js';

export default class AnchorManager{

	constructor({
		container
	}){

		this.container = container;
		this.anchors = [];


	}

	addAnchor2d(option){

		this.container.appendChild(option.dom);
		
		const anchor = new Anchor2d(option)
		this.anchors.push( anchor );

		return anchor;
	}

	update(cameraEntity){
		// console.log('camera:', cameraEntity);

		this.anchors.forEach((anchor)=>{
			anchor.update(this.container, cameraEntity);
		});

	}

	destroy(){

		this.anchors.forEach((anchor)=>{
			this.container.removeChild(anchor.dom);
			anchor.destroy();
		});
		this.anchors = null;
	}

}