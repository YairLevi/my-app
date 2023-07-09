import './input.css'
import {Sidebar} from "@/components/Sidebar";
import Calendar from "@/components/Calendar";
import {Summary} from "@/components/calendar/Summary";
import '@/components/style.css'
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


  return (
    <div className="flex h-screen bg-[#1a1c22] overflow-hidden">
      <Sidebar/>
      <div className="h-full w-full overflow-auto flex [&_*]:text-sm [&_*]:text-white">
        <div className="h-fit">
          <div className="px-4 py-2 bg-slate-800 text-center w-20">Hour</div>
          {
            [...new Array(24).keys()].map((val, i) => (
              <div key={i} className={`px-4 py-2 h-10 bg-slate-800 text-center ${i == 0 && 'bg-red-950'}`}>
                {getByAMPM(i)}
              </div>
            ))
          }
        </div>
        <div className="h-fit w-full">
          <div className="flex w-full h-full">
            {
              daysFullNames.map((val, i) => (
                <div key={i} className="px-4 py-2 bg-slate-900 text-center min-w-[7rem] w-full">{val}</div>
              ))
            }
          </div>
          <div className="w-full h-full relative">
            <div className="bg-gray-900 bg-opacity-20 w-full min-h-full absolute">
              {
                [...new Array(24).keys()].map((val, i) => (
                  <div className="flex">
                    {
                      [...new Array(7).keys()].map((val, i) => (
                        <div key={i} className="h-10 min-w-[7rem] w-full border-b border-b-gray-800 border-r border-r-gray-700"/>
                      ))
                    }
                  </div>
                ))
              }
            </div>
            <ResponsiveGridLayout
              className="layout bg-gray-700 bg-opacity-20 h-full w-full min-w-[49rem]"
              breakpoints={{lg: 1200}}
              preventCollision={true}
              cols={{'lg': 7}}
              rowHeight={rowHeightInPixels}
              onLayoutChange={onLayoutChange}
              resizeHandles={['s']}
              maxRows={24}
              verticalCompact={false}
              isBounded={true}
              margin={[0, 0]}
            >
              <div key="item1" className="bg-red-200 hover:cursor-grab active:cursor-grabbing"
                   data-grid={{w: 1, h: 1, x: 0, y: 0}}>
                Item 1
              </div>
              <div key="item2" className="bg-red-200 hover:cursor-grab active:cursor-grabbing"
                   data-grid={{w: 1, h: 2, x: 1, y: 2}}>
                Item 2
              </div>
              <div key="item-top" className="hidden"
                   data-grid={{w: 0, h: 0, x: 0, y: 0, isResizable: false, isDraggable: false, static: true}}>
                This is the top item, hidden, to stretch the grid.
              </div>
              <div key="item-bottom" className="hidden"
                   data-grid={{w: 0, h: 0, x: 0, y: 24, isResizable: false, isDraggable: false, static: true}}>
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