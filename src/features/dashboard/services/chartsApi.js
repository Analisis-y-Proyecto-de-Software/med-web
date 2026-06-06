import { apiFetch } from '../../../services/apiClient'

export async function fetchEmotionalDistribution(userId, month, year) {
  const response = await apiFetch(
    `/charts/${encodeURIComponent(userId)}/emotional-distribution?month=${month}&year=${year}`
  )
  if (!response.ok) throw new Error('Error al obtener la distribución emocional.')
  return response.json()
}

export async function fetchWeeklyTasks(userId, month, year) {
  const response = await apiFetch(
    `/charts/${encodeURIComponent(userId)}/weekly-tasks?month=${month}&year=${year}`
  )
  if (!response.ok) throw new Error('Error al obtener el progreso semanal de tareas.')
  return response.json()
}

export async function fetchCognitiveTrend(userId, year) {
  const response = await apiFetch(
    `/charts/${encodeURIComponent(userId)}/cognitive-trend?year=${year}`
  )
  if (!response.ok) throw new Error('Error al obtener la tendencia cognitiva anual.')
  return response.json()
}
