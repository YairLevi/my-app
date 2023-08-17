import React, {forwardRef, PropsWithChildren} from "react";

interface TileProps2 extends PropsWithChildren {
  title: string
  date: Date
}

export const MonthlyTile = forwardRef<HTMLDivElement, TileProps2>(({children, date, title, ...props}, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className="[&_*]:select-none"
    >
      <div className={`bg-[#0f0f11] h-full rounded mx-1 !text-black px-1 py-1 flex gap-2
        active:cursor-grab overflow-hidden border-t-gray-800 border-t
        `}
      >
        <div className={`border rounded-lg border-l-4 h-full`} style={{borderColor: "#0e9426"}}/>
        <section>
          <span className="font-medium text-white text-sm line-clamp-1">{title}</span>
        </section>
      </div>

      {/* Do not remove children. this is for the resize handle. */}
      {children}
    </div>
  )
})