import {rowHeightInPixels} from "../../grid";
import React from "react";
import {Responsive, WidthProvider} from "react-grid-layout";

const ResponsiveGridLayout = WidthProvider(Responsive)

export function MonthlyCalendar() {
  const RowCount = 4

  return (
    <ResponsiveGridLayout
      className="h-full w-full min-w-[49rem] layout border-gray-600"
      breakpoints={{lg: 1200,}}
      width={500}
      preventCollision={true}
      cols={{'lg': 7}}
      rowHeight={100}
      resizeHandles={['w', 's']}
      maxRows={RowCount}
      compactType={null}
      isBounded={true}
      margin={[1, 1]}
    >
      <div
        key="item"
        className="bg-blue-200"
        data-grid={{
          w: 7,
          h: 1,
          x: 1,
          y: 1,
          isResizable: false,
        }}
      >

      </div>
      <div
        key="item-top"
        className="hidden"
        data-grid={{
          w: 0,
          h: 0,
          x: 0,
          y: 0,
          isResizable: false,
          isDraggable: false,
          static: true,
          minH: -1,
          minW: -1
        }}
      >
        This is the top item, hidden, to stretch the grid.
      </div>
      <div
        key="item-bottom"
        className="hidden"
        data-grid={{
          w: 0,
          h: 0,
          x: 0,
          y: RowCount,
          isResizable: false,
          isDraggable: false,
          static: true,
          minH: -1,
          minW: -1
        }}
      >
        This is the bottom item, hidden, to stretch the grid.
      </div>
    </ResponsiveGridLayout>
  )
}