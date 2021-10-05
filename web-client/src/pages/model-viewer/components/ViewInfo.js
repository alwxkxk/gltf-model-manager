
/**
 * @param  {Object} params.viewInfo 场景信息
 */
function ViewInfo (params) {
  let boxInfo = null

  if (params.viewInfo && params.viewInfo.box) {
    boxInfo = params.viewInfo.box
  }
  return (
    boxInfo &&
    <div>
      <div>当前模型尺寸</div>
      <div>X：{(boxInfo.max.x - boxInfo.min.x).toFixed(3)}({(boxInfo.min.x).toFixed(3)}~{(boxInfo.max.x).toFixed(3)})</div>
      <div>Y：{(boxInfo.max.y - boxInfo.min.y).toFixed(3)}({(boxInfo.min.y).toFixed(3)}~{(boxInfo.max.y).toFixed(3)})</div>
      <div>Z：{(boxInfo.max.z - boxInfo.min.z).toFixed(3)}({(boxInfo.min.z).toFixed(3)}~{(boxInfo.max.z).toFixed(3)})</div>
    </div>
  )
}

export default ViewInfo
