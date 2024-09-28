
export default class Anchor2d{

	constructor({
		container,

		name,
		dom,
		pos,

		offsetX = 0,
		offsetY = 0,

		testShow = ()=>{ return true },
		showStyle = (dom)=>{ dom.style.display = null },
		hideStyle = (dom)=>{ dom.style.display = 'none'; },
	}){
		this.container = container;

		this.name = name;

		this.dom = dom;
		this.dom.style.position = 'absolute';

		this.posWorld = pos;

    // 锚点内容x的偏移距
    this.offsetX = offsetX || 0;
    // 锚点内容的y偏移距
    this.offsetY = offsetY || 0;

		this.testShow = testShow;
		this.showStyle = showStyle;
		this.hideStyle = hideStyle;

		this.hideStyle(this.dom);

    this.enable = true;
	}

	mount(){
		this.container.appendChild(this.dom);
	}

	unmount(){
		this.container.removeChild(this.dom);
	}

	update(engine, scene, camera){
		if( !this.enable ){
			return;
		}

		const posScreen = BABYLON.Vector3.Project(this.posWorld,
        BABYLON.Matrix.Identity(),
        scene.getTransformMatrix(),
        camera.viewport.toGlobal(engine.getRenderWidth(), engine.getRenderHeight()));

		this.dom.style.transform = `translate(${posScreen.x}px, ${posScreen.y}px) translate(${this.offsetX}, ${this.offsetY})`;

		if ( this.testShow(this) ){
			this.showStyle(this.dom);
		}else{
			this.hideStyle(this.dom);
		}
	}


	destroy(){
		this.unmount();

		this.container = null;
		this.dom = null;

		this.posWorld = null

    this.testShow = null;

    this.showStyle = null;
    this.hideStyle = null;
	}
}