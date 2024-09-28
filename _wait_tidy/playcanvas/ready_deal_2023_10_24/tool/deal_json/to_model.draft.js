import {
	http
} from '../../../src/index.js';
import { JsonModelParser } from '../../../src/framework/parsers/json-model.js';
// import testModeJson from './test_model_json.js';


// setTimeout(()=>{
// 	const parser = app.loader._handlers.model._parsers[0].parser;
// 	parser.parse(testModeJson, (err, model)=>{
//     const entity = new pc.Entity('test');

// 		entity.addComponent("model");
// 		entity.model.model = model;

// 		console.log('model:', model);

//     app.root.addChild(entity)
// 	})
// }, 1000);

console.log('http:', http);


export {
	JsonModelParser
}