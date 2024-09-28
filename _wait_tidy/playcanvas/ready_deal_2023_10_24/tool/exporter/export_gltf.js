


function exportGltf(root){

	const resources = {
	    buffers: [],
	    cameras: [],
	    entities: [],
	    materials: [],
	    textures: [],

	    // entry: { node, meshInstances}
	    entityMeshInstances: [],

	    // maps a buffer (vertex or index) to an array of bufferview indices
	    bufferViewMap: new Map()
	},
	{ materials, buffers, entityMeshInstances, textures } = resources;

  // Collect entities
  root.forEach((entity) => {
      resources.entities.push(entity);
  });

  console.log('resources:', resources);

}