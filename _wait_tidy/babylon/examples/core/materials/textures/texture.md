# 简介
&emsp; 汇总说明 babylon 中，有文档支持的常用纹理的简单信息。

* **Texture**: 最基本的纹理，可传入 jpg\jpeg\png\webp\basis\dds 单张图

* **CubeTexture**: 立方体纹理，传入 jpg\png 六张图、有六张图信息的 dds 、babylon 自定义的 env

&emsp; 文档: https://doc.babylonjs.com/features/featuresDeepDive/environment/skybox

&emsp; 案例: https://playground.babylonjs.com/#UU7RQ#1

* **HDRCubeTexture**: 这表示来自 HDR 输入的纹理。目前唯一支持的格式是以 RGBE 格式存储的全景图片。

* **DynamicTexture**: 动态纹理，将一个 canvas 作为纹理，对 canvas 进行操作以起到动态的效果

* **VideoTexture**: 视频纹理，将视频作为纹理进行播放。可传入 mp4 单个视频

&emsp; 文档: https://doc.babylonjs.com/features/featuresDeepDive/materials/using/videoTexture

&emsp; 案例: https://playground.babylonjs.com/#ZMCFYA#83

* **HtmlElementTexture**: 使用已经存在的元素(Canvas 或 Video)作为纹理的最小工作负载。可视作是一个廉价的 VideoTexture 或 DynamicTexture


* **MirrorTexture**: RenderTargetTexture 子类，充当平面镜像的动态反射呈现环境映射。

&emsp; 文档: https://doc.babylonjs.com/features/featuresDeepDive/materials/using/reflectionTexture#mirrortexture

&emsp; 案例: https://playground.babylonjs.com/#1YAIO7#5

* **RefractionTexture**: RenderTargetTexture 的子类，类似于 MirrorTexture，但是设计用于折射而不是反射。(抄文档的，个人还是不大懂)

&emsp; 文档: https://doc.babylonjs.com/features/featuresDeepDive/materials/using/reflectionTexture#refractiontexture

&emsp; 案例: https://playground.babylonjs.com/#22KZUW#15


* **ProceduralTexture**: 可编程纹理，可直接传入 url 使用 Texture 纹理接收图片信息(不过使用绝对路径的话，会出问题，需要修改一下)

&emsp; 文档: https://doc.babylonjs.com/features/featuresDeepDive/materials/advanced/custom_procedural_textures


<!-- * **RawCubeTexture**: 待完善 -->

* **RawTexture**: 原始纹理(不大懂)

&emsp; 文档: https://doc.babylonjs.com/features/featuresDeepDive/materials/advanced/rawTexture

<!-- * **RawTexture3d**: 待完善 -->

<!-- * **RawTexture2DArray**: 待完善 -->