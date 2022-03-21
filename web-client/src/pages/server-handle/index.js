import { useState, useEffect } from 'react'
import eventBus from '@/utils/event-bus'
import { Button } from 'antd'
import { uploadFile } from '@/apis/file'
import GreetTest from '@/components/GreetTest'

function ServerHandle (params) {
  const [fileNameList, setFileNameList] = useState([])
  const [files, setFiles] = useState([])

  const uploadHandle = () => {
    // 建立 websocket。
    console.log('uploadHandle files', files)
    Array.from(files).forEach(file => {
      uploadFile(file)
    })
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
      <GreetTest></GreetTest>
    </div>
  )
}

export default ServerHandle
