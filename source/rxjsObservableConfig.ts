/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/recompose-etc
 */

import { ObservableConfig } from "recompose";
import { from, observable } from "rxjs";

export const rxjsObservableConfig: ObservableConfig = {
  fromESObservable: source$ => {
    source$[observable] = source$[observable] || self;
    return from(source$);
  },
  toESObservable: source$ => source$
};

function self(this: any): any {
  /*tslint:disable-next-line:no-invalid-this*/
  return this;
}
