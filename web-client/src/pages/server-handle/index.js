import { useState, useEffect } from 'react'
import eventBus from '@/utils/event-bus'
import { Button } from 'antd'

function ServerHandle (params) {
  const [fileNameList, setFileNameList] = useState([])
  const [files, setFiles] = useState([])
  const [ws, setWs] = useState({})

  const uploadHandle = () => {
    // 建立 websocket。
    console.log('uploadHandle files', files)
    // TODO:先检测文件是否超出最大 大小。

    Array.from(files).forEach(file => {
      window.requestIdleCallback(() => {
        ws.send(JSON.stringify({ type: 'fileName', value: file.name }))
        file.arrayBuffer().then(buf => {
          ws.send(buf)
        })
      })
    })
  }

  // 只初始化一次
  useEffect(() => {
    const ws = new WebSocket(`${process.env.REACT_APP_WS_URL}/file`)
    setWs(ws)
    const changeFile = (files) => {
      console.log('ServerHandle changeFile', files)
      const fileNameList = Array.from(files).map(file => {
        return file.name
      })
      setFiles(files)
      setFileNameList(fileNameList)
    }

    eventBus.on('file-change', changeFile)

    return () => {
      eventBus.off('file-change', changeFile)
    }
  }, [])

  return (
    <div>
      <div>文件名：{fileNameList}</div>
      <Button type="primary" onClick={uploadHandle}>开始上传</Button>
    </div>
  )
}

export default ServerHandle
