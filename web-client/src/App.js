import { Tabs } from 'antd'
// import GreetTest from './components/GreetTest'
import ModelViewer from './pages/model-viewer'
import ServerHandle from './pages/server-handle'
import 'antd/dist/antd.css'
import './App.css'

const { TabPane } = Tabs
function App () {
  return (
    <Tabs defaultActiveKey="1" type="card">
      <TabPane tab="1.模型分析页" key="1">
        <ModelViewer/>
      </TabPane>
      <TabPane tab="2.后端处理" key="2" forceRender>
        <ServerHandle/>
      </TabPane>
    </Tabs>

  )
}

export default App
