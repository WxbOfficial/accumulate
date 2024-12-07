# construction-1.md

&emsp;一份比较简单的代码说明，不是很规范，更多是模糊的感觉。
&emsp;适用版本 Babylon.js-1.0.8 到 Babylon.js-1.3.0

## engine

* createVertexBuffer
	>* gl.createBuffer
	>* gl.bindBuffer
	>* gl.bufferData

* createDynamicVertexBuffer
	>* gl.createBuffer
	>* gl.bindBuffer
	>* gl.bufferData

* updateDynamicVertexBuffer
	>* gl.bindBuffer
	>* gl.bufferSubData

* createIndexBuffer
	>* gl.createBuffer
	>* gl.bindBuffer
	>* gl.bufferData

* bindBuffers
	>* gl.bindBuffer
	>* effect.getAttribute
	>* gl.vertexAttribPointer

* createEffect
	>* \_compiledEffects
	>* new BABYLON.Effect

* compileShader
	>* gl.createShader
	>* gl.shaderSource
	>* gl.compileShader
	>* gl.getShaderParameter
	>* gl.getShaderInfoLog

* createShaderProgram
	>* gl.createProgram
	>* gl.attachShader
	>* gl.linkProgram
	>* gl.deleteShader

* getUniforms
	>* gl.getUniformLocation

* getAttributes
	>* gl.getAttribLocation

* enableEffect
	>* gl.useProgram
	>* gl.enableVertexAttribArray

* createTexture
	>* gl.createTexture
	>* gl.bindTexture
	>* gl.pixelStorei
	>* gl.texImage2D
	>* gl.texParameteri
	>* gl.generateMipmap

* bindSamplers
	>* gl.useProgram
	>* effect.getSamplers
	>* effect.getUniform
	>* gl.uniform1i

## Scene

### render

1. beforeRender
2. \_onBeforeRenderCallbacks
3. setTransformMatrix
4. \_animate
5. \_evaluateActiveMeshes
	>1. \_activeMeshes.push
	>2. \_processedMaterials.push
	>3. \_renderTargets.concat
	>4. \_transparentSubMeshes.push
	>5. \_alphaTestSubMeshes.push
	>6. \_opaqueSubMeshes.push
	>7. \_activeParticleSystems.push
	>8. particleSystem.animate
6. \_renderTargets.push(shadowGenerator.getShadowMap());
7. renderTarget.render
8. engine.restoreDefaultFramebuffer ; engine.clear
9. layer.render (Backgrounds)
10. \_localRender
	>1. submesh.render (opaqueSubMeshes)
	>2. submesh.render (alphaTestSubMeshes)
	>3. spriteManager.render
	>4. submesh.render (transparentSubMeshes)
	>5. particleSystem.render
11. layer.render Foregrounds
12. activeCamera.\_update
13. afterRender
14. dispose

## Effect

* defines , \_uniformsNames , \_samplers
* Tools.LoadFile
* \_prepareEffect

### \_prepareEffect

* \_program = engine.createShaderProgram
* \_uniforms = engine.getUniforms
* \_attributes = engine.getAttributes
* getUniform(清除不需要的 sampler)
* engine.bindSamplers

## Texture
```
BABYLON.BaseTexture
	├──BABYLON.CubeTexture: createCubeTexture
	├──BABYLON.Texture: createTexture
			├──BBABYLON.VideoTexture: createDynamicTexture
			├──BABYLON.DynamicTexture: createDynamicTexture
			├──BABYLON.RenderTargetTexture: createRenderTargetTexture
					├──BABYLON.MirrorTexture: createRenderTargetTexture
```

## Layer

### 渲染流程

1. new BABYLON.Layer
	>* new BABYLON.Texture
	>* scene.getEngine().createVertexBuffe
	>* scene.getEngine().createIndexBuffer
	>* scene.getEngine().createEffect
