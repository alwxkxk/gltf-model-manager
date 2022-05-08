import { useState, useEffect } from 'react'
import eventBus from '@/utils/event-bus'
import { Button, Table } from 'antd'
import { uploadFile } from '@/apis/file'
import GreetTest from '@/components/GreetTest'
import jsSHA from 'jssha'
import HashWorker from '@/utils/worker/hash.worker.js'
import { v4 as uuidv4 } from 'uuid'
const filesHashColumns = [
  {
    title: 'name',
    dataIndex: 'name'
  },
  {
    title: 'hash',
    dataIndex: 'hash'
  },
  {
    title: 'hash碰撞', // 是否有hash碰撞
    dataIndex: 'hashCollision'
  }
]

function ServerHandle (params) {
  const [filesObj, setFilesObj] = useState([])
  const [filesHashObj, setFilesHashObj] = useState({})
  const [filesHashDataArr, setFilesHashDataArr] = useState([])

  const uploadHandle = () => {
    console.log('uploadHandle files', filesObj, filesHashObj)

    // TODO: 用uuid作为临时文件名
    const tempDirName = uuidv4()
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
      if (window.Worker) {
        const hashWorker = new HashWorker()
        hashWorker.onmessage = function (messageEvent) {
          // console.log('worker receive:', event)
          setFilesHashObj(messageEvent.data)
          const arr = []
          Object.keys(messageEvent.data).forEach((key, index) => {
            arr.push({ key: index + key, name: key, hash: messageEvent.data[key], hashCollision: false })
          })
          setFilesHashDataArr(arr)
        }
        hashWorker.postMessage(fileListObj)
      } else {
        console.warn('不支持worker，导致hash计算由主线程计算')
        const pList = []
        const hashObj = {}

        Object.keys(fileListObj).forEach(key => {
          console.time(key + ' hash')
          const p = fileListObj[key].arrayBuffer().then(arrayBuf => {
            // eslint-disable-next-line new-cap
            const shaObj = new jsSHA('SHA-256', 'ARRAYBUFFER')
            shaObj.update(arrayBuf)
            hashObj[key] = shaObj.getHash('HEX')
            console.timeEnd(key + ' hash')
          })
          pList.push(p)
        })
        Promise.all(pList).then(() => {
          postMessage(hashObj)
          const arr = []
          Object.keys(hashObj).forEach((key, index) => {
            setFilesHashObj(hashObj)
            arr.push({ key: index + key, name: key, hash: hashObj[key], hashCollision: false })
          })
          setFilesHashDataArr(arr)
        })
      }

      setFilesObj(fileListObj)
    }

    eventBus.on('file-change', changeFile)

    return () => {
      eventBus.off('file-change', changeFile)
    }
  }, [])

  return (
    <div>
      <Button type="primary" onClick={uploadHandle}>开始上传</Button>
      <GreetTest></GreetTest>
      <div className="pl-10">各文件及hash值 </div>
      <Table columns={filesHashColumns} dataSource={filesHashDataArr} />
    </div>
  )
}

export default ServerHandle
