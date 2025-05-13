import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <h1>Darius Millerd's Portfolio</h1>
        <p>This is a test for Darius Millerd's Portfolio</p>
          <button onClick={() => setCount((count) => count + 1)}></button>
      </div>

    </>
  )
}

export default App
