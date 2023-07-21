import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { Create, Delete, Read, Update } from '@/wails/go/main/Calendar'
import { main } from "@/wails/go/models";

type Exports = {
  events: main.Event[]
  addEvent: (newEvent: main.Event) => void
  updateEvent: (id: number, updatedFields: Partial<main.Event>) => void
  deleteEvent: (id: number) => void
}

const EventsContext = createContext<Exports>({} as Exports)

export function useEvents() {
  return useContext(EventsContext)
}

export function EventsProvider({ children }: PropsWithChildren) {
  const [events, setEvents] = useState<main.Event[]>([])

  useEffect(() => {
    getEvents()
  }, [])

  async function getEvents() {
    let events = await Read()
    events = events.map(event => {
      event.startDate = new Date(event.startDate)
      event.endDate = new Date(event.endDate)
      return event
    })
    setEvents(events)
  }

  async function addEvent(newEvent: main.Event) {
    const rEvent = await Create(newEvent)

    rEvent.startDate = new Date(rEvent.startDate)
    rEvent.endDate = new Date(rEvent.endDate)
    setEvents(prev => [...prev, rEvent])
  }

  async function updateEvent(id: number, updatedFields: Partial<main.Event>) {
    const event = events.find(ev => ev.id == id)
    if (!event) return
    const updatedEvent = Object.assign({}, event, updatedFields)

    await Update(id, updatedFields)
    setEvents(prev => [...prev.filter(ev => ev.id != id), updatedEvent])
  }

  async function deleteEvent(id: number) {
    await Delete(id)
    setEvents(prev => prev.filter(event => event.id != id))
  }

  const value = {
    events,
    addEvent,
    updateEvent,
    deleteEvent
  }

  return (
    <EventsContext.Provider value={value}>
      {children}
    </EventsContext.Provider>
  )
}