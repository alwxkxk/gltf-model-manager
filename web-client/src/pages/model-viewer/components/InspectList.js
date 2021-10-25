
import { Table } from 'antd'
import {
  transformFileSize
} from '@/utils/utils.js'

const textureColumns = [
  {
    title: 'name',
    dataIndex: 'name'
  },
  {
    title: 'mimeType',
    dataIndex: 'mimeType'
  },
  {
    title: 'instances',
    dataIndex: 'instances'
  },
  {
    title: 'slots',
    dataIndex: 'slots'
  },
  {
    title: 'resolution',
    dataIndex: 'resolution'
  },
  {
    title: 'size',
    dataIndex: 'size'
  },
  {
    title: 'gpuSize',
    dataIndex: 'gpuSize'
  }

]

const materialsColumns = [
  {
    title: 'name',
    dataIndex: 'name'
  },
  {
    title: 'instances',
    dataIndex: 'instances'
  },
  {
    title: 'doubleSided',
    dataIndex: 'doubleSided'
  },
  {
    title: 'alphaMode',
    dataIndex: 'alphaMode'
  },
  {
    title: 'textures',
    dataIndex: 'textures'
  }

]

const meshesColumns = [
  {
    title: 'name',
    dataIndex: 'name'
  },
  {
    title: 'instances',
    dataIndex: 'instances'
  },
  {
    title: 'attributes',
    dataIndex: 'attributes'
  },
  {
    title: 'indices',
    dataIndex: 'indices'
  },
  {
    title: 'mode',
    dataIndex: 'mode'
  },
  {
    title: 'primitives',
    dataIndex: 'primitives'
  },
  {
    title: 'glPrimitives',
    dataIndex: 'glPrimitives'
  },
  {
    title: 'size',
    dataIndex: 'size'
  },
  {
    title: 'vertices',
    dataIndex: 'vertices'
  }
]

// 添加index，将值为数组的转换成字符串，用逗号分隔
// 含size的转换成KB或MB
const refactorProperties = (properties) => {
  return properties.map((i, index) => {
    const result = { key: index }
    Object.keys(i).forEach(key => {
      if (Array.isArray(i[key])) {
        result[key] = i[key].join(',')
      } else if (typeof (i[key]) === 'boolean') {
        result[key] = String(i[key])
      } else if (key.includes('size') || key.includes('Size')) {
        result[key] = transformFileSize(i[key])
      } else {
        result[key] = i[key]
      }
    })
    return result
  })
}

function InspectList (params) {
  let textureData = []
  let materialsData = []
  let meshesData = []
  if (params.data) {
    const dataObj = params.data
    console.log('InspectList:', dataObj)
    if (dataObj.textures && dataObj.textures.properties) {
      textureData = refactorProperties(dataObj.textures.properties)
    }

    if (dataObj.materials && dataObj.materials.properties) {
      materialsData = refactorProperties(dataObj.materials.properties)
    }

    if (dataObj.meshes && dataObj.meshes.properties) {
      meshesData = refactorProperties(dataObj.meshes.properties)
    }
  }
  return (
        <div>
            <div className="pl-10">纹理(texture)</div>
            <Table columns={textureColumns} dataSource={textureData} />
            <div className="pl-10">材质(materials)</div>
            <Table columns={materialsColumns} dataSource={materialsData} />
            <div className="pl-10">网格(meshes)</div>
            <Table columns={meshesColumns} dataSource={meshesData} />
        </div>
  )
}

export default InspectList
