import {rerender} from './lifecycle';

/**
 * A function bonded a Model or other Bond parent. Changes are pushed from
 * parent to child. Using a Bond in a `h` tagged template string will
 * automatically rerender when its function returns a new value from its parent
 * Model or Bond.
 */
class Bond {
  constructor (parent, fn) {
    this.parent = parent;
    this.fn = fn;
    this.data = this.fn(this.parent.pull(), this.data);
  }

  unbind (child) {
    if ((this.activeChildren = (this.activeChildren || []).filter(c => c !== child)).length === 0) {
      this.parent.unbind(this);
    }
  }

  bind (child) {
    if ((this.activeChildren = [...(this.activeChildren || []), child]).length === 1) {
      this.parent.bind(this);
    }
    this.push();
  }

  pull () {
    return this.data = this.fn(this.parent.pull(), this.data);
  }

  push () {
    if (this.data !== (this.data = this.fn(this.parent.data, this.data))) {
      (this.activeChildren || []).forEach(child => child.push());
      if (this.ref) {
        rerender(this);
      }
    }
  }

  as (fn) {
    return new Bond(this, fn);
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
  Bond,
};
