import { Matrix4 } from 'three';

import loadMesh from './load_mesh.js';

export default function loadNode( json, nodeIndex, cache, bin ){

	let
		node = json.nodes[nodeIndex],
		isSkinnedMesh = node.skin !== void 0,

		threeNode;

	if( node.mesh !== void 0 ){

		threeNode = loadMesh( json, node.mesh, cache, bin, isSkinnedMesh )
	}

	if( node.camera !== void 0 ){

	}

	if( Array.isArray( node.children ) && node.children.length > 0 ){


	}

	if( node.skin ){

	}


	if ( node.matrix !== void 0 ) {

		const matrix = new Matrix4();
		matrix.fromArray( node.matrix );
		threeNode.applyMatrix4( matrix );
	} else {

		if ( node.translation !== void 0 ) {

			threeNode.position.fromArray( node.translation );
		}

		if ( node.rotation !== void 0 ) {

			threeNode.quaternion.fromArray( node.rotation );
		}

		if ( node.scale !== void 0 ) {

			threeNode.scale.fromArray( node.scale );
		}
	}

	return threeNode;
}