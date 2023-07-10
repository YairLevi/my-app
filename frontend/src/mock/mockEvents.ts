export interface Event {
  startDate: Date
  endDate: Date
  title: string
}

export const events: Event[] = [
  {
    title: "Meeting with friends",
    startDate: new Date(2023, 6, 9, 14, 30),
    endDate: new Date(2023, 6, 9, 18, 30),
  },
  {
    title: "Work on project",
    startDate: new Date(2023, 6, 9, 9, 15),
    endDate: new Date(2023, 6, 9, 11, 45),
  },
  {
    title: "Meditate",
    startDate: new Date(2023, 6, 10, 7, 30),
    endDate: new Date(2023, 6, 10, 8, 30),
  },
]