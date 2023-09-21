import Editor from "@/pages/notes/Lexical/Editor";
import { Sidebar } from "@/pages/notes/Sidebar";

export default function NotesPage() {
  return (
    <div className="flex overflow-hidden">
      <Sidebar/>
      <Editor/>
    </div>
  )
}