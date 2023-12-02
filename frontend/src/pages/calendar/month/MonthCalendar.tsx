import React, { MouseEvent, useEffect, useRef, useState } from "react";
import { ItemCallback, Responsive, WidthProvider } from "react-grid-layout";
import { For } from "@/components/For";
import { useCalendar } from "@/contexts/DateContext";
import { MonthEvent, useMonthEvents, WeekEvent } from "@/contexts/Events";
import { Tile } from "@/pages/calendar/month/Tile";
import uuid from "react-uuid";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "@/components/Button";
import { AddMonthlyEventModal } from "@/pages/calendar/month/AddEvent.modal";
import { useModal } from "@/components/Modal";
import { Keys, useKeybind } from "@/hooks/useKeybind";
import { createLayout } from "@/pages/calendar/month/Sorting";
import { mockMonthEvents } from "@/pages/calendar/month/MockMonthEvents";

const ResponsiveGridLayout = WidthProvider(Responsive)

const ROW_COUNT = 6
const COL_COUNT = 7
const ROWS_PER_CELL = 5
const GRID_COLS = COL_COUNT
const GRID_ROWS = ROW_COUNT * ROWS_PER_CELL
const RowHeightRem = 2
const rowHeightPixels = RowHeightRem * 16


function generateCalendarGrid(currentDate: Date): Date[] {
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  const prevMonthLastDays = [];
  const startDay = firstDayOfMonth.getDay(); // Starting from Sunday
  for (let i = startDay === 0 ? 6 : startDay - 1; i >= 0; i--) {
    const prevDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), -i);
    prevMonthLastDays.push(prevDay);
  }

  const daysToAdd = 42 - daysInMonth - prevMonthLastDays.length;
  const nextMonthCompletingDays = [];
  for (let i = 1; i <= daysToAdd; i++) {
    const nextDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i);
    nextMonthCompletingDays.push(nextDay);
  }

  return [
    ...prevMonthLastDays,
    ...Array.from({ length: daysInMonth },
      (_, i) => new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1)),
    ...nextMonthCompletingDays
  ];
}


