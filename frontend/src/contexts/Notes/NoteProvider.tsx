import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { Create, Delete, Read, Update } from '@/wails/go/repositories/NoteRepository'
import { repositories } from "@/wails/go/models";
import { convertToNote, Note, NoteProviderExports } from "@/contexts/Notes/NoteTypes";

const NotesContext = createContext<NoteProviderExports>({} as NoteProviderExports)

export function useNotes() {
  const { notes, ...functions } = useContext(NotesContext)
  return {
    notes: notes,
    notesService: functions
  }
}

export function NotesProvider({ children }: PropsWithChildren) {
  const [notes, setNotes] = useState<Note[]>([])

  useEffect(() => {
    getNotes()
  }, [])

  async function getNotes() {
    const repoNotes = await Read()
    const notes: Note[] = repoNotes.map(note => convertToNote(note))
    setNotes(notes)
  }

  async function addNote(newNote: Partial<Note>) {
    const repoNote = new repositories.Note()
    Object.assign(repoNote, newNote)
    const newRepoNote = await Create(repoNote)
    const note = convertToNote(newRepoNote)
    setNotes(prev => [...prev, note])
  }

  async function updateNote(updatedNote: Note) {
    const repoNote = new repositories.Note()
    Object.assign(repoNote, updatedNote)
    repoNote.deletedAt = undefined
    const updatedRepoNote = await Update(repoNote)
    const note = convertToNote(updatedRepoNote)
    setNotes(prev => [...prev.filter(ev => ev.id != updatedNote.id), note])
  }

  async function deleteNote(deleteNote: Note) {
    const repoNote = new repositories.Note()
    Object.assign(repoNote, deleteNote)
    await Delete(repoNote)
    setNotes(prev => prev.filter(ev => ev.id != deleteNote.id))
  }

  const value = {
    notes,
    addNote,
    updateNote,
    deleteNote,
    forceRefresh: getNotes
  }

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  )
}