
```
importMeshAsync
	=> _loadData
		=> _setupData
			=> _createRootNode
				=> GLTFLoader._LoadTransform
	=> _loadAsync
		=> _loadExtensions
		=> _checkExtensions

		=> loadSceneAsync

			=> loadNodeAsync
				=> loadNode
					=> loadNodeAsync
				=> _loadMeshAsync
					=> _loadMeshPrimitiveAsync
						=> _createMorphTargets

				=> _loadMeshAsync
					=> _loadSkinAsync
			=> _loadAnimationsAsync
		=> _loadMaterialAsync
```