import { Sidebar, SidebarItem } from "@/components/Sidebar"
import { useEffect, useState } from "react"
import { Route, Routes, useLocation, useNavigate } from "react-router";
import CalendarPage from "@/pages/calendar/Page";
import {
  BarChart3,
  CalendarDays,
  StickyNote,
  LayoutGrid
} from "lucide-react";
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import './input.css'
import { GetVersion, IsUpdateAvailable, Update } from "@/wails/go/main/App";
import { Modal, useModal } from "@/components/Modal";
import { Button } from "@/components/Button";
import { Editor } from '@/pages/notes/Lexical/Editor'
import { Dashboard } from "@/pages/dashboard";

export default function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const { onOpen, open, onClose } = useModal()
  const [isUpdate, setIsUpdate] = useState(false)

  useEffect(() => {
    (async function () {
      if (import.meta.env.PROD) {
        const isUpdate = await IsUpdateAvailable()
        if (isUpdate) onOpen()
      }
    })()
  }, []);

  function update() {
    setIsUpdate(true)
    Update()
  }

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
          text="Dashboard"
          icon={<LayoutGrid/>}
          onClick={() => navigate('/')}
        />
        <SidebarItem
          text="Calendar"
          icon={<CalendarDays/>}
          onClick={() => navigate('/calendar/week')}
        />
        <SidebarItem
          text="Notes"
          icon={<StickyNote/>}
          onClick={() => navigate('/notes')}
        />
      </Sidebar>

      <Routes>
        <Route path="/" element={<Dashboard/>}/>
        <Route path="/calendar/*" element={<CalendarPage/>}/>
        <Route path="/notes/*" element={<Editor/>}/>
      </Routes>

      <Modal
        title="Update Available"
        onClose={() => !isUpdate && onClose()}
        open={open}
      >
        {
          isUpdate
            ? <div className="py-3">
              <div className="text-sm text-gray-300">Preparing to update...</div>
              <div className="text-gray-300 text-sm">The application will restart automatically.</div>
            </div>
            : <>
            <div className="text-gray-300 text-sm py-3">A new update is available.</div>
            <Modal.Footer>
              <Button onClick={update} color="#141414">Update</Button>
              <Button onClick={onClose} color="#141414">Skip</Button>
            </Modal.Footer>
            </>
        }
      </Modal>
    </div>
  )
}