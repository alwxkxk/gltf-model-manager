import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {
  loadGLTF,
  localLoadSeparateGLTF,
  frameTargetView
} from '@/utils/threejs-utils.js'
import {
  generateFilesMap
} from '@/utils/utils.js'

import {
  message,
  Divider
} from 'antd'
import eventBus from '@/utils/event-bus'

import UploadBlock from './UploadBlock.js'
import RightBlock from './RightBlock.js'
import ViewInfo from './ViewInfo.js'
import './ModelScene.css'
import {
  gtReadGlb,
  gtReadGltf,
  gtReadSeparateGltf,
  gtWriteToSeparateGltf
} from '@/utils/gltf-transform-utils.js'

import { inspect } from '@gltf-transform/functions'
import InspectList from './InspectList.js'

function ModelScene (params) {
  const ref = useRef()
  const [viewInfo, setViewInfo] = useState({})
  const [scene, setScene] = useState()
  const [camera, setCamera] = useState()
  const [orbit, setOrbit] = useState()
  const [inspectObj, setInspectObj] = useState([])

  // const [cameraPositionInfo, setCameraPositionInfo] = useState()

  useEffect(() => {
    setScene(new THREE.Scene())
    scene.background = new THREE.Color('#ccc')
    setCamera(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000))
    const renderer = new THREE.WebGLRenderer()
    setOrbit(new OrbitControls(camera, renderer.domElement))

    // orbit.autoRotate = true
    // orbit.autoRotateSpeed = 2

    renderer.setSize(window.innerWidth / 2, window.innerHeight / 2)
    ref.current.appendChild(renderer.domElement)
    // 默认加载指定模型
    loadGLTF(scene, '/model/gltf-separate/computer.gltf').then(() => {
      setViewInfo(frameTargetView(scene, camera, orbit))
    })

    // // NOTE:临时测试
    // window.requestIdleCallback(() => {
    //   const obj = {}
    //   for (let index = 0; index < 10; index++) {
    //     obj[index] = Math.random()
    //   }
    //   eventBus.emit('file-change', [new File([JSON.stringify(obj)], 'test.json', { type: 'application/json' })])
    // })

    camera.position.z = 5
    orbit.update()
    let animationFrameFlag = null
    const animate = function () {
      animationFrameFlag = requestAnimationFrame(animate)
      orbit.update()
      // setCameraPositionInfo({ ...camera.position })
      eventBus.emit('3d-animate')
      renderer.render(scene, camera)
    }

    animate()
    return () => {
      // 释放资源
      cancelAnimationFrame(animationFrameFlag)
      renderer.domElement.remove()
    }
  }, []) // 任何变化都不会再触发调用，即只在第一次更新

  function uploadChange (event) {
    const target = event.target
    const files = target.files
    if (files.length === 1) {
      if (files[0].name.includes('.glb') || files[0].name.includes('.gltf')) {
        const url = window.URL.createObjectURL(files[0])

        loadGLTF(scene, url).then(() => {
          if (files[0].name.includes('.glb')) {
            gtReadGlb(files[0]).then(doc => {
              console.log('gtReadGlb', doc, doc.getRoot().listTextures())
              setInspectObj(inspect(doc))
              const fileListObj = gtWriteToSeparateGltf(doc)
              eventBus.emit('file-change', fileListObj)
            })
          } else if (files[0].name.includes('.gltf')) {
            // console.log('提示：单个gltf文件加载，如果是gltf separate文件会导致无法加载其它资源。')
            gtReadGltf(url).then(doc => {
              console.log('gtReadGltf', doc, doc.getRoot().listTextures())
              setInspectObj(inspect(doc))
            })
          }

          setViewInfo(frameTargetView(scene, camera, orbit))
          window.URL.revokeObjectURL(url)
        }).catch(err => {
          message.warn(err.message)
          window.URL.revokeObjectURL(url)
        })
      } else {
        message.warn('模型文件应为gltf/glb格式。')
      }
    } else {
      console.log('本地选择多文件：', files)
      generateFilesMap(files).then(obj => {
        // console.log('generateFilesMap', res)
        const filesUrlMap = obj.filesUrlMap
        const filesBufferMap = obj.filesBufferMap

        let rootFileUrl = null
        let errorMsg = null
        filesUrlMap.forEach((url, fileName) => {
          if (fileName.includes('.gltf')) {
            if (!rootFileUrl) {
              rootFileUrl = url
            } else {
              // 存在多个gltf文件
              errorMsg = '文件夹里不允许存在多个gltf文件'
            }
          }
        })

        if (!rootFileUrl) {
          errorMsg = '没找到gltf文件'
        }

        if (errorMsg) {
          message.warn(errorMsg)
          return Promise.reject(errorMsg)
        }

        const p1 = localLoadSeparateGLTF(scene, rootFileUrl, filesUrlMap)

        const p2 = gtReadSeparateGltf(rootFileUrl, filesBufferMap).then(doc => {
          console.log('gtReadSeparateGltf', doc, doc.getRoot().listTextures())
          setInspectObj(inspect(doc))
        })

        Promise.all([p1, p2]).then(() => {
          setViewInfo(frameTargetView(scene, camera, orbit))

          // 释放资源
          filesUrlMap.forEach(url => {
            window.URL.revokeObjectURL(url)
          })
          filesUrlMap.clear()
          filesBufferMap.clear()
        })
      })
    }
  }

  return (

    <div>
      <div className="flex">
        <div className="flex-1">
          <UploadBlock uploadChange={uploadChange} />
          <Divider />
          <ViewInfo viewInfo={viewInfo} />
        </div>

        {/* 中间插入3D场景 */}
        <div ref={ref} className="flex-1"></div>
        <RightBlock scene={scene} />
      </div>

      <InspectList data={inspectObj}/>

    </div>

  )
}

export default ModelScene
