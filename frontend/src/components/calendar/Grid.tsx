import { daysFullNames, prefixZero } from "../../time";
import { Tile } from "@/components/calendar/Tile";
import { getGridPosition, remToPixels } from "../../grid";
import { Event } from "../../mock/mockEvents";
import { Responsive, WidthProvider } from "react-grid-layout";

const ResponsiveGridLayout = WidthProvider(Responsive);

function getRandomColor() {
  let letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * letters.length)]
  }
  return color
}

interface Props {
  events: Event[]
}

export function Grid({events}: Props) {

  const onLayoutChange = (newLayout: any) => {
    // Handle layout changes here if needed
    // console.log(newLayout)
  }

  const numberOfRowsInRem = 4;
  const rowHeightInRem = 2.5;
  const rowHeightInPixels = remToPixels(rowHeightInRem);

  const startHour = new Date(2020, 1, 1).getHours()
  const startMinute = new Date(2020, 1, 1).getMinutes()


  return (
    <div className="h-full w-full overflow-auto flex [&_*]:text-sm [&_*]:text-white">
      <div className="h-fit pt-2">
        <div className="px-4 py-2 text-center w-20 !text-transparent">empty</div>
        {
          [...new Array(24).keys()].map((val, i) => (
            <>
              <div key={`time${i}`} className="h-8 text-center !text-xs">
                {prefixZero(startHour + val)}:{prefixZero(startMinute)}
              </div>
              <div key={`time-half${i}`} className="h-8 !text-gray-600 text-center !text-xs">
                {prefixZero(startHour + val)}:{prefixZero(startMinute + 30)}
              </div>
            </>
          ))
        }
      </div>
      <div className="h-fit w-full relative">
        <div className="flex w-full h-full">
          {
            daysFullNames.map((day, i) => (
              <div key={`day-names${i}`} className="px-4 py-2 text-center min-w-[7rem] w-full">{day}</div>
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
            breakpoints={{lg: 1200, }}
            width={500}
            preventCollision={true}
            cols={{'lg': 7}}
            rowHeight={rowHeightInPixels * 0.4}
            onLayoutChange={onLayoutChange}
            resizeHandles={['n', 's']}
            maxRows={24 * 4}
            compactType={null}
            isBounded={true}
            margin={[0, 0]}
          >
            {
              events.map((event, i) => (
                <Tile
                  key={`${i}`}
                  start={event.startDate}
                  end={event.endDate}
                  data-grid={getGridPosition(event.startDate, event.endDate)}
                  title={event.title}
                  color={getRandomColor()}
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