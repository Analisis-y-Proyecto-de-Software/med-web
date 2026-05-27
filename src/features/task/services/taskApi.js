import { apiFetch } from '../../../services/apiClient'

export async function fetchTasks(userId) {
  const response = await apiFetch(`/tasks/${encodeURIComponent(userId)}/list`)

  if (!response.ok) {
    throw new Error('No se pudieron cargar las tareas.')
  }

  return response.json()
}

export async function createTask(data) {
  const response = await apiFetch('/tasks/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('No se pudo crear la tarea.')
  }

  return response.json()
}
