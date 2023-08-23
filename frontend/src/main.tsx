import React from 'react'
import { createRoot } from 'react-dom/client'
import { DirectionProvider } from "./contexts/Direction";
import { CalendarProvider } from "./contexts/DateContext";
import { EventProvider } from "@/contexts/Events";
import { WindowProvider } from "@/contexts/Window";
import { BrowserRouter } from "react-router-dom";
import App from './App'
import './input.css'

const container = document.getElementById('root')

const root = createRoot(container!)

root.render(
  <BrowserRouter>
    <WindowProvider>
      <DirectionProvider>
        <CalendarProvider>
          <EventProvider>
            <App/>
          </EventProvider>
        </CalendarProvider>
      </DirectionProvider>
    </WindowProvider>
  </BrowserRouter>
)
