import './input.css'
import { Sidebar } from "@/components/Sidebar";
import { ChooseDirectionButton } from "@/components/ChooseDirectionButton";
import Calendar from "@/components/Calendar";

export default function App() {
  return (
    <div className="flex place-items-center">
      <Sidebar />
      <ChooseDirectionButton />
      <Calendar />
    </div>
  )
}