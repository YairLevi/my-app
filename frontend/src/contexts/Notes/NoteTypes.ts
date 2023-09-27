import { repositories } from "@/wails/go/models";

type NoteNoConvert = Omit<repositories.Note, "convertValues">

type TDateKey =
  | "createdAt"
  | "updatedAt"
  | "deletedAt"

const DateKeyListForNote: TDateKey[] = [
  "createdAt",
  "updatedAt",
  "deletedAt",
]

export type Note = { [K in keyof NoteNoConvert]: K extends TDateKey ? Date : NoteNoConvert[K] };

export type NoteProviderExports = {
  notes: Note[]
  addNote: (newNote: Partial<Note>) => Promise<void>
  updateNote: (updatedNote: Note) => Promise<void>
  deleteNote: (deletedNote: Note) => Promise<void>
  forceRefresh: () => Promise<void>
}

export function convertToNote(note: repositories.Note): Note {
  const obj: Record<string, any> = {}
  for (const key of Object.keys(note)) {
    if (DateKeyListForNote.includes(key as TDateKey)) {
      obj[key] = new Date(note[key as keyof typeof note])
    } else {
      obj[key] = note[key as keyof typeof note]
    }
  }
  return obj as Note
}