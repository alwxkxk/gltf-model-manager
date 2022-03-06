import { useState, useEffect } from 'react'
import eventBus from '@/utils/event-bus'
import { Button } from 'antd'

function ServerHandle (params) {
  const [fileNameList, setFileNameList] = useState([])
  const [files, setFiles] = useState([])

  const uploadHandle = () => {
    // TODO: 建立 websocket。
    console.log('uploadHandle files', files)
    const ws = new WebSocket(`${process.env.REACT_APP_WS_URL}/file`)
    ws.onopen = () => {
      ws.send(JSON.stringify({ number: files.length }))
      files.forEach(file => {
        window.requestIdleCallback(() => {
          file.arrayBuffer().then(buf => {
            ws.send(buf)
          })
        })
      })

      const blob = new Blob([JSON.stringify({ test: 123 })], { type: 'application/octet-stream' })
      ws.send(blob)
    }
  }

  // 只初始化一次
  useEffect(() => {
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
