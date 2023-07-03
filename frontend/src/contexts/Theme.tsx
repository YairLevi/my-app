import { createContext, PropsWithChildren, useContext, useState } from "react";

type Theme = 'dark' | 'light'

interface Exports {
  theme: Theme
}

const Direction = createContext<Exports>({} as Exports)

export function useTheme() {
  return useContext(Direction)
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState<Theme>('dark')

  const value = {
    theme
  }

  return (
    <Direction.Provider value={value}>
      {children}
    </Direction.Provider>
  )
}