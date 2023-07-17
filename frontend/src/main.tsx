import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './input.css'
import { DirectionProvider } from "./contexts/Direction";
import { CalendarProvider } from "./contexts/DateContext";

const container = document.getElementById('root')

const root = createRoot(container!)

root.render(
  <DirectionProvider>
    <CalendarProvider>
      <App/>
    </CalendarProvider>
  </DirectionProvider>
)
