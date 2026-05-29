import { useEffect, useState } from 'react'
import { getCurrentUser } from 'aws-amplify/auth'
import {
  fetchEmotionalRecords,
  submitEmotionalRecord,
} from '../services/registroEmocionalApi'

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
    submitRecord: async ({ name, id }) => {
      setLoading(true)
      setError('')

      try {
        const currentUser = await getCurrentUser()
        const userId = currentUser?.userId || currentUser?.username

        if (!userId) {
          throw new Error('No se encontro el usuario actual.')
        }

        const payload = {
          name: name || undefined,
          emotional_state_id: id || undefined,
          created_at: new Date().toISOString(),
        }

        const created = await submitEmotionalRecord(userId, payload)

        setRecords((prev) => (Array.isArray(prev) ? [created, ...prev] : [created]))

        return created
      } catch (err) {
        setError(err?.message || 'Error al registrar la emoción.')
        throw err
      } finally {
        setLoading(false)
      }
    },
  }
}
