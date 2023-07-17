import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './input.css'
import { DirectionProvider } from "./contexts/Direction";
import { CalendarProvider } from "./contexts/DateContext";
import { EventsProvider } from "./contexts/EventsContext";

const container = document.getElementById('root')

const root = createRoot(container!)

root.render(
  <DirectionProvider>
    <CalendarProvider>
      <EventsProvider>
        <App/>
      </EventsProvider>
    </CalendarProvider>
  </DirectionProvider>
)
