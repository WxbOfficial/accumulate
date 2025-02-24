// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "instancesVertex";
const shader = `#ifdef INSTANCES
var finalWorld=mat4x4<f32>(vertexInputs.world0,vertexInputs.world1,vertexInputs.world2,vertexInputs.world3);
#if defined(PREPASS_VELOCITY) || defined(VELOCITY)
var finalPreviousWorld=mat4x4<f32>(previousWorld0,previousWorld1,previousWorld2,previousWorld3);
#endif
#ifdef THIN_INSTANCES
#if !defined(WORLD_UBO)
finalWorld=uniforms.world*finalWorld;
#else
finalWorld=mesh.world*finalWorld;
#endif
#if defined(PREPASS_VELOCITY) || defined(VELOCITY)
finalPreviousWorld=previousWorld*finalPreviousWorld;
#endif
#endif
#else
#if !defined(WORLD_UBO)
var finalWorld=uniforms.world;
#else
var finalWorld=mesh.world;
#endif
#if defined(PREPASS_VELOCITY) || defined(VELOCITY)
var finalPreviousWorld=previousWorld;
#endif
#endif
`;
// Sideeffect
ShaderStore.IncludesShadersStoreWGSL[name] = shader;
/** @internal */
export const instancesVertex = { name, shader };
//# sourceMappingURL=instancesVertex.js.map