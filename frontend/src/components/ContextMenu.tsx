import { forwardRef, JSX } from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export type ContextMenu = {
  top: number
  left: number
  show: boolean
  options: Option[]
}

export type Option = "divider" | {
  content: string | JSX.Element
  onClick: () => void
  icon?: IconProp
}

export const ContextMenu = forwardRef<HTMLDivElement, ContextMenu>(({ top, left, show, options, ...props }, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className={`
        fixed z-[999] rounded bg-[#1f1f21] p-2 flex flex-col gap-1 w-48
        ${show ? 'visible' : 'hidden'}
      `}
      style={{
        top: top + 'px',
        left: left + 'px'
      }}
    >
      {options.map((option, i) => (
        <>
          {
            option == 'divider'
              ? <hr className="mx-1 border-gray-600"/>
              :
              <div
                onClick={e => {
                  e.stopPropagation()
                  e.preventDefault()
                  option.onClick && option.onClick()
                }}
                className="flex justify-between items-center text-sm hover:bg-gray-500 hover:bg-opacity-30 px-2 py-1 rounded select-none hover:cursor-pointer"
              >
                <p className="text-gray-300 font-medium">
                  {option.content}
                </p>
                {option.icon && <FontAwesomeIcon className="text-gray-300" icon={option.icon}/>}
              </div>
          }
        </>
      ))}
    </div>
  )
})