2. scene.render => layer.render
	>* engine.enableEffect
	>* effect.setTexture ; effect.setMatrix ; effect.setFloat4
	>* engine.bindBuffers
	>* engine.draw

## SpriteManager

### 渲染流程

1. new BABYLON.SpriteManager
	>* new BABYLON.Texture
	>* scene.getEngine().createDynamicVertexBuffer
	>* scene.getEngine().createIndexBuffer
	>* scene.getEngine().createEffect
	>* new BABYLON.Sprite ; sprite.playAnimation
2. scene.render => \_localRender => spriteManager.render
	>* sprite.\_animate
	>* appendSpriteVertex
	>* engine.updateDynamicVertexBuffer
	>* engine.enableEffect
	>* setTexture ; setMatrix ; setVector2 ; setFloat4 ; setColor3
	>* engine.bindBuffers
	>* effect.setBool ; engine.setColorWrite ; engine.draw
	>* engine.setAlphaMode ; engine.draw

## ParticleSystem

### 渲染流程

1. new BABYLON.ParticleSystem
	>* scene.getEngine().createDynamicVertexBuffer
	>* scene.getEngine().createIndexBuffer
	>* new BABYLON.Texture
	>* particleSystem.start
2. scene.render => \_evaluateActiveMeshes => \_activeParticleSystems.push ; particleSystem.animate
	>* \_getEffect: scene.getEngine().createEffect
	>* \_update
	>* appendParticleVertex ; engine.updateDynamicVertexBuffer
3. scene.render => \_localRender => particleSystem.render
	>* engine.enableEffect
	>* effect.setTexture ; effect.setMatrix ; effect.setFloat4 ; effect.setFloat4
	>* engine.bindBuffers
	>* engine.setAlphaMode ; engine.draw

## Mesh

### 渲染流程

## webgl 角度看通用的渲染大致流程

1. 创建 array buffer
	>* createBuffer(): 创建并初始化一个用于储存顶点数据或着色数据的 WebGLBuffer 对象
	>* bindBuffer(target, buffer):
		>>* target: 指定 Buffer 绑定点(目标); gl.ARRAY_BUFFER, 包含顶点属性的 Buffer, 如顶点坐标，纹理坐标数据或顶点颜色数据 ; gl.ELEMENT_ARRAY_BUFFER, 用于元素索引的 Buffer;
		>>* buffer: 要绑定的 WebGLBuffer, 如果是 null 的话, 表明解绑
	>* bufferData(target, size, usage):
	>* bufferData(target, srcData, usage):
		>>* target: 指定 Buffer 绑定点(目标) , 同上;
		>>* size: 设定 Buffer 对象的数据存储区大小
		>>* usage: 指定数据存储区的使用方法。可取以下值:
		>>>* gl.STATIC_DRAW: 缓冲区的内容可能经常使用，而不会经常更改。内容被写入缓冲区，但不被读取。
		>>>* gl.DYNAMIC_DRAW: 缓冲区的内容可能经常被使用，并且经常更改。内容被写入缓冲区，但不被读取。
		>>>* gl.STREAM_DRAW: 缓冲区的内容可能不会经常使用。内容被写入缓冲区，但不被读取。
		>>* srcData: 一个 ArrayBuffer ， SharedArrayBuffer 或者 ArrayBufferView 类型的数组对象，将被复制到 Buffer 的数据存储区。如果为 null ，数据存储区仍会被创建，但是不会进行初始化和定义。
	>* bindBuffer(target, null): 解绑

