import { useEffect, useState } from 'react'
import './App.css'
import Tabla, { type DataItem } from './components/Tabla'

function App() {
  const [data, setData] = useState<DataItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('http://127.0.0.1:8000')
      .then(res => {
        if (!res.ok) throw new Error('Error al obtener los datos')
        return res.json()
      })
      .then((json: DataItem[]) => {
        setData(json)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) return <p>Cargando datos...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className="App">
      <h1>Tabla de datos</h1>
      <Tabla data={data} />
    </div>
  )
}

export default App