export function MonthCalendar() {
  const { date } = useCalendar()
  const { monthEvents, monthEventService } = useMonthEvents()

  const [clickDate, setClickDate] = useState<Date>()

  const {
    open: openAdd,
    onClose: onCloseAdd,
    onOpen: onOpenAdd
  } = useModal()
  const days = generateCalendarGrid(date)
  const NON_SELECTED = -1

  // need both ref => for persistence of value in event listeners
  // and need state => for UI change detection.
  const selectedRef = useRef<number>(NON_SELECTED)
  const [selectedId, setSelectedId] = useState(NON_SELECTED)

  const [edited, setEdited] = useState<WeekEvent | undefined>()

  function updateSelected(id: number) {
    selectedRef.current = id
    setSelectedId(id)
  }

  useKeybind(() => {
    if (selectedRef.current == NON_SELECTED) return
    const monthEventToDelete = monthEvents.find(ev => ev.id == selectedRef.current)!
    if (!monthEventToDelete) return
    monthEventService.deleteEvent(monthEventToDelete)
  }, [monthEvents], [Keys.delete], [Keys.backspace])

  useEffect(() => {
    function onClickHandle() {
      updateSelected(-1)
    }

    window.addEventListener('click', onClickHandle)
    return () => window.removeEventListener('click', onClickHandle)
  }, [])


  const dateToEvents: Map<string, MonthEvent[]> = new Map<string, MonthEvent[]>()

  const [startingIdxArr, setStartingIdxArr] = useState(new Array(ROW_COUNT * COL_COUNT).fill(0))

  const dragStopHandle: ItemCallback = async (layout, oldItem, newItem, placeholder, event, element) => {
    const { x, y } = newItem
    const newDate = days[Math.floor(y / ROWS_PER_CELL) * COL_COUNT + x]

    // To rerender programmatically, I added to the key some random
    // element... so, to get the ID, I need to split and take the first.
    const eventId = Number(newItem.i.split(';')[0])

    const monthEvent = monthEvents.find(ev => ev.id == eventId)!
    const newMonthEvent: MonthEvent = { ...monthEvent, startDate: newDate, endDate: newDate }
    await monthEventService.updateEvent(newMonthEvent)
    updateStartingIndex(oldItem.x, oldItem.y)
  }

  days.forEach(day => dateToEvents
    .set(day.toDateString(), [])
  )
  monthEvents.forEach(event => {
    const key = event.startDate.toDateString()
    const eventList = dateToEvents.get(key)
    if (!eventList) return
    eventList.push(event)
  })
  days.forEach(day => dateToEvents
    .get(day.toDateString())!
    .sort((e1, e2) => e1.title.localeCompare(e2.title))
  )

  function updateStartingIndex(x: number, y: number) {
    const idx = Math.floor(y / ROWS_PER_CELL) * COL_COUNT + x
    const eventCount = dateToEvents.get(days[idx].toDateString())!.length - 1
    setStartingIdxArr(prev => {
      if (eventCount - startingIdxArr[idx] >= 3) return [...prev]
      prev[idx] = Math.max(0, prev[idx] - (3 - (eventCount - startingIdxArr[idx])))
      return [...prev]
    })
  }

  useEffect(() => {
    if (!clickDate) {
      return
    }
    onOpenAdd()
  }, [clickDate]);

  function calculateDate(event: MouseEvent<HTMLDivElement>) {
    const div = event.currentTarget

    const cellWidth = Math.floor(div.clientWidth / 7);  // 7 columns
    // const cellHeight = Math.floor(div.clientHeight / 6); // 6 rows

    const cellHeight = rowHeightPixels * 5

    // Get the relative position of the click within the div
    const x = event.clientX - div.getBoundingClientRect().left;
    const y = event.clientY - div.getBoundingClientRect().top;


    // Calculate the 0-indexed cell
    const columnIndex = Math.floor(x / cellWidth);
    const rowIndex = Math.floor(y / cellHeight);
    // Calculate the cell number
    const cellNumber = rowIndex * 7 + columnIndex;
    // Log the relative position
    const day = days[cellNumber]
    setClickDate(day)
  }

  const [dragging, setDragging] = useState('')

  return (
    <>
      <div className="w-full items-center justify-center flex py-2">
        <Button onClick={() => {
          setClickDate(undefined)
          onOpenAdd()
        }}>Add Event</Button>
      </div>
      <div className="relative min-w-[45rem] h-full overflow-auto [&_*]:select-none">

        {/* Background Grid UI */}
        <div className="w-full absolute h-full">
          <For limit={ROW_COUNT} mapFunc={rowIndex => (
            <div className="flex border-b border-b-gray-700"
                 style={{ height: ROWS_PER_CELL * RowHeightRem + "rem" }}>
              <For limit={COL_COUNT} mapFunc={colIndex => {
                const currentDateIndex = rowIndex * COL_COUNT + colIndex
                const currentDate = days[currentDateIndex]!
                const eventCount = dateToEvents.get(currentDate.toDateString())!.length

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
                                        prev[currentDateIndex] = Math.max(0, prev[currentDateIndex] - 1)
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
                                        prev[currentDateIndex] = Math.min(prev[currentDateIndex] + 1, eventCount - 3)
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
        <div className="h-full w-full min-w-[45rem]"
             onClick={(e) => calculateDate(e)}
        >
          <ResponsiveGridLayout
            className="h-full w-full min-w-[45rem] layout monthly-grid relative"
            breakpoints={{ lg: 1200 }}
            preventCollision={true}
            cols={{ 'lg': GRID_COLS }}
            rowHeight={rowHeightPixels}
            useCSSTransforms={true}
            maxRows={GRID_ROWS}
            compactType={null}
            allowOverlap={false}
            isBounded={true}

            margin={[0, 0]}
            onDragStop={dragStopHandle}
          >

            {
              createLayout(mockMonthEvents, days)
                .map(tile => (
                  <Tile
                    setDrag={(id) => setDragging(id)}
                    event={tile.event}
                    selectedId={selectedId}
                    key={tile.layout.i}
                    data-grid={{...tile.layout, isResizable: false }}
                    onClick={(e) => {
                      e.stopPropagation()
                      updateSelected(tile.event.id!)
                    }}
                  />
                ))
            }

            {/*{*/}
            {/*  days.map((day, index) => {*/}
            {/*    const dayEvents = dateToEvents.get(day.toDateString())!*/}
            {/*    const Nodes: ReactNode[] = []*/}
            {/*    for (let i = startingIdxArr[index]; i < Math.min(dayEvents.length, startingIdxArr[index] + 3); i++) {*/}
            {/*      const event = dayEvents[i]*/}
            {/*      const y = Math.floor(index / COL_COUNT) * ROWS_PER_CELL + 1 + i - startingIdxArr[index]*/}
            {/*      const x = event.startDate.getDay()*/}
            {/*      Nodes.push(*/}
            {/*        <Tile*/}
            {/*          setDrag={(id) => setDragging(id)}*/}
            {/*          event={event}*/}
            {/*          selectedId={selectedId}*/}
            {/*          key={`${event.id};${uuid()}`}*/}
            {/*          data-grid={{ w: 1, h: 1, x, y, isResizable: false }}*/}
            {/*          onClick={(e) => {*/}
            {/*            e.stopPropagation()*/}
            {/*            updateSelected(event.id!)*/}
            {/*          }}*/}
            {/*        />*/}
            {/*      )*/}
            {/*    }*/}

            {/*    return Nodes*/}
            {/*  })*/}
            {/*}*/}

            {/* HIDDEN CELLS, TO STRETCH THE GRID */}
            <div
              key="item-top"
              className="hidden"
              data-grid={{ w: 0, h: 0, x: 0, y: 0, static: true, minH: -1, minW: -1 }}
            >
              This is the top item, hidden, to stretch the grid.
            </div>
            <div
              key="item-bottom"
              className="hidden"
              data-grid={{ w: 0, h: 1, x: 0, y: GRID_ROWS - 1, static: true, minH: -1, minW: -1 }}
            >
              This is the bottom item, hidden, to stretch the grid.
            </div>
          </ResponsiveGridLayout>

        </div>
      </div>


      <AddMonthlyEventModal
        open={openAdd}
        onClose={() => {
          onCloseAdd()
          setClickDate(undefined)
        }}
        title="Add Event"
        date={clickDate}
      />
    </>
  )
}
