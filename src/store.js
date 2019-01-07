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
    return this.model(id).data;
  }

  set (id, data) {
    this.model(id).set(data);
  }

  remove (id) {
    delete this.data[id];
  }

  as (id, fn = i => i) {
    return new Bond(this.model(id), fn);
  }

  toJSON () {
    return this.data;
  }
}

export {
  Store,
};
