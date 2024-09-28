import {
	Vec3
} from 'pc';

export default class Anchor2d{

	constructor({
		name,
		dom,
		pos,
		scaleEnabled = false,
		scaleFactor = 6,
		offsetX = 0,
		offsetY = 0,
		testShow = ()=>{ return true },
		showStyle = (dom)=>{ dom.style.display = null },
		hideStyle = (dom)=>{ dom.style.display = 'none'; },
	}){
		this.name = name;

		this.dom = dom;
		this.dom.style.position = 'absolute';

		this.testShow = testShow;

		this.showStyle = showStyle;
		this.hideStyle = hideStyle;

		this.hideStyle(this.dom)

		this.posScreen = new Vec3(0, 0, 0);
		this.posWorld = pos;

		this.nowCamDis = new Vec3(0, 0, 0);

		this.scaleEnabled = scaleEnabled;
		this.scaleFactor = scaleFactor;

    // 锚点内容x的偏移距
    this.offsetX = offsetX || 0;
    // 锚点内容的y偏移距
    this.offsetY = offsetY || 0;

    this.enable = true;


	}

	update(canvasDom, cameraEntity){
		if( !this.enable ){
			return;
		}

    cameraEntity.camera.worldToScreen(this.posWorld, this.posScreen);
		
		// console.log('this.posScreen.z:', this.posScreen.z);
		// 判断是否在相机前面
		if (this.posScreen.z >= 0) {
      // 算出相机和锚点的距离
      // const dis = this.nowCamDis.sub2(cameraEntity.getLocalPosition(), this.posWorld).length();
      // 近大远小控制
      // const scaleCss = this.scaleEnabled ? `translate(-50%,-50%) scale(${this.scaleFactor / dis})translate(50%,50%)` : '';

			// 设置平移位置
			const translateX = this.posScreen.x;
			const translateY = this.posScreen.y;

			const translateCss = `translate(${translateX}px, ${translateY}px)`;
			// 默认dom中心点对应锚点
			let offsetCss = `translate(${this.offsetX}, ${this.offsetY})`;

			if ( this.testShow(this, translateX, translateY) ){
				this.showStyle(this.dom);
			}else{
				this.hideStyle(this.dom);
			}
			this.dom.style.transform = `${translateCss} ${offsetCss}`;
		}else{
			this.hideStyle(this.dom);
		}
	}

	destroy(){
		this.dom.parentNode.removeChild(this.dom);
		this.dom = null;

		this.posScreen = null
		this.posWorld = null

    this.testShow = null;

    this.showStyle = null;
    this.hideStyle = null;
	}
}