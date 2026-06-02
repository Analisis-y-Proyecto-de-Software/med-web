import {
  Calendar as AriaCalendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  Heading,
  Button,
} from 'react-aria-components';
import { cx } from '@/utils/cx';

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Calendar({ className, ...props }) {
  return (
    <AriaCalendar
      className={cx('inline-flex flex-col gap-4 select-none', className)}
      {...props}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <Button
          slot="previous"
          className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
        >
          <ChevronLeft />
        </Button>

        <Heading className="text-sm font-semibold text-gray-900 flex-1 text-center" />

        <Button
          slot="next"
          className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
        >
          <ChevronRight />
        </Button>
      </div>

      {/* Grid */}
      <CalendarGrid className="w-full border-collapse">
        <CalendarGridHeader>
          {(day) => (
            <CalendarHeaderCell className="text-xs font-medium text-gray-400 pb-2 text-center w-10">
              {day}
            </CalendarHeaderCell>
          )}
        </CalendarGridHeader>
        <CalendarGridBody>
          {(date) => (
            <CalendarCell
              date={date}
              className={({ isSelected, isDisabled, isUnavailable, isFocusVisible, isOutsideMonth }) =>
                cx(
                  'text-sm w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-colors outline-none',
                  isOutsideMonth && 'text-gray-300',
                  !isOutsideMonth && !isSelected && !isDisabled && 'text-gray-700 hover:bg-gray-100',
                  isSelected && 'bg-blue-600 text-white font-semibold hover:bg-blue-700',
                  (isDisabled || isUnavailable) && 'text-gray-300 cursor-not-allowed',
                  isFocusVisible && 'ring-2 ring-blue-500 ring-offset-1',
                )
              }
            />
          )}
        </CalendarGridBody>
      </CalendarGrid>
    </AriaCalendar>
  );
}
