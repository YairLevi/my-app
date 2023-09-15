import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";
import { SplitSquareVertical } from "lucide-react";
import Dropdown from "@/components/Dropdown";
import { InsertDropdownProps } from "@/pages/notes/Lexical/components/Toolbar/Insert/InsertDropdown";

export function HorizontalRuleItem({ activeEditor }: InsertDropdownProps) {
  return (
    <Dropdown.Item onClick={() => activeEditor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined)}>
      <div className="flex items-center gap-2">
        <SplitSquareVertical size={20}/>
        <p>Horizontal Rule</p>
      </div>
    </Dropdown.Item>
  )
}