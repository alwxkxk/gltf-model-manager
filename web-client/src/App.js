import { Tabs  } from 'antd';
import GreetTest from './components/GreetTest';
import ModelViewer from './pages/model-viewer';
import 'antd/dist/antd.css';
import './App.css';

const { TabPane } = Tabs;
function App() {
  return (
    <Tabs defaultActiveKey="2" type="card">
      <TabPane tab="Tab 1" key="1">
        Content of Tab Pane 1
      </TabPane>
      <TabPane tab="3D模型分析页" key="2">
        <ModelViewer/>
      </TabPane>
      <TabPane tab="后端接口测试页" key="3">
        <GreetTest/>
      </TabPane>
    </Tabs>

  );
}

export default App;
