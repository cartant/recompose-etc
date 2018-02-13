import { shallow } from "enzyme";
import * as React from "react";
import * as renderer from "react-test-renderer";
import { renderFromStream } from "./renderFromStream";
import { counterPropsFromStream } from "./testing/counter";

const Counter = renderFromStream(counterPropsFromStream);

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
  description: "using the implicit children",
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
