import { Route, Routes } from "react-router";
import { Button } from "@/components/Button";
import { WeekCalendar } from "@/pages/calendar/week/WeekCalendar";
import { MonthCalendar } from "@/pages/calendar/month/MonthCalendar";
import { Calendar } from "@/pages/calendar/Calendar";
import { Summary } from "@/pages/calendar/Summary";
import { useCustomNav } from "@/components/nav";

export default function CalendarPage() {
  const navigate = useCustomNav()

  return (
    <>
      <div className="w-full h-full overflow-auto flex">
        <div className="w-full h-full flex flex-col">
          <div className="flex gap-2 m-2">
            <Button onClick={() => navigate('/week', "sibling")} color="#0f0f11">Week</Button>
            <Button onClick={() => navigate('/month', "sibling")} color="#0f0f11">Month</Button>
          </div>
          <Routes>
            <Route path="/week" element={<WeekCalendar/>}/>
            <Route path="/month" element={<MonthCalendar/>}/>
          </Routes>
        </div>
      </div>
      <div className="max-w-fit min-w-fit h-full bg-[#1a1c22] flex flex-col py-3">
        <Calendar/>
        <Summary/>
      </div>
    </>
  )
}