/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/recompose-etc
 */

import * as React from "react";
import { mapper } from "recompose";
import { distinctUntilChanged } from "rxjs/operators/distinctUntilChanged";
import { map } from "rxjs/operators/map";
import { debounceTimeSubsequent } from "rxjs-etc/operators/debounceTimeSubsequent";
import { pipeFromArray } from "rxjs/util/pipe";
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
  return transformProps(props$ => props$.pipe(pipeFromArray(operators)));
}
