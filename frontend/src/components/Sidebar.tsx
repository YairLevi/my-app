import { useState } from "react";
import { faCalendarDays, faNoteSticky } from "@fortawesome/free-regular-svg-icons"
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icon, IconProp } from "@fortawesome/fontawesome-svg-core";
import Calendar from "@/components/Calendar";

interface ItemProps {
  text: string
  open?: boolean
  icon?: IconProp
}

function SidebarItem({ text, open, icon }: ItemProps) {
  return (
    <div className={`rounded-lg flex items-center gap-4 font-medium hover:bg-sky-100 duration-100
       select-none [& *]:duration-200 py-2.5 px-3.5 overflow-hidden hover:cursor-pointer`}
    >
      { icon && <FontAwesomeIcon icon={icon} className={`${!open && 'text-xl'} duration-200`}/> }
      <p className={`${!open && ''} duration-200`}>{text}</p>
    </div>
  )
}

export function Sidebar() {
  const [open, setOpen] = useState(true)
//bg-[#fafcfe]
  return (
    <div className={`${open ? 'w-64' : 'w-16'} group duration-200 bg-[#fafcfe]  [&_*]:text-gray-500 h-screen px-2 py-2 flex flex-col relative group`}>
      <button className="absolute z-[-1] bg-[#fafcfe] rounded-md rounded-l-none p-1 px-2 pl-2.5 hover:border group-hover:z-20 group-hover:right-[-2rem]"
              onClick={() => setOpen(!open)}>
        <FontAwesomeIcon
          icon={open ? faChevronLeft : faChevronRight}
          className={`mx-0.5`}
        />
      </button>
      {/*<ActionBar />*/}
      <div className="h-full [&>*]:my-1">
        {/*<Note/>*/}
        {/*<Note/>*/}
        {/*<Note text="זה טקסט בעברית כדי לראות איך מגיב"/>*/}
        {/*<div className={`rounded flex items-center gap-4 font-medium hover:bg-white */}
        {/*hover:bg-opacity-20 select-none [& *]:duration-200 py-2 px-3.5 overflow-hidden`}*/}
        {/*>*/}
          <SidebarItem text="Calendar" open={open} icon={faCalendarDays} />
          <SidebarItem text="Notes" open={open} icon={faNoteSticky} />
          {/*<FontAwesomeIcon icon={faCalendarDays} className={`text-white ${!open && 'text-2xl'} duration-200`}/>*/}

          {/*<p className={`text-gray-200 ${!open && ''} duration-200`}>Calendar</p>*/}
          {/*{*/}
          {/*  open &&*/}
          {/*    <>*/}
          {/*        <FontAwesomeIcon icon={faCalendarDays} className="text-white p-3"/>*/}
          {/*        <p className="text-gray-200">Calendar</p>*/}
          {/*    </>*/}
          {/*}*/}
          {/*{*/}
          {/*  !open &&*/}
          {/*    <>*/}
          {/*        <FontAwesomeIcon icon={faCalendarDays} className="text-white text-xl"/>*/}
          {/*    </>*/}
          {/*}*/}

        {/*</div>*/}
      </div>
      <input
        placeholder="search"
        className="rounded-md px-3 py-2 bg-[#1b1c22] text-gray-200 w-full"
      />
    </div>
  )
}