/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/recompose-etc
 */

import * as React from "react";
import {
  componentFromStreamWithConfig,
  mapper,
  setDisplayName,
  wrapDisplayName
} from "recompose";
import { from, Observable, ObservableInput } from "rxjs";
import { map, withLatestFrom } from "rxjs/operators";
import { rxjsObservableConfig } from "./rxjsObservableConfig";
import { RenderProp } from "./types";

export function transformProps<TOuterProps, TInnerProps>(
  propsToReactNode: mapper<Observable<TOuterProps>, Observable<TInnerProps>>
): React.ComponentType<TOuterProps & RenderProp<TInnerProps>> & { Props: TInnerProps };

export function transformProps<TProps>(
  propsToReactNode: mapper<Observable<TProps>, Observable<TProps>>
): React.ComponentType<TProps & RenderProp<TProps>> & { Props: TProps };

export function transformProps<TOuterProps, TInnerProps>(
  propsToReactNode: mapper<Observable<TOuterProps>, Observable<TInnerProps>>
): React.ComponentType<TOuterProps & RenderProp<TInnerProps>> & { Props: TInnerProps } {
  const componentFromStream = componentFromStreamWithConfig(rxjsObservableConfig);
  const Component = componentFromStream<TOuterProps & RenderProp<TInnerProps>>(
    subscribable => {
      const props$ = from(subscribable as ObservableInput<TOuterProps & RenderProp<TInnerProps>>);
      return propsToReactNode(props$).pipe(
        withLatestFrom(props$),
        map(([renderProps, props]) => {
          if (process.env.NODE_ENV !== "production") {
            if (!props.render && !props.children) {
              /*tslint:disable*/
              console.error(
                "A component created by `transformProps()` was passed neither a " +
                "`render` property nor a `children` property."
              );
              /*tslint:enable*/
            }
          }
          return (props.render! || props.children!)(renderProps);
        })
      );
    }
  );
  if (process.env.NODE_ENV !== "production") {
    return setDisplayName(wrapDisplayName(Component, "transformProps"))(Component as any) as any;
  }
  return Component as any;
}
