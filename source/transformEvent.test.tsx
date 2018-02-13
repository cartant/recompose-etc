import { shallow } from "enzyme";
import * as React from "react";
import * as renderer from "react-test-renderer";
import { Observable } from "rxjs";
import { mapTo } from "rxjs/operators/mapTo";
import { transformEvent } from "./TransformEvent";

type Event = React.MouseEvent<HTMLButtonElement>;
const Component = transformEvent((event$: Observable<Event>) => event$.pipe(mapTo({
  name: "click",
  transformed: true
})));

[{
  description: "using the render prop",
  factory: (handleClick: (event: any) => void) => (
    <Component
      handler={handleClick}
      render={({ handler }) => <button id="button" onClick={handler}></button>}
    />
  )
}, {
  description: "using the children prop",
  factory: (handleClick: (event: any) => void) => (
    <Component
      children={({ handler }) => <button id="button" onClick={handler}></button>}
      handler={handleClick}
    />
  )
}, {
  description: "using implicit children",
  factory: (handleClick: (event: any) => void) => (
    <Component handler={handleClick}>
      {({ handler }: typeof Component.Props) => <button id="button" onClick={handler}></button>}
    </Component>
  )
}].forEach(({ description, factory }) => {

  describe(description, () => {

    it("should transform an event", () => {
      let clickEvent: any = null;
      const wrapper = shallow(factory(event => clickEvent = event));
      wrapper.find("#button").simulate("click");
      expect(clickEvent).toEqual({
        name: "click",
        transformed: true
      });
    });

    it("should render correctly", () => {
      const rendering = renderer.create(factory(() => {})).toJSON();
      expect(rendering).toMatchSnapshot();
    });
  });
});
