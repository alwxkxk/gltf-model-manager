import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { LoadingManager } from 'three'

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

class CustomLoadingManager extends LoadingManager {
  constructor (manager) {
    super(manager)
    // console.log('CustomLoadingManager constructor', manager)
    this.setURLModifier(this.setURLModifierFun)
    this.onStart = this.onStartFun
  }

  setURLModifierFun (url) {
    console.log('setURLModifier2', url)
    // TODO: blob要处理
    return url
  }

  onStartFun (url, itemsLoaded, itemsTotal) {
    console.log('onStartFun', url, itemsLoaded, itemsTotal)
  }
}

/**
 * 加载gltf/glb文件模型
 * @param  {THREE.Scene} scene
 * @param  {} url
 */
export function loadGLTF (scene, url) {
  const loader = new GLTFLoader(new CustomLoadingManager())
  return new Promise((resolve, reject) => {
    loader.load(url, function (gltf) {
      clearScene(scene)
      // console.log('load gltf file:', gltf)
      // TODO:测量加载文件的变化
      // https://developer.mozilla.org/en-US/docs/Web/API/Resource_Timing_API/Using_the_Resource_Timing_API
      // performance.getEntriesByType("resource")
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
