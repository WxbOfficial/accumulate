# FreeCamera

&emsp; 对 babylon.freeCamera.js 相关代码的说明

&emsp;对 Cameras/babylon.freeCamera.js 相关代码的说明

## 属性说明

1. 无使用属性: name , id

2. \_scene:
	>* attachControl 类方法中使用提供 getEngine ，用于确定 isPointerLock
	>* \_collideWithWorld 类方法中使用 \_getNewPosition , 具体作用暂时不是很确定
	>* \_update 中提供 collisionsEnabled 属性 ; 提供 gravity 属性。 具体作用暂时都不是很确定

3. position: 一开始由外部的参数进行赋值
	>* setTarget 类方法中作为更新 \_camMatrix 的变量之一 ; 作为更新 vDir 变量的变量之一, 进一步更新 rotation 属性的 y 属性
	>* \_collideWithWorld 类方法中更新 \_oldPosition 的属性之一 ; 被 \_diffPosition 属性影响更新
	>* \_update 类方法中赋值给 oldPosition 变量 , 影响更新 \_needMoveForGravity 属性 ; 被 cameraDirection 属性影响更新
	>* getViewMatrix 类方法中作为更新 \_currentTarget 属性的变量之一 ; 作为更新 \_viewMatrix 属性的变量之一 ;

4. cameraDirection

5. cameraRotation

6. cameraRotation

7. rotation

8. ellipsoid

9. \_keys

10. keysUp , keysDown , keysLeft , keysRight

11. \_collider , \_needMoveForGravity

12. animations

13. \_currentTarget

14. \_upVector

15. \_viewMatrix

16. \_camMatrix

17. \_cameraTransformMatrix

18. \_cameraRotationMatrix

19. \_referencePoint

20. \_transformedReferencePoint

21. \_oldPosition

22. \_diffPosition

23. \_newPosition


## setTarget: 主要是更新 \_camMatrix , rotation 属性

1. 根据 position 属性 , 传入的 target 参数 , 默认的 up 值更新 \_camMatrix 属性
2. 根据 \_camMatrix 属性更新 rotation 属性的 x 属性
3. 根据传入的 target 参数和 position 属性更新 rotation 属性的 y 属性
4. 根据默认的 up 值更新 rotation 属性的 z 属性


## attachControl: 主要是添加事件更新 cameraRotation , \_keys 属性

1. \_onMouseMove 事件中更新 cameraRotation 属性
2. \_onKeyDown 事件中 \_keys 属性添加
3. \_onKeyUp 事件中  \_keys 属性移除
4. \_onLostFocus 事件中 \_keys 属性清空为空数组


## \_collideWithWorld: 不是很清楚

1. \_oldPosition 属性根据 position 属性和 ellipsoid 属性的 y 属性更新

2. ellipsoid 属性(固定值)赋值给 \_collider 属性的 radius 属性

3. 调用 \_scene.\_getNewPosition, 传入 \_oldPosition 属性, velocity 参数, \_collider 属性, 3, \_newPosition 属性 (较复杂不展开)

4. 根据 \_newPosition , \_oldPosition 属性更新 \_diffPosition 属性

5. 如果 \_diffPosition 的长度大于 collisionsEpsilon (0.001)
	>* 根据 \_diffPosition 更新 position 属性


## \_checkInputs

&emsp;内部引用更新 \_localDirection , \_transformedDirection, \_cameraTransformMatrix (属性只有在该函数中起作用)

&emsp;引用外部 rotation 属性

&emsp;更新外部 cameraDirection 属性

1. 若 \_localDirection 属性不存在, 初始化 \_localDirection , \_transformedDirection
2. 遍历 \_keys 数组 , 每次遍历:
	>* 根据 \_keys 中的元素更新 \_localDirection 属性
	>* 根据 rotation 属性的 y , x 属性更新 \_cameraTransformMatrix 属性
	>* 根据 \_localDirection 属性和 \_cameraTransformMatrix 属性更新 \_transformedDirection 属性
	>* 根据 \_transformedDirection 属性更新 cameraDirection 属性


## \_update

1. 执行 \_checkInputs()

2. 根据 \_needMoveForGravity 属性和 cameraDirection 属性判断是否需要移动 ; 根据 cameraRotation 属性判断是否需要旋转

3. 如果需要移动的话
	>* 如果 checkCollisions 属性为 true 且场景的 collisionsEnabled 属性为 true
		>>* 执行 \_collideWithWorld, 传入 cameraDirection 属性
		>>* 如果 applyGravity 属性为 true， 即应用重力效果
		>>>* 执行 \_collideWithWorld, 传入 \_scene.gravity
		>>>* 根据新老位置是否存在偏移更新 \_needMoveForGravity
	>* 如果 checkCollisions 属性和场景的 collisionsEnabled 属性有一个为 false
		>>* 更新 position 属性

4. 如果需要旋转的话
	>* 根据 cameraRotation 属性更新 rotation 属性
	>* 对 rotation 属性的 x 属性进行范围限制

5. 如果需要移动的话
	>* 根据 inertia 属性, 更新 cameraDirection 属性

6. 如果需要旋转的话
	>* 根据 inertia 属性, 更新 cameraRotation 属性


## getViewMatrix 主要用于计算返回 \_viewMatrix

&emsp;内部引用更新 \_referencePoint, \_cameraRotationMatrix , \_transformedReferencePoint, \_currentTarget, \_upVector, \_viewMatrix 属性

&emsp;引用外部 rotation, position 属性

1. \_referencePoint 属性赋值为 0, 0, 1

2. 根据 rotation 属性的 x, y, z 属性更新 \_cameraRotationMatrix 属性

3. 根据 \_referencePoint , \_cameraRotationMatrix 属性更新 \_transformedReferencePoint 属性

4. 根据 position 属性和 \_transformedReferencePoint 属性更新 \_currentTarget 属性

5. 根据 position , \_currentTarget , \_upVector 属性更新 \_viewMatrix 属性

