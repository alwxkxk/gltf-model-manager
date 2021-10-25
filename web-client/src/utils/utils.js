export function generateFilesMap (files) {
  const filesArr = Array.from(files)
  const filesUrlMap = new Map()
  const filesBufferMap = new Map()
  const fileBufferPromiseList = []
  filesArr.forEach(file => {
    filesUrlMap.set(file.name, window.URL.createObjectURL(file))

    const p = file.arrayBuffer().then(buffer => {
      filesBufferMap.set(file.name, buffer)
    })
    fileBufferPromiseList.push(p)
  })

  return Promise.all(fileBufferPromiseList).then(() => {
    return { filesUrlMap, filesBufferMap }
  })
}

export function transformFileSize (val) {
  let flag = 'KB'
  let result = val / 1024

  if (result > 1024) {
    result = result / 1024
    flag = 'MB'
  }
  return `${result.toFixed(2)}${flag}`
}
