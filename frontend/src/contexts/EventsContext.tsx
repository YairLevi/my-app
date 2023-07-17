import { createContext, PropsWithChildren, useContext, useState } from "react";
import { Event, events as MockEvents } from "../mock/mockEvents";

type Exports = {
  events: Event[]
  addEvent: (newEvent: Event) => void
  updateEvent: (id: number, updatedEvent: Event) => void
}

const EventsContext = createContext<Exports>({} as Exports)

export function useEvents() {
  return useContext(EventsContext)
}

export function EventsProvider({ children }: PropsWithChildren) {
  const [events, setEvents] = useState<Event[]>(MockEvents)

  function addEvent(newEvent: Event) {
    setEvents(prev => [...prev, newEvent])
  }

  function updateEvent(id: number, updatedEvent: Event) {
    const newEventList = events.filter(event => event.id != id)
    newEventList.push(updatedEvent)
    setEvents(newEventList)
  }

  const value = {
    events,
    addEvent,
    updateEvent
  }

  return (
    <EventsContext.Provider value={value}>
      {children}
    </EventsContext.Provider>
  )
}