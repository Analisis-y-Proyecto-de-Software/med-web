import { useState } from 'react'
import { Calendar } from '../Calendar'
import useCalendarData from '../hooks/useCalendarData'

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

  return (
    <div className="flex flex-col gap-6 h-full">
      <h1 className="text-2xl font-bold text-[#0b2b2a]">Calendario</h1>
      <div className="flex-1 bg-white rounded-2xl shadow-sm p-8">
        <Calendar
          calendarData={calendarData}
          loading={loading}
          onFocusChange={handleFocusChange}
        />
      </div>
    </div>
  )
}

export default CalendarPage
