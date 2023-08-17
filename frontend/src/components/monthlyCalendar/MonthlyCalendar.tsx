import React, { ReactNode, useEffect, useState } from "react";
import { ItemCallback, Responsive, WidthProvider } from "react-grid-layout";
import { For } from "@/components/For";
import { generateCalendarGrid } from "@/components/monthlyCalendar/utils";
import { useCalendar } from "@/contexts/DateContext";
import { MonthEvent, monthlyEvents } from "../../mock/monthEvents";
import { MonthlyTile } from "@/components/monthlyCalendar/MonthlyTile";
import uuid from "react-uuid";
import { ArrowDown, ArrowUp, ContactIcon } from "lucide-react";


const ResponsiveGridLayout = WidthProvider(Responsive)

const ROW_COUNT = 6
const COL_COUNT = 7
const ROWS_PER_CELL = 5
const GRID_COLS = COL_COUNT
const GRID_ROWS = ROW_COUNT * ROWS_PER_CELL
const RowHeightRem = 2
const rowHeightPixels = RowHeightRem * 16

export function MonthlyCalendar() {
  const { date } = useCalendar()
  const days = generateCalendarGrid(date)

  const [events, setEvents] = useState<MonthEvent[]>(monthlyEvents)

  const [startingIdxArr, setStartingIdxArr] = useState(new Array(ROW_COUNT * COL_COUNT).fill(0))




  const dragStopHandle: ItemCallback = (layout, oldItem, newItem, placeholder, event, element) => {
    updateStartingIndex(oldItem.x, oldItem.y)
    const { x, y } = newItem
    const newDate = days[Math.floor(y / ROWS_PER_CELL) * COL_COUNT + x]

    // To rerender programmatically, I added to the key some random
    // element... so, to get the ID, I need to split and take the first.
    const eventId = Number(newItem.i.split(';')[0])

    const monthEvent = events.find(ev => ev.id == eventId)!
    const newMonthEvent: MonthEvent = { ...monthEvent, date: newDate }
    setEvents(prev => [...prev.filter(ev => ev.id != eventId), newMonthEvent])
  }

  const DateToEventList: Map<string, MonthEvent[]> = new Map<string, MonthEvent[]>()
  console.log(DateToEventList)

  useEffect(() => {

  }, [events])



  days.forEach(day => DateToEventList
    .set(day.toDateString(), [])
  )
  events.forEach(event => {
    const key = event.date.toDateString()
    const eventList = DateToEventList.get(key)
    if (!eventList) return
    eventList.push(event)
  })
  days.forEach(day => DateToEventList
    .get(day.toDateString())!
    .sort((e1, e2) => e1.title.localeCompare(e2.title))
  )

  function updateStartingIndex(x: number, y: number) {
    const idx = Math.floor(y / ROWS_PER_CELL) * COL_COUNT + x
    const eventCount = DateToEventList.get(days[idx].toDateString())!.length - 1
    setStartingIdxArr(prev => {
      if (eventCount - startingIdxArr[idx] >= 3) return [...prev]
      prev[idx] = Math.max(0, prev[idx] - (3 - (eventCount - startingIdxArr[idx])))
      return [...prev]
    })
  }

  return (
    <div className="relative min-w-[45rem] h-full [&_*]:select-none">

      {/* Background Grid Design */}
      <div className="w-full absolute h-full">
        <For limit={ROW_COUNT} mapFunc={rowIndex => (
          <div className="flex border-b border-b-gray-700"
               style={{ height: 5 * RowHeightRem + "rem" }}>
            <For limit={COL_COUNT} mapFunc={colIndex => {
              const currentDateIndex = rowIndex * COL_COUNT + colIndex
              const currentDate = days[currentDateIndex]!
              const eventCount = DateToEventList.get(currentDate.toDateString())!.length

              return (
                <div
                  key={uuid()}
                  className={`min-h-[7rem] w-full border-r border-r-gray-700 flex flex-col justify-between relative`}
                >
                  {
                    eventCount > 3 &&
                      <div
                          className="absolute right-0 pl-1 top-1/2 h-full bg-red-200 -translate-y-1/2 z-[1] flex items-center"
                          style={{
                            background: "linear-gradient(to left, #1a1c22 50%, rgba(255, 0, 0, 0))"
                          }}
                      >
                          <div>
                              <ArrowUp
                                  className={`
                              text-white rounded p-0.5
                              hover:bg-white hover:bg-opacity-20
                              `}
                                  width={20}
                                  height={20}
                                  onClick={() => {
                                    setStartingIdxArr(prev => {
                                      prev[currentDateIndex] = Math.max(0, prev[currentDateIndex]-1)
                                      return [...prev]
                                    })
                                  }}
                              />
                              <ArrowDown
                                  className={`
                              text-white rounded p-0.5
                              hover:bg-white hover:bg-opacity-20
                              `}
                                  width={20}
                                  height={20}
                                  onClick={() => {
                                    setStartingIdxArr(prev => {
                                      prev[currentDateIndex] = Math.min(prev[currentDateIndex]+1, DateToEventList.get(currentDate.toDateString())!.length-3)
                                      return [...prev]
                                    })
                                  }}
                              />
                          </div>
                      </div>
                  }

                  <p
                    className={`
                    text-xs text-center pt-1
                    ${currentDate.getMonth() == date.getMonth() ? "text-white" : "text-gray-500"}
                    `}
                    style={{ height: RowHeightRem + "rem" }}
                  >
                    {currentDate.toDateString().substring(4, 10)}
                  </p>
                  {
                    eventCount > 3 &&
                      <p className="text-xs text-gray-300 mx-1 px-1 my-1 py-1 rounded">
                          {eventCount} events...
                      </p>
                  }
                </div>
              )
            }}/>
          </div>
        )}/>
      </div>

      <ResponsiveGridLayout
        className="h-full w-full min-w-[45rem] layout monthly-grid"
        breakpoints={{ lg: 1200 }}
        preventCollision={true}
        cols={{ 'lg': GRID_COLS }}
        rowHeight={rowHeightPixels}
        maxRows={GRID_ROWS}
        compactType={null}
        allowOverlap={false}
        isBounded={true}
        margin={[0, 0]}
        onDragStop={dragStopHandle}
      >
        {
          days.map((day, index) => {
            const dayEvents = DateToEventList.get(day.toDateString())!
            const Nodes: ReactNode[] = []
            for (let i = Math.min(startingIdxArr[index], ); i < Math.min(dayEvents.length, startingIdxArr[index]+3); i++) {
              const event = dayEvents[i]
              const y = Math.floor(index / 7) * 5 + 1 + i - startingIdxArr[index]
              const x = event.date.getDay()
              Nodes.push(
                <MonthlyTile
                  {...event}
                  key={`${event.id};${uuid()}`}
                  data-grid={{ w: 1, h: 1, x, y, isResizable: false, minW: -1 }}
                />
              )
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
