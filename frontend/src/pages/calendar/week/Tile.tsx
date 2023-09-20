import React, { forwardRef, HTMLAttributes } from 'react';
import { getTimeFormat } from "../../../time";
import { WeekEvent } from "@/contexts/Events";

interface TileProps extends HTMLAttributes<HTMLDivElement> {
  color: string
  event: WeekEvent
  selectedId: number
}

export const Tile = forwardRef<HTMLDivElement, TileProps>(({ event, color, children, selectedId, ...props }, ref) => {
  const { title, startDate, endDate, id } = event

  const isFifteenMin = 1000 * 60 * 15 == endDate.getTime() - startDate.getTime()
  const isThirtyMin =  1000 * 60 * 30 == endDate.getTime() - startDate.getTime()

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
          <span
            className={`
            line-clamp-2
            ${isFifteenMin && "-mt-1 !line-clamp-1"}
            ${isThirtyMin && "-mt-0.5 !line-clamp-1"}
            font-medium !text-xs
            `}
          >
            {title}
          </span>
          <p
            className={`
            !text-gray-400 !text-[0.7rem] -mt-0.5
            `}
          >
            {getTimeFormat(startDate)} - {getTimeFormat(endDate)}
          </p>
        </section>
      </div>

      {/* Do not remove children. this is for the resize handle. */}
      {children}
    </div>
  );
})
