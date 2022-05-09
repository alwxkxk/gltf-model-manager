import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { LoadingManager } from 'three'

/**
 * 清除场景里所有物体
 * @param  {THREE.Scene} scene
 */
export function clearScene (scene) {
  const children = [...scene.children]
  children.forEach(c => {
    scene.remove(c)
  })
  return scene
}

class CustomLoadingManager extends LoadingManager {
  constructor (manager) {
    super(manager)
    // console.log('CustomLoadingManager constructor', manager)
    this.setURLModifier(this.setURLModifierFun.bind(this))
    this.onStart = this.onStartFun
    this.fileMap = new Map()
  }

  setURLModifierFun (url) {
    // 将fileMap里的blob替换出来
    const splitArray = url.split('/')
    if (splitArray.length > 1) {
      const fileName = splitArray[splitArray.length - 1]
      const blobUrl = this.fileMap.get(fileName)
      if (blobUrl) {
        return blobUrl
      }
    }
    return url
  }

  setFileMap (fileMap) {
    this.fileMap = fileMap
  }

  onStartFun (url, itemsLoaded, itemsTotal) {
    console.log('onStartFun', url, itemsLoaded, itemsTotal)
  }
}

/**
 * 加载gltf/glb文件模型,(不支持本地选择separate gltf文件夹，使用localLoadSeparateGLTF)
 * @param  {THREE.Scene} scene
 * @param  {} url
 */
export function loadGLTF (scene, url) {
  const loader = new GLTFLoader()
  return new Promise((resolve, reject) => {
    loader.load(url, (gltf) => {
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
    }, null, reject)
  }).catch(err => {
    let errMessage = '加载模型失败:'
    if (err.message.includes('Failed to load buffer')) {
      errMessage += '单个gltf文件加载，如果是gltf separate文件会导致无法加载其它资源。'
      console.warn('提示：单个gltf文件加载，如果是gltf separate文件会导致无法加载其它资源。')
    }
    // console.log('errMessage', errMessage)
    return Promise.reject(new Error(errMessage))
  })
}
/**
 * 本地加载gltf separate 文件夹
 * @param  {THREE.Scene} scene
 * @param  {Array[File]} filesList
 */

export function localLoadSeparateGLTF (scene, rootFileUrl, filesUrlMap) {
  const customLoadingManager = new CustomLoadingManager()
  customLoadingManager.setFileMap(filesUrlMap)

  const loader = new GLTFLoader(customLoadingManager)
  return new Promise((resolve, reject) => {
    loader.load(rootFileUrl, (gltf) => {
      clearScene(scene)
      // console.log('load gltf file:', gltf)
      // NOTE:可能后面改用 测量加载文件的变化
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
