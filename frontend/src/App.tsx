import './input.css'
import {Sidebar} from "@/components/Sidebar";
import Calendar from "@/components/Calendar";
import {Summary} from "@/components/calendar/Summary";
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import {Responsive, WidthProvider} from 'react-grid-layout';

const ResponsiveGridLayout = WidthProvider(Responsive);

const daysFullNames = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

function getHourOfDay(number: number, offset = 0) {
  const hour = (number + offset) % 24
  return `${hour}:00`
}

function getByAMPM(number: number, offset = 0) {
  let hour = (number + offset) % 12
  let hour_24 = (number + offset) % 24
  hour = hour == 0 ? 12 : hour
  const suffix = hour_24 < 12 ? 'AM' : 'PM'
  return `${hour} ${suffix}`
}

function prefixZero(num: number): string {
  return num < 10 ? `0${num}` : `${num}`
}

export default function App() {
  const onLayoutChange = (newLayout: any) => {
    // Handle layout changes here if needed
    console.log(newLayout);
  }

  const remToPixels = (remValue: number) => {
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    return remValue * rootFontSize;
  }

  const numberOfRowsInRem = 4;
  const rowHeightInRem = 2.5;
  const rowHeightInPixels = remToPixels(rowHeightInRem);

  const startHour = new Date(2020, 1, 1).getHours()
  const startMinute = new Date(2020, 1, 1).getMinutes()

  return (
    <div className="flex h-screen bg-[#1a1c22] overflow-hidden">
      <Sidebar/>
      <div className="h-full w-full overflow-auto flex [&_*]:text-sm [&_*]:text-white">
        <div className="h-fit pt-2">
          <div className="px-4 py-2 text-center w-20 !text-transparent">empty</div>
          {
            [...new Array(24).keys()].map((val, i) => (
              <>
                <div key={i} className="h-8 text-center !text-xs">
                  {prefixZero(startHour + val)}:{prefixZero(startMinute)}
                </div>
                <div key={i} className="h-8 !text-gray-600 text-center !text-xs">
                  {prefixZero(startHour + val)}:{prefixZero(startMinute + 30)}
                </div>
              </>
            ))
          }
        </div>
        <div className="h-fit w-full">
          <div className="flex w-full h-full">
            {
              daysFullNames.map((val, i) => (
                <div key={i} className="px-4 py-2 text-center min-w-[7rem] w-full">{val}</div>
              ))
            }
          </div>
          <div className="w-full h-full relative pt-4">
            <div className="bg-opacity-20 w-full min-h-full absolute">
              {
                [...new Array(24 * 2).keys()].map((val, i) => (
                  <div className="flex">
                    {
                      [...new Array(7).keys()].map((val, j) => (
                        <div key={j}
                             className={`h-8 min-w-[7rem] w-full border-b border-b-gray-800 
                             border-r border-r-gray-700 ${i == 0 && 'border-t border-t-gray-800'}`}
                        />
                      ))
                    }
                  </div>
                ))
              }
            </div>
            <ResponsiveGridLayout
              className="layout bg-opacity-20 h-full w-full min-w-[49rem]"
              breakpoints={{lg: 1200}}
              preventCollision={true}
              cols={{'lg': 7}}
              rowHeight={rowHeightInPixels * 0.4}
              onLayoutChange={onLayoutChange}
              resizeHandles={['s']}
              maxRows={24 * 4}
              verticalCompact={false}
              isBounded={true}
              margin={[0, 0]}
            >
              <div key="item1" className="bg-black hover:cursor-grab active:cursor-grabbing"
                   data-grid={{w: 1, h: 1, x: 0, y: 0}}>
                Item 1
              </div>
              <div key="item2" className="bg-black hover:cursor-grab active:cursor-grabbing"
                   data-grid={{w: 1, h: 2, x: 1, y: 2}}>
                Item 2
              </div>
              <div key="item-top" className="hidden"
                   data-grid={{w: 0, h: 0, x: 0, y: 0, isResizable: false, isDraggable: false, static: true}}>
                This is the top item, hidden, to stretch the grid.
              </div>
              <div key="item-bottom" className="hidden"
                   data-grid={{w: 0, h: 0, x: 0, y: 24 * 4, isResizable: false, isDraggable: false, static: true}}>
                This is the bottom item, hidden, to stretch the grid.
              </div>
            </ResponsiveGridLayout>
          </div>
        </div>
      </div>
      <div className="max-w-fit min-w-fit h-full bg-[#1a1c22] flex flex-col py-3">
        <Calendar/>
        <Summary/>
      </div>
    </div>
  )
}