/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/recompose-etc
 */

import * as React from "react";
import { mapper } from "recompose";
import { debounceTime } from "rxjs/operators/debounceTime";
import { distinctUntilChanged } from "rxjs/operators/distinctUntilChanged";
import { map } from "rxjs/operators/map";
import { tap } from "rxjs/operators/tap";
import { pipeFromArray } from "rxjs/util/pipe";
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
  return transformEvent(event$ => event$.pipe(pipeFromArray(operators)));
}

function defaultEqualComparer(left: any, right: any): boolean {
  if (!left || !left.target || !right || !right.target) {
    return left === right;
  }
  return left.target.value === right.target.value;
}
