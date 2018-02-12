import { createEventHandlerWithConfig } from "recompose";
import { Observable } from "rxjs/Observable";
import { combineLatest } from "rxjs/observable/combineLatest";
import { merge } from "rxjs/observable/merge";
import { mapTo } from "rxjs/operators/mapTo";
import { scan } from "rxjs/operators/scan";
import { startWith } from "rxjs/operators/startWith";
import { rxjsObservableConfig } from "../rxjsObservableConfig";

export const counterPropsFromStream = (props$: Observable<{}>) => {
  const createEventHandler = createEventHandlerWithConfig(rxjsObservableConfig);
  const { handler: increment, stream: increment$ } = createEventHandler();
  const { handler: decrement, stream: decrement$ } = createEventHandler();
  const count$ = merge<number>(
    increment$.pipe(mapTo(1)),
    decrement$.pipe(mapTo(-1))
  ).pipe(
    startWith(0),
    scan((count, n) => count + n, 0)
  );
  return combineLatest(
    props$,
    count$,
    (props, count) => ({ ...props, count, increment, decrement })
  );
};
