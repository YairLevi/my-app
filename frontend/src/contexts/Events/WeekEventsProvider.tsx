import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { Create, Delete, Read, Update } from '@/wails/go/repositories/WeeklyCalendar'
import { repositories } from "@/wails/go/models";
import { EventProviderExports } from "@/contexts/Events/EventProvider";

type WeekEventNoConvert = Omit<repositories.WeekEvent, "convertValues">

type TDateKey =
  | "createdAt"
  | "updatedAt"
  | "deletedAt"
  | "endDate"
  | "startDate"

const DateKeyList: TDateKey[] = [
  "createdAt",
  "updatedAt",
  "deletedAt",
  "endDate",
  "startDate"
]

export type WeekEvent = { [K in keyof WeekEventNoConvert]: K extends TDateKey ? Date : WeekEventNoConvert[K] };

const WeekEventsContext = createContext<EventProviderExports<WeekEvent>>({} as EventProviderExports<WeekEvent>)

function convertToWeekEvent(event: repositories.WeekEvent): WeekEvent {
  const obj: Record<string, any> = {}
  for (const key of Object.keys(event)) {
    if (DateKeyList.includes(key as TDateKey)) {
      obj[key] = new Date(event[key as keyof typeof event])
    } else {
      obj[key] = event[key as keyof typeof event]
    }
  }
  return obj as WeekEvent
}

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
    const events = await Read()
    const weekEvents: WeekEvent[] = events.map(ev => convertToWeekEvent(ev))
    setEvents(weekEvents)
  }

  async function addEvent(newEvent: Partial<WeekEvent>) {
    const repoEvent = new repositories.WeekEvent()
    Object.assign(repoEvent, newEvent)
    const newRepoEvent = await Create(repoEvent)
    const newWeekEvent = convertToWeekEvent(newRepoEvent)
    console.log("current events:", events)
    console.log("new events:", [...events, newWeekEvent])
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
    console.log(deleteEvent)
    Object.assign(repoEvent, deleteEvent)
    await Delete(repoEvent)
    setEvents(prev => prev.filter(ev => ev.id != deleteEvent.id))
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