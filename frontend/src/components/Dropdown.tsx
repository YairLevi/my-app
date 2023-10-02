import React, { HTMLProps, PropsWithChildren, ReactNode, RefObject, useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";

export function useDropdown<T>(data: T[]) {
  const [open, setOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState<T>()
  const pickerRef = useRef<HTMLDivElement>(null)

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
    toggleOpen,
    pickerRef
  }
}

interface ItemProps extends PropsWithChildren {
  onClick: () => void
  isSelected?: boolean
}

function DropdownItem(props: ItemProps) {
  return (
    <li className={`select-none text-gray-200 list-none px-2 py-1 my-1 rounded-lg hover:cursor-pointer hover:bg-gray-300 hover:bg-opacity-20
      ${props.isSelected && 'bg-gray-500'}
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
  className?: string
  pickerRef: RefObject<HTMLDivElement>
}

function DropdownMenu(props: MenuProps) {
  let top = props.pickerRef.current?.clientHeight
  let left = props.pickerRef.current?.getBoundingClientRect().left

  return (
    <>
      <div
        className={clsx(
          'border max-w-[350px] min-w-[5rem] overflow-auto mt-2 p-1 rounded-md z-10 shadow-2xl bg-[#0f0f11] ease-out duration-150',
          '[&_*]:text-sm',
          props.open ? 'opacity-100 scale-100' : 'opacity-0 scale-95 invisible',
          !props.inline && 'fixed',
          props.className
        )}
        style={{
          top: top,
          left: left,
        }}
      >
        {props.children}
      </div>
    </>
  )
}

interface PickerProps extends Omit<HTMLProps<HTMLDivElement>, 'value'> {
  open: boolean
  onClick: () => void
  placeholder?: string
  value: string | ReactNode
  pickerRef: RefObject<HTMLDivElement>
}

function DropdownPicker(props: PickerProps) {
  const openRef = useRef(props.open)

  useEffect(() => {
    openRef.current = props.open
  }, [props.open]);

  useEffect(() => {
    function detect() {
      if (!openRef.current) return
      props.onClick()
    }

    window.addEventListener('resize', detect)
    return () => window.removeEventListener('resize', detect)
  }, [])

  return (
    <div
      ref={props.pickerRef}
      className={clsx(
        `px-3 py-1 text-sm flex justify-between items-center gap-2 select-none`,
        'hover:cursor-pointer',
        '[&_*]:text-gray-300',
        props.className,
      )}
      onClick={props.onClick}
    >
      <div className="overflow-hidden text-ellipsis whitespace-nowrap">
        {props.value ?? <p className="text-gray-500">{props.placeholder}</p>}
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
    <div className="w-auto [&>*]:rounded-md">
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