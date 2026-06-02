import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge'
import useCognitiveLoad from '../hooks/useCognitiveLoad'

export default function CognitiveLoadGauge({ month, year }) {
  const { data, loading } = useCognitiveLoad(month, year)

  const value = data ? Math.round(parseFloat(data.average_cognitive_load)) : 0

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-2">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Carga cognitiva</p>
      <p className="text-xs text-gray-400">
        {data ? `${data.records_count} registros este mes` : 'Sin registros'}
      </p>

      <div className="flex items-center justify-center">
        {loading ? (
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#00343a] my-8" />
        ) : (
          <Gauge
            value={value}
            startAngle={-110}
            endAngle={110}
            height={160}
            sx={{
              [`& .${gaugeClasses.valueText}`]: {
                fontSize: 28,
                transform: 'translate(0px, 0px)',
                fill: '#0b2b2a',
                fontWeight: 700,
              },
              [`& .${gaugeClasses.valueArc}`]: {
                fill: '#00343a',
              },
              [`& .${gaugeClasses.referenceArc}`]: {
                fill: '#e5e7eb',
              },
            }}
            text={({ value, valueMax }) => `${value} / ${valueMax}`}
          />
        )}
      </div>
    </div>
  )
}
