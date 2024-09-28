# BoundingSphere


## 涉及到的引用

1. babylon.boundingInfo.js
	>* BoundingInfo 初始化实例对象的时候, 赋一个实例对象作为 boundingSphere 属性值
	>* `_update` 类方法中调用 boundingSphere.\_update
	>* `isInFrustrum` 类方法中调用 boundingSphere.isInFrustrum
	>* `intersectsPoint` 类方法中调用 boundingSphere.intersectsPoint
	>* `intersects` 类方法中调用 BoundingSphere.intersects

2. babylon.mesh.js:
	>* `intersects` 类方法执行 ray.intersectsSphere 传入 \_boundingInfo.boundingSphere


## 构造函数

1. 传入 vertices, stride, start, count 参数
	>* babylon.mesh.js 执行 setVertices 时创建一个 BoundingInfo 实例对象赋给 \_boundingInfo 属性
	>* babylon.mesh.js 执行 clone 时创建一个 BoundingInfo 实例对象赋给新的 mesh 实例对象的 \_boundingInfo 属性
	>* babylon.subMesh.js 构造函数初始化时, 创建一个 BoundingInfo 实例对象赋给 \_boundingInfo 属性
		>>* BoundingInfo 构造函数初始化传入 vertices, stride, verticesStart, verticesCount 参数创建实例对象作为 boundingBox 属性值

2. 初始化 minimum 属性, x, y, z 为 Number.MAX_VALUE ; 初始化 maximum 属性, x, y, z 为 -Number.MAX_VALUE ;

3. 根据 start, count 遍历 vertices , 更新 minimum , maximum 属性

4. 创建 distance 变量, 赋值 minimum 到 maximum 的距离

5. 赋值 minimum, maximum 的中点给 center 属性

6. 赋值 distance 的一半给 radius 属性

7. 赋值原点顶点给 centerWorld 属性


## \_update

1. 传入 world, scale 参数
	>* babylon.mesh.js 执行 computeWorldMatrix 类方法
		>>* 传入 \_worldMatrix , \_scaleFactor 属性, 执行 babylon.boundingInfo.js 中的 \_boundingInfo.\_update => 传入 world, scale 参数, 执行 babylon.boundingSphere.js 中的 boundingSphere.\_update
		>>* 传入 \_worldMatrix , \_scaleFactor 属性, 执行 babylon.subMesh.js 中的 subMesh.updateBoundingInfo => 传入 world, scale 参数, 执行 babylon.boundingInfo.js 中的 \_boundingInfo.\_update => 传入 world, scale 参数, 执行 babylon.boundingSphere.js 中的 boundingSphere.\_update

2. 根据 center 属性和 world 参数矩阵, 更新 centerWorld 属性

3. 根据 radius 属性和 scale 参数, 更新 centerWorld 属性


## isInFrustrum

1. 传入 frustumPlanes 参数
	>* 执行 babylon.scene.js 中的 \_evaluateActiveMeshes 类方法的时候, 将 BABYLON.Frustum.GetPlanes 生成的值赋给 \_frustumPlanes 属性
	>* 判断调用执行 babylon.mesh.js 中的 isInFrustrum 方法, 传入 \_frustumPlanes 属性
	>* 判断调用执行 babylon.subMesh.js 中的 isInFrustrum 方法, 传入 \_frustumPlanes 属性
		>>* 执行 babylon.boundingInfo.js 中的 isInFrustrum 类方法传入 frustumPlanes 参数 => 判断调用执行 babylon.boundingSphere.js 中的 boundingSphere.isInFrustrum, 传入 frustumPlanes 参数

2. 遍历 frustumPlanes 中的六个面, 每个面调用执行 dotCoordinate 传入 centerWorld 属性, 如果有一个面的结果小于 radiusWorld 取反, 就返回 false, 反之则返回 true


## intersectsPoint

1. 传入 point 参数
	>* 执行 babylon.mesh.js 中的 intersectsPoint 类方法 => 执行 babylon.boundingInfo.js 中的 intersectsPoint 类方法, 传入 point 参数 => 判断调用执行 babylon.boundingSphere.js 中的 intersectsPoint 方法, 传入 point 参数

2. 计算 centerWorld 属性和传入 point 参数顶点之间的距离, 如果大于 radiusWorld 属性就返回 false, 反之则返回 true


## intersects 静态类方法

1. 传入 sphere0, sphere1 参数
	>* 执行 babylon.mesh.js 中的 intersectsMesh 类方法 => 调用执行 babylon.boundingInfo.js 中的 intersects, 传入 mesh 参数中的 \_boundingInfo 属性和 precise 参数 => 调用执行 babylon.boundingSphere.js 中的 intersects 静态类方法, 传入 boundingSphere 属性和 boundingInfo 参数的 boundingSphere 属性

2. 计算传入的 sphere0 和 sphere1 参数的 centerWorld 属性之间的距离, 判断是否比 sphere0 和 sphere1 参数的 radiusWorld 属性之和小, 如果小的话就返回 false, 反之则返回 true