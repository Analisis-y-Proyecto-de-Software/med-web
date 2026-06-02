import {
  Calendar as AriaCalendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  Heading,
  Button,
} from 'react-aria-components'
import { cx } from '@/utils/cx'

function ChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const EMOTION_MAP = {
  Excelente: { emoji: '😊', dot: '#4ade80' },
  Bien:      { emoji: '🙂', dot: '#86efac' },
  Neutral:   { emoji: '😐', dot: '#facc15' },
  Mal:       { emoji: '😞', dot: '#fb923c' },
  'Muy Mal': { emoji: '😢', dot: '#f87171' },
}

export function Calendar({ className, calendarData = {}, loading = false, ...props }) {
  return (
    <AriaCalendar
      isReadOnly
      className={cx('flex flex-col gap-6 w-full select-none', className)}
      {...props}
    >
      <div className="flex items-center justify-between gap-4">
        <Button
          slot="previous"
          className="flex items-center justify-center w-10 h-10 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#00343a] cursor-pointer"
        >
          <ChevronLeft />
        </Button>

        <div className="flex-1 flex items-center justify-center gap-2">
          <Heading className="text-xl font-bold text-[#0b2b2a] capitalize" />
          {loading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#00343a]" />
          )}
        </div>

        <Button
          slot="next"
          className="flex items-center justify-center w-10 h-10 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#00343a] cursor-pointer"
        >
          <ChevronRight />
        </Button>
      </div>

      <CalendarGrid className="w-full table-fixed border-separate border-spacing-1">
        <CalendarGridHeader>
          {(day) => (
            <CalendarHeaderCell className="text-sm font-semibold text-gray-400 pb-3 text-center">
              {day}
            </CalendarHeaderCell>
          )}
        </CalendarGridHeader>
        <CalendarGridBody>
          {(date) => {
            const entry = calendarData[date.day]
            const emotions = (entry?.emotional_states ?? []).map((s) => EMOTION_MAP[s]).filter(Boolean)
            const taskCount = entry?.tasks_due_count ?? 0
            const hasContent = emotions.length > 0 || taskCount > 0

            return (
              <CalendarCell
                date={date}
                className={({ isToday, isOutsideMonth, isFocusVisible }) =>
                  cx(
                    'rounded-xl transition-colors outline-none cursor-default align-top overflow-hidden',
                    isOutsideMonth
                      ? 'opacity-25 bg-gray-50'
                      : 'bg-white border border-gray-100 shadow-sm',
                    isToday && 'bg-[#00343a]! border-[#00343a]! text-white',
                    isFocusVisible && 'ring-2 ring-[#00343a] ring-offset-1',
                  )
                }
              >
                {({ isToday, isOutsideMonth }) => (
                  <div className="flex flex-col p-2" style={{ height: '6rem' }}>
                    <span
                      className={cx(
                        'text-sm font-bold',
                        isToday ? 'text-white' : 'text-[#0b2b2a]',
                        isOutsideMonth && 'text-gray-300',
                      )}
                    >
                      {date.day}
                    </span>

                    {hasContent && !isOutsideMonth && (
                      <>
                        {taskCount > 0 && (
                          <span
                            className={cx(
                              'text-xs mt-1',
                              isToday ? 'text-white/80' : 'text-gray-400',
                            )}
                          >
                            {taskCount} {taskCount === 1 ? 'tarea' : 'tareas'}
                          </span>
                        )}
                        {emotions.length > 0 && (
                          <div className="flex items-center gap-1.5 mt-auto flex-wrap">
                            {emotions.map((em, i) => (
                              <div key={i} className="flex items-center gap-0.5">
                                <span className="text-sm leading-none">{em.emoji}</span>
                                <span
                                  className="w-1.5 h-1.5 rounded-full inline-block"
                                  style={{ backgroundColor: em.dot }}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </CalendarCell>
            )
          }}
        </CalendarGridBody>
      </CalendarGrid>
    </AriaCalendar>
  )
}
