import * as React from 'react';
import { ReactNode } from 'react';

import ColorPicker from './ColorPicker';
import Dropdown, { useDropdown } from "@/components/Dropdown";
import { Type } from "lucide-react";

type Props = {
  disabled?: boolean;
  buttonAriaLabel?: string;
  buttonClassName: string;
  buttonIconClassName?: string;
  buttonLabel?: string;
  title?: string;
  stopCloseOnClickSelf?: boolean;
  color: string;
  onChange?: (color: string) => void;
  value: ReactNode
};

export default function DropdownColorPicker({
                                              disabled = false,
                                              stopCloseOnClickSelf = true,
                                              color,
                                              onChange,
                                              value,
                                              ...rest
                                            }: Props) {

  const {
    open,
    toggleOpen,
  } = useDropdown([])

  return (
    <Dropdown>
      <Dropdown.Picker
        open={open}
        onClick={toggleOpen}
        className="hover:bg-gray-300"
        value={<div className="flex items-center">
          {value}
          <div
            className="w-4 h-4 rounded-md"
            style={{
              backgroundColor: color,
              border: "1px groove lightgray",
          }}
          />
        </div>}
      />
      <Dropdown.Menu open={open}>
        <ColorPicker color={color} onChange={(c) => {
          if (onChange) {
            onChange(c)
          }
          if (open && color != c) {
            toggleOpen()
          }
        }}/>
      </Dropdown.Menu>
    </Dropdown>
  );
}