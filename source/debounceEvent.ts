import * as React from "react";
import { debounceTime } from "rxjs/operators/debounceTime";
import { distinctUntilChanged } from "rxjs/operators/distinctUntilChanged";
import { tap } from "rxjs/operators/tap";
import { pipeFromArray } from "rxjs/util/pipe";
import { transformEvent } from "./transformEvent";
import { EqualComparer, HandlerProp, RenderProp } from "./types";

export function debounceEvent<TEvent>(
  duration: number,
  distinct?: boolean | EqualComparer<TEvent>
): React.ComponentType<
  HandlerProp<TEvent> &
  RenderProp<HandlerProp<TEvent>>
> & { Props: HandlerProp<TEvent> } {
  const operators = [
    tap((event: any) => event && event.persist && event.persist()),
    debounceTime(duration)
  ];
  if (distinct) {
    const comparer = (typeof distinct === "function") ? distinct : defaultEqualComparer;
    operators.push(distinctUntilChanged(comparer));
  }
  return transformEvent(event$ => event$.pipe(pipeFromArray(operators)));
}

function defaultEqualComparer(left: any, right: any): boolean {
  if (!left || !left.target || !right || !right.target) {
    return false;
  }
  return left.target.value === right.target.value;
}
