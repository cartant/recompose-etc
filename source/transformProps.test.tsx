/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/recompose-etc
 */

import { shallow } from "enzyme";
import * as React from "react";
import * as renderer from "react-test-renderer";
import { createEventHandlerWithConfig } from "recompose";
import { combineLatest, merge, Observable } from "rxjs";
import { map, mapTo, scan, startWith } from "rxjs/operators";
import { rxjsObservableConfig } from "./rxjsObservableConfig";
import { transformProps } from "./transformProps";

const Counter = transformProps((props$: Observable<{}>) => {
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
  return combineLatest(props$, count$).pipe(
    map(([props, count]) => ({ ...props, count, increment, decrement }))
  );
});

[{
  description: "using the render prop",
  factory: () => (
    <Counter
      render={({ count, increment, decrement }) => (
        <div>
          Count: {count}
          <button id="increment" onClick={increment}>+</button>
          <button id="decrement" onClick={decrement}>-</button>
        </div>
      )}
    />
  )
}, {
  description: "using the children prop",
  factory: () => (
    <Counter
      children={({ count, increment, decrement }) => (
        <div>
          Count: {count}
          <button id="increment" onClick={increment}>+</button>
          <button id="decrement" onClick={decrement}>-</button>
        </div>
      )}
    />
  )
}, {
  description: "using implicit children",
  factory: () => (
    <Counter>
      {({ count, increment, decrement }: typeof Counter.Props) => (
        <div>
          Count: {count}
          <button id="increment" onClick={increment}>+</button>
          <button id="decrement" onClick={decrement}>-</button>
        </div>
      )}
    </Counter>
  )
}].forEach(({ description, factory }) => {

  describe(description, () => {

    it("should render without crashing", () => {
      shallow(factory());
    });

    it("should increment the counter", () => {
      const wrapper = shallow(factory());
      expect(wrapper.html()).toEqual(expect.stringMatching(/Count: 0/));
      wrapper.find("#increment").simulate("click");
      expect(wrapper.html()).toEqual(expect.stringMatching(/Count: 1/));
    });

    it("should decrement the counter", () => {
      const wrapper = shallow(factory());
      expect(wrapper.html()).toEqual(expect.stringMatching(/Count: 0/));
      wrapper.find("#decrement").simulate("click");
      expect(wrapper.html()).toEqual(expect.stringMatching(/Count: -1/));
    });

    it("should render correctly", () => {
      const rendering = renderer.create(factory()).toJSON();
      expect(rendering).toMatchSnapshot();
    });
  });
});
