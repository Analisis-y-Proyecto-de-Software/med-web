import { useState, useRef } from 'react'
import { Calendar } from '../Calendar'
import useCalendarData from '../hooks/useCalendarData'
import TodayEmotionPanel from './TodayEmotionPanel'
import CognitiveLoadGauge from './CognitiveLoadGauge'
import DailySummaryCard from './DailySummaryCard'

const CalendarPage = () => {
  const today = new Date()
  const [month, setMonth] = useState(today.getMonth() + 1)
  const [year, setYear] = useState(today.getFullYear())

  const { calendarData, loading } = useCalendarData(month, year)

  const handleFocusChange = (date) => {
    if (date.month !== month || date.year !== year) {
      setMonth(date.month)
      setYear(date.year)
    }
  }

  const isCurrentMonth = month === today.getMonth() + 1 && year === today.getFullYear()
  const todayDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  // Cache today's entry once loaded so navigating to other months doesn't clear the panel
  const todayEntryCache = useRef(null)
  if (isCurrentMonth && !loading) {
    todayEntryCache.current = calendarData[today.getDate()] ?? null
  }
  const panelLoading = loading && todayEntryCache.current === null

  return (
    <div className="flex flex-col gap-6 h-full">
      <h1 className="text-2xl font-bold text-[#0b2b2a]">Calendario</h1>

      <div className="flex gap-6 flex-1 min-h-0">
        <div className="flex-1 bg-white rounded-2xl shadow-sm p-8 overflow-auto">
          <Calendar
            calendarData={calendarData}
            loading={loading}
            onFocusChange={handleFocusChange}
          />
        </div>

        <div className="w-64 shrink-0 flex flex-col gap-6 overflow-y-auto">
          <TodayEmotionPanel entry={todayEntryCache.current} loading={panelLoading} />
          <CognitiveLoadGauge month={today.getMonth() + 1} year={today.getFullYear()} />
          <DailySummaryCard date={todayDate} />
        </div>
      </div>
    </div>
  )
}

export default CalendarPage
