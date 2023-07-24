import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './input.css'
import { DirectionProvider } from "./contexts/Direction";
import { CalendarProvider } from "./contexts/DateContext";
import { EventsProvider } from "./contexts/EventsContext";
import { WindowProvider } from "@/contexts/Window";

const container = document.getElementById('root')

const root = createRoot(container!)

root.render(
  <WindowProvider>
    <DirectionProvider>
      <CalendarProvider>
        <EventsProvider>
          <App/>
        </EventsProvider>
      </CalendarProvider>
    </DirectionProvider>
  </WindowProvider>
)
