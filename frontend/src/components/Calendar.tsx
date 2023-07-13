import { PropsWithChildren, useState } from "react";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const ROW_COUNT = 6
const COL_COUNT = 7



function getRandomColor() {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * letters.length)];
  }
  return color;
}

interface Props extends PropsWithChildren {
  className?: string
  blurred?: boolean
  date?: Date
  selected?: Date
  onClick?: () => void
}

function Tile({ className, children, blurred, date, selected, onClick }: Props) {
  function isSelected() {
    if (!date || !selected) return false
    return selected?.getFullYear() == date?.getFullYear()
      && selected?.getMonth() == date?.getMonth()
      && selected?.getDate() == date?.getDate()
  }

  return (
    <div
      className={`
    ${isSelected() && 'bg-white bg-opacity-20'}
    ${blurred && '!text-gray-500'}
    py-1.5 text-gray-300 text-xs w-8 flex flex-col items-center justify-center 
    select-none hover:cursor-pointer rounded-md px-2 relative
    ${className}`}
      onClick={() => onClick && onClick()}
    >
      {children}
      <div className="flex gap-0.5 absolute bottom-0">
        <div className="rounded-full bg-green-600 w-1 h-1 text-transparent">i</div>
        <div className="rounded-full bg-blue-600 w-1 h-1 text-transparent">i</div>
        <div className="rounded-full bg-red-600 w-1 h-1 text-transparent">i</div>
        {/*<div className="rounded-full text-[0.5rem] h-1 flex items-center pb-0.5">+</div>*/}
      </div>
    </div>
  )
}

export function Calendar() {
  const [monthIdx, setMonthIdx] = useState(new Date().getMonth())
  const [year, setYear] = useState(new Date().getFullYear())
  const [selectedDate, setSelectedDate] = useState(new Date())

  function clickOnDayPreviousMonth(day: number) {
    const _year = year - (monthIdx == 0 ? 1 : 0)
    const _monthIdx = (monthIdx - 1) % 12
    previousMonth()
    setSelectedDate(new Date(_year, _monthIdx, day))
  }

  function clickOnDayNextMonth(day: number) {
    const _year = year + (monthIdx == 11 ? 1 : 0)
    const _monthIdx = (monthIdx + 1) % 12
    nextMonth()
    setSelectedDate(new Date(_year, _monthIdx, day))
  }

  function nextMonth() {
    if (monthIdx == 11) {
      setYear(year => year + 1)
      setMonthIdx(0)
    } else {
      setMonthIdx((monthIdx + 1) % 12)
    }
  }

  function previousMonth() {
    if (monthIdx == 0) {
      setYear(year => year - 1)
      setMonthIdx(11)
    } else {
      setMonthIdx((monthIdx - 1) % 12)
    }
  }

  function getFirstDayOfMonth() {
    const firstDay = new Date(year, monthIdx, 1);
    return firstDay.getDay()
  }

  function getToToday() {
    setYear(new Date().getFullYear())
    setMonthIdx(new Date().getMonth())
    setSelectedDate(new Date())
  }

  function getMonthAndYear() {
    const date = new Date(year, monthIdx, 1);  // 2009-11-10
    const month = date.toLocaleString('default', { month: 'long' });
    return `${month}, ${date.getFullYear()}`
  }

  function getNumberOfDaysInMonth(month: number) {
    const today = new Date();
    const year = today.getFullYear();
    const lastDay = new Date(year, month + 1, 0).getDate();
    return lastDay;
  }

  const lastMonthDay = getNumberOfDaysInMonth((monthIdx - 1) % 12)
  const firstDay = getFirstDayOfMonth()
  const daysToFill = ROW_COUNT * COL_COUNT - (firstDay + getNumberOfDaysInMonth(monthIdx))

  const previousMonthDays = [...Array(lastMonthDay + 1).keys()].slice(lastMonthDay - firstDay + 1)
  const currentMonthDays = [...Array(getNumberOfDaysInMonth(monthIdx)).keys()].map(i => i + 1)
  const nextMonthDays = [...Array(daysToFill).keys()].map(i => i + 1)

  return (
    <div className="flex flex-col min-w-[5rem]">
      <div className="flex px-4 justify-between [&>*]:whitespace-nowrap">
        <p className="text-white">{getMonthAndYear()}</p>
        <div className="flex gap-1 [&_*]:text-gray-300 [&_*]:text-sm [&_*]:bg-[#222222] [&_*]:rounded-md">
          <button className="w-7 h-7" onClick={previousMonth}>
            <FontAwesomeIcon icon={faChevronLeft}/>
          </button>
          <button className="px-2" onClick={getToToday}>
            Today
          </button>
          <button className="w-7 h-7" onClick={nextMonth}>
            <FontAwesomeIcon icon={faChevronRight}/>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-y-1 p-3 place-items-center">
        {
          days.map((day, i) => (
            <p key={i} className="text-gray-400 text-[0.6rem] font-bold text-center mb-2">
              {day}
            </p>
          ))
        }
        {
          previousMonthDays
            .map((val, i) => (
              <Tile key={i} blurred onClick={() => clickOnDayPreviousMonth(val)}>
                {val}
              </Tile>
            ))
        }
        {
          currentMonthDays
            .map((val, i) => (
              <Tile
                key={i}
                selected={selectedDate}
                date={new Date(year, monthIdx, val)}
                onClick={() => setSelectedDate(new Date(year, monthIdx, val))}
              >
                {val}
              </Tile>
            ))
        }
        {
          nextMonthDays
            .map((val, i) => (
              <Tile key={i} blurred onClick={() => clickOnDayNextMonth(val)}>
                {val}
              </Tile>
            ))
        }
      </div>
    </div>
  )
}
