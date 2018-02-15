/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/recompose-etc
 */

import * as React from "react";
import {
  setDisplayName,
  wrapDisplayName
} from "recompose";
import { auditTime } from "rxjs/operators/auditTime";
import { animationFrame } from "rxjs/scheduler/animationFrame";
import { subsequent } from "rxjs-etc/operators/subsequent";
import { transformProps } from "./transformProps";
import { HandlerProp, RenderProp } from "./types";

// https://github.com/facebook/react/issues/11171

export function limitFrameRate<TProps>(): React.ComponentType<
  TProps &
  RenderProp<TProps>
> & { Props: TProps } {
  const Component = transformProps<TProps>(props$ => props$.pipe(
    subsequent(1, source$ => source$.pipe(
      auditTime(0, animationFrame)
    ))
  ));
  if (process.env.NODE_ENV !== "production") {
    return setDisplayName<any>(wrapDisplayName(Component, "limitFrameRate"))(Component) as any;
  }
  return Component;
}
