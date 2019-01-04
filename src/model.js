import {rerender} from './lifecycle';

export class Model {
  constructor (data = {}) {
    this.activeChildren = [];
    this.data = data;
  }

  set (data) {
    this.data = data;
    this.activeChildren.forEach(child => child.push(data));
  }

  unbind (child) {
    this.activeChildren = this.activeChildren.filter(c => c !== child);
  }

  bind (child) {
    this.activeChildren = [...this.activeChildren, child];
  }

  pull () {
    return this.data;
  }

  to (fn) {
    return new To(this, fn);
  }

  toJSON () {
    return this.data;
  }
}

class To {
  constructor (parent, fn) {
    this.parent = parent;
    this.fn = fn;
    this.attached = false;
    this.activeChildren = null;
    this.oldParentData = null;
    this.data = null;

    this.pull();
  }

  willDetach () {
    if (this.attached) {
      this.parent.unbind(this);
      this.attached = false;
      this.oldParentData = null;
      this.data = null;
    }
  }

  didAttach () {
    if (!this.attached) {
      this.attached = true;
      this.parent.bind(this);
    }
  }

  to (fn) {
    return new To(this, fn);
  }

  unbind (child) {
    this.activeChildren = this.activeChildren.filter(c => c !== child);
    this.parent.unbind(this);
  }

  bind (child) {
    this.parent.bind(this);
    this.activeChildren = [...(this.activeChildren || []), child];
  }

  pull () {
    const parentData = this.parent.pull();
    if (this.oldParentData !== parentData) {
      this.oldParentData = parentData;
      this.data = this.fn(parentData, this.data) || this.data;
    }
    return this.data;
  }

  push (parentData) {
    if (this.oldParentData !== parentData) {
      this.oldParentData = parentData;
      const out = this.fn(parentData, this.data);
      if (out !== null) {
        this.data = out;
        (this.activeChildren || []).forEach(child => child.push(out));
        if (this.attached) {
          rerender(this);
        }
      }
    }
  }

  render () {
    return this.data;
  }
}
