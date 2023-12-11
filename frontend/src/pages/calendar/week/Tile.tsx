import React, { forwardRef, HTMLAttributes } from 'react';
import { getTimeFormat } from "../../../time";
import { WeekEvent } from "@/contexts/Events";

type TileProps = HTMLAttributes<HTMLDivElement> & {
  color: string
  event: WeekEvent
  selectedId: number
}

export const Tile = forwardRef<HTMLDivElement, TileProps>(({ event, color, children, selectedId, ...props }, ref) => {
  const { title, startDate, endDate, id } = event

  const is15Min = 1000 * 60 * 15 == endDate.getTime() - startDate.getTime()
  const is30Min = 1000 * 60 * 30 == endDate.getTime() - startDate.getTime()

  return (
    <div
      ref={ref}
      className="[&_*]:select-none"
      {...props}
    >
      <div className={`bg-[#0f0f11] h-full overflow-hidden rounded-lg mx-1 !text-black px-1 py-0.5 flex gap-2
        active:cursor-grab border-gray-800 border
        ${selectedId == id && 'border border-white'}
        `}
      >
        {/*<div className={`border rounded-lg border-l-4 h-full`} style={{ borderColor: color }}/>*/}
        <section className="px-1.5">
          <span
            className={`
            line-clamp-2
            break-words
            ${is15Min && "-mt-1"}
            ${is30Min && "-mt-0.5"}
            font-medium !text-xs
            overflow-ellipsis
            whitespace-normal
            break-after-auto
            `}
          >
            {title}
          </span>
          <p className={`!text-gray-400 !text-[0.7rem] -mt-0.5 line-clamp-1`}>
            {getTimeFormat(startDate)} - {getTimeFormat(endDate)}
          </p>
        </section>
      </div>

      {/* Do not remove children. this is for the resize handle. */}
      {children}
    </div>
  );
})
