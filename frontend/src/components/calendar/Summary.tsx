import { useWeekEvents } from "@/contexts/Events/WeekEventsProvider";
import { prefixZero } from "../../time";

function getHourOfDay(number: number, offset = 7) {
  const hour = (number + offset) % 24
  return `${hour}:00`
}

function getRandomColor() {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * letters.length)];
  }
  return color;
}

export function Summary() {
  const { weekEvents } = useWeekEvents()
  const todayEvents = weekEvents
    .filter(event => event.startDate.toDateString() == new Date().toDateString())
    .sort((eventA, eventB) => eventA.startDate < eventB.startDate ? -1 : 1)


  return (
    <>
      <h1 className="px-3 text-gray-400 text-xs font-bold my-2">
        Daily Schedule Summary, {new Date().toDateString()}
      </h1>
      <div className="w-80 px-3 pb-4 overflow-y-auto">
        {
          todayEvents.length == 0
          && <p className="font-medium text-[0.7rem] text-gray-500">No events for today.</p>
        }
        {
          todayEvents.map((v, i) => {
            const start = `${v.startDate.getHours()}:${prefixZero(v.startDate.getMinutes())}`
            const end = `${v.endDate.getHours()}:${prefixZero(v.endDate.getMinutes())}`
            return (
              <div key={`summary-item${i}`} className="flex mb-2 gap-2">
                <div className="w-full self-end rounded-md py-1.5 px-2 flex items-center bg-[#0f0f11] gap-2">
                  <div className={`border rounded-lg border-l-4 h-8`} style={{ borderColor: "#000000" }}/>
                  <section className="flex justify-between items-center w-full">
                    <p className="font-medium text-gray-300 text-sm">{v.title}</p>
                    <div className="text-end">
                      <p className="font-medium text-[0.7rem] text-gray-500">{start}</p>
                      <p className="font-medium text-[0.7rem] text-gray-500">-{end}</p>
                    </div>
                  </section>
                </div>
              </div>
            )
          })
        }
      </div>
    </>
  )
}