import {Bond} from './bond';
import {Model} from './model';

/** A store for multiple Models to utilize them in multiple components. */
class Store {
  constructor (lemnData = {}) {
    this.lemnData = {};
    for (const key in lemnData) {
      this.lemnData[key] = new Model(lemnData[key]);
    }
  }

  model (id) {
    return (this.lemnData[id] = this.lemnData[id] || new Model());
  }

  get (id) {
    return (this.lemnData[id] = this.lemnData[id] || new Model()).data;
  }

  set (id, lemnData) {
    (this.lemnData[id] = this.lemnData[id] || new Model()).set(lemnData);
  }

  remove (id) {
    delete this.lemnData[id];
  }
}

export {
  Store,
};
