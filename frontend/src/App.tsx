import { Sidebar } from "@/components/Sidebar"
import { Calendar } from "@/components/calendar/Calendar"
import { Summary } from "@/components/calendar/Summary"
import React, { useEffect, useState } from "react"
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import './input.css'
import { AddEventModal } from "@/components/calendar/week/AddEvent.modal";
import { MonthlyCalendar } from '@/components/calendar/month/MonthlyCalendar'
import { Route, Routes, useLocation, useNavigate } from "react-router";
import { WeeklyCalendar } from "@/components/calendar/week/WeeklyCalendar";
import { Button } from "@/components/Button";


export default function App() {
  const [open, setOpen] = useState(false)
  const onClose = () => setOpen(false)
  const navigate = useNavigate()
  const location = useLocation()


  /**
   * For now, this is a solution that will be refactored.
   * The problem is that Wails doesn't bind the window['go']['main'] functions
   * to a page when its reloaded, but only to '/'.
   * So, I go back, refresh, wait some time, and go back to current path.
   * It's not optimal, but it will be with some loading spinner or something..
   * for now, this works.
   */
  const PPKEY = "previousPath"

  useEffect(() => {
    const previousPath = sessionStorage.getItem(PPKEY)
    if (previousPath == null) {
      sessionStorage.setItem(PPKEY, location.pathname)
      window.location.replace('/')
    } else {
      setTimeout(() => {
        navigate(previousPath)
        sessionStorage.removeItem(PPKEY)
      }, 10)
    }
  }, []);

  /**
   * refresh page on some path
   * save current path to session storage
   * go to '/' page
   * refresh there, make the wails runtime bind the functions
   * go to saved path
   * set path to NULL
   */

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
            <Button onClick={() => navigate('/')} color="#0f0f11">Go to home</Button>
          </div>
          <Routes>
            <Route path="/" element={<button className="text-white">Home!</button>}/>
            <Route path="/week" element={<WeeklyCalendar/>}/>
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