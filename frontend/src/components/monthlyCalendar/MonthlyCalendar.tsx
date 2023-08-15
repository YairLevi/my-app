import React, {ReactNode, useState} from "react";
import {Responsive, WidthProvider} from "react-grid-layout";
import {For} from "@/components/For";
import {generateCalendarGrid} from "@/components/monthlyCalendar/utils";
import {useCalendar} from "@/contexts/DateContext";
import {MonthEvent, monthlyEvents} from "../../mock/monthEvents";
import {MonthlyTile} from "@/components/monthlyCalendar/MonthlyTile";

const ResponsiveGridLayout = WidthProvider(Responsive)

const ROW_COUNT = 6
const COL_COUNT = 7
const ROWS_PER_CELL = 5
const GRID_COLS = COL_COUNT
const GRID_ROWS = ROW_COUNT * ROWS_PER_CELL
const RowHeightRem = 2
const rowHeightPixels = RowHeightRem * 16

export function MonthlyCalendar() {
  const {date} = useCalendar()
  const days = generateCalendarGrid(date)

  const [events, setEvents] = useState<MonthEvent[]>(monthlyEvents)

  const DateToEventList: Map<string, MonthEvent[]> = new Map<string, MonthEvent[]>()

  for (const day of days) {
    DateToEventList.set(day.toDateString(), [])
  }

  for (const event of events) {
    const key = event.date.toDateString()
    const eventList = DateToEventList.get(key)
    if (!eventList) continue
    eventList.push(event)
  }

  for (const day of days) {
    DateToEventList.get(day.toDateString())!.sort((ev1, ev2) => ev1.date < ev2.date ? -1 : 1)
  }

  const isDate = (date1: Date, date2: Date) => date1.getMonth() == date2.getMonth()

  return (
    <div className="relative min-w-[49rem] h-full">

      {/* Background Grid Design */}
      <div className="w-full absolute h-full">
        <For limit={ROW_COUNT} mapFunc={rowIndex => (
          <div className="flex border-b border-b-gray-700"
               style={{height: 5 * RowHeightRem + "rem"}}>
            <For limit={COL_COUNT} mapFunc={colIndex => {
              const extraEvents = DateToEventList.get(days[rowIndex * 7 + colIndex].toDateString())!.length - 3

              return (
                <div
                  key={`monthly-grid-${rowIndex}-${colIndex}`}
                  className={`min-h-[7rem] w-full border-r border-r-gray-700 flex flex-col justify-between`}
                >
                  <p
                    className={`text-xs text-center pt-1 ${isDate(days[rowIndex * 7 + colIndex], date) ? "text-white" : "text-gray-500"}`}
                    style={{height: RowHeightRem + "rem"}}
                  >
                    {days[rowIndex * 7 + colIndex].toDateString().substring(4, 10)}
                  </p>
                  {extraEvents > 0 &&
                      <p className="text-xs text-gray-300 mx-1 px-1 my-1 py-1 rounded">{extraEvents} more events...</p>}
                </div>
              )
            }}/>
          </div>
        )}/>
      </div>

      <ResponsiveGridLayout
        className="h-full w-full min-w-[49rem] layout monthly-grid"
        breakpoints={{lg: 1200}}
        preventCollision={true}
        cols={{'lg': 7}}
        rowHeight={rowHeightPixels}
        maxRows={GRID_ROWS}
        compactType={null}
        allowOverlap={false}
        isBounded={true}
        margin={[0, 0]}
        // onDragStop={(layout, oldItem, newItem, placeholder, event, element) => {
        //   const monthEvent = events.find(ev => ev.id + "" == newItem.i)!
        //   const newDate = days[Math.floor(newItem.y / 5) * 7 + newItem.x]
        //   const date = monthEvent.date
        //   date.setFullYear(newDate.getFullYear(), newDate.getMonth(), newDate.getDate())
        //
        //   setEvents(prev => [
        //     ...prev.filter(ev => ev.id + "" != newItem.i),
        //     {
        //       ...monthEvent,
        //       date
        //     }
        //   ])
        //
        // }}
      >
        {
          days.map((day, index) => {
            const dayEvents = DateToEventList.get(day.toDateString())!
            const Nodes: ReactNode[] = []

            for (let i = 0; i < Math.min(dayEvents.length, 3); i++) {
              const event = dayEvents[i]
              const y = Math.floor(index / 7) * 5 + 1 + i
              const x = event.date.getDay()
              const key = event.date.toDateString() + y
              Nodes.push(<MonthlyTile {...event} key={event.id} data-grid={{w: 1, h: 1, x, y, isResizable: false}}/>)
            }

            return Nodes
          })
        }

        <div
          key="item-top"
          className="hidden"
          data-grid={{
            w: 0,
            h: 0,
            x: 0,
            y: 0,
            isResizable: false,
            isDraggable: false,
            static: true,
            minH: -1,
            minW: -1
          }}
        >
          This is the top item, hidden, to stretch the grid.
        </div>
        <div
          key="item-bottom"
          className="hidden"
          data-grid={{
            w: 0,
            h: 1,
            x: 0,
            y: GRID_ROWS - 1,
            isResizable: false,
            isDraggable: false,
            static: true,
            minH: -1,
            minW: -1
          }}
        >
          This is the bottom item, hidden, to stretch the grid.
        </div>
      </ResponsiveGridLayout>
    </div>
  )
}