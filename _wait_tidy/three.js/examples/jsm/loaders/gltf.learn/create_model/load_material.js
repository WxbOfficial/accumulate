
import { MeshBasicMaterial, Color } from 'three';


export default function loadMaterial( json, materialIndex ){

	let
		material = json.materials[materialIndex],
		materialExtensions = material.extensions;

	if( 'KHR_materials_unlit' in materialExtensions ){

		return createMeshBasicMaterial( material )
	}

}


function createMeshBasicMaterial( params ){

	const
		baseColorFactor = params.pbrMetallicRoughness.baseColorFactor,

		color = baseColorFactor ? baseColorFactor : [1, 1, 1, 1];

	return new MeshBasicMaterial({
		color: new Color( color[0], color[1], color[2] ),
		opacity: color[3],
	});
}