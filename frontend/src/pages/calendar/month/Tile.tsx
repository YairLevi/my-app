import React, { forwardRef, HTMLAttributes, MouseEvent } from "react";
import { MonthEvent } from "@/contexts/Events";

interface TileProps2 extends HTMLAttributes<HTMLDivElement> {
  selectedId: number
  onTileDragStart: (e: MouseEvent) => void
  onTileDragStop: (e: MouseEvent) => void
  event: MonthEvent
}

export const Tile = forwardRef<HTMLDivElement, TileProps2>(({children, event, selectedId, className, ...props}, ref) => {
  const { title, startDate, id } = event
  const { onTileDragStart, onTileDragStop } = props

  return (
    <div
      ref={ref}
      className={`![&_*]:select-none ${className}`}
      {...props}
      onMouseDown={e => {
        e.stopPropagation()
        onTileDragStart(e)
      }}
    >
      <div className={`bg-[#0f0f11] h-full rounded mx-1 !text-black px-1 py-1 flex gap-2
        active:cursor-grabbing hover:cursor-grab overflow-hidden border-t-gray-800 border-t items-center
        ${selectedId == id && 'border border-white'}
        `}
      >
        <section>
          <span className="font-medium text-white text-[0.8rem] line-clamp-1 px-1.5">{title}</span>
        </section>
      </div>

      {/* Do not remove children. this is for the resize handle. */}
      {/* Since this is a month tile, and I didn't implement a resizing yet, let's remove children! */}
      {/*{children}*/}
    </div>
  )
})