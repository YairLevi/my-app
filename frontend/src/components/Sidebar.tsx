import { Children, PropsWithChildren, ReactElement } from "react";
import { BarChart3, CalendarDays, StickyNote } from "lucide-react";

interface ItemProps {
  text: string
  icon?: ReactElement
  onClick: () => void
}

export function SidebarItem({ text, icon, onClick }: ItemProps) {
  return (
    <div
      onClick={onClick}
      className={`
        rounded flex items-center gap-3 hover:bg-white hover:bg-opacity-10
        select-none py-3 px-3.5 hover:cursor-pointer text-white group relative
      `}
    >
      {icon}

      {/* Tooltip for the sidebar item */}
      <div
        className={`
          invisible group-hover:visible z-20 opacity-50 group-hover:opacity-100
          absolute ease-out top-1/2 -translate-y-1/2 left-16 bg-black px-2.5 py-1.5 rounded w-fit text-sm
        `}
      >
        {text}
      </div>

      <div
        className={`
          invisible group-hover:visible z-10 opacity-50 group-hover:opacity-100
          absolute w-2 h-2 bg-black -translate-x-1/2 left-16 -translate-y-1/2 top-1/2 rotate-45 
        `}
      />
    </div>
  )
}

export function Sidebar({ children }: PropsWithChildren) {
  return (
    <div className="max-w-fit bg-[#0f0f11] h-screen px-2 py-2">
      <div className="h-full">
        {children}
      </div>
    </div>
  )
}