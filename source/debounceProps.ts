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
import { distinctUntilChanged, map } from "rxjs/operators";
import { debounceTimeSubsequent } from "rxjs-etc/operators/debounceTimeSubsequent";
import { transformProps } from "./transformProps";
import { EqualComparer, HandlerProp, RenderProp } from "./types";

export function debounceProps<TOuterProps, TInnerProps>(
  duration: number,
  distinct: EqualComparer<TInnerProps> | undefined,
  transform: mapper<TOuterProps, TInnerProps>
): React.ComponentType<
  TOuterProps &
  RenderProp<TInnerProps>
> & { Props: TInnerProps };

export function debounceProps<TProps>(
  duration: number,
  distinct?: EqualComparer<TProps>
): React.ComponentType<
  TProps &
  RenderProp<TProps>
> & { Props: TProps };

export function debounceProps<TOuterProps, TInnerProps>(
  duration: number,
  distinct: EqualComparer<TInnerProps> | undefined,
  transform?: mapper<TOuterProps, TInnerProps>
): React.ComponentType<
  TOuterProps &
  RenderProp<TInnerProps>
> & { Props: TInnerProps } {
  const operators = [
    debounceTimeSubsequent<any>(duration)
  ];
  if (transform) {
    operators.push(map(transform));
  }
  if (distinct) {
    operators.push(distinctUntilChanged(distinct));
  }
  const Component = transformProps<TOuterProps, TInnerProps>(
    props$ => props$.pipe(...operators)
  );
  if (process.env.NODE_ENV !== "production") {
    return setDisplayName<any>(wrapDisplayName(Component, "debounceProps"))(Component) as any;
  }
  return Component;
}
