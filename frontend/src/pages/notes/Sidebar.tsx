import { Button } from "@/components/Button";
import { NoteTab } from "@/pages/notes/NoteTab";
import { AddNoteModal } from "@/pages/notes/AddNote.modal";
import { useModal } from "@/components/Modal";
import { useNotes } from "@/contexts/Notes/NoteProvider";

export function Sidebar() {
  const { open, onOpen, onClose } = useModal()
  const {notes} = useNotes()

  return (
    <>
      <div className="min-w-[20rem] max-w-[20rem] border-r border-r-gray-700 h-full flex flex-col">
        <div id="" className="flex p-2 h-fit">
          <Button
            onClick={() => onOpen()}
          >
            New Note
          </Button>
        </div>
        <div className="overflow-auto gap-0.5 flex flex-col h-full">
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