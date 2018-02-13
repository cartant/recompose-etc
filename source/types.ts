import * as React from "react";

export type EqualComparer<T> = (left: T, right: T) => boolean;
export type HandlerProp<TEvent> = { handler: (event: TEvent) => void };
export type RenderProp<TProps> = { [key in "children" | "render"]?: (props: TProps) => React.ReactNode };
