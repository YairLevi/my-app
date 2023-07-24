import React, { forwardRef, MouseEvent, PropsWithChildren, useRef } from "react";

export type ContextMenu = {
  top: number
  left: number
  show: boolean
}

export const defaultMenuState: ContextMenu = {
  top: 0,
  left: 0,
  show: false
}

export function useContextMenuRef() {
  return { menuRef: useRef<HTMLDivElement>(null) }
}

interface OptionProps extends PropsWithChildren {
  onClick?: () => void
}

function Option({ onClick, children }: OptionProps) {
  function click(e: MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    onClick && onClick()
  }

  return (
    <p
      onClick={click}
      className="text-white hover:bg-gray-500 hover:bg-opacity-30 px-2 py-1 rounded-md select-none"
    >
      {children}
    </p>
  )
}

export const ContextMenu = forwardRef<HTMLDivElement, ContextMenu>(({ top, left, show, ...props }, ref) => {
  return (

    <div
      ref={ref}
      {...props}
      className={`
        fixed z-[999] rounded-lg bg-slate-800 p-2 flex flex-col gap-1
        ${show ? 'visible' : 'hidden'}
      `}
      style={{
        top: top + 'px',
        left: left + 'px'
      }}
    >
      <Option>Option A</Option>
      <Option>Option B</Option>
      <Option>Option C</Option>
    </div>
  )
})