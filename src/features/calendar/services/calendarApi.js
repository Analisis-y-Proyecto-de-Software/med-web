import { apiFetch } from '../../../services/apiClient'

const MONTH_NAMES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]

export async function fetchCalendarMonth(userId, month, year) {
  const monthName = MONTH_NAMES[month - 1]
  const response = await apiFetch(`/${monthName}/${encodeURIComponent(userId)}?year=${year}`)

  if (!response.ok) {
    throw new Error('No se pudieron cargar los datos del calendario.')
  }

  return response.json()
}

export async function fetchDailySummary(userId, date) {
  const response = await apiFetch(`/summary/${encodeURIComponent(userId)}?date=${date}`)

  if (!response.ok) {
    throw new Error('No se pudo cargar el resumen del día.')
  }

  return response.json()
}

export async function fetchCognitiveLoad(userId, month, year) {
  const monthName = MONTH_NAMES[month - 1]
  const response = await apiFetch(
    `/cognitive-load/${encodeURIComponent(userId)}?month=${monthName}&year=${year}`
  )

  if (!response.ok) {
    throw new Error('No se pudo cargar la carga cognitiva.')
  }

  return response.json()
}
