import { MonthEvent } from "@/contexts/Events";
import ReactGridLayout from "react-grid-layout";

function sortEvents(events: MonthEvent[]): MonthEvent[] {
  return events.sort((a, b) => {
    // Priority 1: Earliest startDate
    if (a.startDate.getTime() !== b.startDate.getTime()) {
      return a.startDate.getTime() - b.startDate.getTime();
    }

    // Priority 2: Longest event (endDate - startDate)
    const durationA = a.endDate.getTime() - a.startDate.getTime();
    const durationB = b.endDate.getTime() - b.startDate.getTime();
    if (durationA !== durationB) {
      return durationB - durationA; // Sort in descending order of duration
    }

    // Priority 3: Lexical order of title
    return a.title.localeCompare(b.title);
  });
}

type Tile = {
  event: MonthEvent
  layout: ReactGridLayout.Layout
}

const NOT_FOUND = -1
const FREE = false
export let dateToEvents = new Map<string, MonthEvent[]>()

export function createTiles(events: MonthEvent[], monthDays: Date[]): Tile[] {
  // reset global - requires refactoring...
  dateToEvents = new Map<string, MonthEvent[]>()

  const sortedEvents = sortEvents(events)
  let tiles: Tile[] = []

  for (let i = 0; i < monthDays.length; i+=7) {
    // if (i != 4*7) continue // testing purposes
    const weekDays = monthDays.slice(i, i+7)
    const eventsInWeek = sortedEvents.filter(event => event.startDate <= weekDays[6] && event.endDate >= weekDays[0])
    const weekTiles = tilesInWeek(eventsInWeek, weekDays).map(tile => {
      return {
        event: tile.event,
        layout: {
          ...tile.layout,
          y: tile.layout.y + 5 * (i/7)
        }
      }
    })
    tiles = [...tiles, ...weekTiles]
  }

  return tiles
}

function tilesInWeek(eventsInWeek: MonthEvent[], weekDays: Date[]): Tile[] {
  const tiles: Tile[] = []
  const slots = Array.from({ length: 7 }, () => [FREE, FREE, FREE])

  eventsInWeek.forEach(event => {
    const start = event.startDate > weekDays[0] ? event.startDate : weekDays[0]
    const end = event.endDate < weekDays[6] ? event.endDate : weekDays[6]

    const startIdx = weekDays.findIndex(day => day.toDateString() == start.toDateString())
    const endIdx = weekDays.findIndex(day => day.toDateString() == end.toDateString())

    if (startIdx == NOT_FOUND || endIdx == NOT_FOUND) {
      return
    }

    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dateStringKey = date.toDateString()
      const newEventList = [...dateToEvents.get(dateStringKey) || [], event]
      dateToEvents.set(dateStringKey, newEventList)
    }

    const slotIdx = slots[startIdx].findIndex(slot => slot == FREE)
    if (slotIdx == NOT_FOUND) {
      for (let i = startIdx; i <= endIdx; i++) {
        slots[i][slotIdx] = !FREE
      }
      return
    }

    for (let i = startIdx; i <= endIdx; i++) {
      slots[i][slotIdx] = !FREE
    }

    tiles.push({
      event: event,
      layout: {
        i: `${event.id}-${start.toDateString()}`,
        x: start.getDay(),
        y: slotIdx + 1,
        w: end.getDay() - start.getDay() + 1,
        h: 1
      }
    })
  })

  return tiles
}

function createLayout(events: MonthEvent[], days: Date[]): Tile[] {
  const sortedEvents = sortEvents(events)
  const tiles: Tile[] = []

  const counters = new Map<string, number>()

  sortedEvents.forEach(event => {
    if (event.id == 10) {
      console.log(counters)
    }

    let dayIdx = days.findIndex(day => day.toDateString() == event.startDate.toDateString())
    if (dayIdx == -1)
      return

    const start = event.startDate > days[0] ? event.startDate : days[0]
    const end = (event.endDate < days.at(-1)! ? event.endDate : days.at(-1))! // might be null

    let startOfTile = start
    let endOfTile

    let tapout = 0
    while (tapout < 10) {
      let tileX, tileY, tileW, tileH

      if (startOfTile > end) {
        break
      }

      const row = Math.floor(days.findIndex(ev => ev.toDateString() == startOfTile.toDateString()) / 7)
      endOfTile = days[Math.ceil((row*5 + 1)/5) * 7 - 1] < end ? days[Math.ceil((row*5 + 1)/5) * 7 - 1] : end



      if (counters.get(startOfTile.toDateString())! > 3) {
        startOfTile.setDate(endOfTile.getDate() + 1)
        continue
      }

      tileY = row*5 + 1
      tileX = startOfTile.getDay()
      tileH = 1
      tileW = endOfTile.getDay() - startOfTile.getDay() + 1

      const layout: ReactGridLayout.Layout = {
        i: event.id + startOfTile.toDateString(),
        x: tileX,
        y: tileY,
        w: tileW,
        h: tileH
      }

      tiles.push({
        event, layout
      })

      for (let date = startOfTile; date <= endOfTile; date.setDate(date.getDate() + 1)) {
        const dateStringKey = date.toDateString()
        if (!counters.has(dateStringKey)) {
          counters.set(dateStringKey, 0)
        }
        counters.set(dateStringKey, counters.get(dateStringKey)! + 1)
      }

      startOfTile.setDate(endOfTile.getDate() + 1)
      /**
       * if start is more than end: break
       *
       * start date of tile is given
       * end date of tile is the min from end of current week to "end"
       * calculate Y by floor(idx of start / 7)
       * calculate X by simply day-in-the-week of start
       * calculate H = 1, because all tiles have height 1
       * calculate W by the difference in day count from end to start
       *
       * set start to be the sunday of the next week
       */
      tapout++
    }
  })

  return tiles
}

/**
 * I need an algorithm that given an array of events, sorted by order, return array of layout:
 * [{ i: id, x, y, w, h=1 }]
 * and array of events that are not shown.
 * [
 *   days => [X, X, X, ...]
 * ]
 * given event e:
 *    get the index topmost available slot of e.startDate.
 *    assign that event to all [start, ..., end] days at that index.
 *
 */


export function generateCalendarGrid(currentDate: Date): Date[] {
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  const prevMonthLastDays = [];
  const startDay = firstDayOfMonth.getDay(); // Starting from Sunday
  for (let i = startDay === 0 ? 6 : startDay - 1; i >= 0; i--) {
    const prevDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), -i);
    prevMonthLastDays.push(prevDay);
  }

  const daysToAdd = 42 - daysInMonth - prevMonthLastDays.length;
  const nextMonthCompletingDays = [];
  for (let i = 1; i <= daysToAdd; i++) {
    const nextDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i);
    nextMonthCompletingDays.push(nextDay);
  }

  return [
    ...prevMonthLastDays,
    ...Array.from({ length: daysInMonth },
      (_, i) => new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1)),
    ...nextMonthCompletingDays
  ];
}