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
import {
  createTiles,
  dateToEvents,
  dateToSlots,
  daysBetweenDates,
  generateCalendarGrid,
  tilesFromTwoDates
} from "@/pages/calendar/month/Sorting";

const ResponsiveGridLayout = WidthProvider(Responsive)

const ROW_COUNT = 6
const COL_COUNT = 7
const ROWS_PER_CELL = 5
const GRID_COLS = COL_COUNT
const GRID_ROWS = ROW_COUNT * ROWS_PER_CELL
const ROW_HEIGHT_IN_REM = 2
const ROW_HEIGHT_IN_PIXELS = ROW_HEIGHT_IN_REM * 16

enum DragEvent {
  None,
  Create,
  Move
}

export function MonthCalendar() {
  const { date } = useCalendar()
  const { monthEvents, monthEventService } = useMonthEvents()

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

  function updateSelected(id: number) {
    selectedRef.current = id
    setSelectedId(id)
  }

  useEffect(() => {
    function onClickHandle() {
      updateSelected(-1)
    }

    window.addEventListener('click', onClickHandle)
    return () => window.removeEventListener('click', onClickHandle)
  }, [])

  useKeybind(() => {
    if (selectedRef.current == NON_SELECTED) return
    const monthEventToDelete = monthEvents.find(ev => ev.id == selectedRef.current)!
    if (!monthEventToDelete) return
    monthEventService.deleteEvent(monthEventToDelete)
  }, [monthEvents], [Keys.delete], [Keys.backspace])


  function calculateDate(event: MouseEvent): Date {
    const div = gridRef.current
    if (!div) return new Date('3000-03-03')

    const cellWidth = Math.floor(div.clientWidth / 7)
    const cellHeight = ROW_HEIGHT_IN_PIXELS * ROWS_PER_CELL

    // Get the relative position of the click within the div
    const x = event.clientX - div.getBoundingClientRect().left;
    const y = event.clientY - div.getBoundingClientRect().top;


    // Calculate the 0-indexed cell
    const columnIndex = Math.floor(x / cellWidth);
    const rowIndex = Math.floor(y / cellHeight);
    // Calculate the cell number
    const cellNumber = rowIndex * 7 + columnIndex;
    // Log the relative position
    return days[cellNumber]
  }


  const gridRef = useRef<HTMLDivElement>(null)
  const someFarDate = new Date('3000-03-03')
  const [dragEvent, setDragEvent] = useState<DragEvent>(DragEvent.None)
  const [firstDate, setFirstDate] = useState<Date>(someFarDate)
  const [secondDate, setSecondDate] = useState<Date>(someFarDate)

  // for updating an existing event
  const [movingEvent, setMovingEvent] = useState<MonthEvent>()
  const [initiallyClickedOnDate, setInitiallyClickedOnDate] = useState<Date>(new Date())


  // function mouseOutOfBounds(e: MouseEvent): boolean {
  //   const mouseX = e.clientX
  //   const mouseY = e.clientY
  //
  //   if (gridRef.current) {
  //     const { left, top, right, bottom } = gridRef.current.getBoundingClientRect();
  //     return mouseX < left || mouseX > right || mouseY < top || mouseY > bottom;
  //   }
  //   return false;
  // }

  const onMouseMove = (e: MouseEvent) => {
    switch (dragEvent) {
      case DragEvent.None:
        return
      case DragEvent.Move:
        onTileDrag(e)
        break
      case DragEvent.Create:
        onGridDrag(e)
        break
    }
  }


  function onGridDragStart(e: MouseEvent) {
    if (e.button != 0) return
    setDragEvent(DragEvent.Create)

    const start = calculateDate(e)
    setFirstDate(start)
    setSecondDate(start)
  }

  function onGridDragStop(e: MouseEvent) {
    setDragEvent(DragEvent.None)
    onOpenAdd()
  }

  function onGridDrag(e: MouseEvent) {
    setSecondDate(calculateDate(e))
  }

  function onTileDragStart(e: MouseEvent, event: MonthEvent) {
    if (e.button != 0) return
    setDragEvent(DragEvent.Move)

    const initialDate = calculateDate(e)
    setInitiallyClickedOnDate(initialDate)
    setFirstDate(event.startDate)
    setSecondDate(event.endDate)
    setMovingEvent(event)
  }

  function onTileDragStop(e: MouseEvent) {
    console.log('stopping drag tile')
    setDragEvent(DragEvent.None)
  }

  function onTileDrag(e: MouseEvent) {
    if (!movingEvent) return

    const hoverOnDate = calculateDate(e)
    const daysBetween = daysBetweenDates(hoverOnDate, initiallyClickedOnDate)

    setFirstDate(_ => {
      const nDate = new Date(movingEvent.startDate)
      nDate.setDate(nDate.getDate() + daysBetween)
      return nDate
    })
    setSecondDate(prev => {
      const nDate = new Date(movingEvent.endDate)
      nDate.setDate(nDate.getDate() + daysBetween)
      return nDate
    })
  }

  return (
    <>
      <div className="w-full items-center justify-center flex py-2">
        <Button onClick={() => {
          onOpenAdd()
        }}>Add Event</Button>
      </div>
      <div
        className="relative min-w-[45rem] h-full overflow-auto [&_*]:select-none"
      >

        {/* Background Grid UI */}
        <div className="w-full absolute h-full" ref={gridRef}>
          <For limit={ROW_COUNT} mapFunc={rowIndex => (
            <div className="flex border-b border-b-gray-700"
              style={{ height: ROWS_PER_CELL * ROW_HEIGHT_IN_REM + "rem" }}>
              <For limit={COL_COUNT} mapFunc={colIndex => {
                const currentDateIndex = rowIndex * COL_COUNT + colIndex
                const currentDate = days[currentDateIndex]!
                const eventCount = dateToEvents.get(currentDate.toDateString())?.length || 0
                const slotCount = dateToSlots.get(currentDate.toDateString()) || 0

                return (
                  <div key={uuid()} className={`min-h-[7rem] w-full border-r border-r-gray-700 relative flex flex-col justify-between`}>
                    <p
                      className={`text-xs text-center pt-1 ${currentDate.getMonth() == date.getMonth() ? "text-white" : "text-gray-500"}`}
                      style={{ height: ROW_HEIGHT_IN_REM + "rem" }}
                    >
                      {currentDate.toDateString().substring(4, 10)}
                    </p>
                    {
                      slotCount != eventCount &&
                      <p className="text-xs text-gray-300 mx-1 px-1 my-1 py-1 rounded z-[100] hover:bg-white hover:bg-opacity-20 transition-colors"
                        onClick={e => {
                          e.stopPropagation()
                          // TODO: open a dialog with all the events of the current date
                        }}
                      >
                        {eventCount - slotCount} more events...
                      </p>
                    }
                  </div>
                )
              }} />
            </div>
          )} />
        </div>
        <div className="h-full w-full min-w-[45rem]"
          onMouseDown={onGridDragStart}
          onMouseUp={onGridDragStop}
          onMouseMove={onMouseMove}
        >
          <ResponsiveGridLayout
            className="h-full w-full min-w-[45rem] layout monthly-grid relative"
            breakpoints={{ lg: 1200 }}
            preventCollision={true}
            cols={{ 'lg': GRID_COLS }}
            rowHeight={ROW_HEIGHT_IN_PIXELS}
            useCSSTransforms={true}
            maxRows={GRID_ROWS}
            compactType={null}
            allowOverlap={true}
            isBounded={true}
            margin={[0, 0]}
          >
            {
              dragEvent != DragEvent.None &&
              tilesFromTwoDates(firstDate, secondDate, days)
                .map(tile => (
                  <Tile
                    selectedId={-1}
                    className="[&_*]:!bg-opacity-70 [&_*]:!opacity-70 !z-[999] [&>*]:bg-red-500"
                    onTileDragStart={() => {
                    }}
                    onTileDragStop={(e) => {
                      switch (dragEvent) {
                        case DragEvent.Create:
                          onGridDragStop(e)
                        case DragEvent.Move:
                          onTileDragStop(e)
                      }
                    }}
                    key={JSON.stringify(tile.layout)} // again... for re-rendering purposes.
                    data-grid={{ ...tile.layout, isResizable: false }}
                    event={tile.event}
                  />
                ))
            }

            {/*
            The grid UI library requires the key to change in order for the tiles to
            be re-rendered. so, I added date.toDateString() to the key
            */}
            {
              createTiles(monthEvents, days)
                .map(tile => (
                  <Tile
                    onTileDragStart={e => onTileDragStart(e, tile.event)}
                    onTileDragStop={onTileDragStop}
                    event={tile.event}
                    selectedId={selectedId}
                    key={tile.layout.i + date.toDateString()}
                    data-grid={{ ...tile.layout, isResizable: false }}
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
          setSecondDate(someFarDate)
          setFirstDate(someFarDate)
        }}
        startDate={firstDate.getTime() < secondDate.getTime() ? firstDate : secondDate}
        endDate={firstDate.getTime() > secondDate.getTime() ? firstDate : secondDate}
        title="Add Event"
      />
    </>
  )
}
