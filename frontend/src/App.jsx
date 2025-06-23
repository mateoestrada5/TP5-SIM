import { useEffect, useState } from 'react'
import './App.css'
import Principal from './components/Principal'

function App() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('http://127.0.0.1:8000')
      .then(res => {
        if (!res.ok) throw new Error('Error al obtener los datos')
        return res.json()
      })
      .then(json => {
        setData(json)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="min-h-screen bg-zinc-800 text-white text-center p-6"> <p className='font-bold'>Cargando datos...</p> </div>
  if (error) return <div className="min-h-screen bg-zinc-800 text-white text-center p-6"> <p className='font-bold'>Error: {error}</p> </div>

  return (
    <div className="min-h-screen bg-zinc-800 text-white p-6">
      <Principal data={data} />
    </div>
  )
}

export default App
