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
): React.ComponentType<{
  children?: (props: { handler: (event: TInnerEvent) => void }) => React.ReactNode,
  handler: (event: TOuterEvent) => void
}> & { ChildProps: { handler: (event: TInnerEvent) => void } } {
  const createEventHandler = createEventHandlerWithConfig(rxjsObservableConfig);
  const componentFromStream = componentFromStreamWithConfig(rxjsObservableConfig);
  const { handler: innerHandler, stream: innerEvent$ } = createEventHandler();
  const Component = componentFromStream<{
    children?: (props: { handler: (event: TInnerEvent) => void }) => React.ReactNode,
    handler: (event: TOuterEvent) => void
  }>(props$ => {
    return merge(
      from(props$).pipe(
        map(({ children }) => children!({ handler: innerHandler }))
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
