import { Sidebar, SidebarItem } from "@/components/Sidebar"
import { useEffect, useState } from "react"
import { Route, Routes, useLocation, useNavigate } from "react-router";
import CalendarPage from "@/components/calendar/Page";
import { BarChart3, CalendarDays, StickyNote } from "lucide-react";
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import './input.css'
import { GetVersion } from "@/wails/go/main/App";

export default function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const [version, setVersion] = useState('')

  useEffect(() => {
    console.log(location.pathname)
  }, [location]);

  useEffect(() => {
    (async function(){
      const ver = await GetVersion()
      setVersion(ver)
    })()
  }, []);

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
      <Sidebar>
        <SidebarItem
          text="Calendar"
          icon={<CalendarDays/>}
          onClick={() => navigate('/calendar/week')}
        />
        <SidebarItem
          text="Analytics"
          icon={<BarChart3/>}
          onClick={() => navigate('/analytics')}
        />
        <SidebarItem
          text="Notes"
          icon={<StickyNote/>}
          onClick={() => navigate('/notes')}
        />
      </Sidebar>

      <Routes>
        <Route path="/" element={<div className="text-white">Dashboard page {version}</div>}/>
        <Route path="/calendar/*" element={<CalendarPage/>} />
        <Route path="/analytics/*" element={<div className="text-white">Analytics Page</div>} />
        <Route path="/notes/*" element={<div className="text-white">Notes Page</div>} />
      </Routes>
    </div>
  )
}