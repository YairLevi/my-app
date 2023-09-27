import { Note } from '@/contexts/Notes/NoteTypes'
import { useCurrentNote } from "@/contexts/Notes/CurrentNoteProvider";
import { ContextMenu } from "@/components/ContextMenu";

type NoteProps = {
  note: Note
}

export function NoteTab({ note }: NoteProps) {
  const { title, content } = note
  const {setCurrentNote} = useCurrentNote()

  return (
    <div
      className="w-full bg-[#202124] h-fit flex flex-col gap-1.5 p-2.5 select-none hover:cursor-pointer"
      onClick={() => setCurrentNote(note)}
    >
      <h2 className="font-medium text-[#eaeaea]">
        {title}
      </h2>
      <span className="text-xs overflow-ellipsis line-clamp-2 text-gray-400">
        {content}
      </span>
      {/*<div id="tags" className="p-1">*/}
      {/*  <Tag/>*/}
      {/*</div>*/}
    </div>
  )
}