import { GLTFLoader } from "../glTFLoader.js";

import { KHR_draco_mesh_compression } from  './KHR_draco_mesh_compression.js';



GLTFLoader.RegisterExtension('KHR_draco_mesh_compression', (loader) => new KHR_draco_mesh_compression(loader));
