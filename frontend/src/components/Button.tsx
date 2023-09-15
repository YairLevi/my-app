import React, { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  onClick: () => void
  color: string
  disabled?: boolean
}

export function Button({ children, onClick, color, disabled }: Props) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{ backgroundColor: color }}
      className={`text-sm text-white px-4 py-2 font-medium hover:bg-gray-800 hover:bg-opacity-50 rounded-md`}
    >
      {children}
    </button>
  )
}

// <button className="text-sm px-3 py-2 hover:bg-gray-800 rounded-lg">Cancel</button>
// <button className="text-sm px-3 py-2 hover:bg-gray-800 bg-gray-700 rounded-lg">Add</button>