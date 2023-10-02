import Dropdown, { useDropdown } from "@/components/Dropdown";
import { ReactElement, useCallback, useEffect } from "react";
import { $getSelection, $isRangeSelection, LexicalEditor } from "lexical";
import { $patchStyleText } from "@lexical/selection";

export function FontDropDown({ editor, value, style, disabled = false, }: {
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
    pickerRef
  } = useDropdown(FONT_STYLE)


  return (
    <Dropdown>
      <Dropdown.Picker
        pickerRef={pickerRef}
        onClick={toggleOpen}
        open={open}
        className="hover:bg-gray-300 hover:bg-opacity-20"
        value={
          <div
            className="flex items-center gap-2"
          >
            {value}
          </div>
        }
      />
      <Dropdown.Menu open={open} pickerRef={pickerRef}>
        {
          options.map((option, idx) => (
            <Dropdown.Item
              isSelected={selectedOption == option}
              onClick={() => {
                onSelect(idx)()
                handleClick(option)
              }}
            >
              <div
                key={`font` + idx}
                className="flex items-center gap-2 !text-gray-200"
              >
                {option}
              </div>
            </Dropdown.Item>
          ))
        }
      </Dropdown.Menu>
    </Dropdown>
  );
}
