import { WeekEvent } from "@/contexts/Events";

export { }

function sortWeekEventsByStartDate(weekEvents: WeekEvent[]): WeekEvent[] {
  return weekEvents.sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
}

function extractNonOverlapEvents(weekEvents: WeekEvent[]): WeekEvent[] {
  if (weekEvents.length == 0) return []

  const nonOverlappingEvents: WeekEvent[] = [weekEvents[0]]
  for (let i = 1; i < weekEvents.length; i++) {
    const currEventStartDate = weekEvents[i].startDate
    const prevEventEndDate = weekEvents.at(-1)!.startDate

    if (currEventStartDate.getTime() >= prevEventEndDate.getTime()) {
      nonOverlappingEvents.push(weekEvents[i])
      weekEvents.splice(i, 1)
    }
  }

  return nonOverlappingEvents
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