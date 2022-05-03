import { WebIO } from '@gltf-transform/core'
import {
  TextureBasisu,
  TextureTransform
} from '@gltf-transform/extensions'

// 要注册扩展，否则加载模型时用到那些扩展会报错
const io = new WebIO({ credentials: 'include' })
  .registerExtensions([TextureBasisu, TextureTransform])

/**
 * 读取glb文件
 * @param  {Blob} blob
 * @returns {Promise<Document>}
 */
export async function gtReadGlb (blob) {
  const arrayBuffer = await blob.arrayBuffer()
  return io.readBinary(arrayBuffer)
}

/**
 * 读取gltf文件(embedded)，输入url
 * @param  {String} url
 * @returns {Promise<Document>}
 */
export function gtReadGltf (url) {
  io.readAsJSON(url).then(res => {
    console.log('readAsJSON', res)
  })
  return io.read(url)
}

/**
 * 读取gltf文件(separate)，输入url
 * @param  {String} url
 * @param  {Map} filesBufferMap
 * @returns {Promise<Document>}
 */
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

/**
 * 将文档 转换成对象 {文件名:blob对象}
 * @param  {} doc
 */
export function gtWriteToSeparateGltf (doc) {
  const options = {
    basename: 'model'
  }
  const obj = io.writeJSON(doc, options)
  // {
  //   json:{...},// 一个对象，对应
  //   resources:{...} // 多个ArrayBuffer，包括：.bin , 及纹理等的 .jpg
  // }

  // 该库会将图片名字改变成 ${basename}.jpg 这样子的
  const result = {}
  const jsonBlob = new Blob([JSON.stringify(obj.json)], { type: 'application/json' })
  result['model.gltf'] = jsonBlob

  Object.keys(obj.resources).forEach(key => {
    result[key] = new Blob([obj.resources[key]])
  })

  console.log('gtWriteToSeparateGltf', obj, result)
  return result
}
