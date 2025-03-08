import { Circle, Rect, Polyline, Polygon, Text } from '../src/index.js';
import start2d from './common/start2d.js';
import { allowObject2dCanMove, object2dCanMove } from './common/object2d_move.js';

const { camera, scene } = start2d(document.getElementById('renderCanvas'));
allowObject2dCanMove(scene);

const circle = new Circle({
	radius: 12,
	startAngle: 0,
	endAngle: 360,

	fill: '#0000ff',
	//fill: null,
	//strokeWidth: 1,
	//stroke: '#0000ff',
	renderOrder: 1,
});
// object2dCanMove(circle);
scene.on('mousemove', (x, y) => {
	circle.x = x;
	circle.y = y;
});
scene.addObject(circle);

const rect = new Rect({
	x: 400,
	y: 300,

	width: 300,
	height: 300,
	// rxlt: 150,
	// rylt: 150,

	fill: '#ffff00',
	stroke: '#0000ff',
	strokeWidth: 0,
});
object2dCanMove(rect);
rect.on('mouseenter', () => {
	rect.fill = '#ff0000';
})
rect.on('mouseleave', () => {
	rect.fill = '#ffff00';
})

scene.addObject(rect);

const polyline = new Polyline({
	points: [
		{ x: 60, y: 20 },
		{ x: 60, y: 80 },
		{ x: 120, y: 80 },
		{ x: 120, y: 20 },
	],
	fill: '#ff0000',
	// fill: null,
	strokeWidth: 2,
	stroke: '#000000',
});
object2dCanMove(polyline);
scene.addObject(polyline);

const polygon = new Polygon({
	points: [
		{ x: 100 + 60, y: 20 },
		{ x: 100 + 60, y: 80 },
		{ x: 100 + 120, y: 80 },
		{ x: 100 + 120, y: 20 },
	],
	fill: '#ff0000',
	// fill: null,
	strokeWidth: 2,
	stroke: '#000000',
});
object2dCanMove(polygon);
scene.addObject(polygon);

const text = new Text({
	x: 300,
	y: 0,
	text: 'font-size',
	backgroundColor: '#ff00ff',
	// text: 'Hello world!\nAAA\nBBB',
	fill: '#0000ff',
	// fill: null,
	// strokeWidth: 2,
	stroke: '#0000ff',
});
// text.add(rect);
object2dCanMove(text);
scene.addObject(text);

scene.sortObjectsByOrder();

const gui = new lil.GUI();

function onChangeFun() {
	// requestRender();
}
onChangeFun();

function initTransformGui(folder, target) {
	folder.add(target, 'x', -6000, 6000, 0.01).onChange(onChangeFun);
	folder.add(target, 'y', -6000, 6000, 0.01).onChange(onChangeFun);
	folder.add(target, 'scaleX', -10, 10).onChange(onChangeFun);
	folder.add(target, 'scaleY', -10, 10).onChange(onChangeFun);
	folder.add(target, 'rotationAngle', -180, 180, 1).name('rotationAngle').onChange(onChangeFun);
}
function initObject2dGui(folder, target) {

	folder.add(target, 'strokeWidth', 0, 30, 1).onChange(onChangeFun);
	folder.add(target, 'opacity', 0, 1, 0.01).onChange(onChangeFun);
	initTransformGui(folder, target);
}
{
	const camera2dFolder = gui.addFolder('camera2d');
	camera2dFolder.close();

	initTransformGui(camera2dFolder, camera);
}
{
	const circleFolder = gui.addFolder('circle');

	circleFolder.add(circle, 'radius', 0, 300).name('radius').onChange(onChangeFun);
	circleFolder.add(circle, 'visible').onChange(onChangeFun);
	circleFolder.close();

	initObject2dGui(circleFolder, circle);
}
{
	const rectFolder = gui.addFolder('rect');
	rectFolder.close();

	rectFolder.add(rect, 'width', -600, 600).onChange(onChangeFun);
	rectFolder.add(rect, 'height', -600, 600).onChange(onChangeFun);
	rectFolder.add(rect, 'visible').onChange(onChangeFun);

	['rxlt', 'rxrt', 'ryrt', 'ryrb', 'rxrb', 'rxlb', 'rylb', 'rylt'].forEach((radius) => {
		rectFolder.add(rect, radius, 0, 150).onChange(onChangeFun);
	});
	initObject2dGui(rectFolder, rect);
}
{
	const polylineFolder = gui.addFolder('polyline');
	polylineFolder.close();

	initObject2dGui(polylineFolder, polyline);
}
{
	const polygonFolder = gui.addFolder('polygon');
	polygonFolder.close();

	initObject2dGui(polygonFolder, polygon);
}
{
	const textFolder = gui.addFolder('text');
	textFolder.close();

	initObject2dGui(textFolder, text);
}


function mousedownCamera(x, y) {
	//模拟click事件
	//获取btn
	const canvasEventDom = document.querySelectorAll("#renderCanvas")[0];
	// console.clear();
	//创建event
	const event = document.createEvent("MouseEvents");
	//初始化event
	event.initMouseEvent("mousedown",
		true, true, document.defaultView, 0,
		x, y,
		x, y,
		false, false, false, false, 0, null);
	//触发事件
	canvasEventDom.dispatchEvent(event);
}

function mousemoveCamera(x, y) {
	//模拟click事件
	//获取btn
	const canvasEventDom = document.querySelectorAll("#renderCanvas")[0];
	// console.clear();
	//创建event
	const event = document.createEvent("MouseEvents");
	//初始化event
	event.initMouseEvent("mousemove",
		true, true, document.defaultView, 0,
		x, y,// screen
		x, y,// client
		false, false, false, false, 0, null);
	//触发事件
	canvasEventDom.dispatchEvent(event);
}

setTimeout(() => {
	mousedownCamera(100, 100);
	mousemoveCamera(230, 230);

	setTimeout(() => {
		mousedownCamera(100, 100);
		mousemoveCamera(180, 180);
	}, 1000);
}, 2000)