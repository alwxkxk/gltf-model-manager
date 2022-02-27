

## 开发说明
- 本项目使用lombok，开发时IDE需要安装对应插件。
- 数据库：MySQL 8
- java版本： openjdk 17
- 配置信息在 `resources/application.properties`

## 业务逻辑
- 前端选择上传模型文件（glb/gltf），通过websocket。
- 后端将上传的文件放到临时文件夹进行处理，解析拆成分离型的gltf文件。处理期间通过websocket与前端保持通信，实时返回处理信息与进度。
- 拆分后计算模型与纹理图片的hash，与正式保存的文件的hash对比，看是否存在模型重复，图片纹理重复。
- 返回前端拆解后的文件，以及引用重复的文件，加载显示进行两者对比，最终若重复的一致就确认保存使用重复的以提升加载性能，若不一致就确认保存使用原始的文件。

### 数据表设计

### file
用于存放正式文件的表信息。
- id 生成的uuid
- model_id 对应的模型id
- name 文件名称，含相对路径与后缀名
- hash 文件哈希值
- download_num 下载次数
- created_time 创建时间
- last_download_time 最后的下载时间：用于区分是否存在太久没下载的僵尸文件
### model
- id 生成的uuid
- name 模型名称
- path 文件路径
- upload_user 上传用户
- created_time 创建时间

### 其它说明
- 纹理图片还做处理优化，以及生成小尺寸的文件。