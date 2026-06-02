import { useState } from 'react'
import { Calendar } from '../Calendar'
import useCalendarData from '../hooks/useCalendarData'
import TodayEmotionPanel from './TodayEmotionPanel'
import CognitiveLoadGauge from './CognitiveLoadGauge'

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
  const todayEntry = isCurrentMonth ? calendarData[today.getDate()] : null

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

        <div className="w-64 shrink-0 flex flex-col gap-6">
          <TodayEmotionPanel entry={todayEntry} loading={loading} />
          <CognitiveLoadGauge month={month} year={year} />
        </div>
      </div>
    </div>
  )
}

export default CalendarPage
