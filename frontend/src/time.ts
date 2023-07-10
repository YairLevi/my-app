export function getHourOfDay(number: number, offset = 0) {
  const hour = (number + offset) % 24
  return `${hour}:00`
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

export const daysFullNames = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]