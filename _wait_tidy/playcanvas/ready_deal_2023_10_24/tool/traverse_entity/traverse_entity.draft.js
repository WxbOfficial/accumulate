// t Entity
// f 根据 Entity 自建的相机类
// o 根据 Entity 自建的模型类
// c 根据 Entity 自建的锚点父类(可能)
// S 根据 Entity 自建的锚点类
// m 不知道，感觉没啥用

const memoryClass = new Map();


// export default 
function traverseEntity(entity){
	let root = {};

	initEntityMessage(root, entity);

	return root;
}


function initEntityMessage(obj, entity){
	if( !entity instanceof pc.Entity ){
		throw new Error( '不是 Entity 类型' );
	}

	obj.name = entity.name;
	obj.type = entity.constructor.name;
	obj.components = [];

	if( memoryClass.has( obj.type ) ){
		memoryClass.get( obj.type ).examples.push( entity );
	}else{
		memoryClass.set( obj.type, {
			fun: entity.constructor,
			examples: [ entity ],
		} );
	}

	if( entity.c ){
		let keys = Object.keys( entity.c );
		if( keys.length > 0 ){
			keys.forEach((keyName)=>{

				traverseComponent(obj.components, keyName, entity.c[keyName]);
			});
		}
	}

	if( Array.isArray( entity.children ) ){
		obj.children = [];

		entity.children.forEach((child)=>{

			let childObj = {};
			
			initEntityMessage(childObj, child);
			obj.children.push(childObj);

		})
	}
}

function traverseComponent(objCom, keyName, com){
	let c = {
		type: `${keyName}Component`,
	}

	switch(keyName){
		case 'model':
			c.model = getModelJson(com.model)
	}

	objCom.push(c);
}

function getModelJson(modelResouce){
	console.log('modelResouce:', modelResouce);

	return {
		model: {
			graph: traverseModelNode(modelResouce.graph),
		}
	}
}

window.traverseModelNodes = new Set();

function traverseModelNode(graphNode){
	const
		pos = graphNode.localPosition,
		rot = graphNode.localRotation,
		sca = graphNode.localScale,
		nodeObj = {
			name: graphNode.name,
			position: [ pos.x, pos.y, pos.z ],
			rotation: [ rot.x, rot.y, rot.z ],
			scale: [ sca.x, sca.y, sca.z ],
			scaleCompensation: graphNode.scaleCompensation,
			children: [],
		}
	traverseModelNodes.add( nodeObj );
	if( Array.isArray( graphNode.children ) ){
		graphNode.children.forEach((childNode)=>{
			nodeObj.children.push(traverseModelNode(childNode));
		})
	}
	return nodeObj;
}



