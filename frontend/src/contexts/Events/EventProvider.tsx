import { createContext, PropsWithChildren } from "react";
import { WeekEventsProvider } from "@/contexts/Events/WeekEventsProvider";
import { MonthEventsProvider } from "@/contexts/Events/MonthEventsProvider";

const EventContext = createContext({})

export type EventProviderExports<T> = {
  events: T[]
  addEvent: (newEvent: Partial<T>) => Promise<void>
  updateEvent: (updatedEvent: T) => Promise<void>
  deleteEvent: (deletedEvent: T) => Promise<void>
  forceRefresh: () => Promise<void>
}

export function EventProvider({ children }: PropsWithChildren) {
  return (
    <EventContext.Provider value={{}}>
      <MonthEventsProvider>
        <WeekEventsProvider>
          {children}
        </WeekEventsProvider>
      </MonthEventsProvider>
    </EventContext.Provider>
  )
}