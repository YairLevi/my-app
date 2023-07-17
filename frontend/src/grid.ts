export interface GridPosition {
  x: number
  y: number
  w: number
  h: number
}

export const numberOfRowsInRem = 4;
export const rowHeightInRem = 2.5;
export const rowHeightInPixels = remToPixels(rowHeightInRem);

export function getGridPosition(startDate: Date, endDate: Date) {
  const x = startDate.getDay()

  const startOfDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())
  startOfDay.setHours(0, 0, 0, 0)
  const timeDifferenceMs = startDate.getTime() - startOfDay.getTime()
  const minutesPassed = Math.floor(timeDifferenceMs / 1000 / 60);
  const y = Math.floor(minutesPassed / 15)

  const w = 1

  const minToStart = startDate.getHours() * 60 + startDate.getMinutes()
  const minToEnd = endDate.getHours() * 60 + endDate.getMinutes()
  const h = Math.floor((minToEnd - minToStart) / 15)

  return {x, y, w, h}
}

export function remToPixels(remValue: number) {
  const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
  return remValue * rootFontSize;
}


function calculateHeight(start: Date, end: Date) {
  const minToStart = start.getHours() * 60 + start.getMinutes()
  const minToEnd = end.getHours() * 60 + end.getMinutes()
  return Math.floor((minToEnd - minToStart) / 15)
}

function calculateY(currentTime: Date) {
  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)
  const timeDifferenceMs = currentTime.getTime() - startOfDay.getTime()
  const minutesPassed = Math.floor(timeDifferenceMs / 1000 / 60);
  return Math.floor(minutesPassed / 15)
}

export function getRandomColor() {
  let letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * letters.length)]
  }
  return color
}