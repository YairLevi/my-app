import { createContext, PropsWithChildren, useContext } from "react";

interface Exports {
  toggle: () => void
}

const Direction = createContext<Exports>({} as Exports)

export function useDirection() {
  return useContext(Direction)
}

type Direction = 'ltr' | 'rtl'

export function DirectionProvider({ children }: PropsWithChildren) {
  const direction: Direction = "ltr"

  function toggle() {
    const curr = document.body.style.direction
    curr == 'ltr'
      ? document.body.style.direction = 'rtl'
      : document.body.style.direction = 'ltr'
  }

  const value = {
    toggle
  }

  return (
    <Direction.Provider value={value}>
      {children}
    </Direction.Provider>
  )
}