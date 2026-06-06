import { LineChart } from '@mui/x-charts/LineChart'
import useCognitiveTrend from '../hooks/useCognitiveTrend'

export default function CognitiveTrendChart({ year }) {
  const { data, loading, error } = useCognitiveTrend(year)

  const hasData = data && data.values.some(v => v !== null)

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-2">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
        Tendencia de carga cognitiva anual
      </p>
      <p className="text-xs text-gray-400">
        Promedio mensual · 0 = máximo estrés · 100 = máximo bienestar
      </p>

      <div className="flex items-center justify-center min-h-[260px]">
        {loading ? (
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#00343a]" />
        ) : error ? (
          <p className="text-xs text-red-400 text-center">{error}</p>
        ) : !hasData ? (
          <p className="text-sm text-gray-400 text-center">Sin registros para este año</p>
        ) : (
          <LineChart
            xAxis={[{
              scaleType: 'point',
              data: data.labels,
              tickLabelStyle: { fontSize: 11, fill: '#6b7280' },
            }]}
            yAxis={[{
              min: 0,
              max: 100,
              tickLabelStyle: { fontSize: 11, fill: '#6b7280' },
            }]}
            series={[{
              data: data.values,
              label: 'Carga cognitiva',
              color: '#00343a',
              connectNulls: false,
              area: true,
            }]}
            height={280}
            sx={{
              '& .MuiAreaElement-root': { fill: '#00343a', opacity: 0.08 },
              '& .MuiLineElement-root': { strokeWidth: 2 },
              '& .MuiMarkElement-root': { strokeWidth: 2, r: 4 },
              '& .MuiChartsLegend-root': { display: 'none' },
            }}
            margin={{ top: 20, bottom: 40 }}
          />
        )}
      </div>
    </div>
  )
}
