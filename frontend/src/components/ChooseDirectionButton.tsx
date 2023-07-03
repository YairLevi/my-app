import { useDirection } from "../contexts/Direction";

export function ChooseDirectionButton() {
  const { toggle } = useDirection()

  return (
    <button onClick={() => toggle()} className="bg-red-200 h-fit">Change direction</button>
  )
}