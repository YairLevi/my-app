import { daysFullNames, getWeekDays, prefixZero } from "../../time";
import { Tile } from "@/components/calendar/Tile";
import { calculateDatesFromLayout, getGridPosition, rowHeightInPixels } from "../../grid";
import { ItemCallback, Responsive, WidthProvider } from "react-grid-layout";
import { useCalendar } from "@/contexts/DateContext";
import { useEvents } from "@/contexts/EventsContext";
import { useEffect, useRef, useState } from "react";
import { Keys, useKeybind } from "../../hooks/useKeybind";
import { main } from "@/wails/go/models";

const ResponsiveGridLayout = WidthProvider(Responsive);

export function Grid() {
  const { date } = useCalendar()
  const { events, addEvent, updateEvent, deleteEvent } = useEvents()
  const weekDays = getWeekDays(date)

  // need both ref => for persistence of value in event listeners
  // and need state => for UI change detection.
  const NON_SELECTED = -1
  const selectedRef = useRef<number>(NON_SELECTED)
  const [selectedId, setSelectedId] = useState(NON_SELECTED)

  function updateSelected(id: number) {
    selectedRef.current = id
    setSelectedId(id)
  }

  useKeybind(() => {
    if (selectedRef.current == NON_SELECTED) return
    deleteEvent(selectedRef.current)
  }, [Keys.delete], [Keys.backspace])

  useEffect(() => {
    function onClickHandle() {
      updateSelected(-1)
    }

    window.addEventListener('click', onClickHandle)
    return () => window.removeEventListener('click', onClickHandle)
  }, [])

  const resizeHandler: ItemCallback = (layout, oldItem, newItem, placeholder, event, element) => {
    const id = Number(newItem.i)
    const dates = calculateDatesFromLayout(newItem, weekDays)

    const updatedEvent: Partial<main.Event> = { ...dates }
    updateEvent(id, updatedEvent)
  }

  return (
    <div className="h-full w-full overflow-auto flex [&_*]:text-sm [&_*]:text-white">
      <div className="h-fit pt-2">
        <div className="px-4 py-2 mt-4 text-center w-20 !text-transparent">empty</div>
        {
          [...new Array(24).keys()].map((val, i) => (
            <>
              <div key={`time${i}`} className="h-8 text-center !text-xs">
                {prefixZero(val)}:00
              </div>
              <div key={`time-half${i}`} className="h-8 !text-gray-600 text-center !text-xs">
                {prefixZero(val)}:30
              </div>
            </>
          ))
        }
      </div>
      <div className="h-fit w-full relative">
        <div className="flex w-full h-full">
          {
            weekDays.map((day, i) => (
              <div key={`day-names${i}`} className={`px-4 py-2 text-center min-w-[7rem] w-full ${date.getDay() == i && 'bg-gray-700 rounded-lg'}`}>
                <p className="!text-xs !text-gray-400">{day.toDateString().split(' ')[1]} {day.getDate()}</p>
                <p>{daysFullNames[day.getDay()]}</p>
              </div>
            ))
          }
        </div>
        <div className="w-full h-full relative pt-4 ">
          <div className="w-full min-h-full absolute">
            {
              [...new Array(24 * 2).keys()].map((val, i) => (
                <div key={`grid-row${i}`} className="flex">
                  {
                    [...new Array(7).keys()].map((val, j) => (
                      <div key={`grid-slot${i}${j}`}
                           className={`
                             h-8 min-w-[7rem] w-full 
                             border-b border-b-gray-800 
                             border-r border-r-gray-700 
                             ${i == 0 && 'border-t border-t-gray-800'}
                             `}
                      />
                    ))
                  }
                </div>
              ))
            }
          </div>
          <ResponsiveGridLayout
            className="h-full w-full min-w-[49rem]"
            breakpoints={{ lg: 1200, }}
            width={500}
            preventCollision={true}
            cols={{ 'lg': 7 }}
            rowHeight={rowHeightInPixels * 0.4}
            resizeHandles={['n', 's']}
            maxRows={24 * 4}
            compactType={null}
            isBounded={true}
            margin={[0, 0]}
            onResizeStop={resizeHandler}
            onDragStop={resizeHandler}
          >
            {
              events
                .filter(event => weekDays.some(day => day.toDateString() == event.startDate.toDateString()))
                .map(event => (
                  <Tile
                    tileId={event.id!}
                    selectedId={selectedId}
                    key={`${event.id}`}
                    start={event.startDate}
                    end={event.endDate}
                    data-grid={getGridPosition(event.startDate, event.endDate)}
                    title={event.title}
                    color={"#000000"}
                    onClick={(e) => {
                      e.stopPropagation()
                      updateSelected(event.id!)
                    }}
                  />
                ))
            }
            <div key="item-top" className="hidden"
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
                 }}>
              This is the top item, hidden, to stretch the grid.
            </div>
            <div key="item-bottom" className="hidden"
                 data-grid={{
                   w: 0,
                   h: 0,
                   x: 0,
                   y: 24 * 4,
                   isResizable: false,
                   isDraggable: false,
                   static: true,
                   minH: -1,
                   minW: -1
                 }}>
              This is the bottom item, hidden, to stretch the grid.
            </div>
          </ResponsiveGridLayout>
        </div>
      </div>
    </div>
  )
}