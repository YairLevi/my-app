import { Note } from '@/contexts/Notes/NoteTypes'
import { useCurrentNote } from "@/contexts/Notes/CurrentNoteProvider";
import { Tag } from "@/pages/notes/Tag";
import { Trash2 } from "lucide-react";
import clsx from "clsx";
import { MouseEvent } from "react";
import { useNotes } from "@/contexts/Notes/NoteProvider";

type NoteProps = {
  note: Note
}

export function NoteTab({ note }: NoteProps) {
  const { title, content } = note
  const {setCurrentNote} = useCurrentNote()
  const {notesService } = useNotes()

  function onDelete(e: MouseEvent) {
    e.stopPropagation()
    notesService.deleteNote(note)
    setCurrentNote(undefined)
  }

  return (
    <div
      className={clsx(
        "w-full bg-[#202124] flex flex-col gap-1.5 p-2.5 select-none hover:cursor-pointer group",
        "relative"
      )}
      onClick={() => setCurrentNote(note)}
    >
      <h2 className="font-medium text-[#eaeaea]">
        {title}
      </h2>
      <div id="tags">
        {/*<Tag/>*/}
      </div>

      <Trash2
        size={32}
        onClick={onDelete}
        className={clsx(
          "text-gray-300 absolute group-hover:visible invisible right-2 top-1/2 p-1.5 -translate-y-1/2 rounded-md",
          "hover:bg-gray-500 hover:bg-opacity-50"
        )}
      />
    </div>
  )
}