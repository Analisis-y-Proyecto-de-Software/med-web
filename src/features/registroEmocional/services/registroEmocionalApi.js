import { apiFetch } from '../../../services/apiClient'

export async function fetchEmotionalRecords(userId) {
  const response = await apiFetch(`/emotionalrecords/${encodeURIComponent(userId)}/list`)

  if (!response.ok) {
    throw new Error('No se pudieron cargar los registros.')
  }

  return response.json()
}

// CORRECCIÓN: Código simplificado y apuntando directamente a la ruta unificada
export async function submitEmotionalRecord(userId, payload) {
  const path = `/emotionalrecords/${encodeURIComponent(userId)}/create`

  const response = await apiFetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    const message = text || 'No se pudo guardar el registro.'
    throw new Error(message)
  }

  return response.json()
}
