import { daysInitials, getWeekDays, prefixZero } from "../../../time";
import { Tile } from "@/pages/calendar/week/Tile";
import { calculateDatesFromLayout, getGridPosition, rowHeightInPixels } from "../../../grid";
import { ItemCallback, Responsive, WidthProvider } from "react-grid-layout";
import { useCalendar } from "@/contexts/DateContext";
import { useWeekEvents, WeekEvent } from "@/contexts/Events";
import React, { useEffect, useRef, useState } from "react";
import { Keys, useKeybind } from "@/hooks/useKeybind";
import { ContextMenu } from "@/components/ContextMenu";
import { useContextMenu } from "@/hooks/useContextMenu";
import { EditEventModal } from "@/pages/calendar/week/EditEvent.modal";
import { faCog, faPencil } from "@fortawesome/free-solid-svg-icons";
import { AddEventModal } from "@/pages/calendar/week/AddEvent.modal";
import { Button } from "@/components/Button";
import { createWeekCalendarLayout, GRID_COLUMN_COUNT } from "@/pages/calendar/week/WeekSorting";
import { mockWeekEvents } from "@/pages/calendar/week/MockWeekEvents";

const ResponsiveGridLayout = WidthProvider(Responsive);
const NON_SELECTED = -1


export function WeekCalendar() {
  const { date } = useCalendar()
  const { weekEvents, weekEventService } = useWeekEvents()
  const weekDays = getWeekDays(date)
  const deleteRefWeekDays = useRef(weekEvents)

  const [openEdit, setOpenEdit] = useState(false)
  const [openAdd, setOpenAdd] = useState(false)

  const menuRef = useRef<HTMLDivElement>(null)
  const [options, openMenu, closeMenu] = useContextMenu(menuRef)

  // need both ref => for persistence of value in event listeners
  // and need state => for UI change detection.
  const selectedRef = useRef<number>(NON_SELECTED)
  const [selectedId, setSelectedId] = useState(NON_SELECTED)

  const [edited, setEdited] = useState<WeekEvent | undefined>()

  useEffect(() => {
    deleteRefWeekDays.current = weekEvents
  }, [weekEvents]);

  function updateSelected(id: number) {
    selectedRef.current = id
    setSelectedId(id)
  }

  useKeybind(() => {
    if (selectedRef.current == NON_SELECTED) return
    const weekEvent = deleteRefWeekDays.current.find(ev => ev.id == selectedRef.current)!
    weekEventService.deleteEvent(weekEvent)
  }, [], [Keys.delete], [Keys.backspace])

  useEffect(() => {
    function onClickHandle() {
      updateSelected(-1)
    }

    window.addEventListener('click', onClickHandle)
    return () => window.removeEventListener('click', onClickHandle)
  }, [])

  const resizeHandler: ItemCallback = (layout, oldItem, newItem, placeholder, event, element) => {
    const id = Number(newItem.i.split(';')[0])
    const dates = calculateDatesFromLayout(newItem, weekDays)

    const weekEvent = weekEvents.find(ev => ev.id == id)!
    const updatedEvent: WeekEvent = { ...weekEvent, ...dates }
    weekEventService.updateEvent(updatedEvent)
  }

  return (
    <>
      <div className="w-full flex justify-center gap-5 items-center py-2">
        <Button
          onClick={() => setOpenAdd(true)}
        >
          Add Event
        </Button>
      </div>
      <div className="h-full w-full overflow-auto flex [&_*]:text-white">
        <div className="h-fit pt-2">
          <div className="px-4 py-2 -mt-1 text-center w-20 !text-transparent">empty</div>
          {
            [...new Array(24).keys()].map((val, i) => (
              <div key={`t${i}`}>
                <div key={`time${i}`} className="h-16 text-center text-xs">
                  {prefixZero(val)}:00
                </div>
              </div>
            ))
          }
        </div>
        <div className="h-fit w-full min-w-[59rem]">
          <div className="flex w-full h-full">
            {
              weekDays.map((day, i) => (
                <div key={`day-names${i}`} className={`px-4 py-2 text-center min-w-[7rem] w-full ${date.getDay() == i && 'bg-gray-700 rounded-lg'}`}>
                  <p className="text-sm">{daysInitials[day.getDay()]} {day.getDate()}</p>
                </div>
              ))
            }
          </div>
          <div className="w-full h-full relative pt-4">
            <div className="w-full min-h-full absolute">
              {
                [...new Array(24).keys()].map((val, i) => (
                  <div key={`grid-row${i}`} className="flex">
                    {
                      [...new Array(7).keys()].map((val, j) => (
                        <div key={`grid-slot${i}${j}`}
                             className={`
                             h-16 min-w-[7rem] w-full 
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
              className="h-full w-full layout"
              breakpoints={{ lg: 1200, }}
              width={500}
              preventCollision={true}
              cols={{ 'lg': 7 * GRID_COLUMN_COUNT }}
              rowHeight={rowHeightInPixels * 0.4}
              resizeHandles={['n', 's']}
              maxRows={24 * 4}
              compactType={null}
              isBounded={true}
              margin={[0, 0]}
              allowOverlap={true}
              onResizeStop={resizeHandler}
              onDragStop={resizeHandler}
            >
              {
                createWeekCalendarLayout(mockWeekEvents, weekDays)
                  .map((tile, i) => (
                    <Tile
                      key={tile.layout.i + i}
                      data-grid={{...tile.layout, isResizable: false}}
                      color={"#5c1f7f"}
                      event={tile.event}
                      selectedId={-1}
                    />
                  ))
                // weekEvents
                //   .filter(event => weekDays.some(day => day.toDateString() == event.startDate.toDateString()))
                //   .map(event => {
                //     const key = `${event.id};${new Date(event.startDate).getTime()};${new Date(event.endDate).getTime()}`
                //     return (
                //       <Tile
                //         selectedId={selectedId}
                //         event={event}
                //         key={key}
                //         data-grid={getGridPosition(event.startDate, event.endDate)}
                //         color={"#0fa12f"}
                //         onClick={(e) => {
                //           e.stopPropagation()
                //           updateSelected(event.id!)
                //         }}
                //         onContextMenu={(e) => {
                //           openMenu(e)
                //           setEdited(event)
                //         }}
                //       />
                //     )
                //   })
              }
              <div
                key="item-top-week"
                className="hidden"
                data-grid={{ w: 0, h: 0, x: 0, y: 0, static: true, minH: -1, minW: -1 }}
              >
                This is the top item, hidden, to stretch the grid.
              </div>
              <div
                key="item-bottom-week"
                className="hidden"
                data-grid={{ w: 0, h: 0, x: 0, y: 24 * 4, static: true, minH: -1, minW: -1 }}
              >
                This is the bottom item, hidden, to stretch the grid.
              </div>
            </ResponsiveGridLayout>
          </div>
        </div>
      </div>

      <ContextMenu
        {...options}
        ref={menuRef}
        options={[
          {
            content: "Edit",
            icon: faPencil,
            onClick: () => {
              setOpenEdit(true)
              closeMenu()
            },
          },
          "divider",
          {
            content: "Options",
            icon: faCog,
            onClick: () => {
              console.log("yes")
            }
          },

        ]}
      />

      {
        edited &&
          <EditEventModal
              open={openEdit}
              onClose={() => setOpenEdit(false)}
              event={edited}
          />
      }
      <AddEventModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
      />
    </>
  )
}