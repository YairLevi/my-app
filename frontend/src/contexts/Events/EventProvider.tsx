import { PropsWithChildren } from "react";
import { WeekEventProvider } from "@/contexts/Events/WeekEventProvider";
import { MonthEventProvider } from "@/contexts/Events/MonthEventProvider";

export function EventProvider({ children }: PropsWithChildren) {
  return (
    <>
      <MonthEventProvider>
        <WeekEventProvider>
          {children}
        </WeekEventProvider>
      </MonthEventProvider>
    </>
  )
}