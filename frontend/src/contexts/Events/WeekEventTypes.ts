import { repositories } from "@/wails/go/models";

type WeekEventNoConvert = Omit<repositories.WeekEvent, "convertValues">

type TDateKeyWeek =
  | "createdAt"
  | "updatedAt"
  | "deletedAt"
  | "endDate"
  | "startDate"

const DateKeyListForWeek: TDateKeyWeek[] = [
  "createdAt",
  "updatedAt",
  "deletedAt",
  "endDate",
  "startDate"
]

export type WeekEvent = { [K in keyof WeekEventNoConvert]: K extends TDateKeyWeek ? Date : WeekEventNoConvert[K] };

export function convertToWeekEvent(event: repositories.WeekEvent): WeekEvent {
  const obj: Record<string, any> = {}
  for (const key of Object.keys(event)) {
    if (DateKeyListForWeek.includes(key as TDateKeyWeek)) {
      obj[key] = new Date(event[key as keyof typeof event])
    } else {
      obj[key] = event[key as keyof typeof event]
    }
  }
  return obj as WeekEvent
}