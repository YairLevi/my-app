import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useRef, useState } from "react";
import { Event } from "../../mock/mockEvents";
import { CalendarEvent, useEvents } from "@/contexts/EventsContext";
import { main } from "@/wails/go/models";

interface Props {
  open: boolean
  onClose: () => void
}

export function AddEventModal({ open, onClose }: Props) {
  const { events, addEvent } = useEvents()

  const startDateRef = useRef<HTMLInputElement>(null)
  const endDateRef = useRef<HTMLInputElement>(null)
  const titleRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState('')

  function clearAndExit() {
    startDateRef.current!.value = ''
    endDateRef.current!.value = ''
    titleRef.current!.value = ''
    setError('')
    onClose()
  }

  function doesOverlapOtherEvent(event: Event) {
    return events.some(ev => ev.startDate < event.endDate && event.startDate < ev.endDate)
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

    if (start.getMinutes() % 15 != 0 || end.getMinutes() % 15 != 0) {
      setError("Minutes must be of 15 minute interval.")
      return false
    }

    if (start.toDateString() != end.toDateString()) {
      setError("Must be the same day.")
      return false
    }

    return true
  }

  function onSubmit() {
    if (!validateDates())
      return

    const startDate = new Date(startDateRef.current!.value)
    const endDate = new Date(endDateRef.current!.value)
    const title = titleRef.current!.value

    const newEvent: CalendarEvent = {
      title: title,
      startDate: startDate,
      endDate: endDate
    }


    if (doesOverlapOtherEvent(newEvent))
      return setError("Overlap detected. Try again")

    addEvent(newEvent)
    clearAndExit()
  }

  return (
    <div
      onClick={onClose}
      className={`absolute w-screen h-screen bg-black bg-opacity-40 flex items-center justify-center ${open ? 'scale-1' : 'scale-0'}`}
    >
      <div
        onClick={e => e.stopPropagation()}
        className={`p-5 bg-[#17191f] shadow-xl rounded-lg w-1/4 min-w-[20rem] h-fit duration-100 ease-out ${open ? 'scale-100' : 'scale-50'} [&_*]:text-gray-200`}
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
          <label className="text-[0.8rem] !text-gray-400 font-semibold">
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
          <label className="text-[0.8rem] !text-gray-400 font-semibold">
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
          <label className="text-[0.8rem] !text-gray-400 font-semibold">
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
            className="text-sm px-3 py-2 hover:bg-gray-800 bg-gray-700 rounded-lg"
          >
            Add
          </button>
        </footer>
      </div>
    </div>
  )
}