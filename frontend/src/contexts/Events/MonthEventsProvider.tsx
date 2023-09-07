import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import {Create,Read,Update,Delete} from "@/wails/go/repositories/MonthCalendar"
import { repositories } from "@/wails/go/models";
import { EventProviderExports } from "@/contexts/Events/EventProvider";

type MonthEventNoConvert = Omit<repositories.MonthEvent, "convertValues">

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

function convertToMonthEvent(event: repositories.MonthEvent): MonthEvent {
  const obj: Record<string, any> = {}
  for (const key of Object.keys(event)) {
    if (DateKeyList.includes(key as TDateKey)) {
      obj[key] = new Date(event[key as keyof typeof event])
    } else {
      obj[key] = event[key as keyof typeof event]
    }
  }
  return obj as MonthEvent
}

export function MonthEventsProvider({ children }: PropsWithChildren) {
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
    const repoEvent = new repositories.MonthEvent()
    Object.assign(repoEvent, updatedEvent)
    repoEvent.deletedAt = undefined
    const updatedRepoEvent = await Update(repoEvent)
    const updatedWeekEvent = convertToMonthEvent(updatedRepoEvent)
    setEvents(prev => [...prev.filter(ev => ev.id != updatedEvent.id), updatedWeekEvent])
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