import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { Create, Delete, Read, Update } from '@/wails/go/repositories/WeekEventRepository'
import { repositories } from "@/wails/go/models";
import { WeekEvent, convertToWeekEvent } from './WeekEventTypes'

type WeekEventProviderExports = {
  events: WeekEvent[]
  addEvent: (newEvent: Partial<WeekEvent>) => Promise<void>
  updateEvent: (updatedEvent: WeekEvent) => Promise<void>
  deleteEvent: (deletedEvent: WeekEvent) => Promise<void>
  forceRefresh: () => Promise<void>
}

const WeekEventsContext = createContext<WeekEventProviderExports>({} as WeekEventProviderExports)

export function useWeekEvents() {
  const { events, ...functions } = useContext(WeekEventsContext)
  return {
    weekEvents: events,
    weekEventService: functions
  }
}

export function WeekEventProvider({ children }: PropsWithChildren) {
  const [events, setEvents] = useState<WeekEvent[]>([])

  useEffect(() => {
    getEvents()
  }, [])

  async function getEvents() {
    const events = await Read()
    const weekEvents: WeekEvent[] = events.map(ev => convertToWeekEvent(ev))
    setEvents(weekEvents)
  }

  async function addEvent(newEvent: Partial<WeekEvent>) {
    const repoEvent = new repositories.WeekEvent()
    Object.assign(repoEvent, newEvent)
    const newRepoEvent = await Create(repoEvent)
    const newWeekEvent = convertToWeekEvent(newRepoEvent)
    setEvents(prev => [...prev, newWeekEvent])
  }

  async function updateEvent(updatedEvent: WeekEvent) {
    const repoEvent = new repositories.WeekEvent()
    Object.assign(repoEvent, updatedEvent)
    repoEvent.deletedAt = undefined
    const updatedRepoEvent = await Update(repoEvent)
    const updatedWeekEvent = convertToWeekEvent(updatedRepoEvent)
    setEvents(prev => [...prev.filter(ev => ev.id != updatedEvent.id), updatedWeekEvent])
  }

  async function deleteEvent(deleteEvent: WeekEvent) {
    const repoEvent = new repositories.WeekEvent()
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
    <WeekEventsContext.Provider value={value}>
      {children}
    </WeekEventsContext.Provider>
  )
}