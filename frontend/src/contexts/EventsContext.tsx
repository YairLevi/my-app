import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { Create, Delete, Read, Update } from '@/wails/go/main/Calendar'
import { main } from "@/wails/go/models";

export type CalendarEvent = Omit<Omit<main.Event, "convertValues">, "id"> & { id?: number }

type Exports = {
  events: CalendarEvent[]
  addEvent: (newEvent: CalendarEvent) => void
  updateEvent: (id: number, updatedFields: Partial<CalendarEvent>) => void
  deleteEvent: (id: number) => void
}

const EventsContext = createContext<Exports>({} as Exports)

export function useEvents() {
  return useContext(EventsContext)
}

export function EventsProvider({ children }: PropsWithChildren) {
  const [events, setEvents] = useState<CalendarEvent[]>([])

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

  async function addEvent(newEvent: CalendarEvent) {
    const event = new main.Event()
    event.title = newEvent.title
    event.endDate = newEvent.endDate
    event.startDate = newEvent.startDate
    const rEvent = await Create(event)

    rEvent.startDate = new Date(rEvent.startDate)
    rEvent.endDate = new Date(rEvent.endDate)
    setEvents(prev => [...prev, rEvent])
  }

  async function updateEvent(id: number, updatedFields: Partial<CalendarEvent>) {
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