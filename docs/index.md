### What is it?

A bunch of RxJS-based React components that build on those in [`recompose`](https://github.com/acdlite/recompose).

### Why might you need it?

At the moment, `recompose-etc` is something of an experiment. It seems interesting, but I'm only just starting to use it for real-world development.

`recompose` provides the [`componentFromStream`](https://github.com/acdlite/recompose/blob/master/docs/API.md#componentfromstream) component factory and the [`mapPropsStream`](https://github.com/acdlite/recompose/blob/master/docs/API.md#mappropsstream) higher-order component. This package builds upon those and provides two render-prop-based component factories:

* `transformProps`
* `transformEvent`

`transformProps` applies an RxJS-based transform to the properties passed from the parent component to a child - via a render prop. The render prop can be specified as a `render` property, a `children` property or a child function. An example might look something like this:

```tsx
const Component = transformProps(props$ => props$.pipe(auditTime(0, animationFrame)));
const element =
  <Component
    auditedValue={highFreqValue}
    render={({ auditedValue }) => (<span>{auditedValue}</span>)}
  />;
```

The specified transform could apply any structural or temporal RxJS transformation to the props. It could be as simple as an `auditTime` or `debouceTime` operator, or it could be something more complicated - like an observable that connects to the Firebase FireStore.

`transformEvent` applies an RxJS-based transform to an event passed from a child to a parent - via a handler function. An example might look something like this:

```tsx
const Component = transformEvent(event$ => event$.pipe(
  debounceTime(1000),
  distinctUntilChanged((left, right) => left.target.value === right.target.value)
));
const element =
  <Component
    handler={handleChange}
    render={({ handler }) => (<input onChange={handler} type="text"/>)}
  />;
```

The package's `debounceEvent`, `debounceProps` and `limitToFrameRate` build upon the base component factories, incorporating some specifically-composed observables.