import Anchor2d from './anchor2d.js';


export default class AnchorManager{
	constructor({
		engine, scene, camera,
		container, // 目前规定是 canvas 的父级节点且与 canvas 大小保持一致
	}){
		this.engine = engine;
		this.scene = scene;
		this.camera = camera;

		this.container = container;
		this.anchors = [];
		this.anchorsMap = new Map();
	}

	addAnchor2ds(optionArr){
		optionArr.forEach((option)=>{
			this.addAnchor2d(option);
		});
	}

	addAnchor2d(option){

		if( !((typeof HTMLElement === 'function') ? (option.dom instanceof HTMLElement)
						: (typeof option.dom === 'object') && (option.dom.nodeType === 1))
		){
			throw new Error("option.dom isn't a Dom Node");
		}

		if( typeof option.name !== 'string' ){
			throw new Error("option.name isn't string");
		}

		if( this.anchorsMap.has( option.name ) ){
			throw new Error("has a same name anchor2d");
		}
		option.container = this.container;

		const anchor2d = new Anchor2d(option);

		anchor2d.mount();

		this.anchors.push( anchor2d );
		this.anchorsMap.set( option.name, anchor2d )
	}

	update(){
		// console.log('camera:', cameraEntity);

		this.anchors.forEach((anchor)=>{
			anchor.update(this.engine, this.scene, this.camera);
		});
	}

	destroy(){
		this.engine = null;
		this.scene = null;
		this.camera = null;

		this.container = null;

		this.anchors.forEach((anchor)=>{
			anchor.destroy();
		});
		this.anchors = null;
		this.anchorsMap.clear();
		this.anchorsMap = null;
	}
}