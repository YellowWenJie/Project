import { useState } from 'react'
import './app.scss'
import Router from './router'
import 'antd/dist/antd.css'

function App() {
  const [count, setCount] = useState(0)

  return <Router></Router>
}

export default App
