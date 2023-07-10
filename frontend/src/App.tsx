import { Sidebar } from "@/components/Sidebar";
import { Calendar } from "@/components/Calendar";
import { Summary } from "@/components/calendar/Summary";
import { Grid } from "@/components/calendar/Grid";
import './input.css'
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';



export default function App() {

  return (
    <div className="flex h-screen bg-[#1a1c22] overflow-hidden">
      <Sidebar/>
      <Grid/>
      <div className="max-w-fit min-w-fit h-full bg-[#1a1c22] flex flex-col py-3">
        <Calendar/>
        <Summary/>
      </div>
    </div>
  )
}