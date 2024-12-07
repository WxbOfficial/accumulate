import { Group } from 'three';

import loadNode from './load_node.js';

export default function loadScene( json, sceneIndex, cache, bin ){

	const
		scene = json.scenes[sceneIndex],
		nodes = scene.nodes,

		threeScene = new Group();

	threeScene.name = scene.name;

	nodes.forEach(( nodeIndex )=>{

		threeScene.add( loadNode( json, nodeIndex, cache, bin ) );
	})

	return threeScene;
}