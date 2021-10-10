// import './RightBlock.css'
import ColorPicker from './ColorPicker'
import { Collapse, Switch } from 'antd'
import * as THREE from 'three'
const { Panel } = Collapse

function openLightFun (scene, light, helper) {
  return (checked) => {
    if (checked) {
      scene.add(light)
      if (helper) {
        scene.add(helper)
      }
    } else {
      light.removeFromParent()
      if (helper) {
        helper.removeFromParent()
      }
    }
  }
}

function setLightColorFun (light, colorKey = 'color') {
  return (value) => {
    light[colorKey].set(value.hex)
  }
}
/**
 * @param  {THREE.Scene} params.scene 场景
 */
function RightBlock (params) {
  const scene = params.scene
  const defaultColor = { r: 255, g: 255, b: 255 }

  const ambientLightDefaultColor = { r: 0, g: 0, b: 255 }
  const ambientLight = new THREE.AmbientLight(new THREE.Color(ambientLightDefaultColor))
  const openAmbientLight = openLightFun(scene, ambientLight)
  const changeAmbientLightColor = setLightColorFun(ambientLight)

  const directionalLight = new THREE.DirectionalLight(new THREE.Color(defaultColor))
  directionalLight.position.set(1, 1, 1)// 方向光要倾斜一下，防止在顶端有时会没作用。
  const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight)
  const openDirectionalLight = openLightFun(scene, directionalLight, directionalLightHelper)
  const changeDirectionalLightColor = setLightColorFun(directionalLight)

  const hemisphereLightDefaultSkyColor = { r: 255, g: 255, b: 255 }
  const hemisphereLightDefaultGroundColor = { r: 200, g: 200, b: 200 }
  const hemisphereLight = new THREE.HemisphereLight(new THREE.Color(hemisphereLightDefaultSkyColor), new THREE.Color(hemisphereLightDefaultGroundColor))
  const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight)
  const openHemisphereLight = openLightFun(scene, hemisphereLight, hemisphereLightHelper)
  const changeHemisphereLightSkyColor = setLightColorFun(hemisphereLight)
  const changeHemisphereLightGroundColor = setLightColorFun(hemisphereLight, 'groundColor')

  return (
    <div style={{ minWidth: '400px' }}>
      <Collapse className="flex-1">
        <Panel header="背景光(AmbientLight)" key="1">
          <div className="flex">
            <Switch checkedChildren="开启" unCheckedChildren="关闭" onChange={openAmbientLight}/>
            <ColorPicker defaultColor={ambientLightDefaultColor} onChange={changeAmbientLightColor}/>
          </div>
        </Panel>
        <Panel header="方向光(DirectionalLight)" key="2">
          <div className="flex">
            <Switch checkedChildren="开启" unCheckedChildren="关闭" onChange={openDirectionalLight}/>
            <ColorPicker defaultColor={defaultColor} onChange={changeDirectionalLightColor}/>
          </div>
        </Panel>
        <Panel header="天空光(HemisphereLight)" key="3">
        <div className="flex">
            <Switch checkedChildren="开启" unCheckedChildren="关闭" onChange={openHemisphereLight}/>
            天：
            <ColorPicker defaultColor={hemisphereLightDefaultSkyColor} onChange={changeHemisphereLightSkyColor}/>
            地：
            <ColorPicker defaultColor={hemisphereLightDefaultGroundColor} onChange={changeHemisphereLightGroundColor}/>
          </div>
        </Panel>
    </Collapse>
    </div>

  )
}

export default RightBlock
