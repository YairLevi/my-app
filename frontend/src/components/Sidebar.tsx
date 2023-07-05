import { useEffect, useRef, useState } from "react";
import { faCalendarDays, faNoteSticky } from "@fortawesome/free-regular-svg-icons"
import { faChevronLeft, faChevronRight, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

interface ItemProps {
  text: string
  open?: boolean
  icon?: IconProp
}

function SidebarItem({ text, open, icon }: ItemProps) {
  return (
    <div className={`rounded-lg flex items-center gap-3 hover:bg-white hover:bg-opacity-10 duration-100
       select-none [&_*]:duration-200 py-1.5 my-1 px-3.5 overflow-hidden hover:cursor-pointer`}
    >
      {icon && <FontAwesomeIcon icon={icon} className={`${!open && 'ml-[1px]'} duration-200 text-xl`}/>}
      <p className={`${!open && '!text-transparent'} duration-200`}>{text}</p>
    </div>
  )
}

export function Sidebar() {
  const [open, setOpen] = useState(true)
  const searchRef = useRef<HTMLInputElement>(null)
  const [openedSearch, setOpenSearch] = useState(false)

  useEffect(() => {
    searchRef.current && searchRef.current.focus()
  }, [openedSearch])

  return (
    <div
      className={`${open ? 'w-56' : 'w-16'} group duration-200 bg-[#0f0f11]  [&_*]:text-[#ceced0] h-screen px-2 py-2 flex flex-col relative group`}>
      <button
        className="absolute z-[-1] bg-[#0f0f11] rounded-md rounded-l-none p-1 px-2 pl-2.5 group-hover:z-20 group-hover:right-[-2rem]"
        onClick={() => setOpen(!open)}>
        <FontAwesomeIcon
          icon={open ? faChevronLeft : faChevronRight}
          className={`mx-0.5`}
        />
      </button>
      <div className="h-full [&>*]:my-1">
        <SidebarItem text="Calendar" open={open} icon={faCalendarDays}/>
        <SidebarItem text="Notes" open={open} icon={faNoteSticky}/>
      </div>
      {
        open
          ? <input
            ref={searchRef}
            placeholder="search"
            className="rounded-md px-3 py-2 bg-[#1b1c22] text-gray-200 w-full"
          />
          :
          <div className={`rounded-lg flex items-center gap-4 font-medium hover:bg-white hover:bg-opacity-10 duration-100
       select-none [& *]:duration-200 py-2.5 px-3.5 overflow-hidden hover:cursor-pointer`}
               onClick={() => {
                 setOpen(true)
                 setOpenSearch(!openedSearch)
               }}
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} className={`${!open && 'text-lg'} duration-200`}/>
          </div>
      }
    </div>
  )
}