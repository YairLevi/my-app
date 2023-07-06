import './input.css'
import { Sidebar } from "@/components/Sidebar";
import Calendar from "@/components/Calendar";

function getHourOfDay(number: number, offset = 7) {
  const hour = (number + offset) % 24
  return `${hour}:00`
  // const time = hour < 12 ? 'AM' : 'PM'
  // if (hour === 0) {
  //   return `12 ${time}`
  // } else {
  //   return `${hour % 12} ${time}`
  // }
  // return `${hour === 0 ? 12 : (hour % 12)} ${hour < 12 ? 'AM' : 'PM'}`;
}

export default function App() {
  return (
    <div className="flex h-screen bg-[#1a1c22] overflow-hidden">
      <Sidebar/>
      <div className="flex w-full">
        <div className="bg-[#1a1c22] w-full">
          Hello
        </div>
        <div className="max-w-fit min-w-fit h-full bg-[#1a1c22] flex flex-col py-3">
          <Calendar/>
          <h1 className="px-3 text-gray-400 text-sm font-bold my-2">Schedule Summary</h1>
          <div className="w-80 px-3 pb-4 overflow-y-auto">
            {
              [...Array(24).keys()].map((v, i) => {
                function getRandomColor() {
                  let letters = '0123456789ABCDEF';
                  let color = '#';
                  for (let i = 0; i < 6; i++) {
                    color += letters[Math.floor(Math.random() * letters.length)];
                  }
                  return color;
                }

                const col = getRandomColor()
                return (
                  <div key={i} className="flex mb-2 gap-2">
                    <div className="[&_*]:text-gray-500">
                      <div className="w-10 text-right">
                        <p className="font-semibold text-[0.8rem]">{getHourOfDay(i)}</p>
                      </div>
                    </div>
                    <div className="w-10/12 self-end rounded-md py-1.5 px-2 flex items-center bg-[#0f0f11] gap-2">
                      <div className={`border rounded-lg border-l-4 h-10`} style={{ borderColor: col }}/>
                      <section>
                        <p className="font-bold text-gray-300">Meeting with team</p>
                      </section>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </div>
  )
}