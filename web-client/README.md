## 简述
[gltf文件](https://www.khronos.org/registry/glTF/specs/2.0/glTF-2.0.html)管理的前端界面。
## 技术选型
- 前端框架：[React](https://react.docschina.org/docs/getting-started.html)
- UI库：[antd](https://ant.design/components/message-cn/)
- 颜色选择器：[react-color](https://casesandberg.github.io/react-color/#api)
- 3D库：[three.js](https://threejs.org/)
- [gltf-transform](https://gltf-transform.donmccurdy.com/)
## 类似参考
- [three-gltf-viewer](https://github.com/donmccurdy/three-gltf-viewer)

## 业务逻辑
- 网页选择glb/gltf模型后，显示模型相关信息。
- 若上传文件不是separate模式，则拆解成gltf separate模式，然后上传至后端。
- 前端计算各个文件的hash值，向后端询问，看是否有重复的。有重复的话说明有可能会被前端的其它图片缓存替换掉导致异常，要做修改（边缘加一点随机色），促使其hash值变化。
- 从后端加载显示，分析其显示性能。



