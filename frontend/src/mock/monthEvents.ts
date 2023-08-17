export type MonthEvent = {
  id: number
  date: Date
  title: string
}

export const monthlyEvents: MonthEvent[] = [
  {
    id: 1,
    date: new Date(2023, 7, 1),
    title: "Event 1.1"
  },
  {
    id: 2,
    date: new Date(2023, 7, 1),
    title: "Event 1.2"
  },
  {
    id: 3,
    date: new Date(2023, 7, 1),
    title: "Event 1.3"
  },
  {
    id: 4,
    date: new Date(2023, 7, 1),
    title: "Event 1.4"
  },
  {
    id: 5,
    date: new Date(2023, 7, 10),
    title: "Event 2"
  },
  {
    id: 6,
    date: new Date(2023, 7, 13),
    title: "Event 3"
  }
]

/**
 * list of events = MonthEvent[]
 * list of days that are currently being displayed = Date[]
 * Map<days, Events>:
 * events.groupBy(ev => ev.toDateString())
 * map.sortLists
 *
 * display:
 * mapEvents => MonthlyTile<...> calculate x and y from date.
 *
 *
 * update:
 * date => oldItem.date
 * event = map[date].get(ev => ev.id == newItem.i)
 * remove: map[date].removeOne(ev => ev.id == id)
 * newEvent = event.changeDate(...)
 * add:    map[newDate].addOne(newEvent)
 *
 */