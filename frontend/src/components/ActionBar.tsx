import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export function ActionBar() {
  return (
    <div className="flex my-2">
      <div className="w-7 h-7 flex items-center justify-center hover:bg-gray-700 hover:cursor-pointer rounded-md">
        <FontAwesomeIcon
          icon={faPlus}
          className="text-white"
        />
      </div>
    </div>
  )
}
