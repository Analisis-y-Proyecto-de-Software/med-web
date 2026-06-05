import { useEffect, useState } from 'react'
import { getCurrentUser } from 'aws-amplify/auth'
import {
  fetchEmotionalRecords,
  submitEmotionalRecord,
} from '../services/registroEmocionalApi'

const formatDateFilter = (date) => {
  if (!date) return null
  const normalizedDate = date instanceof Date ? date : new Date(date)
  if (Number.isNaN(normalizedDate.getTime())) return null

  const year = normalizedDate.getFullYear()
  const month = String(normalizedDate.getMonth() + 1).padStart(2, '0')
  const day = String(normalizedDate.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export default function useRegistroEmocional() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedStateId, setSelectedStateId] = useState(null) // Nuevo estado para el filtro de emoción

  useEffect(() => {
    let isMounted = true

    const loadRecords = async (date, stateId) => {
      setLoading(true)
      setError('')

      try {
        const currentUser = await getCurrentUser()
        const userId = currentUser?.userId || currentUser?.username

        if (!userId) {
          throw new Error('No se encontró el usuario actual.')
        }

        const formattedDate = formatDateFilter(date)
        // Enviamos tanto la fecha como el ID de estado a la API
        const data = await fetchEmotionalRecords(userId, formattedDate, stateId)
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

    void loadRecords(selectedDate, selectedStateId)

    return () => {
      isMounted = false
    }
  }, [selectedDate, selectedStateId]) // Se dispara al cambiar fecha o estado

  return {
    records,
    loading,
    error,
    selectedDate,
    setSelectedDate,
    selectedStateId,    // Expuesto para el componente visual
    setSelectedStateId, // Expuesto para limpiar o asignar el filtro
    submitRecord: async ({ name, id }) => {
      setLoading(true)
      setError('')

      try {
        const currentUser = await getCurrentUser()
        const userId = currentUser?.userId || currentUser?.username

        if (!userId) {
          throw new Error('No se encontró el usuario actual.')
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