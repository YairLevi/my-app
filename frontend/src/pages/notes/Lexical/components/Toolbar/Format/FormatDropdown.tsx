import Dropdown, { useDropdown } from "@/components/Dropdown";
import { ReactElement, useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useBlockFormat } from './useBlockFormat'
import useEditorToolbar from "@/pages/notes/Lexical/components/Toolbar/useEditorToolbar";
import { $getRoot, $getSelection, RangeSelection } from "lexical";

type OptionProps = {
  text: string,
  Icon: ReactElement,
}

function Option(props: OptionProps) {
  const { text, Icon } = props

  return (
    <div className="flex items-center gap-2">
      <>
        {Icon}
        {text}
      </>
    </div>
  )
}

export const blockTypeToBlockName = {
  bullet: 'Bulleted List',
  check: 'Check List',
  code: 'Code Block',
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  h4: 'Heading 4',
  h5: 'Heading 5',
  h6: 'Heading 6',
  number: 'Numbered List',
  paragraph: 'Normal',
  quote: 'Quote',
};

export function FormatDropdown() {
  const [editor] = useLexicalComposerContext();
  const { blockType} = useEditorToolbar()
  const {
    blocks
  } = useBlockFormat({blockType})

  const {
    open,
    options,
    selectedOption,
    toggleOpen,
    onSelect,
    pickerRef
  } = useDropdown(blocks)

  useEffect(() => {
    onSelect(0)()
  }, []);

  useEffect(() => {
    editor.update(() => {
      // set default font
      $getRoot()?.getChildAtIndex(0)?.select();
      const selection = $getSelection();
      console.log(selection)
      if (selection) {
        // (selection as RangeSelection).setStyle("font-family: Courier New")
      }
      console.log(selection)
    });
  }, [editor]);

  return (
    <Dropdown>
      <Dropdown.Picker
        pickerRef={pickerRef}
        onClick={toggleOpen}
        open={open}
        className="hover:bg-gray-300 hover:bg-opacity-20"
        value={
          !selectedOption ?
            "Pick a type format" :
            <Option
              Icon={blocks.find(b => b.blockType == blockType)!.icon}
              text={blocks.find(b => b.blockType == blockType)!.name}
            />
        }
      />
      <Dropdown.Menu open={open} pickerRef={pickerRef}>
        {options.map((option, idx) => (
          <Dropdown.Item
            isSelected={selectedOption == option}
            onClick={() => {
              onSelect(idx)()
              option.onClick()
            }}
          >
            <Option
              key={idx}
              text={option.name}
              Icon={option.icon}
            />
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  )
}