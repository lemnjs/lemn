import {rerender} from './lifecycle';

class Pass {
  constructor (parent, fn) {
    this.parent = parent;
    this.fn = fn;
    this.data = this.fn(this.parent.pull(), this.data);
  }

  unbind (child) {
    this.activeChildren = (this.activeChildren || []).filter(c => c !== child);
    this.parent.unbind(this);
  }

  bind (child) {
    this.parent.bind(this);
    this.activeChildren = [...(this.activeChildren || []), child];
    this.push();
  }

  pull () {
    return this.data = this.fn(this.parent.pull(), this.data);
  }

  push () {
    if (this.data !== (this.data = this.fn(this.parent.data, this.data))) {
      (this.activeChildren || []).forEach(child => child.push());
    }
  }

  as (fn) {
    return new Pass(this, fn);
  }
}

export {
  Pass,
};
