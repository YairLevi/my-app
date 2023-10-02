import { Modal, ModalProps } from "@/components/Modal";
import { useRef } from "react";
import { Button } from "@/components/Button";
import { useMonthEvents } from "@/contexts/Events";


export function AddMonthlyEventModal(props: ModalProps) {
  const { title, onClose, open } = props
  const { monthEventService } = useMonthEvents()
  const dateRef = useRef<HTMLInputElement>(null)
  const titleRef = useRef<HTMLInputElement>(null)

  function clearAndClose() {
    dateRef.current!.value = ''
    titleRef.current!.value = ''
    onClose()
  }

  async function onSubmit() {
    const title = titleRef.current!.value
    const date = new Date(dateRef.current!.value)
    await monthEventService.addEvent({ date, title })
    clearAndClose()
  }

  function clearAndExit() {
    dateRef.current!.value = ''
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
      <Modal.Group label="Date">
        <input
          ref={dateRef}
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