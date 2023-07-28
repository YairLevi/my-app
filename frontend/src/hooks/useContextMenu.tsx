import { MouseEvent, RefObject, useEffect, useState } from "react";
import { useWindow } from "@/contexts/Window";

type ContextMenuOpts = {
  show: boolean
  top: number
  left: number
}

const DefaultOptions: ContextMenuOpts = {
  show: false,
  top: 0,
  left: 0,
}

export function useContextMenu(menuRef: RefObject<HTMLElement>): [ContextMenuOpts, (e: MouseEvent) => void, () => void] {
  const { windowRef } = useWindow()
  const [options, setOptions] = useState<ContextMenuOpts>(DefaultOptions)

  const closeMenu = () => setOptions(DefaultOptions)

  useEffect(() => {
    window.addEventListener('click', closeMenu)
    return () => window.removeEventListener('click', closeMenu)
  }, [])

  function openMenu(e: MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    const menu = menuRef.current!
    const window = windowRef.current!

    const X = Math.max(0, Math.min(e.clientX, window.clientWidth - menu.clientWidth))
    const Y = Math.max(0, Math.min(e.clientY, window.clientHeight - menu.clientHeight))

    setOptions({
      left: X,
      top: Y,
      show: true,
    })
  }

  return [options, openMenu, closeMenu]
}