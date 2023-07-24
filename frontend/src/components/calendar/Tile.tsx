import React, { forwardRef, HTMLAttributes, MouseEvent, useEffect, useState } from 'react';
import { prefixZero } from "../../time";
import { ContextMenu, defaultMenuState, useContextMenuRef } from "@/components/ContextMenu";
import { useWindow } from "@/contexts/Window";

interface TileProps extends HTMLAttributes<HTMLDivElement> {
  tileId: number
  title: string
  color: string
  start: Date
  end: Date
  selectedId: number
}


export const Tile = forwardRef<HTMLDivElement, TileProps>(({ style, start, end, title, color, children, selectedId, tileId, ...props }, ref) => {
  function getTimeFormat(date: Date) {
    return `${date.getHours()}:${prefixZero(date.getMinutes())}`
  }

  const [openMenu, setOpenMenu] = useState<ContextMenu>(defaultMenuState)
  const { windowRef } = useWindow()
  const { menuRef } = useContextMenuRef()

  useEffect(() => {
    const closeMenu = () => setOpenMenu(defaultMenuState)

    window.addEventListener('click', closeMenu)
    return () => window.removeEventListener('click', closeMenu)
  }, [])

  function showMenu(e: MouseEvent) {
    e.preventDefault()

    let X = e.clientX
    let Y = e.clientY

    const menu = menuRef.current!
    const window = windowRef.current!

    X = Math.max(0, Math.min(X, window.clientWidth - menu.clientWidth))
    Y = Math.max(0, Math.min(Y, window.clientHeight - menu.clientHeight))

    setOpenMenu({
      left: X,
      top: Y,
      show: true
    })
  }

  return (
    <>
      <div
        style={{ ...style, }}
        ref={ref}
        {...props}
        className="[&_*]:select-none"
        onContextMenu={showMenu}
      >
        <div className={`bg-[#0f0f11] h-full rounded-lg mx-1 !text-black px-1 py-1 flex gap-2
        active:cursor-grab overflow-hidden border-t-gray-800 border-t
        ${selectedId == tileId && 'border border-white'}
        `}
        >
          <div className={`border rounded-lg border-l-4 h-full`} style={{ borderColor: color }}/>
          <section>
            <span className="font-medium !text-xs line-clamp-2">{title}</span>
            <span className="!text-gray-400 !text-[0.7rem]">{getTimeFormat(start)} - {getTimeFormat(end)}</span>
          </section>
        </div>

        {/* Do not remove children. this is for the resize handle. */}
        {children}
      </div>

      <ContextMenu
        top={openMenu.top}
        left={openMenu.left}
        show={openMenu.show}
        ref={menuRef}
      />
    </>
  );
})
