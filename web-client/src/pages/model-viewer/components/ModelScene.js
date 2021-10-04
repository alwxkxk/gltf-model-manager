import { useEffect, useRef } from 'react'
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
  const scene = new THREE.Scene()
  // TODO:背景色可调整
  scene.background = new THREE.Color('#ccc')
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  const renderer = new THREE.WebGLRenderer()
  const orbit = new OrbitControls(camera, renderer.domElement)

  orbit.autoRotate = true
  orbit.autoRotateSpeed = 2

  useEffect(() => {
    renderer.setSize(window.innerWidth / 2, window.innerHeight / 2)
    ref.current.appendChild(renderer.domElement)
    renderer.domElement.style = 'margin:auto;'

    loadGlb(scene, '/model/computer.glb').then(() => {
      frameTargetView(scene, camera, orbit)
    })

    camera.position.z = 5
    orbit.update()
    let animationFrameFlag = null
    const animate = function () {
      animationFrameFlag = requestAnimationFrame(animate)
      orbit.update()

      renderer.render(scene, camera)
    }

    animate()
    return () => {
      // TODO：释放资源
      cancelAnimationFrame(animationFrameFlag)
      renderer.domElement.remove()
    }
  })

  function uploadChange (event) {
    const target = event.target
    const files = target.files
    if (files.length === 1) {
      // TODO:URL.revokeObjectURL()释放资源
      const url = window.URL.createObjectURL(files[0])
      // console.log('change to url', url)

      if (files[0].name.includes('.glb')) {
        loadGlb(scene, url).then(() => {
          frameTargetView(scene, camera, orbit)
          window.URL.revokeObjectURL(url)
        })
      } else {
        message.warn('单个模型文件应为glb格式。')
      }
      // TODO: 支持gltf多文件
    }
    console.log('uploadChange', target, files)
  }

  return (

    <div className="flex">
      <LeftBlock uploadChange={uploadChange} />
      {/* 中间插入3D场景 */}
      <div ref={ref} className="flex-1"></div>
      <RightBlock/>
    </div>
  )
}

export default ModelScene
