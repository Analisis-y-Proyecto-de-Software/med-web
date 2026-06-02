import { useState } from 'react'
import { CalendarDays, ClipboardCheck, AlertCircle, Lightbulb } from 'lucide-react'
import useDailySummary from '../hooks/useDailySummary'

function SummaryRow({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="w-5 h-5 text-[#0b2b2a] shrink-0" />
      <span className="text-sm text-[#0b2b2a]">{label}</span>
    </div>
  )
}

export default function DailySummaryCard({ date }) {
  const { data, loading } = useDailySummary(date)
  const [dismissed, setDismissed] = useState(false)

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-4">
      <p className="text-base font-bold text-[#0b2b2a]">Resumen del día</p>

      {loading ? (
        <div className="flex justify-center py-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#00343a]" />
        </div>
      ) : data ? (
        <>
          <div className="flex flex-col gap-3">
            <SummaryRow icon={CalendarDays}   label={`${data.tasksScheduled} ${data.tasksScheduled === 1 ? 'tarea programada' : 'tareas programadas'}`} />
            <SummaryRow icon={ClipboardCheck} label={`${data.tasksDone} ${data.tasksDone === 1 ? 'tarea realizada' : 'tareas realizadas'}`} />
            <SummaryRow icon={AlertCircle}    label={`${data.tasksPending} ${data.tasksPending === 1 ? 'tarea pendiente' : 'tareas pendientes'}`} />
          </div>

          {data.recommendation && !dismissed && (
            <div className="bg-[#fefce8] border border-[#fde68a] rounded-xl p-3 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#92400e]">Recomendación</span>
                <button
                  onClick={() => setDismissed(true)}
                  className="text-xs font-semibold text-[#92400e] border border-[#fcd34d] bg-[#fef9c3] rounded-md px-2 py-0.5 hover:bg-[#fde68a] transition-colors"
                >
                  Ok
                </button>
              </div>
              <div className="flex gap-2">
                <Lightbulb className="w-8 h-8 text-[#f59e0b] shrink-0 mt-0.5" />
                <p className="text-xs text-[#78350f] font-medium leading-snug">{data.recommendation}</p>
              </div>
            </div>
          )}
        </>
      ) : (
        <p className="text-sm text-gray-400">Sin datos para hoy</p>
      )}
    </div>
  )
}
