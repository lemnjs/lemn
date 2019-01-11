import {Model} from './model';

/** A store for multiple Models to utilize them in multiple components. */
class Store {
  constructor (lemnData = {}) {
    Object.entries(lemnData).forEach(args => this.set(...args));
  }

  model (id) {
    return ((this.lemnPrivateData = this.lemnPrivateData || {})[id] = this.lemnPrivateData[id] || new Model());
  }

  get (id) {
    return ((this.lemnPrivateData = this.lemnPrivateData || {})[id] = this.lemnPrivateData[id] || new Model()).data;
  }

  set (id, lemnData) {
    ((this.lemnPrivateData = this.lemnPrivateData || {})[id] = this.lemnPrivateData[id] || new Model()).set(lemnData);
  }

  remove (id) {
    delete this.lemnPrivateData[id];
  }

  toJSON () {
    return this.lemnPrivateData;
  }
}

export {
  Store,
};
