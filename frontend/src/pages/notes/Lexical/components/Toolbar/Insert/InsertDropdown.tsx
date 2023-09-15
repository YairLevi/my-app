import Dropdown, { useDropdown } from "@/components/Dropdown";
import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";
import { LexicalEditor } from "lexical";
import { Plus, SplitSquareVertical } from 'lucide-react'
import { InsertImageDropdownItem } from "@/pages/notes/Lexical/components/Toolbar/Insert/ImageItem";
import { useModal } from "@/components/Modal";
import { HorizontalRuleItem } from "@/pages/notes/Lexical/components/Toolbar/Insert/HorizontalRuleItem";


export type InsertDropdownProps = {
  activeEditor: LexicalEditor
}

export function InsertDropdown(props: InsertDropdownProps) {
  const { activeEditor } = props
  const { open, toggleOpen } = useDropdown([])

  return (
    <>
      <Dropdown>
        <Dropdown.Picker
          open={open}
          className="w-52"
          onClick={toggleOpen}
          value={
            <div className="flex gap-2 items-center">
              <Plus size={20}/>
              <p>Insert</p>
            </div>
          }
        />
        <Dropdown.Menu open={open} className="w-52">
          <HorizontalRuleItem activeEditor={activeEditor}/>
          <InsertImageDropdownItem activeEditor={activeEditor}/>
        </Dropdown.Menu>
      </Dropdown>
    </>
  )
}