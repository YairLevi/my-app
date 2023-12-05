import { Modal, ModalProps } from "@/components/Modal";
import { useEffect, useRef } from "react";
import { Button } from "@/components/Button";
import { useMonthEvents } from "@/contexts/Events";

function formatDateToDatetimeLocal(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function AddMonthlyEventModal(props: ModalProps & { startDate?: Date, endDate?: Date }) {
  const { title, onClose, open, startDate, endDate } = props
  const { monthEventService } = useMonthEvents()
  const startDateRef = useRef<HTMLInputElement>(null)
  const endDateRef = useRef<HTMLInputElement>(null)
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // console.log(date)
    // if (!dateRef.current || !date) return
    if (!startDate || !endDate) {
      startDateRef.current!.value = ''
      endDateRef.current!.value = ''
    } else {
      startDateRef.current!.value = formatDateToDatetimeLocal(startDate)
      endDateRef.current!.value = formatDateToDatetimeLocal(endDate)
    }
  }, [startDate, endDate])

  function clearAndClose() {
    startDateRef.current!.value = ''
    endDateRef.current!.value = ''
    titleRef.current!.value = ''
    onClose()
  }

  async function onSubmit() {
    const title = titleRef.current!.value
    const startDate = new Date(startDateRef.current!.value)
    const endDate = new Date(endDateRef.current!.value)
    await monthEventService.addEvent({ startDate, endDate, title })
    clearAndClose()
  }

  function clearAndExit() {
    endDateRef.current!.value = ''
    startDateRef.current!.value = ''
    titleRef.current!.value = ''
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <Modal.Group label="Title">
        <input
          ref={titleRef}
          style={{ colorScheme: "dark" }}
          type="text"
          className="bg-[#0f0f11] px-3 py-1.5 text-gray-200 rounded-md text-sm"
        />
      </Modal.Group>
      <Modal.Group label="Start">
        <input
          ref={startDateRef}
          style={{ colorScheme: "dark" }}
          type="date"
          className="bg-[#0f0f11] px-3 py-1.5 text-gray-200 rounded-md text-sm"
        />
      </Modal.Group>
      <Modal.Group label="End">
        <input
          ref={endDateRef}
          style={{ colorScheme: "dark" }}
          type="date"
          className="bg-[#0f0f11] px-3 py-1.5 text-gray-200 rounded-md text-sm"
        />
      </Modal.Group>
      <Modal.Footer>
        <Button onClick={clearAndExit} type="ghost">Cancel</Button>
        <Button onClick={onSubmit}>Add</Button>
      </Modal.Footer>
    </Modal>
  )
}