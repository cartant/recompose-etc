import * as React from "react";
import {
  componentFromStreamWithConfig,
  mapper,
  setDisplayName,
  Subscribable,
  wrapDisplayName
} from "recompose";
import { Observable } from "rxjs/Observable";
import { from } from "rxjs/observable/from";
import { map } from "rxjs/operators/map";
import { withLatestFrom } from "rxjs/operators/withLatestFrom";
import { rxjsObservableConfig } from "./rxjsObservableConfig";

export function transformProps<TOuterProps, TInnerProps>(
  transform: mapper<Observable<TOuterProps>, Observable<TInnerProps>>
): React.ComponentType<TInnerProps> & { ChildProps: TInnerProps } {
  const componentFromStream = componentFromStreamWithConfig(rxjsObservableConfig);
  const Component = componentFromStream<TOuterProps & { children?: (props: TInnerProps) => React.ReactNode }>(
    props$ => transform(from(props$)).pipe(
      withLatestFrom(props$),
      map(([innerProps, props]) => props.children!(innerProps))
    )
  );
  if (process.env.NODE_ENV !== "production") {
    return setDisplayName(wrapDisplayName(Component, "transformProps"))(Component) as any;
  }
  return Component as any;
}
