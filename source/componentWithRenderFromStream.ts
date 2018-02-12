import * as React from "react";
import {
  componentFromStreamWithConfig,
  mapper,
  Subscribable
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
  return componentFromStream<TProps & { render: (props: TRenderProps) => React.ReactNode }>(props$ => {
    return from(propsToReactNode(props$)).pipe(
      withLatestFrom(props$),
      map(([renderProps, props]) => props.render(renderProps))
    );
  });
}
