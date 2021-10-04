// import './LeftBlock.css'

import { useState } from 'react'

/**
 * @param  {Function} params.uploadChange 选择文件后的触发函数
 */
function LeftBlock (params) {
  const [fileNameList, setFileNameList] = useState([])
  const [fileSize, setfileSize] = useState(0)
  function uploadChangeWrap (event) {
    // 读取文件信息
    const target = event.target
    const files = target.files
    console.log('uploadChangeWrap', event, files)
    let fileSize = 0
    const fileNameList = Array.from(files).map(file => {
      fileSize += file.size
      return file.name
    })
    setFileNameList(fileNameList)
    setfileSize(fileSize)

    if (params.uploadChange) {
      params.uploadChange(event)
    }
  }
  return (
    <div className="flex-1">
      <div className="upload-container">
        {/* <div>PS：只支持gltf/glb文件</div> */}
        <input type="file" multiple onChange={uploadChangeWrap}></input>
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
