import { apiFetch } from '../../../services/apiClient'

export async function fetchTasks(userId) {
  const response = await apiFetch(`/tasks/${encodeURIComponent(userId)}/list`)

  if (!response.ok) {
    throw new Error('No se pudieron cargar las tareas.')
  }

  return response.json()
}
