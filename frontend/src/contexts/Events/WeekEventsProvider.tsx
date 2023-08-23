import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { Create, Delete, Read, Update } from '@/wails/go/main/Calendar'
import { main } from "@/wails/go/models";
import { EventProviderExports } from "@/contexts/Events/EventProvider";

export type WeekEvent = Omit<Omit<main.Event, "convertValues">, "id"> & { id?: number }

const WeekEventsContext = createContext<EventProviderExports<WeekEvent>>({} as EventProviderExports<WeekEvent>)

export function useWeekEvents() {
  const { events, ...functions } = useContext(WeekEventsContext)
  return {
    weekEvents: events,
    weekEventService: functions
  }
}

export function WeekEventsProvider({ children }: PropsWithChildren) {
  const [events, setEvents] = useState<WeekEvent[]>([])

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

  async function addEvent(newEvent: WeekEvent) {
    const event = new main.Event()
    event.title = newEvent.title
    event.endDate = newEvent.endDate
    event.startDate = newEvent.startDate
    const rEvent = await Create(event)

    rEvent.startDate = new Date(rEvent.startDate)
    rEvent.endDate = new Date(rEvent.endDate)
    setEvents(prev => [...prev, rEvent])
  }

  async function updateEvent(id: number, updatedFields: Partial<WeekEvent>) {
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
    deleteEvent,
  }

  return (
    <WeekEventsContext.Provider value={value}>
      {children}
    </WeekEventsContext.Provider>
  )
}