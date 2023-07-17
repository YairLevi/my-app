import { daysFullNames, getWeekDays, prefixZero } from "../../time";
import { Tile } from "@/components/calendar/Tile";
import { getGridPosition, rowHeightInPixels } from "../../grid";
import { ItemCallback, Responsive, WidthProvider } from "react-grid-layout";
import { useCalendar } from "@/contexts/DateContext";
import { useEvents } from "@/contexts/EventsContext";

const ResponsiveGridLayout = WidthProvider(Responsive);

export function Grid() {
  const { date } = useCalendar()
  const { events, addEvent, updateEvent } = useEvents()
  const weekDays = getWeekDays(date)

  const resizeHandler: ItemCallback = (layout, oldItem, newItem, placeholder, event, element) => {
    const i = Number(newItem.i)
    const startHour = Math.floor(newItem.y * 15 / 60) % 24
    const startMinute = (newItem.y % 4) * 15
    let endHour = Math.floor((newItem.y + newItem.h) * 15 / 60) % 24
    let endMinute = ((newItem.y + newItem.h) % 4) * 15

    if (endHour == 0 && endMinute == 0) {
      endHour = 23
      endMinute = 45
    }

    const day = weekDays[newItem.x]
    const currEvent = events.find(ev => ev.id == i)!

    const updatedEvent = {
      id: Number(i),
      color: currEvent.color,
      title: currEvent.title,
      startDate: new Date(day.getFullYear(), day.getMonth(), day.getDate(), startHour, startMinute),
      endDate: new Date(day.getFullYear(), day.getMonth(), day.getDate(), endHour, endMinute),
    }

    updateEvent(i, updatedEvent)


    // const newEvents = events.filter(ev => `${ev.id}` != i)
    // newEvents.push({
    //   id: Number(i),
    //   color: currEvent.color,
    //   title: currEvent.title,
    //   startDate: new Date(day.getFullYear(), day.getMonth(), day.getDate(), startHour, startMinute),
    //   endDate: new Date(day.getFullYear(), day.getMonth(), day.getDate(), endHour, endMinute),
    // })
    // setEvents(newEvents)
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
            onResize={resizeHandler}
            onDrag={resizeHandler}
          >
            {
              events
                .filter(event => weekDays.some(day => day.toDateString() == event.startDate.toDateString()))
                .map(event => (
                  <Tile
                    key={`${event.id}`}
                    start={event.startDate}
                    end={event.endDate}
                    data-grid={getGridPosition(event.startDate, event.endDate)}
                    title={event.title}
                    color={event.color}
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