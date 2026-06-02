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