2. 创建 texture
	>* createTexture(): 一个可以被任何图像绑定的 WebGLTexture 目标
	>* bindTexture(target, texture);
		>>* target: 指定绑定点 (目标)。可能的值：
			>>>* gl.TEXTURE_2D: 二维纹理。
			>>>* gl.TEXTURE_CUBE_MAP: 立方体纹理。
			>>>* 当使用 WebGL 2 context 时，还可以使用以下值:
			>>>>* gl.TEXTURE_3D: 三维贴图。
			>>>>* gl.TEXTURE_2D_ARRAY: 二维数组贴图。
		>>* texture: 要绑定的 WebGLTexture 对象。
	>* [pixelStorei](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLRenderingContext/pixelStorei)(pname, param): 用于图像预处理的函数;
	>* [texImage2D](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLRenderingContext/texImage2D)(target, level, internalformat, format, type, pixels):指定了二维纹理图像。
		>>* target: 指定纹理的绑定对象。可能的值:
			>>>* gl.TEXTURE_2D: 二维纹理贴图。
			>>>* gl.TEXTURE_CUBE_MAP_POSITIVE_X: 立方体映射纹理的正 X 面。
			>>>* gl.TEXTURE_CUBE_MAP_NEGATIVE_X: 立方体映射纹理的负 X 面。
			>>>* gl.TEXTURE_CUBE_MAP_POSITIVE_Y: 立方体映射纹理的正 Y 面。
			>>>* gl.TEXTURE_CUBE_MAP_NEGATIVE_Y: 立方体映射纹理的负 Y 面。
			>>>* gl.TEXTURE_CUBE_MAP_POSITIVE_Z: 立方体映射纹理的正 Z 面。
			>>>* gl.TEXTURE_CUBE_MAP_NEGATIVE_Z: 立方体映射纹理的负 Z 面。
		>>* level: 指定详细级别。0 级是基本图像等级，n 级是第 n 个金字塔简化级。
		>>* internalformat: 指定纹理中的颜色组件
		>>* format: 指定 texel 数据格式
		>>* type: 指定 texel 数据的数据类型。可能的值
		>>* pixels: 下列对象之一可以用作纹理的像素源:
			>>>* ArrayBufferView, Uint8Array 如果 type 是 gl.UNSIGNED_BYTE则必须使用
			>>>* Uint16Array 如果 type 是 gl.UNSIGNED_SHORT_5_6_5, gl.UNSIGNED_SHORT_4_4_4_4, gl.UNSIGNED_SHORT_5_5_5_1, gl.UNSIGNED_SHORT 或ext.HALF_FLOAT_OES则必须使用
			>>>* Uint32Array 如果type 是 gl.UNSIGNED_INT 或ext.UNSIGNED_INT_24_8_WEBGL则必须使用
			>>>* Float32Array 如果type 是 gl.FLOAT则必须使用
			>>>* ImageData,
			>>>* HTMLImageElement,
			>>>* HTMLCanvasElement,
			>>>* HTMLVideoElement,
			>>>* ImageBitmap.
	>* [texParameteri](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLRenderingContext/texParameter)(target, pname, param): 用于设置纹理参数。
		>>* target: 同上
		>>* pname: 指定要设置的纹理参数
		>>* param: 已指定的 pname 参数的值。
	>* generateMipmap(target): 是用来与物体保持距离的。分辨率较高的 mipmap 用于距离较近的对象，分辨率较低的 mipmap 用于距离较远的对象。它从纹理图像的分辨率开始，并将分辨率减半，直到创建一个1x1维的纹理图像;
		>>* target: 同上

