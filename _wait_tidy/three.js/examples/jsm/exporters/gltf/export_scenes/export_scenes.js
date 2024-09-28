//用于测试的导出案例

import { addOnePlane, addTwoPlane } from './mesh.js';

import { addLineBasicMaterial } from './material.js';


export default [

	{
		name: 'one_plane.glb',
		mountScene(scene){

			addOnePlane(scene);
		}
	},
	{
		name: 'two_plane.glb',
		mountScene(scene){

			addTwoPlane(scene);
		}
	},
	{
		name: 'line_basic_material.glb',
		mountScene(scene){

			addLineBasicMaterial(scene);
		}
	}
];