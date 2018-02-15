/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/recompose-etc
 */

import * as React from "react";

export type EqualComparer<T> = (left: T, right: T) => boolean;
export type HandlerProp<TEvent> = { handler: (event: TEvent) => void };
export type RenderProp<TProps> = { [key in "children" | "render"]?: (props: TProps) => React.ReactNode };