3. 创建 program
	>* createShader(type): 创建一个 WebGLShader 着色器对象
		>>* type: 参数为gl.VERTEX_SHADER 或 gl.FRAGMENT_SHADER两者中的一个。
	>* shaderSource(shader, source): 用于设置 WebGLShader 着色器（顶点着色器及片元着色器）的 GLSL 程序代码;
		>>* shader: 用于设置程序代码的 WebGLShader（着色器对象）。
		>>* source: 包含 GLSL 程序代码的字符串。
	>* compileShader(shader): 编译一个 GLSL 着色器，使其成为为二进制数据，然后就可以被 WebGLProgram 对象所使用。
		>>* shader: 一个片元或顶点着色器（WebGLShader）
	>* [getShaderParameter](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLRenderingContext/getShaderParameter)(shader, pname): 返回给定的着色器信息
		>>* shader: 需要获取信息的着色器对象
		>>* pname: 指定要查询的信息属性名称，值：
			>>>* gl.DELETE_STATUS:标示着色器是否被删除，删除（GL_TRUE）未删除（GL_FALSE）.
			>>>* gl.COMPILE_STATUS: 标示着色器是否编译成功，是（GL_TRUE）不是（GL_FALSE）
			>>>* gl.SHADER_TYPE: 标示着色器类型，是顶点着色器 (gl.VERTEX_SHADER) 还是片段着色器 (gl.FRAGMENT_SHADER)
	>* getShaderInfoLog(shader): 返回指定 WebGLShader 对象的信息日志，其中包含警告、调试和编译信息
		>>* shader: 要查询的 shader

	>* createProgram(): 创建和初始化一个 WebGLProgram 对象。
	>* attachShader(program, shader): 往 WebGLProgram 添加一个片段或者顶点着色器。
	>* linkProgram(program): 链接给定的WebGLProgram，从而完成为程序的片元和顶点着色器准备 GPU 代码的过程。
		>>* program: 一个用于链接的 WebGLProgram
	>* deleteShader(shader): 删除一个参数提供的 WebGLShader对象。如果该WebGLShader对象已经被删除，该方法不会有任何作用。
		>>* shader: 需要被删除的 WebGLShader 对象

4. 获取变量地址:
	>* getUniformLocation(program, name): 返回特定 uniform 变量的位置
		>>* program: 在其中定位指定的 uniform 变量的 WebGLProgram。
		>>* name:一个字符串，指定要返回其位置的 uniform 变量的名称。
	>* getAttribLocation(program, name): 返回给定 WebGLProgram 中 attribute 变量的位置。
		>>* program: 包含 attribute 变量的 WebGLProgram。
		>>* name: 一个字符串，指定要获取其位置的 attribute 变量的名称。

5. 绑定图片(如果有):
	>* useProgram(program): 将定义好的WebGLProgram 对象添加到当前的渲染状态中。
		>* program: 需要添加的WebGLProgram对象
	>* uniform\[1234\]\[fi\]\[v\](location, ...value): 指定了 uniform 变量的值
		>>* location: 包含了将要修改的 uniform 属性位置。
		>>* value: 新的值将被用于 uniform 变量。可能的类型：
			>>>* 浮点值 Number(方法名跟"f").
			>>>* 浮点数组 (例如 Float32Array 或 Array 的数组) 用于浮点型向量方法 (方法名跟 "fv").
			>>>* 整型值 Number (方法名跟"i").
			>>>* 整型数组Int32Array 用于整型向量方法 (方法名跟 "iv").

6. 激活顶点并设置 culling
	>* useProgram(program): 同 5
	>* enableVertexAttribArray(index): 打开属性数组列表中指定索引处的通用顶点属性数组。
		>>* index: 指向要激活的顶点属性。如果你只知道属性的名称，不知道索引，你可以使用以下方法来获取索引 getAttribLocation(program, name)
	>* cullFace(mode): 指定正面和/或背面多边形是否可以剔除。
		>>* mode: 指定适合进行剔除的面是正面还是背面。默认值是 gl.BACK. 可能的值有：
			>>>* gl.FRONT
			>>>* gl.BACK
			>>>* gl.FRONT_AND_BACK

	>* [enable](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLRenderingContext/enable)(cap): 为此上下文开启特定的 WebGL 功能。
	>* [disable](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/disable)(cap): 为此上下文禁用特定的 WebGL 功能。

