import {Fragment, ReactNode} from "react";
import uuid from "react-uuid"

type ForProps = {
  limit: number
  mapFunc: (index: number) => ReactNode
}

export function For({limit, mapFunc}: ForProps) {
  return <>
    {
      [...new Array(limit).keys()].map((_, i) => <Fragment key={uuid()}>{mapFunc(i)}</Fragment>)
    }
  </>
}