import { Sidebar } from "@/components/Sidebar"
import { Calendar } from "@/components/calendar/Calendar"
import { Summary } from "@/components/calendar/Summary"
import React, { useEffect } from "react"
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import './input.css'
import { MonthlyCalendar } from '@/components/calendar/month/MonthlyCalendar'
import { Route, Routes, useLocation, useNavigate } from "react-router";
import { WeeklyCalendar } from "@/components/calendar/week/WeeklyCalendar";
import { Button } from "@/components/Button";
import { Modal, useModal } from "@/components/Modal";


export default function App() {
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

  const { open, onOpen, onClose } = useModal()

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
          <div className="flex gap-2">
            <Button onClick={() => navigate('/week')} color="#0f0f11">Go to week</Button>
            <Button onClick={() => navigate('/month')} color="#0f0f11">Go to month</Button>
            <Button onClick={() => navigate('/')} color="#0f0f11">Go to home</Button>
          </div>
          <Routes>
            <Route path="/" element={<button className="text-white" onClick={onOpen}>Home!</button>}/>
            <Route path="/week" element={<WeeklyCalendar/>}/>
            <Route path="/month" element={<MonthlyCalendar/>}/>
          </Routes>
        </div>
      </div>
      <div className="max-w-fit min-w-fit h-full bg-[#1a1c22] flex flex-col py-3">
        <Calendar/>
        <Summary/>
      </div>

      <Modal
        open={open}
        onClose={onClose}
        title="Some modal title">

        <Modal.Group label="Field 1">
          <input
            type="text"
            className="bg-[#0f0f11] px-3 py-1.5 text-gray-200 rounded-md"
          />
        </Modal.Group>

        <Modal.Footer>
          <Button color="#0f0f11" onClick={() => false}>Cancel</Button>
        </Modal.Footer>


      </Modal>
    </div>
  )
}