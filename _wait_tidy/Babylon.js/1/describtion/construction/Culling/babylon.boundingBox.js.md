# BoundingBox


## 涉及到的引用

1. babylon.boundingInfo.js:
	>* BoundingInfo 初始化实例对象的时候, 赋一个实例对象作为 boundingBox 属性值
	>* `_update` 类方法中调用 boundingBox.\_update
	>* `isInFrustrum` 类方法中调用 boundingBox.isInFrustrum
	>* `intersectsPoint` 类方法中调用 boundingBox.intersectsPoint
	>* `intersects` 类方法中调用 BoundingBox.intersects

2. babylon.subMesh.js:
	>* `canIntersects` 类方法执行 ray.intersectsBox 传入 \_boundingInfo.boundingBox

## 构造函数

1. 传入 vertices, stride, start, count 参数
	>* babylon.mesh.js 执行 setVertices 时创建一个 BoundingInfo 实例对象赋给 \_boundingInfo 属性
	>* babylon.mesh.js 执行 clone 时创建一个 BoundingInfo 实例对象赋给新的 mesh 实例对象的 \_boundingInfo 属性
	>* babylon.subMesh.js 构造函数初始化时, 创建一个 BoundingInfo 实例对象赋给 \_boundingInfo 属性
		>>* BoundingInfo 构造函数初始化传入 vertices, stride, verticesStart, verticesCount 参数创建实例对象作为 boundingBox 属性值

2. 初始化 minimum 属性, x, y, z 为 Number.MAX_VALUE ; 初始化 maximum 属性, x, y, z 为 -Number.MAX_VALUE ;

3. 根据 start, count 遍历 vertices , 更新 minimum , maximum 属性

4. 初始化 vectors 属性, 放入包围盒的八个点位信息

5. 初始化 center 属性, 为 minimum , maximum 的中间值

6. 初始化 extends 属性, 为 minimum , maximum 插值的二分之一

7. 初始化 directions 属性, 为三个原点数据

8. 初始化 vectorsWorld 属性, 和 vectors 长度一致都是 8 个点位, 不过都是原点数据

9. 初始化 minimumWorld, maximumWorld 为原点数据


## \_update: 主要更新 vectorsWorld , maximumWorld , minimumWorld , center , directions 属性

1. 传入 world 矩阵参数
	>* babylon.mesh.js 执行 computeWorldMatrix 类方法
		>>* 调用执行 babylon.boundingInfo.js 中的 \_boundingInfo.\_update, 传入 \_worldMatrix 属性 => 调用执行 babylon.boundingBox.js 中的 boundingBox.\_update, 传入 world 参数,
		>>* 调用执行 babylon.subMesh.js 中的 subMesh.updateBoundingInfo, 传入 \_worldMatrix 属性 => 执行 babylon.boundingInfo.js 中 \_boundingInfo.\_update, 传入 world 参数 => 调用执行 babylon.boundingBox.js 中的 boundingBox.\_update, 传入 world 参数

2. 初始化 minimumWorld 属性, x, y, z 为 Number.MAX_VALUE ; 初始化 maximumWorld 属性, x, y, z 为 -Number.MAX_VALUE ;

3. 遍历 vectorsWorld 属性数组内的元素, 根据传入的 world 矩阵计算新的顶点数据, 同时根据 minimumWorld , maximumWorld 进行范围的限制

4. 根据新的 maximumWorld , minimumWorld 属性更新 center 属性, 为 maximumWorld , minimumWorld 的中间值

5. 根据 world 内的矩阵数据更新 directions 属性数组内的顶点信息


## isInFrustrum: 根据 vectorsWorld 属性做判断

1. 传入 frustumPlanes
	>* 执行 babylon.scene.js 中的 \_evaluateActiveMeshes 类方法时将 BABYLON.Frustum.GetPlanes 生成的值赋值给 \_frustumPlanes 属性
		>>* 调用执行 babylon.subMesh.js 中的 subMesh.isInFrustrum 传入 \_frustumPlanes 属性 => 调用执行 babylon.boundingInfo.js 中的 \_boundingInfo.isInFrustrum 传入 frustumPlanes 参数
		>>* 调用执行 babylon.mesh.js 中的 mesh.isInFrustrum 传入 \_frustumPlanes 属性 => 调用执行 babylon.boundingInfo.js 中的 \_boundingInfo.isInFrustrum 传入 frustumPlanes 参数
			>>>* 调用执行 babylon.boundingBox.js 中的 \boundingBox.isInFrustrum 传入 frustumPlanes 参数

2. 遍历 frustumPlanes 的六个面, 在其中再次遍历 vectorsWorld 属性元素的八个顶点 , 作为参数传入执行每个面的 dotCoordinate 函数

3. 如果有一个面执行 dotCoordinate , 八个顶点的结果都小于 0 , 则返回 false , 反之则返回 true


## intersectsPoint: 根据 maximumWorld , minimumWorld 属性做判断

1. 传入 point 参数
	>* 执行 babylon.mesh.js 中 intersectsPoint 类方法 => 执行 \_boundingInfo.intersectsPoint 传入 point 参数 => 执行 boundingBox.intersectsPoint 传入 point 参数

2. point 的 x , y , z 属性有一个不在 maximumWorld , minimumWorld 属性范围内就返回 false, 反之返回 true


## intersectsSphere: : 根据 maximumWorld , minimumWorld 属性做判断

1. 传入 sphere 参数

2. 传入 sphere 参数的 centerWorld 属性 , minimumWorld 属性, maximumWorld 属性, 执行 BABYLON.Vector3.Clamp, 得到 vector 变量

3. 传入 sphere 参数的 centerWorld 属性 , vector 变量, 执行 BABYLON.Vector3.DistanceSquared, 得到 num 变量

4. 返回 num 是否小于 sphere 参数的 radiusWorld 变量的平方, 用于决定是否 intersectsSphere


## intersects 静态类方法

1. 传入 box0, box1 参数
	>* 执行 babylon.mesh.js 中 intersectsMesh 类方法 =>  执行返回 babylon.boundingInfo.js 中的 \_boundingInfo.intersects 类方法, 传入 mesh 参数的 \_boundingInfo 属性, precise 参数 => 执行 BABYLON.BoundingBox.intersects 静态类方法, 传入 boundingBox 属性和 boundingInfo.boundingBox 参数

2. 通过传入的 box0 , box1 的 minimumWorld , maximumWorld 属性判断两个盒子是否不接触, 如果在 x , y, z 三个维度中, 有一个维度不接触, 就返回 false , 反之返回 true
