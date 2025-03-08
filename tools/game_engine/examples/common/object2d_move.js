let x = 0, y = 0, selectedObject = false, _scene = null;

export function allowObject2dCanMove(scene) {
	_scene = scene;
	scene.on('mousemove', function (_x, _y) {
		if (selectedObject) {
			selectedObject.x += _x - x;
			selectedObject.y += _y - y;
			x = _x;
			y = _y;

		}
	});
	scene.on('mouseup', function () {
		if (selectedObject) {
			selectedObject.renderOrder = 0;
			scene.sortObjectsByOrder();
			selectedObject = null;
		}
	});
}

function object2dMoveFun(_x, _y) {
	x = _x;
	y = _y;
	selectedObject = this;

	selectedObject.renderOrder = 1;
	_scene.sortObjectsByOrder();
}

export function object2dCanMove(object2d) {
	object2d.on('mousedown', object2dMoveFun);
}