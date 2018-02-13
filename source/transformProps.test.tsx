import { shallow } from "enzyme";
import * as React from "react";
import * as renderer from "react-test-renderer";
import { Observable } from "rxjs";
import { mapTo } from "rxjs/operators/mapTo";
import { transformProps } from "./transformProps";

const Component = transformProps((props$: Observable<{ name: string }>) => props$.pipe(mapTo({ name: "bob" })));

it("should transform props using the children prop", () => {
  const wrapper = shallow(
    <Component
      children={({ name }) => <span>{name}</span>}
      name={"alice"}
    />
  );
  expect(wrapper.html()).toEqual(expect.stringMatching(/bob/));
});

it("should transform props using implicit children", () => {
  const wrapper = shallow(
    <Component name={"alice"}>
      {({ name }) => <span>{name}</span>}
    </Component>
  );
  expect(wrapper.html()).toEqual(expect.stringMatching(/bob/));
});

it("should render correctly using the children prop", () => {
  const rendering = renderer.create(
    <Component
      children={({ name }) => <span>{name}</span>}
      name={"alice"}
    />
  ).toJSON();
  expect(rendering).toMatchSnapshot();
});

it("should render correctly using implicit children", () => {
  const rendering = renderer.create(
    <Component name={"alice"}>
      {({ name }) => <span>{name}</span>}
    </Component>
  ).toJSON();
  expect(rendering).toMatchSnapshot();
});
