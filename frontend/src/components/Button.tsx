import React, { PropsWithChildren, HTMLProps } from "react"
import clsx from 'clsx'

interface ButtonProps extends PropsWithChildren, Omit<HTMLProps<HTMLButtonElement>, 'size'> {
  size?: 'small' | 'medium' | 'big'
  type?: 'primary' | 'link' | 'secondary' | 'destructive' | 'outline' | 'ghost'
}

export function Button({ children, onClick, className, disabled, ref, size = 'medium', type = 'primary' }: ButtonProps) {
  const sizes = {
    small: 'text-xs px-2 py-1',
    medium: 'text-sm px-4 py-2',
    big: 'text-md px-6 py-2.5',
  }

  const types = {
    primary: 'bg-slate-800 hover:bg-opacity-75',
    link: '',
    secondary: 'bg-blue-500 hover:bg-opacity-75',
    destructive: 'bg-red-500 hover:bg-opacity-75',
    outline: '',
    ghost: '',
  }

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      ref={ref}
      className={clsx(
        'text-gray-200 font-medium rounded-md transition-all duration-50',
        sizes[size],
        types[type],
        type === 'outline' && 'border border-gray-500 hover:border-gray-700',
        type === 'ghost' && 'bg-transparent hover:bg-gray-500 hover:bg-opacity-25',

        className
      )}
    >
      {children}
    </button>
  )
}


// import React, { PropsWithChildren, HTMLProps } from "react"
// import clsx from 'clsx'
//
// interface Props extends PropsWithChildren, HTMLProps<HTMLButtonElement> {}
//
// export function Button({ children, onClick, className, disabled, ref }: Props) {
//   type Variant = 'outline'
//   const v: Variant = 'outline'
//
//   return (
//     <button
//       disabled={disabled}
//       onClick={onClick}
//       className={clsx(
//         'text-sm text-gray-200 px-4 py-2 font-medium rounded-md transition-all duration-50 bg-slate-800',
//         'hover:bg-gray-500 hover:bg-opacity-25',
//         v == 'outline' && '',
//         className
//       )}
//     >
//       {children}
//     </button>
//   )
// }