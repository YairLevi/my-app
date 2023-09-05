import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { Create, Delete, Read, Update } from '@/wails/go/main/MonthCalendar'
import { main, repositories } from "@/wails/go/models";
import { EventProviderExports } from "@/contexts/Events/EventProvider";

type MonthEventNoConvert = Omit<main.MonthEvent, "convertValues">

type TDateKey =
  | "createdAt"
  | "updatedAt"
  | "deletedAt"
  | "date"

const DateKeyList: TDateKey[] = [
  "createdAt",
  "updatedAt",
  "deletedAt",
  "date"
]

export type MonthEvent = { [K in keyof MonthEventNoConvert]: K extends TDateKey ? Date : MonthEventNoConvert[K] };

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
  /*
  async function addEvent(newEvent: Partial<WeekEvent>) {
    const repoEvent = new repositories.WeekEvent()
    Object.assign(repoEvent, newEvent)
    const event = await Create(repoEvent)
    setEvents(prev => [...prev, event])
  }

  async function updateEvent(updatedEvent: WeekEvent) {
    const repoEvent = new repositories.WeekEvent()
    Object.assign(repoEvent, updatedEvent)
    const event = await Update(repoEvent)
    setEvents(prev => [...prev.filter(ev => ev.id != updatedEvent.id), event])
  }

  async function deleteEvent(deleteEvent: WeekEvent) {
    const repoEvent = new repositories.WeekEvent()
    Object.assign(repoEvent, deleteEvent)
    await Delete(repoEvent)
  }
  * */
  async function getEvents() {
    const events = await Read()

  }

  async function addEvent(newEvent: Partial<MonthEvent>) {
    const repoEvent = new main.MonthEvent()
    Object.assign(repoEvent, newEvent)
    const event = await Create(repoEvent)
    setEvents(prev => [...prev, event])
  }

  async function updateEvent(updatedEvent: MonthEvent) {
    const repoEvent = new repositories.WeekEvent()
    Object.assign(repoEvent, updatedEvent)
    // const event = await Update(repoEvent)
    // setEvents(prev => [...prev.filter(ev => ev.id != updatedEvent.id), event])
  }

  async function deleteEvent(deletedEvent: MonthEvent) {
    // await Delete(id)
    // setEvents(prev => prev.filter(event => event.id != id))
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