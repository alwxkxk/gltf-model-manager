import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {
  loadGlb,
  frameTargetView
} from '../../../utils/threejs-utils.js'
import { message } from 'antd'

import LeftBlock from './LeftBlock.js'
import RightBlock from './RightBlock.js'

import './ModelScene.css'

function ModelScene (params) {
  const ref = useRef()
  const [viewInfo, setViewInfo] = useState({})
  const [scene, setScene] = useState()
  const [camera, setCamera] = useState()
  const [orbit, setOrbit] = useState()
  const [cameraPositionInfo, setCameraPositionInfo] = useState()

  useEffect(() => {
    const scene = new THREE.Scene()
    setScene(scene)
    // TODO:背景色可调整
    scene.background = new THREE.Color('#ccc')
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    setCamera(camera)
    const renderer = new THREE.WebGLRenderer()
    const orbit = new OrbitControls(camera, renderer.domElement)
    setOrbit(orbit)

    orbit.autoRotate = true
    orbit.autoRotateSpeed = 2

    renderer.setSize(window.innerWidth / 2, window.innerHeight / 2)
    ref.current.appendChild(renderer.domElement)

    loadGlb(scene, '/model/computer.glb').then(() => {
      const viewInfo = frameTargetView(scene, camera, orbit)
      setViewInfo(viewInfo)
    })

    camera.position.z = 5
    orbit.update()
    let animationFrameFlag = null
    const animate = function () {
      animationFrameFlag = requestAnimationFrame(animate)
      orbit.update()
      setCameraPositionInfo({ ...camera.position })
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
      const url = window.URL.createObjectURL(files[0])
      // console.log('change to url', url)

      if (files[0].name.includes('.glb')) {
        loadGlb(scene, url).then(() => {
          // frameTargetView(scene, camera, orbit)
          window.URL.revokeObjectURL(url)
          const viewInfo = frameTargetView(scene, camera, orbit)
          setViewInfo(viewInfo)
        })
      } else {
        message.warn('单个模型文件应为glb格式。')
      }
      // TODO: 支持gltf多文件
    }
    // console.log('uploadChange', target, files)
  }

  return (

    <div className="flex">
      <LeftBlock uploadChange={uploadChange} viewInfo={viewInfo} cameraPositionInfo={cameraPositionInfo}/>
      {/* 中间插入3D场景 */}
      <div ref={ref} className="flex-1"></div>
      <RightBlock/>
    </div>
  )
}

export default ModelScene
