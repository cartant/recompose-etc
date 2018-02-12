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

export function componentWithChildrenFromStream<TProps, TChildProps>(
  propsToReactNode: mapper<Subscribable<TProps>, Observable<TChildProps>>
): React.ComponentType<TProps & { children?: (props: TChildProps) => React.ReactNode }> & { ChildProps: TChildProps } {
  const componentFromStream = componentFromStreamWithConfig(rxjsObservableConfig);
  return componentFromStream<TProps & { children?: (props: TChildProps) => React.ReactNode }>(props$ => {
    return from(propsToReactNode(props$)).pipe(
      withLatestFrom(props$),
      map(([childProps, props]) => props.children!(childProps))
    );
  }) as any;
}
