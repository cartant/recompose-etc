import * as React from "react";

export type HandlerProp<TEvent> = { handler: (event: TEvent) => void };
export type RenderProp<TProps> = { [key in "children" | "render"]?: (props: TProps) => React.ReactNode };
