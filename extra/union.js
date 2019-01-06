class Union {
  constructor (parents, fn) {
    const _this = this;
    super({
      get data () {
        return parents.map(parent => parent.data);
      },

      unbind () {
        parents.forEach(parent => parent.unbind(_this));
      },

      bind () {
        parents.forEach(parent => parent.bind(_this));
      },

      pull () {
        return parents.map(parent => parent.pull());
      },
    }, fn);
  }
}

export class {
  Union,
};
