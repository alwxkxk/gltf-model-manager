import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/**
 * 清除场景里所有物体
 * @param  {THREE.Scene} scene
 */
export function clearScene (scene) {
  let children = [...scene.children]
  children.forEach(c => {
    scene.remove(c)
  })
  children = null
  return scene
}

/**
 * 加载单个glb文件模型
 * @param  {THREE.Scene} scene
 * @param  {} url
 */
export function loadGlb (scene, url) {
  const loader = new GLTFLoader()
  return new Promise((resolve, reject) => {
    loader.load(url, function (gltf) {
      clearScene(scene)
      // console.log('load gltf file:', gltf)

      scene.add(gltf.scene)
      // TODO: 调整灯光
      const light = new THREE.HemisphereLight(0xffffff, 0xcccccc, 1)
      scene.add(light)
      resolve()
    })
  })
}

/**
 * 设置视野对准目标
 * @param  {} target
 * @param  {THREE.Camera} camera
 * @param  {} orbit
 */
export function frameTargetView (target, camera, orbit) {
  const box = new THREE.Box3()
  const sphere = new THREE.Sphere()
  const center = new THREE.Vector3()
  const delta = new THREE.Vector3(1, 1, 1)

  box.setFromObject(target)
  const distance = box.getBoundingSphere(sphere).radius
  box.getCenter(center)
  delta.multiplyScalar(distance)
  const endPosition = center.add(delta)
  camera.position.copy(endPosition)
  if (orbit) {
    orbit.target.copy(target.position)
    orbit.update()
  }

  return {
    distance: distance,
    box: box,
    center: center
  }
}
