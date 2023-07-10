import React, {forwardRef, HTMLAttributes} from 'react';
import {prefixZero} from "../../time";

interface TileProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  color: string
  start: Date
  end: Date
}

export const Tile = forwardRef<HTMLDivElement, TileProps>(({style, start, end, title, color, children, ...props}, ref) => {

    function getTimeFormat(date: Date) {
      return `${date.getHours()}:${prefixZero(date.getMinutes())}`
    }

    return (
      <div style={{...style}} ref={ref}{...props}>
        <div className="bg-[#0f0f11] h-full rounded-lg mx-1 !text-black px-1 py-1 flex gap-2
        hover:cursor-grab active:cursor-grabbing overflow-hidden border-t-gray-800 border-t"
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
    );
  }
)
