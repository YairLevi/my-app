import { Sidebar } from "@/components/Sidebar"
import { Calendar } from "@/components/calendar/Calendar"
import { Summary } from "@/components/calendar/Summary"
import React, { useState } from "react"
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import './input.css'
import { AddEventModal } from "@/components/calendar/AddEvent.modal";
import { MonthlyCalendar } from '@/components/monthlyCalendar/MonthlyCalendar'
import { Route, Routes } from "react-router";
import { Grid } from "@/components/calendar/Grid";
import { Button } from "@/components/Button";
import { useNavigate } from "react-router";


export default function App() {
  const [open, setOpen] = useState(false)
  const onClose = () => setOpen(false)
  const navigate = useNavigate()

  return (
    <div className="flex h-screen bg-[#1a1c22] overflow-hidden">
      <Sidebar/>
      <div className="w-full h-full overflow-auto flex">
        <div className="w-full h-full flex flex-col">
          {/*<div className="w-full flex justify-center gap-5 items-center py-2">*/}
          {/*  <button*/}
          {/*    className="bg-[#17181c] text-white px-4 py-2 text-sm font-medium rounded-lg"*/}
          {/*    onClick={() => setOpen(true)}*/}
          {/*  >*/}
          {/*    Add Event*/}
          {/*  </button>*/}
          {/*</div>*/}
          <div className="flex gap-2">
            <Button onClick={() => navigate('/week')} color="#0f0f11">Go to week</Button>
            <Button onClick={() => navigate('/month')} color="#0f0f11">Go to month</Button>
          </div>
          <Routes>
            <Route path="/" element={<button className="text-white">Hello</button>}/>
            <Route path="/week" element={<Grid/>}/>
            <Route path="/month" element={<MonthlyCalendar/>}/>
          </Routes>
        </div>
      </div>
      <div className="max-w-fit min-w-fit h-full bg-[#1a1c22] flex flex-col py-3">
        <Calendar/>
        <Summary/>
      </div>
      <AddEventModal
        open={open}
        onClose={onClose}
      />
    </div>
)
}