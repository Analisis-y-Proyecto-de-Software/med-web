import { apiFetch } from '../../../services/apiClient'

/**
 * Obtiene los registros emocionales de un usuario, permitiendo filtrar por fecha, por estado o por ambos.
 * @param {string} userId - Identificador único del usuario.
 * @param {string|null} date - Fecha en formato YYYY-MM-DD (Opcional).
 * @param {number|null} stateId - ID del estado emocional (Opcional).
 */
export async function fetchEmotionalRecords(userId, date, stateId) {
  let path = `/emotionalrecords/${encodeURIComponent(userId)}/list`

  // 1. Creamos un objeto para administrar los Query Parameters de forma segura
  const params = new URLSearchParams()

  // 2. Agregamos los parámetros únicamente si contienen un valor válido
  if (date) {
    params.append('date', date)
  }
  
  if (stateId) {
    params.append('stateId', stateId)
  }

  // 3. Convertimos los parámetros a texto y los unimos al camino base si existen
  const queryString = params.toString()
  if (queryString) {
    path += `?${queryString}`
  }

  const response = await apiFetch(path)

  if (!response.ok) {
    throw new Error('No se pudieron cargar los registros.')
  }

  return response.json()
}

// Guarda un nuevo registro emocional apuntando a la ruta de creación
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