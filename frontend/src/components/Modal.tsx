import React, { PropsWithChildren, useState } from "react";
import { XIcon } from 'lucide-react'
import clsx from "clsx";

export interface ModalProps extends PropsWithChildren {
  open: boolean
  onClose: () => void
  title?: string
}

export function useModal() {
  const [open, setOpen] = useState(false)
  const onClose = () => setOpen(false)
  const onOpen = () => setOpen(true)

  return { open, onClose, onOpen }
}

export function Group({ children, label }: PropsWithChildren & { label?: string }) {
  return (
    <div className="flex flex-col gap-1 my-5">
      {label && <label className="font-medium text-[0.8rem] text-gray-400">{label}:</label>}
      {children}
    </div>
  )
}

export function Footer({ children }: PropsWithChildren) {
  return (
    <footer className="flex justify-end items-center gap-3">
      {children}
    </footer>
  )
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  return (
    <div
      onClick={onClose}
      className={clsx(
        'fixed z-[1000] top-0 left-0 w-screen h-screen bg-black bg-opacity-40 backdrop-blur-sm flex items-center overflow-auto justify-center',
        open ? 'scale-1' : 'scale-0'
      )}
    >
      <div
        onClick={e => e.stopPropagation()}
        className={clsx(
          'p-5 bg-[#17191f] shadow-xl rounded-lg w-1/4 min-w-[20rem] h-fit duration-150 ease-out',
          open ? 'opacity-100 scale-100' : 'opacity-0 scale-95 invisible',
        )}
      >
        <header className="flex justify-between items-center [&_*]:text-gray-200">
          <h1 className="text-lg">{title}</h1>
          <XIcon
            width={32}
            height={32}
            className="rounded hover:bg-white hover:bg-opacity-10 p-1"
            onClick={onClose}
          />
        </header>
        {children}
      </div>
    </div>
  )
}

Modal.Group = Group
Modal.Footer = Footer