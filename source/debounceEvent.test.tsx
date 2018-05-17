/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/recompose-etc
 */

import { shallow } from "enzyme";
import * as React from "react";
import * as renderer from "react-test-renderer";
import { configure } from "rxjs-marbles";
import { debounceEvent } from "./debounceEvent";

const { marbles } = configure({ run: false });

describe("duration only", () => {

  type Event = React.ChangeEvent<HTMLInputElement>;
  const Debounce = debounceEvent<Event>(100);

  it("should debounce events", marbles((m) => {
    m.autoFlush = false;
    m.bind();
    let changeEvents: any[] = [];
    const wrapper = shallow(
      <Debounce
        handler={event => changeEvents.push(event)}
        render={({ handler }) => <input id="input" onChange={handler} type="text" />}
      />
    );
    wrapper.find("#input").simulate("change", { target: { value: "1" } });
    wrapper.find("#input").simulate("change", { target: { value: "12" } });
    wrapper.find("#input").simulate("change", { target: { value: "123" } });
    m.scheduler.schedule(() => {
      wrapper.find("#input").simulate("change", { target: { value: "1234" } });
      wrapper.find("#input").simulate("change", { target: { value: "123" } });
    }, 200);
    m.flush();
    expect(changeEvents).toEqual([
      { target: { value: "123" } },
      { target: { value: "123" } }
    ]);
  }));

  it("should render correctly", () => {
    const rendering = renderer.create(
      <Debounce
        handler={() => {}}
        render={({ handler }) => <input id="input" onChange={handler} type="text" />}
      />
    ).toJSON();
    expect(rendering).toMatchSnapshot();
  });
});

describe("default distinct", () => {

  type Event = React.ChangeEvent<HTMLInputElement>;
  const Debounce = debounceEvent<Event>(100, true);

  it("should debounce events", marbles((m) => {
    m.autoFlush = false;
    m.bind();
    let changeEvents: any[] = [];
    const wrapper = shallow(
      <Debounce
        handler={event => changeEvents.push(event)}
        render={({ handler }) => <input id="input" onChange={handler} type="text" />}
      />
    );
    wrapper.find("#input").simulate("change", { target: { value: "1" } });
    wrapper.find("#input").simulate("change", { target: { value: "12" } });
    wrapper.find("#input").simulate("change", { target: { value: "123" } });
    m.scheduler.schedule(() => {
      wrapper.find("#input").simulate("change", { target: { value: "1234" } });
      wrapper.find("#input").simulate("change", { target: { value: "123" } });
    }, 200);
    m.flush();
    expect(changeEvents).toEqual([{ target: { value: "123" } }]);
  }));
});

describe("distinct using comparer", () => {

  type Event = React.ChangeEvent<HTMLInputElement>;
  const Debounce = debounceEvent<Event>(100, (left, right) => left.target["value"] === right.target["value"]);

  it("should debounce events", marbles((m) => {
    m.autoFlush = false;
    m.bind();
    let changeEvents: any[] = [];
    const wrapper = shallow(
      <Debounce
        handler={event => changeEvents.push(event)}
        render={({ handler }) => <input id="input" onChange={handler} type="text" />}
      />
    );
    wrapper.find("#input").simulate("change", { target: { value: "1" } });
    wrapper.find("#input").simulate("change", { target: { value: "12" } });
    wrapper.find("#input").simulate("change", { target: { value: "123" } });
    m.scheduler.schedule(() => {
      wrapper.find("#input").simulate("change", { target: { value: "1234" } });
      wrapper.find("#input").simulate("change", { target: { value: "123" } });
    }, 200);
    m.flush();
    expect(changeEvents).toEqual([{ target: { value: "123" } }]);
  }));
});

describe("distinct and transformed", () => {

  type Event = React.ChangeEvent<HTMLInputElement>;
  const Debounce = debounceEvent<Event, string>(100, true, event => event.target["value"]);

  it("should debounce events", marbles((m) => {
    m.autoFlush = false;
    m.bind();
    let changeEvents: any[] = [];
    const wrapper = shallow(
      <Debounce
        handler={event => changeEvents.push(event)}
        render={({ handler }) => <input id="input" onChange={handler} type="text" />}
      />
    );
    wrapper.find("#input").simulate("change", { target: { value: "1" } });
    wrapper.find("#input").simulate("change", { target: { value: "12" } });
    wrapper.find("#input").simulate("change", { target: { value: "123" } });
    m.scheduler.schedule(() => {
      wrapper.find("#input").simulate("change", { target: { value: "1234" } });
      wrapper.find("#input").simulate("change", { target: { value: "123" } });
    }, 200);
    m.flush();
    expect(changeEvents).toEqual(["123"]);
  }));
});
