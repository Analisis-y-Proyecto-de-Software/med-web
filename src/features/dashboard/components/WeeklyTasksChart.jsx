import { BarChart } from '@mui/x-charts/BarChart'
import useWeeklyTasks from '../hooks/useWeeklyTasks'

export default function WeeklyTasksChart({ month, year }) {
  const { data, loading, error } = useWeeklyTasks(month, year)

  const isEmpty = !data || (data.done.every(v => v === 0) && data.pending.every(v => v === 0))

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-2">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
        Progreso semanal de tareas
      </p>
      <p className="text-xs text-gray-400">Completadas vs pendientes por semana</p>

      <div className="flex items-center justify-center min-h-[240px]">
        {loading ? (
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#00343a]" />
        ) : error ? (
          <p className="text-xs text-red-400 text-center">{error}</p>
        ) : isEmpty ? (
          <p className="text-sm text-gray-400 text-center">Sin tareas para este período</p>
        ) : (
          <BarChart
            xAxis={[{ scaleType: 'band', data: data.labels }]}
            series={[
              { data: data.done, label: 'Completadas', color: '#00343a' },
              { data: data.pending, label: 'Pendientes', color: '#b8ede6' },
            ]}
            height={260}
            borderRadius={6}
            sx={{
              '& .MuiChartsAxis-tickLabel': { fontSize: 11, fill: '#6b7280' },
              '& .MuiChartsLegend-label': { fontSize: 11 },
            }}
          />
        )}
      </div>
    </div>
  )
}
