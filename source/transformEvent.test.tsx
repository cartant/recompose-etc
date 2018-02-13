import { shallow } from "enzyme";
import * as React from "react";
import * as renderer from "react-test-renderer";
import { Observable } from "rxjs";
import { mapTo } from "rxjs/operators/mapTo";
import { transformEvent } from "./TransformEvent";

type Event = React.MouseEvent<HTMLButtonElement>;
const Component = transformEvent((event$: Observable<Event>) => event$.pipe(mapTo({ name: "click" })));

it("should transform an event using the children prop", () => {
  let receivedEvent: any= null;
  const wrapper = shallow(
    <Component
      children={({ handler }) => <button id="button" onClick={handler}></button>}
      handler={event => { receivedEvent = event; }}
    />
  );
  wrapper.find("#button").simulate("click");
  expect(receivedEvent).toEqual({ name: "click" });
});

it("should transform an event using implicit children", () => {
  let receivedEvent: any= null;
  const wrapper = shallow(
    <Component handler={event => { receivedEvent = event; }}>
      {({ handler }: typeof Component.Props) => <button id="button" onClick={handler}></button>}
    </Component>
  );
  wrapper.find("#button").simulate("click");
  expect(receivedEvent).toEqual({ name: "click" });
});

it("should render correctly using the children prop", () => {
  const rendering = renderer.create(
    <Component
      children={({ handler }) => <button id="button" onClick={handler}></button>}
      handler={() => {}}
    />
  ).toJSON();
  expect(rendering).toMatchSnapshot();
});

it("should render correctly using implicit children", () => {
  const rendering = renderer.create(
    <Component handler={() => {}}>
      {({ handler }: typeof Component.Props) => <button id="button" onClick={handler}></button>}
    </Component>
  ).toJSON();
  expect(rendering).toMatchSnapshot();
});
