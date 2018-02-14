import { shallow } from "enzyme";
import * as React from "react";
import * as renderer from "react-test-renderer";
import { marbles } from "rxjs-marbles";
import { debounceProps } from "./debounceProps";

describe("not distinct", () => {

  const Debounce = debounceProps<{ name: string }>(100);

  it("should debounce props", marbles((m) => {
    m.bind();
    const receivedNames: string[] = [];
    let props = {
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

  const Debounce = debounceProps<{ name: string }>(100, (left, right) => left.name === right.name);

  it("should debounce props", marbles((m) => {
    m.bind();
    const receivedNames: string[] = [];
    let props = {
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

  const Debounce = debounceProps<{ name: string }, { firstName: string }>(
    100,
    (left, right) => left.firstName === right.firstName,
    ({ name }) => ({ firstName: name })
  );

  it("should debounce props", marbles((m) => {
    m.bind();
    const receivedNames: string[] = [];
    let props = {
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
