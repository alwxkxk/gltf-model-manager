
import { useState } from 'react'
// import eventBus from '@/utils/event-bus'

/**
 * @param  {Function} params.uploadChange 选择文件后的触发函数
 */
function LeftBlock (params) {
  const [fileNameList, setFileNameList] = useState([])
  const [fileSize, setFileSize] = useState(0)

  function uploadChangeWrap (event) {
    // 读取文件信息
    const target = event.target
    const files = target.files
    let fileSizeTemp = 0
    const fileNameListTemp = Array.from(files).map(file => {
      fileSizeTemp += file.size
      return file.name
    })
    setFileNameList(fileNameListTemp)
    setFileSize(fileSizeTemp)
    // eventBus.emit('file-change', files)

    if (params.uploadChange) {
      params.uploadChange(event)
    }
  }
  // console.log('uploadChangeWrap', uploadChangeWrap)
  return (
    <div>
      <div className="upload-container">
        <div>上传单个gltf/glb文件：</div>
        <input type="file" onChange={uploadChangeWrap}></input>
        <div>上传gltf separate，选择文件夹：</div>
        <input type="file" webkitdirectory="true" directory="true" multiple onChange={uploadChangeWrap}></input>

        {
          fileNameList.length > 0 &&
          <div>文件名：{fileNameList.join(',')}</div>
        }
        {
          fileSize !== 0 &&
          <div>文件大小：{(fileSize / 1024).toFixed(0) } KB</div>
        }

      </div>
    </div>
  )
}

export default LeftBlock
