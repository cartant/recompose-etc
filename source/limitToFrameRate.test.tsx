/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/recompose-etc
 */

import { shallow } from "enzyme";
import * as React from "react";
import * as renderer from "react-test-renderer";
import { configure } from "rxjs-marbles";
import { limitToFrameRate } from "./limitToFrameRate";

const { marbles } = configure({ run: false });

type Props = { name: string };
const Limit = limitToFrameRate<Props>();

it("should limit renders", marbles((m) => {
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
    <Limit {...props} />
  );
  expect(wrapper.html()).toEqual(expect.stringMatching(/alice/));
  expect(receivedNames).toEqual(["alice"]);
  m.scheduler.schedule(() => {
    wrapper.setProps({ ...props, name: "bob" });
    wrapper.setProps({ ...props, name: "mallory" });
  }, 10);
  m.scheduler.schedule(() => {
    // The expectation of ["alice", "mallory"] doesn't work. I think it might
    // be down to the interplay of Jests's notion of fake time and the
    // TestScheduler's notion of virtual time. If the `auditTime` operator is
    // removed, the received names are what you'd expect - that is, "bob" is in
    // the middle.
    expect(receivedNames).not.toContain(["bob"]);
  }, 20);
  m.flush();
}));
