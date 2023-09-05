import { Route, Routes } from "react-router";
import { Button } from "@/components/Button";
import { WeeklyCalendar } from "@/components/calendar/week/WeeklyCalendar";
import { MonthlyCalendar } from "@/components/calendar/month/MonthlyCalendar";
import { Calendar } from "@/components/calendar/Calendar";
import { Summary } from "@/components/calendar/Summary";
import { useCustomNav } from "@/components/nav";

export default function CalendarPage() {
  const navigate = useCustomNav()

  return (
    <>
      <div className="w-full h-full overflow-auto flex">
        <div className="w-full h-full flex flex-col">
          <div className="flex gap-2">
            <Button onClick={() => navigate('/week', "sibling")} color="#0f0f11">Go to week</Button>
            <Button onClick={() => navigate('/month', "sibling")} color="#0f0f11">Go to month</Button>
            <Button onClick={() => navigate('/')} color="#0f0f11">Go to home</Button>
          </div>
          <Routes>
            <Route path="/week" element={<WeeklyCalendar/>}/>
            {/*<Route path="/month" element={<MonthlyCalendar/>}/>*/}
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