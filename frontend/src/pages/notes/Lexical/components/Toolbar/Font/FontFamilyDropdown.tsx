import Dropdown, { useDropdown } from "@/components/Dropdown";
import { ReactElement, useCallback, useEffect } from "react";
import { $getSelection, $isRangeSelection, LexicalEditor } from "lexical";
import { $patchStyleText } from "@lexical/selection";

type FontOptionProps = {
  name: string,
}

function FontOption(props: FontOptionProps) {
  const { name } = props

  return (
    <div className="flex items-center gap-2">
      {name}
    </div>
  )
}

export function FontDropDown({
                               editor,
                               value,
                               style,
                               disabled = false,
                             }: {
  editor: LexicalEditor;
  value: string;
  style: string;
  disabled?: boolean;
}): ReactElement {
  const handleClick = useCallback(
    (option: string) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, {
            [style]: option,
          });
        }
      });
    },
    [editor, style],
  );

  const buttonAriaLabel =
    style === 'font-family'
      ? 'Formatting options for font family'
      : 'Formatting options for font size';

  const FONT_FAMILY_OPTIONS = [
    'Arial',
    'Courier New',
    'Georgia',
    'Times New Roman',
    'Trebuchet MS',
    'Verdana',
  ];

  const FONT_SIZE_OPTIONS = [
    '10px',
    '11px',
    '12px',
    '13px',
    '14px',
    '15px',
    '16px',
    '17px',
    '18px',
    '19px',
    '20px',
  ];

  const FONT_STYLE = (style === 'font-family' ? FONT_FAMILY_OPTIONS : FONT_SIZE_OPTIONS)

  const {
    onSelect,
    toggleOpen,
    open,
    selectedOption,
    options,
  } = useDropdown(FONT_STYLE)

  useEffect(() => {
    console.log(open)
  }, [open]);

  return (
    <Dropdown>
      <Dropdown.Picker
        onClick={toggleOpen}
        open={open}
        value={<FontOption name={value}/>}
      />
      <Dropdown.Menu open={open}>
        {
          options.map((option, idx) => (
            <Dropdown.Item
              isSelected={selectedOption == option}
              onClick={() => {
                onSelect(idx)()
                handleClick(option)
              }}
            >
              <FontOption key={"font-family" + idx} name={option}/>
            </Dropdown.Item>
          ))
        }
      </Dropdown.Menu>
    </Dropdown>
  );
}