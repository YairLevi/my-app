import { useEffect, useRef, useState } from "react";
import { useWeekEvents, WeekEvent } from "@/contexts/Events";
import { roundToNearest15Minutes } from "../../../time";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";

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
    // No need to clear the refs, since the values come right when we click and not by the user.
    setError('')
    onClose()
  }

  function doesOverlapOtherEvent(event: WeekEvent) {
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
    <Modal
      title="Edit Event"
      onClose={onClose}
      open={open}
    >
      <Modal.Group label="Title">
        <input
          style={{ colorScheme: 'dark' }}
          className="bg-[#0f0f11] px-3 py-1.5 text-sm text-gray-200 rounded-md"
          placeholder="Meeting with the boys."
          ref={titleRef}
        />
      </Modal.Group>
      <Modal.Group label="Starts At">
        <input
          style={{ colorScheme: 'dark' }}
          className="bg-[#0f0f11] px-3 py-1.5 text-sm text-gray-200 rounded-md"
          type="datetime-local"
          ref={startDateRef}
        />
      </Modal.Group>
      <Modal.Group label="Ends At">
        <input
          style={{ colorScheme: 'dark' }}
          className="bg-[#0f0f11] px-3 py-1.5 text-sm text-gray-200 rounded-md"
          type="datetime-local"
          ref={endDateRef}
        />
      </Modal.Group>
      {error && <p className="text-sm !text-red-400 my-3">{error}</p>}
      <Modal.Footer>
        <Button onClick={clearAndExit} type="ghost">
          Cancel
        </Button>
        <Button onClick={onSubmit}>
          Edit
        </Button>
      </Modal.Footer>
    </Modal>
  )
}