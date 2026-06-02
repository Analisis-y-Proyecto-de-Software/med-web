import { useState, useEffect } from 'react'
import { getCurrentUser } from 'aws-amplify/auth'
import { fetchCalendarMonth } from '../services/calendarApi'

export default function useCalendarData(month, year) {
  const [calendarData, setCalendarData] = useState({})
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

        const data = await fetchCalendarMonth(userId, month, year)
        const items = data?.data || []

        const map = {}
        items.forEach((item) => {
          const day = parseInt(item.date.split('-')[2], 10)
          map[day] = {
            emotional_state: item.emotional_state,
            tasks_due_count: item.tasks_due_count,
          }
        })

        if (isMounted) setCalendarData(map)
      } catch (err) {
        if (isMounted) setError(err?.message || 'Error al cargar el calendario.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    void load()
    return () => {
      isMounted = false
    }
  }, [month, year])

  return { calendarData, loading, error }
}
