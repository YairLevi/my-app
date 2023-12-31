import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { Create, Delete, Read, Update } from "@/wails/go/repositories/MonthEventRepository"
import { repositories } from "@/wails/go/models";
import { convertToMonthEvent, MonthEvent } from "@/contexts/Events/MonthEventTypes";

type MonthEventProviderExports = {
  events: MonthEvent[]
  addEvent: (newEvent: Partial<MonthEvent>) => Promise<void>
  updateEvent: (updatedEvent: MonthEvent) => Promise<void>
  deleteEvent: (deletedEvent: MonthEvent) => Promise<void>
  forceRefresh: () => Promise<void>
}

const MonthEventsContext = createContext<MonthEventProviderExports>({} as MonthEventProviderExports)

export function useMonthEvents() {
  const { events, ...functions } = useContext(MonthEventsContext)
  return {
    monthEvents: events,
    monthEventService: functions
  }
}

export function MonthEventProvider({ children }: PropsWithChildren) {
  const [events, setEvents] = useState<MonthEvent[]>([])

  useEffect(() => {
    getEvents()
  }, [])

  async function getEvents() {
    const events = await Read()
    const monthEvents = events.map(ev => convertToMonthEvent(ev))
    setEvents(monthEvents)
  }

  async function addEvent(newEvent: Partial<MonthEvent>) {
    const repoEvent = new repositories.MonthEvent()
    Object.assign(repoEvent, newEvent)
    const newRepoEvent = await Create(repoEvent)
    const newWeekEvent = convertToMonthEvent(newRepoEvent)
    setEvents(prev => [...prev, newWeekEvent])
  }

  async function updateEvent(updatedEvent: MonthEvent) {
    setEvents(prev => [...prev.filter(ev => ev.id != updatedEvent.id), updatedEvent])
    const repoEvent = new repositories.MonthEvent()
    Object.assign(repoEvent, updatedEvent)
    repoEvent.deletedAt = undefined
    const updatedRepoEvent = await Update(repoEvent)
    const updatedWeekEvent = convertToMonthEvent(updatedRepoEvent)
    setEvents(prev => [...prev.filter(ev => ev.id != updatedEvent.id), updatedEvent])
  }


  async function deleteEvent(deleteEvent: MonthEvent) {
    const repoEvent = new repositories.MonthEvent()
    Object.assign(repoEvent, deleteEvent)
    await Delete(repoEvent)
    setEvents(prev => prev.filter(ev => ev.id != deleteEvent.id))
  }

  const value = {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    forceRefresh: getEvents
  }

  return (
    <MonthEventsContext.Provider value={value}>
      {children}
    </MonthEventsContext.Provider>
  )
}