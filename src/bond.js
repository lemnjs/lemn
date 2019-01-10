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
    this.lemnFn = fn;
    this.data = this.lemnFn(this.parent.data, this.data);
  }

  unbind (child) {
    if ((this.lemnActiveChildren = (this.lemnActiveChildren || []).filter(c => c !== child)).length === 0) {
      this.parent.unbind(this);
    }
  }

  bind (child) {
    if ((this.lemnActiveChildren = [...(this.lemnActiveChildren || []), child]).length === 1) {
      this.parent.bind(this);
      this.data = this.lemnFn(this.parent.data, this.data);
    }
  }

  push () {
    if (this.data !== (this.data = this.lemnFn(this.parent.data, this.data))) {
      (this.lemnActiveChildren || []).forEach(child => child.push());
      if (this.lemnRef) {
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
