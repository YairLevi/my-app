import React, { createContext, PropsWithChildren, useContext, useRef } from "react";

type Exports = {
  windowRef: React.RefObject<HTMLDivElement>
}

const WindowContext = createContext<Exports>({} as Exports)

export function useWindow() {
  return useContext(WindowContext)
}

export function WindowProvider({ children }: PropsWithChildren) {
  const windowRef = useRef<HTMLDivElement>(null)

  return (
    <WindowContext.Provider value={{windowRef}}>
      <div ref={windowRef}>
        {children}
      </div>
    </WindowContext.Provider>
  )
}