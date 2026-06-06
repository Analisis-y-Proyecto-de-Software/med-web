import { useState, useEffect } from 'react'
import { getCurrentUser } from 'aws-amplify/auth'
import { fetchEmotionalDistribution } from '../services/chartsApi'

export default function useEmotionalDistribution(month, year) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const currentUser = await getCurrentUser()
        const userId = currentUser?.userId || currentUser?.username
        if (!userId) throw new Error('Usuario no encontrado.')
        const result = await fetchEmotionalDistribution(userId, month, year)
        if (isMounted) setData(result)
      } catch (err) {
        if (isMounted) setError(err?.message || 'Error al cargar la distribución emocional.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    void load()
    return () => { isMounted = false }
  }, [month, year])

  return { data, loading, error }
}
