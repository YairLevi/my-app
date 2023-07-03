import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { PropsWithChildren, ReactNode, useState } from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { useLocation, useNavigate } from "react-router";

const hoverColor = 'bg-gray-100'

export function Divider() {
  return (
    <hr className="border-t mx-4"/>
  )
}

function Header(props: PropsWithChildren) {
  return (
    <div className="h-fit flex flex-col justify-between">
      <>
        {props.children}
      </>
      <Divider/>
    </div>
  )
}

function Content(props: PropsWithChildren) {
  return (
    <div className="h-full overflow-auto py-3">
      {props.children}
    </div>
  )
}

function Footer(props: PropsWithChildren) {
  return (
    <>
      <Divider/>
      <div className="mb-3 py-3">
        {props.children}
      </div>
    </>
  )
}

interface ItemProps {
  title: string
  icon?: IconProp
  href: string

  onClick?: () => void
}

function Item(props: ItemProps) {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div onClick={() => props.onClick ? props.onClick() : navigate(props.href)}
         className={`flex items-center px-5 py-2 rounded-lg mx-3 my-1 hover:cursor-pointer hover:${hoverColor}  
         ${location.pathname === props.href && 'bg-gray-200'}`}
    >
      {props.icon && <FontAwesomeIcon icon={props.icon}/>}
      <p className="ml-5 text-sm" style={{ fontWeight: 500 }}>{props.title}</p>
    </div>
  )
}

interface SubmenuProps extends PropsWithChildren {
  title: string
  icon?: IconProp
}

function Submenu(props: SubmenuProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div
        className={`flex justify-between px-5 py-2 my-1 items-center hover:cursor-pointer rounded-lg mx-3 hover:${hoverColor}`}
        onClick={() => setOpen(prev => !prev)}
      >
        <div className="flex items-center">
          {props.icon && <FontAwesomeIcon icon={props.icon}/>}
          <p className="ml-5 text-sm font-medium">{props.title}</p>
        </div>
        <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown}/>
      </div>
      {
        open &&
        <div className="rounded-lg px-2 py-1 mx-3 my-1 bg-gray-50">
          {props.children}
        </div>
      }
    </>
  )
}

interface SidebarProps extends PropsWithChildren {
  open: boolean
  onClose: () => void
}

export default function Sidebar({ open, onClose, children }: SidebarProps) {
  return (
    <>
      {/* SHOW ONLY WHEN <= MD */}
      <div className="min-md:hidden">
        {
          open &&
          <>
            <div className="bg-white z-20 min-w-[16rem] w-64 h-[100dvh] flex flex-col justify-between border-r-2 border-gray-100 [&>*]:text-[#0f172a] absolute">
              {children}
            </div>
            <div className="absolute z-10 w-screen h-screen bg-black bg-opacity-60" onClick={onClose}>
              <FontAwesomeIcon
                icon={faXmark}
                className="text-3xl text-white absolute top-2 right-2 p-3 hover:cursor-pointer"
                onClick={onClose}
              />
            </div>
          </>
        }
      </div>

      {/* SHOW ONLY WHEN >= MD */}
      <div className="md:hidden">
        <div className="bg-white z-20 min-w-[16rem] w-64 h-screen flex flex-col justify-between border-r-2 border-gray-100 [&>*]:text-[#0f172a]">
          {children}
        </div>
      </div>
    </>
  )
}

Sidebar.Item = Item
Sidebar.Submenu = Submenu
Sidebar.Header = Header
Sidebar.Content = Content
Sidebar.Footer = Footer
