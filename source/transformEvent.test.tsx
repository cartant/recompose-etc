/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/recompose-etc
 */

import { shallow } from "enzyme";
import * as React from "react";
import * as renderer from "react-test-renderer";
import { Observable } from "rxjs";
import { mapTo } from "rxjs/operators/mapTo";
import { transformEvent } from "./transformEvent";

type Event = React.MouseEvent<HTMLButtonElement>;
const Transform = transformEvent((event$: Observable<Event>) => event$.pipe(mapTo({
  name: "click",
  transformed: true
})));

[{
  description: "using the render prop",
  factory: (handleClick: (event: any) => void) => (
    <Transform
      handler={handleClick}
      render={({ handler }) => <button id="button" onClick={handler}></button>}
    />
  )
}, {
  description: "using the children prop",
  factory: (handleClick: (event: any) => void) => (
    <Transform
      children={({ handler }) => <button id="button" onClick={handler}></button>}
      handler={handleClick}
    />
  )
}, {
  description: "using implicit children",
  factory: (handleClick: (event: any) => void) => (
    <Transform handler={handleClick}>
      {({ handler }: typeof Transform.Props) => <button id="button" onClick={handler}></button>}
    </Transform>
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
