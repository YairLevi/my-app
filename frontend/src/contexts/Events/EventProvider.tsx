import { createContext, PropsWithChildren } from "react";
import { WeekEventsProvider } from "@/contexts/Events/WeekEventsProvider";
import { MonthEventsProvider } from "@/contexts/Events/MonthEventsProvider";

const EventContext = createContext({})

export type EventProviderExports<T> = {
  events: T[]
  addEvent: (newEvent: T) => Promise<void>
  updateEvent: (id: number, updatedFields: Partial<T>) => Promise<void>
  deleteEvent: (id: number) => Promise<void>
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