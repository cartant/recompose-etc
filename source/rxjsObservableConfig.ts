/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/recompose-etc
 */

import { ObservableConfig } from "recompose";
import { from } from "rxjs/observable/from";

export const rxjsObservableConfig: ObservableConfig = {
  fromESObservable: from,
  toESObservable: source$ => source$
};
