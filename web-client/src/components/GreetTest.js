import { Button } from 'antd'
import axios from '@/apis/index'
import { greetUlr } from '@/apis/urls'

const getGreet = () => {
  // console.log('process.env',process.env)
  axios.get(greetUlr)
}

function GreetTest (params) {
  return (
        <Button type="primary" onClick={getGreet}>Greet测试</Button>
  )
}

export default GreetTest
