import {Bond} from './bond';
import {Model} from './model';

/** A store for multiple Models to utilize them in multiple components. */
class Store {
  constructor (data = {}) {
    this.data = {};
    for (const key in data) {
      this.data[key] = new Model(data[key]);
    }
  }

  model (id) {
    return (this.data[id] = this.data[id] || new Model());
  }

  get (id) {
    return (this.data[id] = this.data[id] || new Model()).data;
  }

  set (id, data) {
    (this.data[id] = this.data[id] || new Model()).set(data);
  }

  remove (id) {
    delete this.data[id];
  }
}

export {
  Store,
};
