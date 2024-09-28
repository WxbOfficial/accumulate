
export default function createAxesBox(scene, length = 10, size = 1){

	var boxO = BABYLON.Mesh.CreateBox("boxO", size, scene);

	var boxOMat = new BABYLON.StandardMaterial('boxO', scene);
	boxOMat.emissiveColor = new BABYLON.Color3(0, 0, 0);
	boxO.material = boxOMat;


	var boxR = BABYLON.Mesh.CreateBox("boxR", size, scene);

	boxR.position.x = length;
	var boxRMat = new BABYLON.StandardMaterial('boxR', scene);
	boxRMat.emissiveColor = new BABYLON.Color3(1, 0, 0);
	boxR.material = boxRMat;


	var boxG = BABYLON.Mesh.CreateBox("boxG", size, scene);

	boxG.position.y = length;
	var boxGMat = new BABYLON.StandardMaterial('boxG', scene);
	boxGMat.emissiveColor = new BABYLON.Color3(0, 1, 0);
	boxG.material = boxGMat;


	var boxB = BABYLON.Mesh.CreateBox("boxB", size, scene);

	boxB.position.z = length;
	var boxBMat = new BABYLON.StandardMaterial('boxB', scene);
	boxBMat.emissiveColor = new BABYLON.Color3(0, 0, 1);
	boxB.material = boxBMat;
}