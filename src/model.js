import {Bond} from './bond';

/** A data model that pushes changes to bonded functions. */
class Model extends Bond {
  constructor (data = {}) {
    super({
      bind () {},
      unbind () {},
      data
    }, n => n);
  }

  set (data) {
    this.parent.data = data;
    this.push();
  }

  toJSON () {
    return this.data;
  }
}

export {
  Model,
};
