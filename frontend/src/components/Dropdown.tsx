import React, { PropsWithChildren, ReactNode, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

export function useDropdown<T>(data: T[]) {
  const [open, setOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState<T>()

  function onSelect(index: number) {
    return () => {
      setSelectedOption(data[index])
      setOpen(false)
    }
  }

  function toggleOpen() {
    setOpen(prev => !prev)
  }

  return {
    options: data,
    open,
    selectedOption,
    onSelect,
    toggleOpen
  }
}

interface ItemProps extends PropsWithChildren {
  onClick: () => void
  isSelected?: boolean
}

function DropdownItem(props: ItemProps) {
  return (
    <li className={`select-none text-white list-none px-3 py-2 my-1 rounded-lg hover:cursor-pointer hover:bg-gray-600
      ${props.isSelected && 'bg-gray-500 bg-opacity-30'}
    `}
        onClick={props.onClick}
    >
      {props.children}
    </li>
  )
}

interface MenuProps extends PropsWithChildren {
  open: boolean
  inline?: boolean
}

function DropdownMenu(props: MenuProps) {
  return (
    <>
      {
        props.open &&
          <div
              className={`
              max-w-[350px] min-w-[5rem] max-h-52 overflow-auto mt-2 p-1 
              rounded-md shadow-sm z-10 ${!props.inline && 'absolute'} bg-[#0f0f11]
              [&_*]:text-sm
              `}
          >
            {props.children}
          </div>
      }
    </>
  )
}

interface PickerProps {
  open: boolean
  onClick: () => void
  placeholder?: string
  value: string | ReactNode
}

function DropdownPicker(props: PickerProps) {
  return (
    <div
      className={`px-3 py-1 text-sm hover:cursor-pointer flex justify-between items-center gap-2 bg-[#0f0f11] [&_*]:text-gray-200`}
      onClick={props.onClick}
    >
      <div className="overflow-hidden text-ellipsis whitespace-nowrap">
        {props.value ?? <p className="!text-gray-500">{props.placeholder}</p>}
      </div>
      <FontAwesomeIcon icon={props.open ? faChevronUp : faChevronDown} className="pl-2 border-l my-1 py-1"/>
    </div>
  )
}

interface DropdownProps extends PropsWithChildren {
  title?: string
}

export default function Dropdown(props: DropdownProps) {
  return (
    <div className="w-auto [&>*]:rounded-lg">
      {
        props.title &&
          <label className="font-medium text-gray-600 text-sm">
            {props.title}
          </label>
      }
      {props.children}
    </div>
  )
}

Dropdown.Item = DropdownItem
Dropdown.Menu = DropdownMenu
Dropdown.Picker = DropdownPicker