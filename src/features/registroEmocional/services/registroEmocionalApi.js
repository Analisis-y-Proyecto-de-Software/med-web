import { apiFetch } from '../../../services/apiClient'

export async function fetchEmotionalRecords(userId) {
  const response = await apiFetch(`/emotionalrecords/${encodeURIComponent(userId)}/list`)

  if (!response.ok) {
    throw new Error('No se pudieron cargar los registros.')
  }

  return response.json()
}
