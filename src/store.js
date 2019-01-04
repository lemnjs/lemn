import {Model} from './model';

export class Store {
  constructor (data = {}) {
    this.data = {};
    for (const key in data) {
      this.data[key] = new Model(data[key]);
    }
  }

  get (id) {
    return id in this.data ? this.data[id].data : {};
  }

  set (id, data) {
    (this.data[id] = this.data[id] || new Model()).set(data);
  }

  to (id, fn = i => i) {
    return (this.data[id] = this.data[id] || new Model()).to(fn);
  }

  toJSON () {
    return this.data;
  }
}
