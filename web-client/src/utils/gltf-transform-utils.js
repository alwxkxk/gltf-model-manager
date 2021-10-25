import { WebIO } from '@gltf-transform/core'
import {
  TextureBasisu,
  TextureTransform
} from '@gltf-transform/extensions'

// 要注册扩展，否则加载模型时用到那些扩展会报错
const io = new WebIO({ credentials: 'include' })
  .registerExtensions([TextureBasisu, TextureTransform])

/**
 * 读取GLB文件
 * @param  {Blob} blob
 */
export async function gtReadGlb (blob) {
  const arrayBuffer = await blob.arrayBuffer()
  return io.readBinary(arrayBuffer)
}

/**
 * 读取gltf文件(embedded)，输入url
 * @param  {String} url
 */
export function gtReadGltf (url) {
  io.readAsJSON(url).then(res => {
    console.log('readAsJSON', res)
  })
  return io.read(url)
}

export function gtReadSeparateGltf (url, filesBufferMap) {
  const jsonDoc = { json: {}, resources: {} }
  return fetch(url)
    .then((response) => response.json())
    .then(async (json) => {
      jsonDoc.json = json
      filesBufferMap.forEach((buffer, fileName) => {
        jsonDoc.resources[fileName] = buffer
      })
      console.log('jsonDoc', jsonDoc)
      // TODO:针对外部的资源还要额外处理
      return io.readJSON(jsonDoc)
    })
}
