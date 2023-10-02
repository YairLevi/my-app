import { useCallback, useEffect, useState } from "react";
import { GetVersion } from "@/wails/go/main/App";
import { Button } from "@/components/Button";
import Dropdown from "@/components/Dropdown";

export function Dashboard() {
  const [version, setVersion] = useState('')

  useEffect(() => {
    (async function () {
      const ver = await GetVersion()
      setVersion(ver)
    })()
  }, [])

  return (
    <div className="flex w-full items-center justify-center flex-col gap-2">
      <p className="text-gray-300">This will be the dashboard page. Currently, not much to look at.</p>
      <span className="text-gray-400">Version: {version == '' ? 'Loading...' : version}</span>
    </div>
  )
}