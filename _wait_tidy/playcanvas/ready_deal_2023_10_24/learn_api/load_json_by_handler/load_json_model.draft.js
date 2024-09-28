import {
	path,
	http
} from 'pc';
import {
	standardMaterialTextureParameters
} from '../../../src/scene/materials/standard-material-parameters.js';

// 草稿

const materialMap = new Map();
const textureMap = new Map();


// convert any properties that are out of date
// or from old versions into current version
function migrate(data) {
    // replace old shader property with new shadingModel property
    if (data.shadingModel === undefined) {
        if (data.shader === 'blinn') {
            data.shadingModel = 1;
        } else {
            data.shadingModel = 0;
        }
    }
    if (data.shader) delete data.shader;

    // make JS style
    if (data.mapping_format) {
        data.mappingFormat = data.mapping_format;
        delete data.mapping_format;
    }

    let i;
    // list of properties that have been renamed in StandardMaterial
    // but may still exists in data in old format
    const RENAMED_PROPERTIES = [
        ['bumpMapFactor', 'bumpiness'],

        ['aoUvSet', 'aoMapUv'],

        ['aoMapVertexColor', 'aoVertexColor'],
        ['diffuseMapVertexColor', 'diffuseVertexColor'],
        ['emissiveMapVertexColor', 'emissiveVertexColor'],
        ['specularMapVertexColor', 'specularVertexColor'],
        ['metalnessMapVertexColor', 'metalnessVertexColor'],
        ['opacityMapVertexColor', 'opacityVertexColor'],
        ['glossMapVertexColor', 'glossVertexColor'],
        ['lightMapVertexColor', 'lightVertexColor'],

        ['diffuseMapTint', 'diffuseTint'],
        ['specularMapTint', 'specularTint'],
        ['emissiveMapTint', 'emissiveTint'],
        ['metalnessMapTint', 'metalnessTint'],

        ['clearCoatGlossiness', 'clearCoatGloss']
    ];

    // if an old property name exists without a new one,
    // move property into new name and delete old one.
    for (i = 0; i < RENAMED_PROPERTIES.length; i++) {
        const _old = RENAMED_PROPERTIES[i][0];
        const _new = RENAMED_PROPERTIES[i][1];

        if (data[_old] !== undefined) {
            if (data[_new] === undefined) {
                data[_new] = data[_old];
            }
            delete data[_old];
        }
    }

    // Properties that may exist in input data, but are now ignored
    const DEPRECATED_PROPERTIES = [
        'fresnelFactor',
        'shadowSampleType'
    ];

    for (i = 0; i < DEPRECATED_PROPERTIES.length; i++) {
        const name = DEPRECATED_PROPERTIES[i];
        if (data.hasOwnProperty(name)) {
            delete data[name];
        }
    }

    return data;
}

export default function loadJsonModel(url, callback){
	const
		ext = path.getExtension(url),
		dir = path.getDirectory(url),
		basename = path.getBasename(url),
		mappingUrl = path.join(dir, basename.replace(ext, '.mapping.json'));

	console.log('url:', url);
	console.log('ext:', ext);
	console.log('dir:', dir);
	console.log('basename:', basename);
	console.log('mappingUrl:', mappingUrl);

	let gMapping = null;

	http.get( mappingUrl, (error, mappingData)=>{

		if( Array.isArray( mappingData?.mapping ) ){
			gMapping = mappingData.mapping;

			console.log('gMapping:', gMapping);

			mappingData.mapping.forEach((mapping, index)=>{


				mapping.allPath = path.join(dir, mapping.path);
				loadMaterial( mapping.allPath );

			});
		}
	});

	let loadedMaterialCount = 0;
	const loadedMaterials = [];




	function initMaterial(materialData, materialUrl, material, callback){
		const materialDir = path.getDirectory(materialUrl);
    const texParams = standardMaterialTextureParameters;
    for (let i = 0; i < texParams.length; i++) {
        const texPath = materialData[texParams[i]];
        const texParam = texParams[i];

        if (texPath && typeof texPath === 'string') {
        	const textureUrl = path.join(materialDir, texPath);
        	if( textureMap.has(textureUrl) ){
        		material[texParam] = textureMap.get(textureUrl);

						if( i === texParams.length - 1 ){
							callback();
						}

        	}else{
        		pc.app.assets.loadFromUrl(textureUrl, "texture", function (err, asset) {

							material[texParam] = asset.resource;
							textureMap.set(textureUrl, asset.resource);

							if( i === texParams.length - 1 ){
								callback();
							}

        		});
        	}
        }else{
					if( i === texParams.length - 1 ){
						callback();
					}
        }

    }
	}

	function startLoadTexture(){
		if( loadedMaterialCount === gMapping.length ){
			loadedMaterials.forEach(({material, materialData, materialUrl}, index)=>{
				initMaterial(materialData, materialUrl, material, ()=>{
					if( index === loadedMaterials.length - 1 ){
						// loadModel();
					}
				});
			});
		}
	}

	function loadMaterial(materialUrl){
		
		if( materialMap.has(materialUrl) ){

			loadedMaterialCount++;
			startLoadTexture();
		}else{

			http.get(materialUrl, (error, materialData)=>{
				console.log('error:', error, 'materialData:', materialData);

				migrate(materialData);

				const material = app.loader._handlers.material._parser.parse(materialData);
				// console.log('material:', material);
				materialMap.set(materialUrl, material );
				loadedMaterials.push({
					material,
					materialData,
					materialUrl,
				});

				loadedMaterialCount ++;
				startLoadTexture();
			});
		}
	}

	window.loadModel = loadModel;

	function loadModel(){
		if( loadedMaterialCount === gMapping.length ){

			http.get( url, (error, modelData)=>{

				window.modelData = modelData;

				console.log('loadModel');
				console.log("error:", error, "modelData:", modelData);

				// console.log('parser.parse:', app.loader._handlers.model._parsers[0].parser.parse)

				app.loader._handlers.model._parsers[0].parser.parse(modelData, (error, model)=>{
					// console.log('model:', model);
					// console.log('model.meshInstances', model.meshInstances);

					model.meshInstances.forEach((meshInstance, index)=>{
						meshInstance.material = materialMap.get(gMapping[index].allPath);
					});

					callback(model);
				});


			} );
		}
	}


}
