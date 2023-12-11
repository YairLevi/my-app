import { WeekEvent } from "@/contexts/Events";
import ReactGridLayout from "react-grid-layout";

export const CALENDAR_COLUMN_COUNT = 7
export const GRID_COLUMN_COUNT = 8
export const FIRST_EVENT_COLLECTION_COLUMN_SPAN = 6
export const SECOND_EVENT_COLLECTION_COLUMN_SPAN = 4

type Tile = {
  event: WeekEvent
  layout: ReactGridLayout.Layout
}


function sortByStartDate(weekEvents: WeekEvent[]): WeekEvent[] {
  return weekEvents.sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
}

function extractNonOverlapEvents(weekEvents: WeekEvent[]): { nonOverlappingEvents: WeekEvent[], restOfEvents: WeekEvent[] } {
  if (weekEvents.length == 0) return { nonOverlappingEvents: [], restOfEvents: [] }

  const nonOverlappingEvents: WeekEvent[] = [weekEvents[0]]
  const restOfEvents: WeekEvent[] = []

  for (let i = 1; i < weekEvents.length; i++) {
    const currEventStartDate = weekEvents[i].startDate
    const prevEventEndDate = nonOverlappingEvents.at(-1)!.endDate

    if (currEventStartDate.getTime() > prevEventEndDate.getTime()) {
      nonOverlappingEvents.push(weekEvents[i])
    } else {
      restOfEvents.push(weekEvents[i])
    }
  }

  return { nonOverlappingEvents, restOfEvents }
}

function getEventsInWeek(events: WeekEvent[], weekDays: Date[]): WeekEvent[] {
  const startOfWeek = new Date(weekDays[0])
  startOfWeek.setHours(0,0,0)
  const endOfWeek = new Date(weekDays[6])
  endOfWeek.setHours(0,0,0)
  endOfWeek.setDate(endOfWeek.getDate() + 1)

  return events.filter(event => {
    return event.startDate.getTime() <= endOfWeek.getTime() && event.endDate.getTime() >= startOfWeek.getTime()
  })
}

function getEventsInDay(events: WeekEvent[], day: Date): WeekEvent[] {
  const startOfDay = new Date(day)
  startOfDay.setHours(0, 0, 0, 0)
  const endOfDay = new Date(startOfDay)
  endOfDay.setDate(endOfDay.getDate() + 1)

  return events.filter(event => {
    if (event.startDate.getTime() == endOfDay.getTime() || event.endDate.getTime() == startOfDay.getTime()) {
      return false
    }
    return event.startDate.getTime() <= endOfDay.getTime() && event.endDate.getTime() >= startOfDay.getTime()
  })
}

function createEventTileAtDay(event: WeekEvent, day: Date, isFirstCollection: boolean): Tile {
  const startOfDay = new Date(day)
  startOfDay.setHours(0, 0, 0)
  const endOfDay = new Date(startOfDay)
  endOfDay.setDate(endOfDay.getDate() + 1)

  const startDate = startOfDay.getTime() > event.startDate.getTime() ? startOfDay : event.startDate
  const endDate = endOfDay.getTime() < event.endDate.getTime() ? endOfDay : event.endDate

  const x = startDate.getDay() * GRID_COLUMN_COUNT
  const y = Math.ceil((startDate.getTime() - startOfDay.getTime()) / 1000 / 60 / 15)
  const w = isFirstCollection ? FIRST_EVENT_COLLECTION_COLUMN_SPAN : SECOND_EVENT_COLLECTION_COLUMN_SPAN
  const h = Math.max(Math.round((endDate.getTime() - startDate.getTime()) / 1000 / 60 / 15), 1)

  const xDelta = isFirstCollection ? 0 : SECOND_EVENT_COLLECTION_COLUMN_SPAN-1

  return {
    event,
    layout: {i: `${event.id}-${startDate.toString()}`,x: x + xDelta,y,w,h}
  }
}

export function createWeekCalendarLayout(events: WeekEvent[], weekDays: Date[]): Tile[] {
  const eventsInWeek = getEventsInWeek(events, weekDays)
  const sortedEvents = sortByStartDate(eventsInWeek)
  const {restOfEvents: restOfEventsTemp, nonOverlappingEvents: firstCollection} = extractNonOverlapEvents(sortedEvents)
  const {restOfEvents, nonOverlappingEvents: secondCollection} = extractNonOverlapEvents(restOfEventsTemp)

  const tiles: Tile[] = []

  weekDays.forEach(day => {
    const eventsInDay = getEventsInDay(firstCollection, day)
    const tilesForDay: Tile[] = eventsInDay.map(event => createEventTileAtDay(event, day, true))
    tiles.push(...tilesForDay)
  })

  weekDays.forEach(day => {
    const eventsInDay = getEventsInDay(secondCollection, day)
    const tilesForDay: Tile[] = eventsInDay.map(event => createEventTileAtDay(event, day, false))
    tiles.push(...tilesForDay)
  })

  // weekDays.forEach(day => {
  //   const eventsInDay = getEventsInDay(restOfEvents, day)
  //   const tilesForDay: Tile[] = eventsInDay.map(event => createEventTileAtDay(event, day, true))
  //   tiles.push(...tilesForDay)
  // })

  return tiles
}

/*

Plans for the week calendar:
- Drag-n-Drop:
similar to how to month calendar work. however, since the week calendar is more finely grained, with hours and minutes,
we must implement some form of overlapping event mechanism so that we wont be limiting the drag-n-drop.

- overlapping events - calculate layout algorithm
my design decision is not to overlap so many events together like they do in Google calendar.
not only does it look horrible, its not even realistic. who puts so many events clamped up together?

maybe later, when I get external feedback, i would consider changing the layout.
for now, each calendar column will receive 8-10 grid-columns.
rows will remain as they are currently.

1. sort all week events by the starting date and time.
2. make two collections:
  a. starting at the first element, all events that don't overlap. 
  b. taking the first non-chosen element, and do the same.
3. calculate full (75%-80%) cell width for first collection.
4. calculate around half cell width for the second collection.

at this point we are left with some number of unassigned events.
in my estimation, it is unreasonable to assume a lot of unassigned events.

5. group events by the hour (e.g., 11:00 - 11:59 will be under "11")
6. per hour `h`, if group[h].length > 0, put a 100% width of grid cell and height of 1,
    and write "`x` events at `h`".
    this will act like the "more events" in the month calendar, where if you click on it, it will
    open a modal with the rest of the events at that time.
*/