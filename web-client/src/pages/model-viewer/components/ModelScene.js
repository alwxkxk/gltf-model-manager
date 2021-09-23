import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {
  loadGlb
} from '../../../utils/threejs-utils.js'

import './ModelScene.css'

function ModelScene (params) {
  const ref = useRef()
  const scene = new THREE.Scene()
  // TODO:背景色可调整
  scene.background = new THREE.Color('#ccc')
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

  const renderer = new THREE.WebGLRenderer()
  useEffect(() => {
    renderer.setSize(window.innerWidth / 2, window.innerHeight / 2)
    ref.current.appendChild(renderer.domElement)
    renderer.domElement.style = 'margin:auto;'

    const orbit = new OrbitControls(camera, renderer.domElement)
    orbit.autoRotate = true
    orbit.autoRotateSpeed = 2

    loadGlb(scene, '/model/computer.glb')

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
    }
  })

  function uploadChange (event) {
    const target = event.target
    const files = target.files
    if (files.length === 1) {
      // TODO:URL.revokeObjectURL()释放资源
      const url = window.URL.createObjectURL(files[0])
      console.log('change to url', url)

      if (files[0].name.includes('.glb')) {
        loadGlb(scene, url)
      } else {
        console.warn('单个模型文件应为glb格式。')
      }
      // TODO: 支持gltf多文件
    }
    console.log('uploadChange', target, files)
  }

  return (

    <div ref={ref} className="flex">
      {/* TODO：研究选择gltf多个文件的问题,.bin,png，jpg等等 */}
      <div className="upload-container">
        <div>PS：只支持gltf/glb文件</div>
        <input type="file" multiple onChange={uploadChange}></input>
      </div>
    </div>
  )
}

export default ModelScene
