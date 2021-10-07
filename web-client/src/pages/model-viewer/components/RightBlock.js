// import './RightBlock.css'
import ColorPicker from './ColorPicker'
import { Collapse, Switch } from 'antd'
import * as THREE from 'three'
const { Panel } = Collapse

/**
 * @param  {THREE.Scene} params.scene 场景
 */
function RightBlock (params) {
  const ambientLightDefaultColor = { r: 0, g: 0, b: 255 }
  const ambientLight = new THREE.AmbientLight(new THREE.Color(ambientLightDefaultColor))
  const openAmbientLight = (checked) => {
    if (checked) {
      params.scene.add(ambientLight)
    } else {
      ambientLight.removeFromParent()
    }
  }
  const changeAmbientColor = (value) => {
    ambientLight.color.set(value.hex)
  }

  return (
    <div style={{ minWidth: '400px' }}>
      <Collapse className="flex-1">
        <Panel header="背景光(AmbientLight)" key="1">
          <div className="flex">
            <Switch checkedChildren="开启" unCheckedChildren="关闭" onChange={openAmbientLight}/>
            <ColorPicker defaultColor={ambientLightDefaultColor} onChange={changeAmbientColor}/>
          </div>
        </Panel>
        <Panel header="This is panel header 2" key="2">
          <p>test</p>
        </Panel>
        <Panel header="This is panel header 3" key="3">
          <p>test</p>
        </Panel>
    </Collapse>
    </div>

  )
}

export default RightBlock
