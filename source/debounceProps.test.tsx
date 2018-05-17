/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/recompose-etc
 */

import { shallow } from "enzyme";
import * as React from "react";
import * as renderer from "react-test-renderer";
import { configure } from "rxjs-marbles";
import { debounceProps } from "./debounceProps";

const { marbles } = configure({ run: false });

describe("not distinct", () => {

  type Props = { name: string };
  const Debounce = debounceProps<Props>(100);

  it("should debounce props", marbles((m) => {
    m.autoFlush = false;
    m.bind();
    const receivedNames: string[] = [];
    let props: Props & { render: (props: Props) => React.ReactNode } = {
      name: "alice",
      render: ({ name }) => {
        receivedNames.push(name);
        return <span>{name}</span>;
      }
    };
    const wrapper = shallow(
      <Debounce render={props.render} name={props.name} />
    );
    expect(wrapper.html()).toEqual(expect.stringMatching(/alice/));
    expect(receivedNames).toEqual(["alice"]);
    m.scheduler.schedule(() => {
      wrapper.setProps({ ...props, name: "bob" });
    }, 50);
    m.scheduler.schedule(() => {
      expect(receivedNames).toEqual(["alice"]);
    }, 60);
    m.scheduler.schedule(() => {
      wrapper.setProps({ ...props, name: "mallory" });
    }, 70);
    m.scheduler.schedule(() => {
      expect(receivedNames).toEqual(["alice"]);
    }, 80);
    m.scheduler.schedule(() => {
      expect(receivedNames).toEqual(["alice", "mallory"]);
    }, 200);
    m.scheduler.schedule(() => {
      wrapper.setProps({ ...props, name: "mallory" });
    }, 210);
    m.scheduler.schedule(() => {
      expect(receivedNames).toEqual(["alice", "mallory"]);
    }, 220);
    m.scheduler.schedule(() => {
      expect(receivedNames).toEqual(["alice", "mallory", "mallory"]);
    }, 400);
    m.flush();
  }));
});

describe("distinct", () => {

  type Props = { name: string };
  const Debounce = debounceProps<Props>(100, (left, right) => left.name === right.name);

  it("should debounce props", marbles((m) => {
    m.autoFlush = false;
    m.bind();
    const receivedNames: string[] = [];
    let props: Props & { render: (props: Props) => React.ReactNode } = {
      name: "alice",
      render: ({ name }) => {
        receivedNames.push(name);
        return <span>{name}</span>;
      }
    };
    const wrapper = shallow(
      <Debounce render={props.render} name={props.name} />
    );
    expect(wrapper.html()).toEqual(expect.stringMatching(/alice/));
    expect(receivedNames).toEqual(["alice"]);
    m.scheduler.schedule(() => {
      wrapper.setProps({ ...props, name: "bob" });
    }, 50);
    m.scheduler.schedule(() => {
      expect(receivedNames).toEqual(["alice"]);
    }, 60);
    m.scheduler.schedule(() => {
      wrapper.setProps({ ...props, name: "mallory" });
    }, 70);
    m.scheduler.schedule(() => {
      expect(receivedNames).toEqual(["alice"]);
    }, 80);
    m.scheduler.schedule(() => {
      expect(receivedNames).toEqual(["alice", "mallory"]);
    }, 200);
    m.scheduler.schedule(() => {
      wrapper.setProps({ ...props, name: "mallory" });
    }, 210);
    m.scheduler.schedule(() => {
      expect(receivedNames).toEqual(["alice", "mallory"]);
    }, 220);
    m.scheduler.schedule(() => {
      expect(receivedNames).toEqual(["alice", "mallory"]);
    }, 400);
    m.flush();
  }));
});

describe("distinct and transformed", () => {

  type OuterProps = { name: string };
  type InnerProps = { firstName: string };
  const Debounce = debounceProps<OuterProps, InnerProps>(
    100,
    (left, right) => left.firstName === right.firstName,
    ({ name }) => ({ firstName: name })
  );

  it("should debounce props", marbles((m) => {
    m.autoFlush = false;
    m.bind();
    const receivedNames: string[] = [];
    let props: OuterProps & { render: (props: InnerProps) => React.ReactNode } = {
      name: "alice",
      render: ({ firstName }) => {
        receivedNames.push(firstName);
        return <span>{firstName}</span>;
      }
    };
    const wrapper = shallow(
      <Debounce render={props.render} name={props.name} />
    );
    expect(wrapper.html()).toEqual(expect.stringMatching(/alice/));
    expect(receivedNames).toEqual(["alice"]);
    m.scheduler.schedule(() => {
      wrapper.setProps({ ...props, name: "bob" });
    }, 50);
    m.scheduler.schedule(() => {
      expect(receivedNames).toEqual(["alice"]);
    }, 60);
    m.scheduler.schedule(() => {
      wrapper.setProps({ ...props, name: "mallory" });
    }, 70);
    m.scheduler.schedule(() => {
      expect(receivedNames).toEqual(["alice"]);
    }, 80);
    m.scheduler.schedule(() => {
      expect(receivedNames).toEqual(["alice", "mallory"]);
    }, 200);
    m.scheduler.schedule(() => {
      wrapper.setProps({ ...props, name: "mallory" });
    }, 210);
    m.scheduler.schedule(() => {
      expect(receivedNames).toEqual(["alice", "mallory"]);
    }, 220);
    m.scheduler.schedule(() => {
      expect(receivedNames).toEqual(["alice", "mallory"]);
    }, 400);
    m.flush();
  }));
});
