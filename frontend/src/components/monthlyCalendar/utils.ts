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

  return [...prevMonthLastDays, ...Array.from({ length: daysInMonth }, (_, i) => new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1)), ...nextMonthCompletingDays];
}