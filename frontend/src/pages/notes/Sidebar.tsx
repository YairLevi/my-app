import { Button } from "@/components/Button";
import { Note } from "@/pages/notes/Note";

export function Sidebar() {
  return (
    <div className="min-w-[20rem] bg-gray-500">
      <div id="action-bar" className="flex p-2">
        <Button
          onClick={() => {

          }}
        >
          New Note
        </Button>
      </div>
      <div id="note-list" className="flex flex-col overflow-y-auto">
        <Note/>
      </div>
    </div>
  )
}