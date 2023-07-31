import { ReactElement } from "react";
import { BarChart3, CalendarDays, StickyNote } from "lucide-react";

interface ItemProps {
  text: string
  icon?: ReactElement
}

function SidebarItem({ text, icon }: ItemProps) {
  return (

    <div
      className={`
        rounded flex items-center gap-3 hover:bg-white hover:bg-opacity-10
        select-none py-3 px-3.5 hover:cursor-pointer text-white group relative
      `}
    >
      {icon}

      {/* Tooltip for the sidebar item */}
      <div
        className={`
          invisible group-hover:visible z-20
          absolute ease-out duration-50 top-1/2 -translate-y-1/2 left-16 bg-black px-2.5 py-1.5 rounded w-fit text-sm
        `}
      >
        {text}
      </div>

      <div
        className={`
          invisible group-hover:visible z-10
          absolute w-2 h-2 bg-black -translate-x-1/2 left-16 -translate-y-1/2 top-1/2 rotate-45 
        `}
      />
    </div>
  )
}

export function Sidebar() {
  return (
    <div className="max-w-fit bg-[#0f0f11] h-screen px-2 py-2">
      <div className="h-full">
        <SidebarItem text="Calendar" icon={<CalendarDays/>}/>
        <SidebarItem text="Analytics" icon={<BarChart3/>}/>
        <SidebarItem text="Notes" icon={<StickyNote/>}/>
      </div>
    </div>
  )
}