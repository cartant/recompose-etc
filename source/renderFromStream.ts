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

export type RenderProps = "children" | "render";

export function renderFromStream<TProps, TRenderProps>(
  propsToReactNode: mapper<Subscribable<TProps>, Observable<TRenderProps>>
): React.ComponentType<TProps & { [prop in RenderProps]?: (props: TRenderProps) => React.ReactNode }> & { Props: TRenderProps } {
  const componentFromStream = componentFromStreamWithConfig(rxjsObservableConfig);
  const Component = componentFromStream<TProps & { [prop in RenderProps]: (props: TRenderProps) => React.ReactNode }>(
    props$ => from(propsToReactNode(props$)).pipe(
      withLatestFrom(props$),
      map(([renderProps, props]) => (props.render || props.children)(renderProps))
    )
  );
  if (process.env.NODE_ENV !== "production") {
    return setDisplayName(wrapDisplayName(Component, "renderFromStream"))(Component) as any;
  }
  return Component as any;
}
