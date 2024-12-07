# Database


## 关联调用

1. babylon.scene.js 中 render 调用 Database.Release 函数

2. babylon.tools.js 中的 LoadImage 属性方法内调用 Database.OpenAsync , 在参数函数 successCallback 内调用执行 Database.LoadImageFromDB

3. babylon.tools.js 中调用 LoadFile 属性方法内调用 Database.OpenAsync , 在参数函数 successCallback 内调用执行 Database.LoadSceneFromDB

4. babylon.sceneLoader.js 的 ImportMesh 方法中调用 Database.CheckManifestFile

5. babylon.sceneLoader.js 的 Load 方法中调用 Database.CheckManifestFile



## CheckManifestFile




## OpenAsync

1. request = window.indexedDB.open
	>* onerror
		>>* errorCallback
	>* onblocked
		>>* errorCallback
	>* onsuccess
		>>* db = request.result ; successCallback
	>* onupgradeneeded
		>>* db.createObjectStore


## LoadImageFromDB

1. saveAndLoadImage
	>* BABYLON.Database.\_saveImageIntoDBAsync

2. BABYLON.Database.\_loadImageFromDBAsync
	>* saveAndLoadImage

3. saveAndLoadImage
	>* \_saveImageIntoDBAsync


## \_loadImageFromDBAsync

1. `var transaction = db.transaction(["textures"]);`

2. `var getRequest = transaction.objectStore("textures").get(indexeddbUrl);`


## \_saveImageIntoDBAsync

1. ` var transaction = db.transaction(["textures"], "readwrite");`
	>* transaction.onabort
	>* transaction.oncomplete

2. `var addRequest = transaction.objectStore("textures").put(newTexture);`
	>* addRequest.onsuccess
	>* addRequest.onerror


## \_checkVersionFromDB




## \_loadVersionFromDBAsync




## \_saveVersionIntoDBAsync




## LoadSceneFromDB




## \_loadSceneFromDBAsync




## \_saveSceneIntoDBAsync




## Release




