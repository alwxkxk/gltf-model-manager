import { useState, useEffect } from 'react'
import eventBus from '@/utils/event-bus'
import { Button } from 'antd'
import { uploadFile } from '@/apis/file'
import GreetTest from '@/components/GreetTest'

function ServerHandle (params) {
  const [fileNameList, setFileNameList] = useState([])
  const [filesObj, setFilesObj] = useState([])

  const uploadHandle = () => {
    console.log('uploadHandle files', filesObj)
    // Array.from(files).forEach(file => {
    //   uploadFile(file)
    // })
    // TODO: 用uuid作为临时文件名
    const tempDirName = String((new Date()).getTime())
    // 利用promise 依次上传
    let p = Promise.resolve()
    Object.keys(filesObj).forEach(key => {
      p = p.then(() => {
        console.log('开始上传', key)
        return uploadFile(filesObj[key], { fileName: key, dirName: tempDirName })
      })
    })
    p = p.then(() => {
      console.log('所有文件上传成功')
    }).catch(err => {
      console.warn('文件上传失败', err)
    })
  }

  // 只初始化一次
  useEffect(() => {
    const changeFile = (fileListObj) => {
      console.log('ServerHandle changeFile', fileListObj)
      const fileNameList = []
      Object.keys(fileListObj).forEach(key => {
        fileNameList.push(key)
      })

      setFilesObj(fileListObj)
      setFileNameList(fileNameList)
    }

    eventBus.on('file-change', changeFile)

    return () => {
      eventBus.off('file-change', changeFile)
    }
  }, [])

  return (
    <div>
      <div>文件名：{fileNameList.join(',')}</div>
      <Button type="primary" onClick={uploadHandle}>开始上传</Button>
      <GreetTest></GreetTest>
    </div>
  )
}

export default ServerHandle
