import React, { createContext, PropsWithChildren, useContext, useState } from "react";

type Exports = {
  date: Date
  setDate: React.Dispatch<React.SetStateAction<Date>>
}

const DateContext = createContext<Exports>({} as Exports)

export function useCalendar() {
  return useContext(DateContext)
}

export function CalendarProvider({ children }: PropsWithChildren) {
  const [date, setDate] = useState(new Date())

  const value = {
    date,
    setDate
  }

  return (
    <DateContext.Provider value={value}>
      {children}
    </DateContext.Provider>
  )
}