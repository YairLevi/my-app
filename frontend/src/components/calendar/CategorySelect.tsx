import Dropdown, { useDropdown } from "@/components/Dropdown";
import { XIcon } from "lucide-react";
import { useState } from "react";
import uuid from "react-uuid";

type CategoryProps = {
  text: string
  onDelete: () => void
}

function Category({ text, onDelete }: CategoryProps) {
  return (
    <div className="flex text-gray-300 bg-gray-600 w-fit px-1.5 py-0.5 gap-1 text-xs items-center rounded-md">
      {text} <XIcon size={17} className="hover:bg-gray-500 rounded-full p-0.5" onClick={onDelete}/>
    </div>
  )
}

export function CategorySelect() {
  const dropdown = useDropdown([
    "Work", "Project", "Free time!"
  ])
  const [categories, setCategories] = useState<string[]>([
    "Work", "Project", "Free time!"
  ])
  const [chosen, setChosen] = useState<string[]>([])

  function select(category: string) {
    setChosen(prev => [...prev, category])
    setCategories(prev => prev.filter(cat => cat != category))
  }

  function remove(category: string) {
    setChosen(prev => prev.filter(cat => cat != category))
    setCategories(prev => [...prev, category])
  }

  return (
    <>
      <div className="flex flex-wrap gap-1">
        {
          chosen.map((val, _) => (
            <Category
              key={uuid()}
              text={val}
              onDelete={() => remove(val)}
              />
          ))
        }
      </div>
      <Dropdown>
        <Dropdown.Picker
          open={dropdown.open}
          onClick={dropdown.toggleOpen}
          value={
            <p>
              pick an option
            </p>
          }
        />
        {
          categories.length > 0 &&
            <Dropdown.Menu inline open={dropdown.open}>
              {
                categories.map((val, index) => (
                  <Dropdown.Item
                    key={uuid()}
                    onClick={() => select(val)}
                    isSelected={dropdown.selectedOption == val}
                  >
                    {val}
                  </Dropdown.Item>
                ))
              }
            </Dropdown.Menu>
        }
      </Dropdown>
    </>
  )
}