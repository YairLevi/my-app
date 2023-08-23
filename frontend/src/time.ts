export function getHourOfDay(number: number, offset = 0) {
  const hour = (number + offset) % 24
  return `${hour}:00`
}

export function getTimeFormat(date: Date) {
  return `${date.getHours()}:${prefixZero(date.getMinutes())}`
}

export function getByAMPM(number: number, offset = 0) {
  let hour = (number + offset) % 12
  let hour_24 = (number + offset) % 24
  hour = hour == 0 ? 12 : hour
  const suffix = hour_24 < 12 ? 'AM' : 'PM'
  return `${hour} ${suffix}`
}


export function prefixZero(num: number): string {
  return num < 10 ? `0${num}` : `${num}`
}

export function getWeekDays(date: Date) {
  const week = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(date)
    d.setDate(d.getDate() + i - date.getDay())
    week.push(d)
  }
  return week
}

export function roundToNearest15Minutes(date: Date, roundUp: boolean): Date {
  const minutes = date.getMinutes();
  const remainder = minutes % 15;

  if (remainder == 0) {
    return date
  }

  let roundedMinutes = minutes;
  if (roundUp) {
    roundedMinutes += 15 - remainder;
    if (roundedMinutes >= 60) {
      if (date.getHours() + 1 == 24) {
        date.setHours(23, 59)
        return date
      }

      date.setHours(date.getHours() + 1);
      roundedMinutes = 0;
    }
  } else {
    roundedMinutes -= remainder;
  }

  date.setMinutes(roundedMinutes);
  return date;
}

export const daysFullNames = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

export const daysInitials = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat'
]