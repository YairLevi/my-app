import { Button } from "@/components/Button";
import { NoteTab } from "@/pages/notes/Note";
import { AddNoteModal } from "@/pages/notes/AddNote.modal";
import { useModal } from "@/components/Modal";
import { useNotes } from "@/contexts/Notes/NoteProvider";

export function Sidebar() {
  const { open, onOpen, onClose } = useModal()
  const {notes} = useNotes()

  return (
    <>
      <div className="min-w-[20rem] max-w-[20rem] bg-gray-500">
        <div id="action-bar" className="flex p-2">
          <Button
            onClick={() => onOpen()}
          >
            New Note
          </Button>
        </div>
        <div id="note-list" className="flex flex-col overflow-y-auto gap-0.5">
          {
            notes
              .sort((a, b) => a.updatedAt > b.updatedAt ? -1 : 1)
              .map(note => <NoteTab note={note}/>)
          }
        </div>
      </div>

      <AddNoteModal
        title="New Note"
        open={open}
        onClose={onClose}
      />
    </>
  )
}