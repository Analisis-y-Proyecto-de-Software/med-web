import { useState, useEffect } from 'react'
import { getCurrentUser } from 'aws-amplify/auth'
import { fetchCognitiveLoad } from '../services/calendarApi'

export default function useCognitiveLoad(month, year) {
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

        const result = await fetchCognitiveLoad(userId, month, year)
        if (isMounted) setData(result)
      } catch (err) {
        if (isMounted) setError(err?.message || 'Error al cargar la carga cognitiva.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    void load()
    return () => { isMounted = false }
  }, [month, year])

  return { data, loading, error }
}