7. 传入 uniform 变量
	>* uniformMatrix[234]fv(location, transpose, value): 为 uniform 变量指定了矩阵值
		>>* location: 包含了将要修改的 uniform 属性位置。
		>>* transpose: 指定是否转置矩阵。必须为 false。
		>>* value: 表示矩阵的数组。这些值被假定按列主序（column major order）的方式提供。
	>* uniform\[1234\]\[fi\]\[v\]: 同 5

	>* activeTexture(texture): 用来激活指定的纹理单元。
		>>* texture 需要激活的纹理单元。其值是 gl.TEXTUREI ，其中的 I 在 0 到 gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS - 1 范围内。
	>* bindTexture(target, texture): 同 2
	>* texParameteri(target, pname, param):  同 2

8. 绘制顶点
	>* bindBuffer(target, buffer): 同 1, 绑定顶点属性
	>* vertexAttribPointer(index, size, type, normalized, stride, offset): 绑定当前缓冲区范围到gl.ARRAY_BUFFER,成为当前顶点缓冲区对象的通用顶点属性并指定它的布局 (缓冲区对象中的偏移量)
		>>* index: 指定要修改的顶点属性的索引
		>>* size: 指定每个顶点属性的组成数量，必须是 1，2，3 或 4
		>>* type: 指定数组中每个元素的数据类型, 可能是
			>>>* gl.BYTE: 有符号的 8 位整数，范围 [-128, 127]
			>>>* gl.SHORT: 有符号的 16 位整数，范围 [-32768, 32767]
			>>>* gl.UNSIGNED_BYTE: 无符号的 8 位整数，范围 [0, 255]
			>>>* gl.UNSIGNED_SHORT: 无符号的 16 位整数，范围 [0, 65535]
			>>>* gl.FLOAT: 32 位 IEEE 标准的浮点数
			>>>* 使用 WebGL2 版本的还可以使用以下值：
				>>>>* gl.HALF_FLOAT: 16 位 IEEE 标准的浮点数
		>>* normalized: 当转换为浮点数时是否应该将整数数值归一化到特定的范围
			>>>* 对于类型 gl.BYTE 和 gl.SHORT ，如果是 true 则将值归一化为 [-1, 1]
			>>>* 对于类型 gl.UNSIGNED_BYTE 和 gl.UNSIGNED_SHORT ，如果是 true 则将值归一化为 [0, 1]
			>>>* 对于类型 gl.FLOAT 和 gl.HALF_FLOAT ，此参数无效
		>>* stride: 以字节为单位指定连续顶点属性开始之间的偏移量 (即数组中一行长度)。不能大于 255。如果 stride 为 0，则假定该属性是紧密打包的，即不交错属性，每个属性在一个单独的块中，下一个顶点的属性紧跟当前顶点之后。
		>>* offset: 指定顶点属性数组中第一部分的字节偏移量。必须是类型的字节长度的倍数。
	>* bindBuffer(target, buffer): 同 1, 绑定索引
	>* drawElements(mode, count, type, offset): 在 WebGL API 从数组数据渲染图元
		>>* mode: 指定要渲染的图元类型。可以是以下类型：
			>>>* gl.POINTS: 画单独的点。
			>>>* gl.LINE_STRIP: 画一条直线到下一个顶点。
			>>>* gl.LINE_LOOP: 绘制一条直线到下一个顶点，并将最后一个顶点返回到第一个顶点。
			>>>* gl.LINES: 在一对顶点之间画一条线。
			>>>* gl.TRIANGLE_STRIP
			>>>* gl.TRIANGLE_FAN
			>>>* gl.TRIANGLES: 为一组三个顶点绘制一个三角形。
		>>* count: 指定要渲染的元素数量。
		>>* type: 指定元素数组缓冲区中的值的类型。可能的值是：
			>>>* gl.UNSIGNED_BYTE
			>>>* gl.UNSIGNED_SHORT
			>>>* 当使用 OES_element_index_uint (en-US) 扩展时：
				>>>>* gl.UNSIGNED_INT
		>>* offset: 指定元素数组缓冲区中的偏移量。必须是给定类型大小的有效倍数。
