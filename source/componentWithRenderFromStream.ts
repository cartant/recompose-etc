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

export function componentWithRenderFromStream<TProps, TRenderProps>(
  propsToReactNode: mapper<Subscribable<TProps>, Observable<TRenderProps>>
): React.ComponentType<TProps & { render: (props: TRenderProps) => React.ReactNode }> {
  const componentFromStream = componentFromStreamWithConfig(rxjsObservableConfig);
  const Component = componentFromStream<TProps & { render: (props: TRenderProps) => React.ReactNode }>(
    props$ => from(propsToReactNode(props$)).pipe(
      withLatestFrom(props$),
      map(([renderProps, props]) => props.render(renderProps))
    )
  );
  if (process.env.NODE_ENV !== "production") {
    return setDisplayName(wrapDisplayName(Component, "componentWithRenderFromStream"))(Component) as any;
  }
  return Component;
}
