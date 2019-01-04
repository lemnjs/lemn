var lemn = (function (exports) {
  'use strict';

  const DOCUMENT_FRAGMENT_NODE = 11;

  function startEndNodes (replaceWith) {
    if (replaceWith.nodeType === DOCUMENT_FRAGMENT_NODE) {
      return replaceWith;
    }
    return {firstChild: replaceWith, lastChild: replaceWith};
  }

  function setRefRange (refRange, replaceWith) {
    const {firstChild, lastChild} = startEndNodes(replaceWith);

    (firstChild.ref = (refRange.start = firstChild.ref || refRange.start)).dom = firstChild;
    (lastChild.endRef = (refRange.end = lastChild.endRef || refRange.end)).dom = lastChild;
  }

  function removeRef (refRange) {
    const range = document.createRange();
    range.setStartBefore(refRange.start.dom);
    range.setEndAfter(refRange.end.dom);
    range.extractContents();
    return range;
  }

  function replace (refRange, replaceWith) {
    const range = removeRef(refRange);
    setRefRange(refRange, replaceWith);
    range.insertNode(replaceWith);
  }

  function replaceAttr (refRange, replaceWith) {
    refRange.attr.dom.removeAttribute(refRange.attr.name);
    if (typeof replaceWith === 'object') {
      Object.assign(refRange.attr.dom[refRange.attr.name], replaceWith);
    } else {
      refRange.attr.dom[refRange.attr.name] = replaceWith;
    }
  }

  function flatten (array) {
    if (array.some(Array.isArray)) {
      return flatten([].concat(...array));
    }
    return array;
  }

  const BIND_PREFIX = 'BIND_PREFIX';

  function h (strings, ..._exprs) {
    const exprs = [strings[0], ...flatten(_exprs.map((expr, i) => [expr, strings[i + 1]]))];

    const out = exprs.map((expr, i) => (
      (typeof expr === 'object' || typeof expr === 'function') ?
      `<link class=${BIND_PREFIX}${i}>` :
      expr
    )).join('') || ' ';

    const fragment = document.createRange().createContextualFragment(out);

    exprs.forEach((expr, i) => {
      if (typeof expr === 'object' || typeof expr === 'function') {
        const toReplace = fragment.querySelector(`.${BIND_PREFIX}${i}`);
        if (toReplace) {
          if (!expr.nodeType) {
            expr.ref = {start: {dom: toReplace}, end: {dom: toReplace}};
            fragment.components = [...(fragment.components || []), expr];
          } else {
            replace({start: {dom: toReplace}, end: {dom: toReplace}}, expr);
          }
        } else {
          Array.from(fragment.querySelectorAll('*')).some(el => {
            return Array.from(el.attributes).some(attr => {
              if (attr.value === `<link class=${BIND_PREFIX}${i}>`) {
                if (expr.render) {
                  expr.ref = {attr: {dom: el, name: attr.name}};
                  fragment.components = [...(fragment.components || []), expr];
                } else {
                  replaceAttr({attr: {dom: el, name: attr.name}}, expr);
                }
                return true;
              }
            });
          });
        }
      }
    });

    return fragment;
  }

  function toFragment (replaceWith) {
      if (replaceWith.nodeType) {
          return replaceWith;
      }
      return h`${replaceWith}`;
  }

  function maybeCall (fn, _this) {
      fn && fn.call(_this);
  }

  function willDetach (expr) {
      maybeCall(expr.willDetach, expr);
  }

  function didAttach (expr) {
      maybeCall(expr.didAttach, expr);
  }

  function performRender (expr) {
      maybeCall(expr.willRender, expr);

      if (expr.ref.attr) {
        replaceAttr(expr.ref, expr.render() || '');
      } else {
        const fragment = toFragment(expr.render() || '');
        replace(expr.ref, fragment);

        (expr.ref.components || []).forEach(v => !(fragment.components || []).includes(v) && willDetach(v));
        (fragment.components || []).forEach(performRender);
        (fragment.components || []).forEach(v => !(expr.ref.components || []).includes(v) && didAttach(v));
        expr.ref.components = (fragment.components || []);
      }

      maybeCall(expr.didRender, expr);
  }

  function rerender (expr) {
      return Promise.resolve(expr).then(performRender);
  }

  function attach(root, expr) {
      root.appendChild(h`${expr}`);
      performRender(expr);
      didAttach(expr);
  }

  function detach(expr) {
      willDetach(expr);
      removeRef(expr.ref);
  }

  class Component {
      /* willRender () {} */

      /* didRender () {} */

      /* willDetach () {} */

      /* didAttach () {} */

      rerender () {
          return rerender(this);
      }

      render () {}
  }

  class Model {
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

  class Store {
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

  exports.h = h;
  exports.attach = attach;
  exports.detach = detach;
  exports.rerender = rerender;
  exports.Component = Component;
  exports.Store = Store;

  return exports;

}({}));
