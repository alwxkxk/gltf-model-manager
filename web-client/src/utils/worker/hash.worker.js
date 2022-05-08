import jsSHA from 'jssha'
const workerName = 'hash.worker.js'
onmessage = function (messageEvent) {
  console.log(`${workerName}:Message received from main script.`)

  const fileListObj = messageEvent.data
  const hashObj = {}
  const pList = []
  Object.keys(fileListObj).forEach(key => {
    const timeName = workerName + ' deal with ' + key
    console.time(timeName)
    const p = fileListObj[key].arrayBuffer().then(arrayBuf => {
      // eslint-disable-next-line new-cap
      const shaObj = new jsSHA('SHA-256', 'ARRAYBUFFER')
      shaObj.update(arrayBuf)
      hashObj[key] = shaObj.getHash('HEX')
      console.timeEnd(timeName)
    })
    pList.push(p)
  })
  Promise.all(pList).then(() => {
    postMessage(hashObj)
    console.log(`${workerName}:finish task and close this worker.`)
    close()
  })
}
