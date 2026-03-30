import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [examples, setExamples] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchExamples()
  }, [])

  const fetchExamples = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get('/api/auth/examples/')
      setExamples(response.data.results || response.data)
    } catch (err) {
      setError('Failed to fetch examples')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="App">
      <header>
        <h1>CS348 Project</h1>
        <p>React Frontend + Django Backend</p>
      </header>

      <main>
        <section>
          <h2>Examples</h2>
          {loading && <p>Loading...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {examples.length === 0 && !loading && (
            <p>No examples yet. Create one to get started!</p>
          )}
          <ul>
            {examples.map((example) => (
              <li key={example.id}>
                <h3>{example.title}</h3>
                <p>{example.description}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  )
}

export default App
