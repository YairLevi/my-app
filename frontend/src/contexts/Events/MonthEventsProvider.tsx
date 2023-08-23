import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { Create, Delete, Read, Update } from '@/wails/go/main/MonthCalendar'
import { main } from "@/wails/go/models";
import { EventProviderExports } from "@/contexts/Events/EventProvider";

export type MonthEvent = Omit<Omit<main.MonthEvent, "convertValues">, "id"> & { id?: number }

const MonthEventsContext = createContext<EventProviderExports<MonthEvent>>({} as EventProviderExports<MonthEvent>)

export function useMonthEvents() {
  const { events, ...functions } = useContext(MonthEventsContext)
  return {
    monthEvents: events,
    monthEventService: functions
  }
}

export function MonthEventsProvider({ children }: PropsWithChildren) {
  const [events, setEvents] = useState<MonthEvent[]>([])

  useEffect(() => {
    getEvents()
  }, [])

  async function getEvents() {
    let rEvents = await Read()
    rEvents = rEvents.map(event => {
      event.date = new Date(event.date)
      return event
    })
    setEvents(rEvents)
  }

  async function addEvent(newEvent: MonthEvent) {
    const event = new main.MonthEvent()
    event.title = newEvent.title
    event.date = newEvent.date
    const rEvent = await Create(event)

    rEvent.date = new Date(rEvent.date)
    setEvents(prev => [...prev, rEvent])
  }

  async function updateEvent(id: number, updatedFields: Partial<MonthEvent>) {
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
    <MonthEventsContext.Provider value={value}>
      {children}
    </MonthEventsContext.Provider>
  )
}