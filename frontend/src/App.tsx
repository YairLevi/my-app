import './input.css'
import { Sidebar } from "@/components/Sidebar";
import Calendar from "@/components/Calendar";

function getHourOfDay(number: number, offset = 8) {
  const hour = (number + offset) % 24;
  return `${hour === 0 ? 12 : hour} ${hour < 12 ? 'AM' : 'PM'}`;
}

export default function App() {
  return (
    <div className="flex place-items-center h-screen bg-[#1a1c22] overflow-hidden">
      <Sidebar/>
      <div className="w-fit h-full bg-[#1a1c22] flex flex-col py-3">
        <Calendar/>
        <div className="px-5 pb-3 flex gap-3">
          <p className="text-white">My day starts at:</p>
          <select className="">
            {
              [...Array(12).keys()].map((_, i) => <option>{i+1}</option>)
            }
          </select>
          <select className="">
            <option>AM</option>
            <option>PM</option>
          </select>
        </div>
        <div className="w-full px-3 pb-4 overflow-y-auto">
          {
            [...Array(24).keys()].map((v, i) => {
              return (
                <div className="flex flex-col">
                  <div className="flex [&_*]:text-gray-600 gap-2 justify-around items-center">
                    <div className="w-10 text-right">
                      <p className="font-semibold text-[0.7rem]">{getHourOfDay(i)}</p>
                    </div>
                    <hr className="w-11/12 border-none h-[1px] bg-gray-600"/>
                  </div>
                  <div className="bg-blue-400 w-10/12 self-end rounded-md h-9 py-1.5 px-3 flex items-center">
                    <p className="text-sm text-white">Dinner with friends</p>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>

    </div>
  )
}