import { useRef, useState } from "react";
import { useWeekEvents, WeekEvent } from "@/contexts/Events";
import { roundToNearest15Minutes } from "../../../time";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";

interface Props {
  open: boolean
  onClose: () => void
}

export function AddEventModal({ open, onClose }: Props) {
  const { weekEvents, weekEventService } = useWeekEvents()

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

  function doesOverlapOtherEvent(event: Partial<WeekEvent>) {
    return weekEvents.some(ev => ev.startDate < event.endDate! && event.startDate! < ev.endDate)
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

  function onSubmit() {
    if (!validateDates())
      return

    const startDate = roundToNearest15Minutes(new Date(startDateRef.current!.value), false)
    const endDate = roundToNearest15Minutes(new Date(endDateRef.current!.value), true)
    const title = titleRef.current!.value

    const newEvent: Partial<WeekEvent> = {
      title: title,
      startDate: startDate,
      endDate: endDate
    }

    if (doesOverlapOtherEvent(newEvent))
      return setError("Overlap detected. Try again")

    weekEventService.addEvent(newEvent)
    clearAndExit()
  }

  return (
    <Modal
      title="New Event"
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