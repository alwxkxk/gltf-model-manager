import { useEffect, useRef } from 'react'
import * as THREE from 'three'

function ModelScene (params) {
  const ref = useRef()
  useEffect(() => {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth / 2, window.innerHeight / 2)
    // document.body.appendChild( renderer.domElement );
    // console.log('renderer.domElement',renderer.domElement)
    ref.current.appendChild(renderer.domElement)
    renderer.domElement.style = 'margin:auto;'

    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)

    camera.position.z = 5
    let animationFrameFlag = null
    const animate = function () {
      animationFrameFlag = requestAnimationFrame(animate)

      cube.rotation.x += 0.01
      cube.rotation.y += 0.01

      renderer.render(scene, camera)
    }

    animate()
    return () => {
      // TODO：释放资源
      cancelAnimationFrame(animationFrameFlag)
    }
  })

  return (
    <div ref={ref} className="flex"/>
  )
}

export default ModelScene
