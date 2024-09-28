import { BoundingBox } from 'pc';

export default function buildAabb(entity){
	let _modelsAabb = new BoundingBox();
  let i, m, meshInstances = [];

  let renders = entity.findComponents("render");
  for (i = 0; i < renders.length; i++) {
      let render = renders[i];
      for (m = 0; m < render.meshInstances.length; m++) {
          meshInstances.push(render.meshInstances[m]);
      }
  }

  let models = entity.findComponents("model");
  for (i = 0; i < models.length; i++) {
      let model = models[i];
      for (m = 0; m < model.meshInstances.length; m++) {
          meshInstances.push(model.meshInstances[m]);
      }
  }

  for (i = 0; i < meshInstances.length; i++) {
      if (i === 0) {
          _modelsAabb.copy(meshInstances[i].aabb);
      } else {
          _modelsAabb.add(meshInstances[i].aabb);
      }
  }

  return _modelsAabb;
}