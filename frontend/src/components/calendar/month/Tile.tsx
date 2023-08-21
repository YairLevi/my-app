import React, { forwardRef, HTMLAttributes } from "react";
import { MonthEvent } from "@/contexts/Events";

interface TileProps2 extends HTMLAttributes<HTMLDivElement> {
  selectedId: number
  event: MonthEvent
}

export const Tile = forwardRef<HTMLDivElement, TileProps2>(({children, event, selectedId, ...props}, ref) => {
  const { title, date, id } = event

  return (
    <div
      ref={ref}
      className="![&_*]:select-none"
      {...props}
    >
      <div className={`bg-[#0f0f11] h-full rounded mx-1 !text-black px-1 py-1 flex gap-2
        active:cursor-grabbing hover:cursor-grab overflow-hidden border-t-gray-800 border-t items-center
        ${selectedId == id && 'border border-white'}
        `}
      >
        <div className={`border rounded-lg border-l-4 h-full`} style={{borderColor: "#0e9426"}}/>
        <section>
          <span className="font-medium text-white text-[0.8rem] line-clamp-1">{title}</span>
        </section>
      </div>

      {/* Do not remove children. this is for the resize handle. */}
      {/* Since this is a month tile, and I didn't implement a resizing yet, let's remove children! */}
      {/*{children}*/}
    </div>
  )
})