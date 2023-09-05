import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { Event } from "../../../mock/mockEvents";
import { WeekEvent, useWeekEvents } from "@/contexts/Events/WeekEventsProvider";
import { roundToNearest15Minutes } from "../../../time";

interface Props {
  open: boolean
  onClose: () => void
  event: WeekEvent
}

function formatDateToDatetimeLocal(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function EditEventModal({ open, onClose, event }: Props) {
  const {
    startDate: currStartDate,
    endDate: currEndDate,
    title: currTitle,
    id
  } = event

  const { weekEvents, weekEventService } = useWeekEvents()

  const startDateRef = useRef<HTMLInputElement>(null)
  const endDateRef = useRef<HTMLInputElement>(null)
  const titleRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    startDateRef.current!.value = formatDateToDatetimeLocal(currStartDate)
    endDateRef.current!.value = formatDateToDatetimeLocal(currEndDate)
    titleRef.current!.value = currTitle
  }, [id, currStartDate, currEndDate, currTitle])

  function clearAndExit() {
    startDateRef.current!.value = ''
    endDateRef.current!.value = ''
    titleRef.current!.value = ''
    setError('')
    onClose()
  }

  function doesOverlapOtherEvent(event: Event) {
    return weekEvents.some(ev => ev.id != id && ev.startDate < event.endDate && event.startDate < ev.endDate)
  }

  function validateDates() {
    if (!startDateRef || !endDateRef) {
      setError("Undefined dates")
      return false
    }

    const start = new Date(startDateRef.current!.value)
    const end = new Date(endDateRef.current!.value)

    if (start.getTime() >= end.getTime()) {
      setError("Start date cannot be later the end date.")
      return false
    }

    if (start.toDateString() != end.toDateString()) {
      setError("Must be the same day.")
      return false
    }

    return true
  }

  async function onSubmit() {
    if (!validateDates())
      return

    const startDate = roundToNearest15Minutes(new Date(startDateRef.current!.value), false)
    const endDate = roundToNearest15Minutes(new Date(endDateRef.current!.value), true)
    const title = titleRef.current!.value

    const updatedEvent = event
    Object.assign(updatedEvent, { title, startDate, endDate })

    if (doesOverlapOtherEvent(updatedEvent))
      return setError("Overlap detected. Try again")

    await weekEventService.updateEvent(updatedEvent)
    clearAndExit()
  }

  return event && (
    <div
      onClick={onClose}
      className={`fixed z-[1000] top-0 left-0 w-screen h-screen bg-black bg-opacity-40 flex items-center justify-center ${open ? 'scale-1' : 'scale-0'}`}
    >
      <div
        onClick={e => e.stopPropagation()}
        className={`p-5 bg-[#17191f] shadow-xl rounded-lg w-1/4 min-w-[20rem] h-fit duration-75 ease-out ${open ? 'scale-100' : 'scale-50'} [&_*]:text-gray-200`}
      >
        <header className="flex justify-between items-center">
          <h1 className="text-lg">New Event</h1>
          <FontAwesomeIcon
            icon={faXmark}
            onClick={onClose}
            className="text-xl hover:bg-gray-700 hover:bg-opacity-50 rounded-xl py-2 px-3 hover:cursor-pointer"
          />
        </header>
        <div className="flex flex-col gap-1 my-5">
          <label className="text-xs !text-gray-400 font-semibold">
            Title
          </label>
          <input
            style={{ colorScheme: 'dark' }}
            className="bg-[#0f0f11] px-3 py-1.5 text-sm text-gray-200 rounded-md"
            placeholder="Meeting with the boys."
            ref={titleRef}
          />
        </div>
        <div className="flex flex-col gap-1 my-5">
          <label className="text-xs !text-gray-400 font-semibold">
            Starts at
          </label>
          <input
            style={{ colorScheme: 'dark' }}
            className="bg-[#0f0f11] px-3 py-1.5 text-sm text-gray-200 rounded-md"
            type="datetime-local"
            ref={startDateRef}
          />
        </div>
        <div className="flex flex-col gap-1 my-5">
          <label className="text-xs !text-gray-400 font-medium">
            Ends at
          </label>
          <input
            style={{ colorScheme: 'dark' }}
            className="bg-[#0f0f11] px-3 py-1.5 text-sm text-gray-200 rounded-md"
            type="datetime-local"
            ref={endDateRef}
          />
        </div>
        {error && <p className="text-sm !text-red-400 my-3">{error}</p>}
        <footer className="flex justify-end items-center gap-3">
          <button
            onClick={clearAndExit}
            className="text-sm px-3 py-2 hover:bg-gray-800 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="text-sm px-3 py-2 hover:bg-gray-700 bg-gray-800 rounded-lg"
          >
            Edit
          </button>
        </footer>
      </div>
    </div>
  )
}