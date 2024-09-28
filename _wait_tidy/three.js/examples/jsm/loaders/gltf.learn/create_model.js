import loadScene from './create_model/load_scene.js';

// import loadMaterial from './create_model/load_material.js';
// import loadPrimitive from './create_model/load_primitive.js';


export default function createModel( json, bin ){

	const
		cache = {
			nodes: {},
			geometries: {},
			accessors: {},
		},
		scenes = [];

	for( let i = 0, len = json.scenes.length; i < len; i++ ){

		scenes.push( loadScene( json, i, cache, bin ) );
	}

	return {
		scenes,
		scene: scenes[ json.scene ],
	}
}
