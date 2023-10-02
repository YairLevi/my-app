import { createContext, PropsWithChildren, useContext, useState } from "react";
import { Note } from "@/contexts/Notes/NoteTypes";

type CurrentNoteExports = {
  currentNote: Note | undefined
  setCurrentNote: (newNote: Note | undefined) => void
}

const CurrentNoteContext = createContext<CurrentNoteExports>({} as CurrentNoteExports)

export function useCurrentNote() {
  return useContext(CurrentNoteContext)
}

export function CurrentNoteProvider({ children }: PropsWithChildren) {
  const [note, setNote] = useState<Note | undefined>()

  function setCurrentNote(newNote: Note | undefined) {
    setNote(newNote)
  }

  const value = {
    currentNote: note,
    setCurrentNote
  }

  return (
    <CurrentNoteContext.Provider value={value}>
      {children}
    </CurrentNoteContext.Provider>
  )
}