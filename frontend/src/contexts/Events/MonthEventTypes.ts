import { repositories } from "@/wails/go/models";

type MonthEventNoConvert = Omit<repositories.MonthEvent, "convertValues">

type TDateKeyMonth =
  | "createdAt"
  | "updatedAt"
  | "deletedAt"
  | "date"

const DateKeyListForMonth: TDateKeyMonth[] = [
  "createdAt",
  "updatedAt",
  "deletedAt",
  "date"
]

export type MonthEvent = { [K in keyof MonthEventNoConvert]: K extends TDateKeyMonth ? Date : MonthEventNoConvert[K] };

export function convertToMonthEvent(event: repositories.MonthEvent): MonthEvent {
  const obj: Record<string, any> = {}
  for (const key of Object.keys(event)) {
    if (DateKeyListForMonth.includes(key as TDateKeyMonth)) {
      obj[key] = new Date(event[key as keyof typeof event])
    } else {
      obj[key] = event[key as keyof typeof event]
    }
  }
  return obj as MonthEvent
}