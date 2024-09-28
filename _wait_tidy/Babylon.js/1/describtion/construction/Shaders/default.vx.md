# default.vertex.fx


## 简介流程

1. define REFLECTION 纹理 mode 类型: MAP_EXPLICIT , MAP_SPHERICAL , MAP_PLANAR , MAP_CUBIC , MAP_PROJECTION , MAP_SKYBOX

2. 传入属性 position , normal , uv , uv2 , color

3. mvp 矩阵相关: world , view , worldViewProjection

4. 各个纹理贴图:
	>* DIFFUSE: vUv , matrix , infos
	>* AMBIENT: vUv , matrix , infos
	>* OPACITY: vUv , matrix , infos
	>* REFLECTION: vEyePosition , vUv , matrix , infos ,
	>* EMISSIVE: vUv , matrix , infos
	>* SPECULAR: vUv , matrix , infos
	>* BUMP: vUv , matrix , infos

5. varying 差值输出:
	>* vPositionW , vNormalW , vColor
	>* CLIPPLANE: vClipPlane , fClipDistance;
	>* FOG: fFogDistance
	>* SHADOWS: lightMatrix , vPositionFromLight

6. REFLECTION: computeReflectionCoords

7. main
	>* 赋值 gl_Position

	>* varying 差值输出:
		>>* 赋值 vPositionW , vNormalW
		>>* 赋值各个纹理 vUv
			>>>* vDiffuseUV
			>>>* vAmbientUV
			>>>* vOpacityUV
			>>>* vReflectionUVW
			>>>* vEmissiveUV
			>>>* vSpecularUV
			>>>* vBumpUV
		>>* 赋值 fClipDistance
		>>* 赋值 fFogDistance
		>>* 赋值灯光 vPositionFromLight0 , vPositionFromLight1 , vPositionFromLight2 , vPositionFromLight3
		>>* 赋值 vColor


## 参数类型

1. attribute 输入 vec3 position , vec3 normal , vec2 uv , vec2 uv2 , vec3 color

2. uniform 输入
	>* mvp 矩阵: mat4 world, mat4 view, mat4 worldViewProjection
	>* 纹理信息:
		>>* DIFFUSE: mat4 diffuseMatrix , vec2 vDiffuseInfos
		>>* AMBIENT: mat4 ambientMatrix , vec2 vAmbientInfos
		>>* OPACITY: mat4 opacityMatrix , vec2 vOpacityInfos
		>>* REFLECTION: mat4 reflectionMatrix , vec3 vReflectionInfos , vec3 vEyePosition
		>>* EMISSIVE: mat4 emissiveMatrix , vec2 vEmissiveInfos
		>>* SPECULAR: mat4 specularMatrix , vec2 vSpecularInfos
		>>* BUMP: mat4 bumpMatrix , vec2 vBumpInfos
	>* CLIPPLANE: vec4 vClipPlane
	>* 光照阴影: mat4 lightMatrix

3. varying 传输:
	>* 纹理 uv:
		>>* DIFFUSE: vec2 vDiffuseUV
		>>* AMBIENT: vec2 vAmbientUV
		>>* OPACITY: vec2 vOpacityUV
		>>* REFLECTION: vec3 vReflectionUVW
		>>* EMISSIVE: vec2 vEmissiveUV
		>>* SPECULAR: vec2 vSpecularUV
		>>* BUMP: vec2 vBumpUV
	>* attribute 属性: vec3 vPositionW, vec3 vNormalW, vec3 vColor
	>* CLIPPLANE: float fClipDistance
	>* FOG: float fFogDistance
	>* 光照阴影: vec4 vPositionFromLight

4. 方法:
	>* REFLECTION computeReflectionCoords

