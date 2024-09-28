# Octree


## 涉及到的引用

1. babylon.scene.js 的 scene 的实例函数 createOrUpdateSelectionOctree 调用 new BABYLON.Octree 生成一个实例对象赋给 \_selectionOctree 属性


## 构造函数

1. 初始化 blocks 属性为一个空数组

2. 初始化 \_selection 属性为一个长度为 256 的 SmartArray


## update

1. 传入参数 worldMin, worldMax, meshes

2. blocks 属性赋值为一个空数组

3. 根据 worldMin, worldMax 循环生成八叉树的内部八个盒子范围, 每个盒子调用 BABYLON.OctreeBlock 生成一个 block 存放到 blocks 数组属性中

## select