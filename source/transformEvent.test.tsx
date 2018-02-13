import { shallow } from "enzyme";
import * as React from "react";
import * as renderer from "react-test-renderer";
import { Observable } from "rxjs";
import { mapTo } from "rxjs/operators/mapTo";
import { transformEvent } from "./TransformEvent";

type Event = React.MouseEvent<HTMLButtonElement>;
const Component = transformEvent((event$: Observable<Event>) => event$.pipe(mapTo({ name: "click" })));

[{
  description: "using the render prop",
  factory: (state: { event: any }) => (
    <Component
      handler={event => { state.event = event; }}
      render={({ handler }) => <button id="button" onClick={handler}></button>}
    />
  )
}, {
  description: "using the children prop",
  factory: (state: { event: any }) => (
    <Component
      children={({ handler }) => <button id="button" onClick={handler}></button>}
      handler={event => { state.event = event; }}
    />
  )
}, {
  description: "using implicit children",
  factory: (state: { event: any }) => (
    <Component handler={event => { state.event = event; }}>
      {({ handler }: typeof Component.Props) => <button id="button" onClick={handler}></button>}
    </Component>
  )
}].forEach(({ description, factory }) => {

  describe(description, () => {

    it("should transform an event", () => {
      const state = { event: null };
      const wrapper = shallow(factory(state));
      wrapper.find("#button").simulate("click");
      expect(state.event).toEqual({ name: "click" });
    });

    it("should render correctly", () => {
      const state = { event: null };
      const rendering = renderer.create(factory(state)).toJSON();
      expect(rendering).toMatchSnapshot();
    });
  });
});
