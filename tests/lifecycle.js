const test = require('tape');

const {h} = require('../src/tag');
const {toFragment, maybeCall, performRender} = require('../src/lifecycle');

test('toFragment: returns Node', t => {
    t.ok(toFragment('<div></div>') instanceof Node);
    t.ok(toFragment(document.createElement('div')) instanceof Node);
    t.ok(toFragment(document.createDocumentFragment()) instanceof Node);
    t.end();
});

test('maybeCall', t => {
    // does not throw
    maybeCall();

    // does not throw
    maybeCall(null);

    // does not throw
    maybeCall(null, null);

    const spy = function () {
        spy.called += 1;
        spy.this = this;
    };
    spy.called = 0;

    // calls with an unknown context
    maybeCall(spy);
    t.equal(spy.called, 1);

    // calls with an unknown context
    maybeCall(spy, null);
    t.equal(spy.called, 2);

    // calls with a given contenxt
    const context = {};
    maybeCall(spy, context);
    t.equal(spy.called, 3);
    t.equal(spy.this, context);

    t.end();
});

test('performRender', t => {
  class Inner {
    render () {
      return h`123`;
    }
  }

  class Middle {
    render () {
      if (!this.dom) {
        this.dom = h`${new Inner}`;
        this.dom = Object.assign(Array.from(this.dom), {components: this.dom.components});
      }
      return this.dom;
    }
  }

  class Outer {
    constructor (middle) {
      this.middle = middle;
    }

    render () {
      return h`<div>${this.middle}</div>`
    }
  }

  let middle = new Middle();
  let outer = new Outer(middle);

  const root = h`${outer}`;
  performRender(outer);
  t.equal(outer.ref.start.dom.childNodes.length, 1);

  performRender(middle);
  t.equal(outer.ref.start.dom.childNodes.length, 1);
});
