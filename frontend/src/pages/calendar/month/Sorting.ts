import { MonthEvent } from "@/contexts/Events";
import ReactGridLayout from "react-grid-layout";

const dateToEvents: Map<Date, MonthEvent[]> = new Map<Date, MonthEvent[]>()
const days: Date[] = []

/**
 * Result of function:
 * [
 *   [ev1, ev3, ...], // day 1 of currently displayed days
 *   [ev2, ...],      // day 2 of  '' '' '' ''
 *   ...
 * ]
 * @param events
 */

function populateMap(events: MonthEvent[]) {
  events.forEach(event => {
    for (let day = event.startDate; day <= event.endDate; day.setDate(day.getDate() + 1)) {
      dateToEvents.set(day, [...dateToEvents.get(day)!, event]) // assuming we already had an empty list at least.
    }
  })
}

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

function fillAndPopulate(slots: MonthEvent[][], event: MonthEvent) {
  for (let day = event.startDate; day <= event.endDate; day.setDate(day.getDate() + 1)) {
    dateToEvents.set(day, [...dateToEvents.get(day)!, event]) // assuming we already had an empty list at least.

  }
}

function dayDifference(startDate: Date, endDate: Date): number {
  // Convert both dates to UTC to avoid timezone-related issues
  const startUTC = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const endUTC = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

  // Calculate the difference in milliseconds
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.floor((endUTC - startUTC) / msPerDay);
}

type Tile = {
  event: MonthEvent
  layout: ReactGridLayout.Layout
}

export function createLayout(events: MonthEvent[], days: Date[]): Tile[] {
  const sortedEvents = sortEvents(events)
  const slots = days.map(_ => new Array<MonthEvent>(3))
  const tiles: Tile[] = []
  sortedEvents.forEach(event => {
    let dayIdx = days.findIndex(day => day.toDateString() == event.startDate.toDateString())
    if (dayIdx == -1)
      return
    // if (dayIdx > slots.length) {
    //   console.log(dayIdx)
    //   console.log(slots)
    //   console.log(days)
    //   return
    // }
    // try {
    const slotIdx = slots[dayIdx].findIndex(item => !item)
    // } catch (e) {
    //   console.log(dayIdx)
    // }
    const slotAvailable = slotIdx != -1

    if (!slotAvailable) return

    const start = event.startDate > days[0] ? event.startDate : days[0]
    const end = (event.endDate < days.at(-1)! ? event.endDate : days.at(-1))! // might be null

    // 0(Sunday) - (7 - 0 + 1) = 6
    // 6(Tuesday) - (7 - 6 + 1) =

    let startOfTile = start
    let endOfTile

    while (true) {
      let tileX, tileY, tileW, tileH

      if (startOfTile > end) {
        break
      }

      const row = Math.floor(days.indexOf(startOfTile) / 7)
      tileY = row*5 + 1 + slotIdx

      tileX = startOfTile.getDay()
      tileH = 1

      endOfTile = days[tileY * 7 - 1] < end ? days[tileY * 7 - 1] : end
      tileW = endOfTile.getDay() - startOfTile.getDay() + 1

      const layout: ReactGridLayout.Layout = {
        i: event.id + event.startDate.toString(),
        x: tileX,
        y: tileY,
        w: tileW,
        h: tileH
      }

      tiles.push({
        event, layout
      })

      if (tileY * 7 >= days.length) break
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