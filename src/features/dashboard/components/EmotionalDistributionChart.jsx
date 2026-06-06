import { PieChart } from '@mui/x-charts/PieChart'
import useEmotionalDistribution from '../hooks/useEmotionalDistribution'

const COLORS = ['#00343a', '#0e7f6e', '#34c2a0', '#7ddfc8', '#b8ede6', '#e0f7f4']

export default function EmotionalDistributionChart({ month, year }) {
  const { data, loading, error } = useEmotionalDistribution(month, year)

  const isEmpty = !data || data.labels.length === 0

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-2">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
        Distribución emocional
      </p>
      <p className="text-xs text-gray-400">
        {data && !isEmpty ? `${data.total} registros en el período` : 'Estados emocionales del mes'}
      </p>

      <div className="flex items-center justify-center min-h-[240px]">
        {loading ? (
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#00343a]" />
        ) : error ? (
          <p className="text-xs text-red-400 text-center">{error}</p>
        ) : isEmpty ? (
          <p className="text-sm text-gray-400 text-center">Sin registros para este período</p>
        ) : (
          <PieChart
            series={[{
              data: data.labels.map((label, i) => ({
                id: i,
                value: data.data[i],
                label,
                color: COLORS[i % COLORS.length],
              })),
              innerRadius: 55,
              outerRadius: 95,
              paddingAngle: 2,
              cornerRadius: 4,
              highlightScope: { fade: 'global', highlight: 'item' },
            }]}
            height={260}
            slotProps={{
              legend: {
                direction: 'column',
                position: { vertical: 'middle', horizontal: 'right' },
                itemMarkWidth: 10,
                itemMarkHeight: 10,
                markGap: 6,
                itemGap: 10,
                labelStyle: { fontSize: 11, fill: '#6b7280' },
              },
            }}
            margin={{ right: 130 }}
          />
        )}
      </div>
    </div>
  )
}
