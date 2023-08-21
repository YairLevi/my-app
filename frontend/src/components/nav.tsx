import { useLocation, useNavigate } from "react-router";

type NavigationMode = "absolute" | "relative" | "sibling"

export function useCustomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return function(path: string, mode: NavigationMode = 'absolute') {
    if (mode == "absolute") {
      return navigate(path)
    }

    let currentPath = location.pathname.split('/').filter(s => s != '')

    if (mode == "sibling") {
      currentPath.pop()
    }
    let newCurrent = currentPath.map(s => `/${s}`).join('')
    let part = path
      .split('/')
      .filter(s => s != '')
      .map(s => `/${s}`)
      .join()

    navigate(newCurrent + part)
  }
}