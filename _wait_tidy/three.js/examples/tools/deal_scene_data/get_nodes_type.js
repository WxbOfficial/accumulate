
// 用于简单统计根节点内的各类节点信息
function getNodesType( rootNode ){
	console.log();
	console.log('getAllObjectsTypeCount');
	console.log('rootNode:', rootNode);

	const typeMaps = new Map();

	let allCount = 0,
			allCountVisible = 0,
			allCountInVisible = 0;

	rootNode.traverse((node)=>{
		allCount ++;
		const type = node.type;
		const visibleType = `${type}:visible`;
		const invisibleType = `${type}:invisible`;

		if( typeMaps.has(type) ){

			typeMaps.get(type).push(node);
		}else{

			typeMaps.set(type, [node]);
			typeMaps.set(visibleType, []);
			typeMaps.set(invisibleType, []);
		}

		if( node.visible ){
			allCountVisible ++;
			typeMaps.get(visibleType).push(node);
		}else{
			allCountInVisible ++;
			typeMaps.get(invisibleType).push(node);
		}

		// 用于对各个类型的节点进行判断查看，根据具体情况查看
		// switch( node.type ){
		// 	case 'Object3D':
		// 		if( node.children.length > 0 ){
		// 			console.log('node.children.length:', node.children.length)
		// 		}
		// 		break;
		// }

	});

	console.log('所有节点:', allCount);
	console.log('所有可见节点:', allCountVisible);
	console.log('所有不可见节点:', allCountInVisible);
	console.log(`总共有 ${typeMaps.size / 3} 类节点信息`)
	typeMaps.forEach((val, key)=>{
		console.log(key, ':', val.length);
	});

	return {
		allCount,
		allCountVisible,
		allCountInVisible,
		typeMaps,
	}
}

getNodesType( threeEditorController.scenes[0] );


