import { Sidebar } from "@/components/Sidebar"
import { Calendar } from "@/components/Calendar"
import { Summary } from "@/components/calendar/Summary"
import { Grid } from "@/components/calendar/Grid"
import React, { useState } from "react"
import { events } from "./mock/mockEvents"
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import './input.css'
import { AddEventModal } from "@/components/calendar/AddEvent.modal";


export default function App() {
  const [_events, setEvents] = useState([...events])
  const [open, setOpen] = useState(false)
  const onClose = () => setOpen(false)

  return (
    <div className="flex h-screen bg-[#1a1c22] overflow-hidden">
      <Sidebar/>
      <div className="w-full h-full overflow-auto flex">
        <div className="w-full h-full overflow-auto flex flex-col">
          <div className="w-full flex justify-center gap-5 items-center py-2">
            <button
              className="bg-[#17181c] text-white px-4 py-2 text-sm font-medium rounded-lg"
              onClick={() => setOpen(true)}
            >
              Add Event
            </button>
          </div>
          <Grid />
        </div>
      </div>
      <div className="max-w-fit min-w-fit h-full bg-[#1a1c22] flex flex-col py-3">
        <Calendar/>
        <Summary/>
      </div>
      <AddEventModal
        open={open}
        onClose={onClose}
        events={_events}
        addEvent={(event) => setEvents(p => [...p, event])}
      />
    </div>
  )
}