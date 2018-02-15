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
import { Observable } from "rxjs/Observable";
import { from } from "rxjs/observable/from";
import { map } from "rxjs/operators/map";
import { withLatestFrom } from "rxjs/operators/withLatestFrom";
import { rxjsObservableConfig } from "./rxjsObservableConfig";
import { RenderProp } from "./types";

export function transformProps<TProps, TRenderProps>(
  propsToReactNode: mapper<Observable<TProps>, Observable<TRenderProps>>
): React.ComponentType<TProps & RenderProp<TRenderProps>> & { Props: TRenderProps } {
  const componentFromStream = componentFromStreamWithConfig(rxjsObservableConfig);
  const Component = componentFromStream<TProps & RenderProp<TRenderProps>>(
    props$ => propsToReactNode(from(props$)).pipe(
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
    )
  );
  if (process.env.NODE_ENV !== "production") {
    return setDisplayName<any>(wrapDisplayName(Component, "transformProps"))(Component) as any;
  }
  return Component as any;
}
