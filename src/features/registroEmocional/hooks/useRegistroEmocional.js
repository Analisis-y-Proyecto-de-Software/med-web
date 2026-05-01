import { useEffect, useState } from 'react'
import { getCurrentUser } from 'aws-amplify/auth'
import { fetchEmotionalRecords } from '../services/registroEmocionalApi'

export default function useRegistroEmocional() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadRecords = async () => {
      setLoading(true)
      setError('')

      try {
        const currentUser = await getCurrentUser()
        const userId = currentUser?.userId || currentUser?.username

        if (!userId) {
          throw new Error('No se encontro el usuario actual.')
        }

        const data = await fetchEmotionalRecords(userId)
        const list = Array.isArray(data)
          ? data
          : (data?.items || data?.data || [])

        if (isMounted) {
          setRecords(list)
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || 'Error al cargar los registros.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    void loadRecords()

    return () => {
      isMounted = false
    }
  }, [])

  return {
    records,
    loading,
    error,
  }
}
