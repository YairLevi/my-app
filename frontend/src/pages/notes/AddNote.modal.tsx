import { Modal, ModalProps } from "@/components/Modal";
import { useRef } from "react";
import { Button } from "@/components/Button";
import { useNotes } from "@/contexts/Notes/NoteProvider";

const INITIAL_NOTE_STATE = `{
  "root": {
    "children": [
      {
        "children": [],
        "direction": null,
        "format": "",
        "indent": 0,
        "type": "paragraph",
        "version": 1
      }
    ],
    "direction": null,
    "format": "",
    "indent": 0,
    "type": "root",
    "version": 1
  }
}`

export function AddNoteModal(props: ModalProps) {
  const titleRef = useRef<HTMLInputElement>(null)
  const { notesService } = useNotes()

  async function onSubmit() {
    const title = titleRef.current!.value
    await notesService.addNote({
      title: title,
      content: INITIAL_NOTE_STATE
    })
    props.onClose()
  }

  return (
    <Modal {...props}>
      <Modal.Group label="Title">
        <input
          ref={titleRef}
          className="bg-[#0f0f11] px-3 py-1.5 text-gray-200 rounded-md text-sm"
        />
      </Modal.Group>
      <Modal.Footer>
        <Button type="ghost" onClick={props.onClose}>Cancel</Button>
        <Button onClick={onSubmit}>Add</Button>
      </Modal.Footer>
    </Modal>
  )
}