import { useEffect, useState } from 'react'

const useBackendStatus = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('http://127.0.0.1:8000/status')
      .then(res => {
        if (!res.ok) throw new Error('El backend respondió con error')
        return res.json()
      })
      .then(() => {
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return { loading, error }
}

export default useBackendStatus
