interface Props {
  text?: string
}

export function Note(props: Props) {
  return (
    <div className="text-[#dfdfdf] font-medium px-3 py-2 my-1 rounded-md hover:cursor-pointer hover:bg-[#2d2f37] overflow-ellipsis whitespace-nowrap overflow-hidden">
      {props.text ?? "Note tab what about long one"}
    </div>
  )
}