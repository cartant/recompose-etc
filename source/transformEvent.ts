import * as React from "react";
import {
  createEventHandlerWithConfig,
  componentFromStreamWithConfig,
  mapper,
  setDisplayName,
  wrapDisplayName
} from "recompose";
import { Observable } from "rxjs/Observable";
import { from } from "rxjs/observable/from";
import { merge } from "rxjs/observable/merge";
import { ignoreElements } from "rxjs/operators/ignoreElements";
import { map } from "rxjs/operators/map";
import { tap } from "rxjs/operators/tap";
import { withLatestFrom } from "rxjs/operators/withLatestFrom";
import { rxjsObservableConfig } from "./rxjsObservableConfig";

export function transformEvent<TInnerEvent, TOuterEvent>(
  transform: mapper<Observable<TInnerEvent>, Observable<TOuterEvent>>
): React.ComponentType<
  { handler: (event: TOuterEvent) => void } &
  { [key in "children" | "render"]?: (props: { handler: (event: TInnerEvent) => void }) => React.ReactNode }
> & { Props: { handler: (event: TInnerEvent) => void } } {
  const createEventHandler = createEventHandlerWithConfig(rxjsObservableConfig);
  const componentFromStream = componentFromStreamWithConfig(rxjsObservableConfig);
  const { handler: innerHandler, stream: innerEvent$ } = createEventHandler();
  const Component = componentFromStream<
    { handler: (event: TOuterEvent) => void } &
    { [key in "children" | "render"]?: (props: { handler: (event: TInnerEvent) => void }) => React.ReactNode }
  >(props$ => {
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
          return (props.render || props.children)({ handler: innerHandler });
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
    return setDisplayName(wrapDisplayName(Component, "transformEvent"))(Component) as any;
  }
  return Component as any;
}
