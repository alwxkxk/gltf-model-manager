// import './LeftBlock.css'

import { useState } from 'react'

/**
 * @param  {Function} params.uploadChange 选择文件后的触发函数
 * @param  {Object} params.viewInfo 场景信息
 * @param  {Object} params.cameraPositionInfo 摄像头位置信息
 */
function LeftBlock (params) {
  const [fileNameList, setFileNameList] = useState([])
  const [fileSize, setFileSize] = useState(0)

  let boxInfo = null
  let cameraPositionInfo = null

  if (params.viewInfo && params.viewInfo.box) {
    boxInfo = params.viewInfo.box
  }

  if (params.cameraPositionInfo) {
    cameraPositionInfo = params.cameraPositionInfo
  }
  function uploadChangeWrap (event) {
    // 读取文件信息
    const target = event.target
    const files = target.files
    // console.log('uploadChangeWrap', event, files)
    let fileSize = 0
    const fileNameList = Array.from(files).map(file => {
      fileSize += file.size
      return file.name
    })
    setFileNameList(fileNameList)
    setFileSize(fileSize)

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
        {
          boxInfo &&
          <div>
            <div>当前模型尺寸</div>
            <div>X：{(boxInfo.max.x - boxInfo.min.x).toFixed(3)}({(boxInfo.min.x).toFixed(3)}~{(boxInfo.max.x).toFixed(3)})</div>
            <div>Y：{(boxInfo.max.y - boxInfo.min.y).toFixed(3)}({(boxInfo.min.y).toFixed(3)}~{(boxInfo.max.y).toFixed(3)})</div>
            <div>Z：{(boxInfo.max.z - boxInfo.min.z).toFixed(3)}({(boxInfo.min.z).toFixed(3)}~{(boxInfo.max.z).toFixed(3)})</div>
          </div>

        }

      {
          cameraPositionInfo &&
          <div>
            <div>当前摄像头位置</div>
            <div>X：{cameraPositionInfo.x.toFixed(3)}</div>
            <div>Y：{cameraPositionInfo.y.toFixed(3)}</div>
            <div>Z：{cameraPositionInfo.z.toFixed(3)}</div>
          </div>

        }

      </div>
    </div>
  )
}

export default LeftBlock
