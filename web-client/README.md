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
- 上传后端处理，websocket返回处理进度，返回处理后的文件信息，提示hash值以及是否有冲突的图片。

