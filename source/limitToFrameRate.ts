/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/recompose-etc
 */

import * as React from "react";
import {
  setDisplayName,
  wrapDisplayName
} from "recompose";
import { animationFrameScheduler } from "rxjs";
import { auditTime } from "rxjs/operators";
import { subsequent } from "rxjs-etc/operators/subsequent";
import { transformProps } from "./transformProps";
import { HandlerProp, RenderProp } from "./types";

// https://github.com/facebook/react/issues/11171

export function limitToFrameRate<TProps>(): React.ComponentType<
  TProps &
  RenderProp<TProps>
> & { Props: TProps } {
  const Component = transformProps<TProps>(props$ => props$.pipe(
    subsequent(1, source$ => source$.pipe(
      auditTime(0, animationFrameScheduler)
    ))
  ));
  if (process.env.NODE_ENV !== "production") {
    return setDisplayName(wrapDisplayName(Component, "limitToFrameRate"))(Component as any) as any;
  }
  return Component;
}
