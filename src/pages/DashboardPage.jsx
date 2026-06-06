import { useState } from 'react'
import EmotionalDistributionChart from '../features/dashboard/components/EmotionalDistributionChart'
import WeeklyTasksChart from '../features/dashboard/components/WeeklyTasksChart'
import CognitiveTrendChart from '../features/dashboard/components/CognitiveTrendChart'

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

function getYearOptions() {
  const current = new Date().getFullYear()
  return Array.from({ length: 5 }, (_, i) => current - i)
}

export default function DashboardPage() {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())

  const years = getYearOptions()

  return (
    <section className="min-h-[82vh] bg-[#f8f9fa] p-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-xl font-bold text-[#0b2b2a]">Dashboard</h1>
            <p className="text-xs text-gray-400 mt-0.5">Resumen de tu bienestar y productividad</p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={month}
              onChange={e => setMonth(Number(e.target.value))}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-[#00343a]/30 cursor-pointer"
            >
              {MONTHS.map((name, i) => (
                <option key={i + 1} value={i + 1}>{name}</option>
              ))}
            </select>

            <select
              value={year}
              onChange={e => setYear(Number(e.target.value))}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-[#00343a]/30 cursor-pointer"
            >
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EmotionalDistributionChart month={month} year={year} />
          <WeeklyTasksChart month={month} year={year} />
        </div>

        <CognitiveTrendChart year={year} />

      </div>
    </section>
  )
}
