import Editor from "@/pages/notes/Lexical/Editor";
import { Sidebar } from "@/pages/notes/Sidebar";
import { NotesProvider } from "@/contexts/Notes/NoteProvider";
import { CurrentNoteProvider } from '@/contexts/Notes/CurrentNoteProvider'

export default function NotesPage() {
  return (
    <NotesProvider>
      <CurrentNoteProvider>
        <div className="flex w-full overflow-hidden h-full">
          <Sidebar/>
          <Editor/>
        </div>
      </CurrentNoteProvider>
    </NotesProvider>
  )
}