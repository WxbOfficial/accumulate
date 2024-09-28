# BoundingInfo


## 涉及到的引用

1. babylon.mesh.js
	>* `getBoundingInfo` 返回相关的实例对象
	>* `computeWorldMatrix` 类方法中执行 \_update 方法
	>* `setVertices` 类方法中赋一个实例对象作为 \_boundingInfo 属性值
	>* `isInFrustrum` 类方法中执行返回 isInFrustrum 方法
	>* `_checkCollision` 类方法中执行 \_checkCollision 方法
	>* `intersectsMesh` 类方法中执行返回 \_boundingInfo.intersects
	>* `intersectsPoint` 类方法中执行返回 \_boundingInfo.intersectsPoint
	>* `intersects` 类方法中用于判断 \_boundingInfo 和为 ray.intersectsSphere 的执行传入 \_boundingInfo.boundingSphere
	>* `clone` 类方法中赋新的一个实例对象作为新的克隆实例对象的 \_boundingInfo 属性值

2. babylon.subMesh.js
	>* 构造函数初始化时赋一个实例对象作为 \_boundingInfo 属性值
	>* `getBoundingInfo` 返回相关的实例对象
	>* `_checkCollision` 类方法中执行 \_checkCollision 方法
	>* `updateBoundingInfo` 类方法中执行 \_update 方法
	>* `isInFrustrum` 类方法中执行 isInFrustrum 方法
	>* `canIntersects` 类方法中执行 ray.intersectsBox 传入 \_boundingInfo 属性的 boundingBox 属性


## 构造函数

1. 传入 vertices, stride, verticesStart, verticesCount 参数
	>* babylon.mesh.js 执行 setVertices 时创建一个 BoundingInfo 实例对象赋给 \_boundingInfo 属性
	>* babylon.mesh.js 执行 clone 时创建一个 BoundingInfo 实例对象赋给新的 mesh 实例对象的 \_boundingInfo 属性
	>* babylon.subMesh.js 构造函数初始化时, 创建一个 BoundingInfo 实例对象赋给 \_boundingInfo 属性

2. 传入 vertices, stride, verticesStart, verticesCount 参数, `new BoundingBox` 初始化boundingBox 属性

3. 传入 vertices, stride, verticesStart, verticesCount 参数, `new BoundingSphere` 初始化boundingSphere 属性


## \_update

1. 传入 world , scale 参数
	>* babylon.mesh.js 执行 computeWorldMatrix 类方法 => 执行 \_boundingInfo.\_update 传入 \_worldMatrix 和 \_scaleFactor 属性
	>* babylon.mesh.js 执行 computeWorldMatrix 类方法 => 调用执行 subMesh.updateBoundingInfo 传入 \_worldMatrix 和 \_scaleFactor 属性 => 调用执行 \_boundingInfo.\_update 传入 world 和 scale 参数

2. 调用执行 boundingBox.\_update, 传入 world 参数,

3. 调用执行 boundingSphere.\_update, 传入 world , scale 参数,


## isInFrustrum

1. 传入 frustumPlanes

	>* 执行 babylon.scene.js 中的 \_evaluateActiveMeshes 类方法时将 BABYLON.Frustum.GetPlanes 生成的值赋值给 \_frustumPlanes 属性
		>>* 调用执行 babylon.mesh.js 中的 mesh.isInFrustrum 传入 \_frustumPlanes 属性 => 调用执行 babylon.boundingInfo.js 中的 \_boundingInfo.isInFrustrum 传入 frustumPlanes 参数
		>>* 调用执行 babylon.subMesh.js 中的 subMesh.isInFrustrum 传入 \_frustumPlanes 属性 => 调用执行 babylon.boundingInfo.js 中的 \_boundingInfo.isInFrustrum 传入 frustumPlanes 参数

2. 传入 frustumPlanes 判断 boundingSphere.isInFrustrum 是否为 false , 为 false 的话返回 false

3. 传入 frustumPlanes 返回 boundingBox.isInFrustrum


## \_checkCollision

1. 传入 collider 参数
	>* 执行 babylon.freeCamera.js 中的 update 类方法
		>* 调用自身的 \_collideWithWorld 类方法, 传入 cameraDirection 属性
		>* 调用自身的 \_collideWithWorld 类方法, 传入 \_scene 属性的 gravity 属性
			>>* 调用执行 scene 属性的 \_getNewPosition 类方法`(babylon.scene.js 中的 _getNewPosition 类方法)`, 传入 \_oldPosition 属性, velocity 参数, \_collider 属性, 常量 3, \_newPosition 属性 => 调用执行自身的 \_collideWithWorld 类方法, 传入 \_scaledPosition 属性, \_scaledVelocity 属性, collider 参数, maximumRetry 参数, finalPosition 参数 => 遍历 meshes 属性数组中的元素, 调用执行每个元素的 \_checkCollision 属性方法`( babylon.mesh.js 中的 _checkCollision 类方法)`, 传入 collider 参数
				>>>* 调用执行 \_boundingInfo 属性的 \_checkCollision 属性`(babylon.boundingInfo.js 中的 _checkCollision 类方法)`, 传入 collider 参数
				>>>* 调用执行 \_processCollisionsForSubModels 类方法`(babylon.mesh.js 中的 _checkCollision 类方法)`, 传入 collider 参数, \_collisionsTransformMatrix 属性 => 遍历 subMeshes, 调用执行每个元素的 \_checkCollision 属性方法`(babylon.subMesh.js 中的 _checkCollision 类方法)`, 传入 collider 参数 => 调用执行 \_boundingInfo 属性的 \_checkCollision 方法`(babylon.boundingInfo.js 中的 _checkCollision 类方法)`, 传入 collider 参数

2. 调用执行 collider 参数的 \_canDoCollision 返回结果, 传入 boundingSphere 属性的 centerWorld 属性, boundingSphere 属性的 radiusWorld 属性, boundingBox 属性的 minimumWorld 属性, boundingBox 属性的 maximumWorld 属性


## intersectsPoint

1. 传入 point 参数
	>* 执行 babylon.mesh.js 中 intersectsPoint 类方法 => 执行 \_boundingInfo.intersectsPoint 方法`(babylon.boundingInfo.js 中的 intersectsPoint 类方法)`传入 point 参数

2. 判断 boundingSphere.centerWorld 是否存在, 不存在返回 false

3. 传入 point 参数执行 boundingSphere.intersectsPoint , 如果结果为 false 则返回 false

4. 传入 point 参数执行 boundingBox.intersectsPoint , 如果结果为 false 则返回 false

5. 上述检测都通过则返回 true


## intersects

1. 传入 boundingInfo, precise 参数
	>* 执行 babylon.mesh.js 中 intersectsMesh 类方法 => 执行 \_boundingInfo.intersects `(babylon.boundingInfo.js 中的 intersects 类方法)`, 传入 mesh 参数的 \_boundingInfo 属性, precise 参数

2. 判断 boundingSphere 属性的 centerWorld, centerWorld 属性是否存在, 有一个不存在就返回 false

3. 执行 BABYLON.BoundingSphere.intersects 静态类方法, 传入 boundingSphere 属性, boundingInfo 参数的 boundingSphere 属性, 结果取反为 true 则返回 false

4. 执行 BABYLON.BoundingBox.intersects 静态类方法, 传入 boundingBox 属性, boundingInfo 参数的 boundingBox 属性, 结果取反为 true 则返回 false

5. precise 参数若不存在则返回 false

6. 调用一系列 axisOverlap 函数(暂时不知道具体作用)进行判断, 有一个结果取反为 true 则返回 false

7. 返回 true