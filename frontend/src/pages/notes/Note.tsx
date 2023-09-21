import { Tag } from "@/pages/notes/Tag";

export function Note() {
  return (
    <div className="w-full bg-[#202124] h-fit flex flex-col gap-1.5 p-2.5 select-none hover:cursor-pointer">
      <h2 className="font-medium text-[#eaeaea]">
        This is the title of the note
      </h2>
      <span className="text-xs overflow-ellipsis line-clamp-2 text-gray-400">
        This is some preview text of the note. I don't know how to do it effectively yet, This needs to be
      </span>
      <div id="tags" className="p-1">
        <Tag/>
      </div>
    </div>
  )
}