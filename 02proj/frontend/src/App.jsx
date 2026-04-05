import { useState } from 'react'
import { Github } from './Github'

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
        <h1>Hello World</h1>
        <Github/>
      </section>
    </>
  )
}

export default App
