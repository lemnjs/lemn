import {Bond} from './bond';

class Model {
  constructor (data = {}) {
    this.data = data;
  }

  set (data) {
    this.data = data;
    (this.activeChildren || []).forEach(child => child.push());
  }

  unbind (child) {
    this.activeChildren = (this.activeChildren || []).filter(c => c !== child);
  }

  bind (child) {
    (this.activeChildren = [...(this.activeChildren || []), child])
      .forEach(child => child.push());
  }

  pull () {
    return this.data;
  }

  as (fn) {
    return new Bond(this, fn);
  }

  toJSON () {
    return this.data;
  }
}

export {
  Model,
};
