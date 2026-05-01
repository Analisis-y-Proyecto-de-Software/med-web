import { useEffect, useState } from 'react'
import { getCurrentUser } from 'aws-amplify/auth'
import { fetchTasks } from '../services/taskApi'

export default function useTasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadTasks = async () => {
      setLoading(true)
      setError('')

      try {
        const currentUser = await getCurrentUser()
        const userId = currentUser?.userId || currentUser?.username

        if (!userId) {
          throw new Error('No se encontro el usuario actual.')
        }

        const data = await fetchTasks(userId)
        const list = Array.isArray(data)
          ? data
          : (data?.items || data?.data || [])

        if (isMounted) {
          setTasks(list)
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || 'Error al cargar las tareas.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    void loadTasks()

    return () => {
      isMounted = false
    }
  }, [])

  return {
    tasks,
    loading,
    error,
  }
}
