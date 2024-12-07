# VertexBuffer

## 关联调用

1. babylon.standardMaterial.js 文件中 StandardMaterial 的 isReady 类方法调用 BABYLON.VertexBuffer.UVKind , UV2Kind , ColorKind 判断有哪些传入的属性

2. babylon.sceneLoader.js 文件中的 parseMesh 函数中调用 BABYLON.VertexBuffer.PositionKind , NormalKind , UVKind , UV2Kind , ColorKind

3. babylon.mesh.js 文件中 setVerticesData 调用 BABYLON.VertexBuffer 生成一个实例对象 ; 调用判断 BABYLON.VertexBuffer.PositionKind

4. babylon.subMesh.js 文件中 SubMesh 构造函数中调用 BABYLON.VertexBuffer.PositionKind 用于获取对应的顶点信息

## 构造函数

1. 传入 mesh, data, kind, updatable 参数

2. 初始化 \_mesh , \_engine 属性

3. 根据 updatable 参数初始化 \_buffer 属性，是动态 DYNAMIC_DRAW 还是静态 STATIC_DRAW

4. 初始化 \_data , \_kind 属性

5. 根据 kind 的类别初始化 \_strideSize 属性, 如果是 BABYLON.VertexBuffer.PositionKind 则执行 \_mesh.\_resetPointsArrayCache()

## 属性说明

1. \_mesh: 网格对象
	>* update 类方法中, 如果 \_kind 属性是 BABYLON.VertexBuffer.PositionKind 类别， 则执行 \_mesh.\_resetPointsArrayCache()

2. \_engine:
	>* update 类方法中提供 updateDynamicVertexBuffer 方法根据传入的 data 参数更新 \_buffer 属性表示的缓冲区对象内的数据
	>* dispose 类方法中提供 \_releaseBuffer 方法释放 \_buffer 属性表示的对应的 WebGLBuffer 对象

3. \_buffer: 表示对应的 WebGLBuffer 对象
	>* update 类方法中被传入的 data 参数影响更新 ;
	>* dispose 类方法中作为参数传入 \_engine.\_releaseBuffer 被释放

4. \_data: 属性数据
	>* update 类方法中被传入的 data 参数更新替换
	>* getData 类方法中被返回

5. \_kind: buffer 类型
	>* update 类方法中被引用判断是否是 BABYLON.VertexBuffer.PositionKind , 是的话则执行 \_mesh.\_resetPointsArrayCache()

6. \_strideSize: buffer 类型

## get 类方法

1. getData: 返回 \_data 属性
2. getStrideSize: 返回 \_strideSize 属性

## update

1. 调用 \_engine.updateDynamicVertexBuffer 传入 \_buffer 属性和 data 参数更新 \_buffer 属性表示的缓冲区对象内的数据

2. 根据传入的 data 参数更新替换 \_data 属性

3. 引用判断 \_kind 属性是否是 BABYLON.VertexBuffer.PositionKind , 是的话则执行 \_mesh.\_resetPointsArrayCache()

## dispose

1. 调用 \_engine.\_releaseBuffer 方法释放 \_buffer 属性表示的对应的 WebGLBuffer 对象

## Enums

```
PositionKind	= 'position';
NormalKind		= 'normal';
UVKind				= 'uv';
UV2Kind				= 'uv2';
ColorKind			= 'color';
```