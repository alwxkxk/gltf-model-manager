import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export function clearScene (scene) {
  let children = [...scene.children]
  children.forEach(c => {
    scene.remove(c)
  })
  children = null
  return scene
}

export function loadGlb (scene, url) {
  const loader = new GLTFLoader()
  loader.load(url, function (gltf) {
    clearScene(scene)
    console.log('load gltf file:', gltf)
    // TODO: 调整位置

    scene.add(gltf.scene)
    // TODO: 调整灯光
    const light = new THREE.HemisphereLight(0xffffff, 0xcccccc, 1)
    scene.add(light)
  })
}
