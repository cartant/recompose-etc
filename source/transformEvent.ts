/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/recompose-etc
 */

import * as React from "react";
import {
  createEventHandlerWithConfig,
  componentFromStreamWithConfig,
  mapper,
  setDisplayName,
  wrapDisplayName
} from "recompose";
import { from, merge, Observable, ObservableInput } from "rxjs";
import { ignoreElements, map, tap, withLatestFrom } from "rxjs/operators";
import { rxjsObservableConfig } from "./rxjsObservableConfig";
import { HandlerProp, RenderProp } from "./types";

export function transformEvent<TInnerEvent, TOuterEvent>(
  transform: mapper<Observable<TInnerEvent>, Observable<TOuterEvent>>
): React.ComponentType<
  HandlerProp<TOuterEvent> &
  RenderProp<HandlerProp<TInnerEvent>>
> & { Props: HandlerProp<TInnerEvent> };

export function transformEvent<TEvent>(
  transform: mapper<Observable<TEvent>, Observable<TEvent>>
): React.ComponentType<
  HandlerProp<TEvent> &
  RenderProp<HandlerProp<TEvent>>
> & { Props: HandlerProp<TEvent> };

export function transformEvent<TInnerEvent, TOuterEvent>(
  transform: mapper<Observable<TInnerEvent>, Observable<TOuterEvent>>
): React.ComponentType<
  HandlerProp<TOuterEvent> &
  RenderProp<HandlerProp<TInnerEvent>>
> & { Props: HandlerProp<TInnerEvent> } {
  const createEventHandler = createEventHandlerWithConfig(rxjsObservableConfig);
  const componentFromStream = componentFromStreamWithConfig(rxjsObservableConfig);
  const { handler: innerHandler, stream: innerEvent$ } = createEventHandler();
  const Component = componentFromStream<
    HandlerProp<TOuterEvent> &
    RenderProp<HandlerProp<TInnerEvent>>
  >(subscribable => {
    const props$ = from(subscribable as ObservableInput<
      HandlerProp<TOuterEvent> &
      RenderProp<HandlerProp<TInnerEvent>>
    >);
    return merge(
      from(props$).pipe(
        map(props => {
          if (process.env.NODE_ENV !== "production") {
            if (!props.render && !props.children) {
              /*tslint:disable*/
              console.error(
                "A component created by `transformEvent()` was passed neither a " +
                "`render` property nor a `children` property."
              );
              /*tslint:enable*/
            }
          }
          return (props.render! || props.children!)({ handler: innerHandler });
        })
      ),
      transform(from(innerEvent$)).pipe(
        withLatestFrom(props$),
        tap(([transformed, props]) => props.handler(transformed)),
        ignoreElements()
      ) as Observable<never>
    );
  });
  if (process.env.NODE_ENV !== "production") {
    return setDisplayName(wrapDisplayName(Component, "transformEvent"))(Component as any) as any;
  }
  return Component as any;
}
