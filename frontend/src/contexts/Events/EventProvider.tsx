import { createContext, PropsWithChildren } from "react";
import { WeekEventProvider } from "@/contexts/Events/WeekEventProvider";
import { MonthEventProvider } from "@/contexts/Events/MonthEventProvider";

const EventContext = createContext({})

export function EventProvider({ children }: PropsWithChildren) {
  return (
    <EventContext.Provider value={{}}>
      <MonthEventProvider>
        <WeekEventProvider>
          {children}
        </WeekEventProvider>
      </MonthEventProvider>
    </EventContext.Provider>
  )
}