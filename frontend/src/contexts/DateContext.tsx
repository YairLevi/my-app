import React, { createContext, PropsWithChildren, useContext, useState } from "react";

type Exports = {
  date: Date
  setDate: (newDate: Date) => void
}

const DateContext = createContext<Exports>({} as Exports)

export function useCalendar() {
  return useContext(DateContext)
}

export function CalendarProvider({ children }: PropsWithChildren) {
  const [date, changeDate] = useState(new Date())

  function setDate(newDate: Date) {
    changeDate(newDate)
  }

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