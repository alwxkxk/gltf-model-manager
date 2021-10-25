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

import { message } from 'antd'
import eventBus from '@/utils/event-bus'

import UploadBlock from './UploadBlock.js'
import RightBlock from './RightBlock.js'
import ViewInfo from './ViewInfo.js'
import './ModelScene.css'
import {
  gtReadGlb,
  gtReadGltf,
  gtReadSeparateGltf
} from '@/utils/gltf-transform-utils.js'

function ModelScene (params) {
  const ref = useRef()
  const [viewInfo, setViewInfo] = useState({})
  const [scene, setScene] = useState()
  const [camera, setCamera] = useState()
  const [orbit, setOrbit] = useState()
  // const [cameraPositionInfo, setCameraPositionInfo] = useState()

  useEffect(() => {
    const scene = new THREE.Scene()
    setScene(scene)
    scene.background = new THREE.Color('#ccc')
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    setCamera(camera)
    const renderer = new THREE.WebGLRenderer()
    const orbit = new OrbitControls(camera, renderer.domElement)
    setOrbit(orbit)

    // orbit.autoRotate = true
    // orbit.autoRotateSpeed = 2

    renderer.setSize(window.innerWidth / 2, window.innerHeight / 2)
    ref.current.appendChild(renderer.domElement)

    loadGLTF(scene, '/model/gltf-separate/computer.gltf').then(() => {
      const viewInfo = frameTargetView(scene, camera, orbit)
      setViewInfo(viewInfo)
    })

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
            })
          } else if (files[0].name.includes('.gltf')) {
            // console.log('提示：单个gltf文件加载，如果是gltf separate文件会导致无法加载其它资源。')
            gtReadGltf(url).then(doc => {
              console.log('gtReadGltf', doc, doc.getRoot().listTextures())
            })
          }

          const viewInfo = frameTargetView(scene, camera, orbit)
          setViewInfo(viewInfo)
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
        })

        Promise.all([p1, p2]).then(() => {
          const viewInfo = frameTargetView(scene, camera, orbit)
          setViewInfo(viewInfo)

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

    <div className="flex">
      <div className="flex-1">
        <UploadBlock uploadChange={uploadChange} />
        <ViewInfo viewInfo={viewInfo} />
      </div>

      {/* 中间插入3D场景 */}
      <div ref={ref} className="flex-1"></div>
      <RightBlock scene={scene} />
    </div>
  )
}

export default ModelScene
