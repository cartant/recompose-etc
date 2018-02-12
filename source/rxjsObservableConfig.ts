import { ObservableConfig } from "recompose";
import { from } from "rxjs/observable/from";

export const rxjsObservableConfig: ObservableConfig = {
  fromESObservable: from,
  toESObservable: source$ => source$
};
