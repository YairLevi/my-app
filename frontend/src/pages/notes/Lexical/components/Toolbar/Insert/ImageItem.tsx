import { Modal, ModalProps, useModal } from "@/components/Modal";
import { Button } from "@/components/Button";
import Dropdown from "@/components/Dropdown";
import { Image } from "lucide-react";
import { useEffect, useState } from "react";
import { InsertDropdownProps } from "@/pages/notes/Lexical/components/Toolbar/Insert/InsertDropdown";
import { LexicalEditor } from "lexical";
import { INSERT_IMAGE_COMMAND } from "@/pages/notes/Lexical/plugins/ImagesPlugin";
import { ImagePayload } from "@/pages/notes/Lexical/nodes/ImageNode";


export function InsertImageDropdownItem({ activeEditor }: InsertDropdownProps) {
  const modal = useModal()

  return (
    <>
      <Dropdown.Item
        onClick={() => modal.onOpen()}
        isSelected={false}
      >
        <div className="flex items-center gap-2">
          <Image size={20}/>
          <p>Image</p>
        </div>
      </Dropdown.Item>

      <InsertImageModal
        onClose={modal.onClose}
        open={modal.open}
        activeEditor={activeEditor}
        title="Insert Image"
      />
    </>
  )
}

function InsertImageModal(props: ModalProps & { activeEditor: LexicalEditor }) {
  const { open, onClose, title, activeEditor } = props
  const [type, setType] = useState<"url" | "file">("url")

  const [src, setSrc] = useState('');

  const loadImage = (files: FileList | null) => {
    const reader = new FileReader();
    reader.onload = function () {
      if (typeof reader.result === 'string') {
        setSrc(reader.result);
      }
      return '';
    };
    if (files !== null) {
      reader.readAsDataURL(files[0]);
    }
  }
  function onClick() {
    const payload: ImagePayload = {
      altText: "Image load failed",
      src: src,
    }
    activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, payload)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
    >
      <Modal.Group label="Image Source">
        <div className="flex gap-2">
          <input
            id="url"
            type="radio"
            name="image source"
            checked={type == "url"}
            onClick={() => setType("url")}
          />
          <label htmlFor="url">url</label>
        </div>
        <div className="flex gap-2">
          <input
            id="file"
            type="radio"
            name="image source"
            checked={type == "file"}
            onClick={() => setType("file")}
          />
          <label htmlFor="file">file</label>
        </div>
      </Modal.Group>
      <Modal.Group>
        <div className="h-10 w-full flex items-center justify-center">
          {type == "url"
            ? <input type="text" onChange={e => setSrc(e.target.value)}/>
            : <input type="file" onChange={e => loadImage(e.target.files)}/>}
        </div>
      </Modal.Group>

      <Modal.Footer>
        <Button
          disabled={src == ''}
          onClick={onClick}
          color="#111"
        >
          This button does nothing
        </Button>
      </Modal.Footer>
    </Modal>
  )
}