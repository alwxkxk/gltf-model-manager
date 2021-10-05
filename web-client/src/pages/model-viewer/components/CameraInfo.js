
import eventBus from '../../../utils/event-bus'
import { useEffect, useState } from 'react'
/**
 * @param  {THREE.Camera} params.camera 摄像头对象
 */
function CameraInfo (params) {
  const [cameraPositionInfo, setCameraPositionInfo] = useState(null)
  console.log(' CameraInfo', JSON.stringify(cameraPositionInfo))

  useEffect(() => {
    console.log(' CameraInfo useEffect')
    const f = () => {
      if (params.camera) {
        setCameraPositionInfo({ ...params.camera.position })
      }
    }
    eventBus.on('3d-animate', f)
    return () => {
      eventBus.off('3d-animate', f)
    }
  }, [params.camera])

  if (cameraPositionInfo) {
    return (
      <div>
        <div>当前摄像头位置</div>
        <div>X：{cameraPositionInfo.x.toFixed(3)}</div>
        <div>Y：{cameraPositionInfo.y.toFixed(3)}</div>
        <div>Z：{cameraPositionInfo.z.toFixed(3)}</div>
      </div>
    )
  } else {
    return null
  }
}

export default CameraInfo
