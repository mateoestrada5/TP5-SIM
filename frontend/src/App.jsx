import { useEffect, useState } from 'react'
import './App.css'
import Principal from './components/Principal'
import useBackendStatus from './hooks/useBackendStatus'

const App = () => {
  const { loading, error } = useBackendStatus()

  if (loading) return (
    <div className="min-h-screen bg-zinc-800 text-white text-center p-6">
      <p className='font-bold'>Cargando datos...</p>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-zinc-800 text-white text-center p-6">
      <p className='font-bold'>Error: {error}</p> 
      <p className='text-sm'>Backend no disponible. Asegúrate de que el servidor esté corriendo.</p>
      </div>
  )

  return (
    <div className="min-h-screen bg-zinc-800 text-white p-6">
      <Principal />
    </div>
  )
}

export default App
