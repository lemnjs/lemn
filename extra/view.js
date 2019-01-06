import {rerender} from './lifecycle';

class View {
  constructor (parent, fn) {
    this.parent = parent;
    this.fn = fn;
    this.data = this.fn(this.parent.pull(), this.data);
  }

  push () {
    if (this.data !== (this.data = this.fn(this.parent.data, this.data))) {
      rerender(this);
    }
  }

  willDetach () {
    this.parent.unbind(this);
  }

  didAttach () {
    this.parent.bind(this);
  }

  render () {
    return this.data;
  }
}

export {
  View,
};
