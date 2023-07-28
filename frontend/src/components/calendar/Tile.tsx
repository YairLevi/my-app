import React, { forwardRef, HTMLAttributes } from 'react';
import { getTimeFormat } from "../../time";
import { CalendarEvent } from "@/contexts/EventsContext";

interface TileProps extends HTMLAttributes<HTMLDivElement> {
  color: string
  event: CalendarEvent
  selectedId: number
}

export const Tile = forwardRef<HTMLDivElement, TileProps>(({ event, color, children, selectedId, ...props }, ref) => {
  const { title, startDate, endDate, id } = event

  return (
    <div
      ref={ref}
      className="[&_*]:select-none"
      {...props}
    >
      <div className={`bg-[#0f0f11] h-full rounded-lg mx-1 !text-black px-1 py-1 flex gap-2
        active:cursor-grab overflow-hidden border-t-gray-800 border-t
        ${selectedId == id && 'border border-white'}
        `}
      >
        <div className={`border rounded-lg border-l-4 h-full`} style={{ borderColor: color }}/>
        <section>
          <span className="font-medium !text-xs line-clamp-2">{title}</span>
          <span className="!text-gray-400 !text-[0.7rem]">{getTimeFormat(startDate)} - {getTimeFormat(endDate)}</span>
        </section>
      </div>

      {/* Do not remove children. this is for the resize handle. */}
      {children}
    </div>
  );
})
