import React, { MouseEvent, useEffect, useRef, useState } from "react";
import { ItemCallback, Responsive, WidthProvider } from "react-grid-layout";
import { For } from "@/components/For";
import { useCalendar } from "@/contexts/DateContext";
import { MonthEvent, useMonthEvents, WeekEvent } from "@/contexts/Events";
import { Tile } from "@/pages/calendar/month/Tile";
import uuid from "react-uuid";
import { Button } from "@/components/Button";
import { AddMonthlyEventModal } from "@/pages/calendar/month/AddEvent.modal";
import { useModal } from "@/components/Modal";
import { Keys, useKeybind } from "@/hooks/useKeybind";
import { createTiles, dateToEvents, generateCalendarGrid } from "@/pages/calendar/month/Sorting";

const ResponsiveGridLayout = WidthProvider(Responsive)

const ROW_COUNT = 6
const COL_COUNT = 7
const ROWS_PER_CELL = 5
const GRID_COLS = COL_COUNT
const GRID_ROWS = ROW_COUNT * ROWS_PER_CELL
const RowHeightRem = 2
const rowHeightPixels = RowHeightRem * 16


export function MonthCalendar() {
  const { date } = useCalendar()
  const { monthEvents, monthEventService } = useMonthEvents()
  let clickOnGrid = false

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


  // const dateToEvents: Map<string, MonthEvent[]> = new Map<string, MonthEvent[]>()

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

  const [dragging, setDragging] = useState(false)

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
                const eventCount = dateToEvents.get(currentDate.toDateString())?.length || 0

                return (
                  <div
                    key={uuid()}
                    className={`min-h-[7rem] w-full border-r border-r-gray-700 relative flex flex-col justify-between
                    ${dragging && 'bg-blue-400'}
                    `}
                  >
                    <p
                      className={`text-xs text-center pt-1 ${currentDate.getMonth() == date.getMonth() ? "text-white" : "text-gray-500"}`}
                      style={{ height: RowHeightRem + "rem" }}
                    >
                      {currentDate.toDateString().substring(4, 10)}
                    </p>
                    {
                      eventCount > 3 &&
                        <p className="text-xs text-gray-300 mx-1 px-1 my-1 py-1 rounded">
                          {eventCount-3} more events...
                        </p>
                    }
                  </div>
                )
              }}/>
            </div>
          )}/>
        </div>
        <div className="h-full w-full min-w-[45rem]"
             onMouseDown={e => {
               clickOnGrid = true
             }}
             onMouseUp={e => {
               if (clickOnGrid) {
                 console.log('Clicked on thing')
                 calculateDate(e)
               }

               setDragging(false)
               clickOnGrid = false
             }}
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
            allowOverlap={true}
            isBounded={true}

            margin={[0, 0]}
            onDragStop={dragStopHandle}
          >
            {/*
            The grid UI library requires the key to change in order for the tiles to
            be re-rendered. so, I added date.toDateString() to the key
            */}
            {
              createTiles(monthEvents, days)
                .map(tile => (
                  <Tile
                    onTileDragStart={e => setDragging(true)}
                    onTileDragStop={e => setDragging(false)}
                    event={tile.event}
                    selectedId={selectedId}
                    key={tile.layout.i + date.toDateString()}
                    data-grid={{...tile.layout, isResizable: false }}
                    onClick={(e) => {
                      e.stopPropagation()
                      updateSelected(tile.event.id!)
                    }}
                  />
                ))
            }

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
