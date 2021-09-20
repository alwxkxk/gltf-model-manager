import { Tabs  } from 'antd';
import GreetTest from './components/GreetTest';
import 'antd/dist/antd.css';
import './App.css';

const { TabPane } = Tabs;
function App() {
  return (
    <Tabs defaultActiveKey="3" type="card">
      <TabPane tab="Tab 1" key="1">
        Content of Tab Pane 1
      </TabPane>
      <TabPane tab="Tab 2" key="2">
        Content of Tab Pane 2
      </TabPane>
      <TabPane tab="功能测试页" key="3">
        <GreetTest/>
      </TabPane>
    </Tabs>

  );
}

export default App;
