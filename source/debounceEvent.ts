/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/recompose-etc
 */

import * as React from "react";
import {
  mapper,
  setDisplayName,
  wrapDisplayName
} from "recompose";
import { debounceTime, distinctUntilChanged, map, tap } from "rxjs/operators";
import { transformEvent } from "./transformEvent";
import { EqualComparer, HandlerProp, RenderProp } from "./types";

export function debounceEvent<TInnerEvent, TOuterEvent>(
  duration: number,
  distinct: boolean | EqualComparer<TOuterEvent>,
  transform: mapper<TInnerEvent, TOuterEvent>
): React.ComponentType<
  HandlerProp<TOuterEvent> &
  RenderProp<HandlerProp<TInnerEvent>>
> & { Props: HandlerProp<TInnerEvent> };

export function debounceEvent<TEvent>(
  duration: number,
  distinct?: boolean | EqualComparer<TEvent>
): React.ComponentType<
  HandlerProp<TEvent> &
  RenderProp<HandlerProp<TEvent>>
> & { Props: HandlerProp<TEvent> };

export function debounceEvent<TInnerEvent, TOuterEvent>(
  duration: number,
  distinct: undefined | boolean | EqualComparer<TOuterEvent>,
  transform?: mapper<TInnerEvent, TOuterEvent>
): React.ComponentType<
  HandlerProp<TOuterEvent> &
  RenderProp<HandlerProp<TInnerEvent>>
> & { Props: HandlerProp<TInnerEvent> } {
  const operators = [
    tap((event: any) => event && event.persist && event.persist()),
    debounceTime(duration)
  ];
  if (transform) {
    operators.push(map(transform));
  }
  if (distinct) {
    const comparer = (typeof distinct === "function") ? distinct : defaultEqualComparer;
    operators.push(distinctUntilChanged(comparer));
  }
  const Component = transformEvent<TInnerEvent, TOuterEvent>(
    event$ => event$.pipe(...operators)
  );
  if (process.env.NODE_ENV !== "production") {
    return setDisplayName<any>(wrapDisplayName(Component, "debounceEvent"))(Component) as any;
  }
  return Component;
}

function defaultEqualComparer(left: any, right: any): boolean {
  if (!left || !left.target || !right || !right.target) {
    return left === right;
  }
  return left.target.value === right.target.value;
}
