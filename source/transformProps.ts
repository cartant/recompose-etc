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

export function transformProps<TProps, TRenderProps>(
  propsToReactNode: mapper<Subscribable<TProps>, Observable<TRenderProps>>
): React.ComponentType<TProps & { [key in "children" | "render"]?: (props: TRenderProps) => React.ReactNode }> & { Props: TRenderProps } {
  const componentFromStream = componentFromStreamWithConfig(rxjsObservableConfig);
  const Component = componentFromStream<TProps & { [key in "children" | "render"]?: (props: TRenderProps) => React.ReactNode }>(
    props$ => from(propsToReactNode(props$)).pipe(
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
        return (props.render || props.children)(renderProps);
      })
    )
  );
  if (process.env.NODE_ENV !== "production") {
    return setDisplayName(wrapDisplayName(Component, "transformProps"))(Component) as any;
  }
  return Component as any;
}
