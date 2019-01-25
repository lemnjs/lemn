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

    (firstChild.lemnRef = (refRange.lemnPrivateStart = (firstChild.lemnRef || refRange.lemnPrivateStart))).lemnPrivateDom = firstChild;
    (lastChild.lemnEndRef = (refRange.lemnPrivateEnd = (lastChild.lemnEndRef || refRange.lemnPrivateEnd))).lemnPrivateDom = lastChild;
  }

  function removeRef (refRange) {
    const range = document.createRange();
    range.setStartBefore(refRange.lemnPrivateStart.lemnPrivateDom);
    range.setEndAfter(refRange.lemnPrivateEnd.lemnPrivateDom);
    range.extractContents();
    return range;
  }

  function replace (refRange, replaceWith) {
    const range = removeRef(refRange);
    setRefRange(refRange, replaceWith);
    range.insertNode(replaceWith);
  }

  /**
   * @private
   * @param {object|function|string|number|boolean} replaceWith
   */
  function replaceAttr ({lemnPrivateAttr: {lemnPrivateDom, lemnPrivateName}}, replaceWith) {
    lemnPrivateDom.removeAttribute(lemnPrivateName);
    if (Array.isArray(replaceWith)) {
      lemnPrivateDom[lemnPrivateName] = replaceWith.join(' ');
    } else if (typeof replaceWith === 'object') {
      Object.assign(lemnPrivateDom[lemnPrivateName], replaceWith);
    } else {
      lemnPrivateDom[lemnPrivateName] = replaceWith;
    }
  }

  function flatten (array) {
    if (array.some(Array.isArray)) {
      return flatten([].concat(...array));
    }
    return array;
  }

  const BIND_PREFIX = 'lemn';

  /**
   * A template string tag that turns the strings and input objects into lemnPrivateDom
   * elements.
   *
   * @param {Array.<string>} strings
   * @param {Array} ...exprs
   *
   * @example
   * h`<div></div>`
   *
   * @example
   * h`<div style="${{fontSize: '2em'}}">Big Text</div>`
   *
   * @example
   * h`<div onclick="${ev => console.log('clicked!')}">Click Me</div>`
   *
   * @example
   * h`<div>${{render() {return h`output`;}}}</div>`
   *
   * @example
   * h`<div>${new MyComponent()}</div>`
   */
  function h (strings, ..._exprs) {
    const exprs = [strings[0], ...flatten(_exprs.map((expr, i) => [expr, strings[i + 1]]))];

    let content;
    Object.defineProperty(exprs, 'content', {
      get () {
        if (!content) {
          const out = exprs.map((expr, i) => (
            (typeof expr === 'object' || typeof expr === 'function') ?
              `<link class=${BIND_PREFIX}${i}>` :
              expr
          )).join('') || ' ';

          content = document.createRange().createContextualFragment(out);

          exprs.forEach((expr, i) => {
            if (typeof expr === 'object' || typeof expr === 'function') {
              const toReplace = content.querySelector(`.${BIND_PREFIX}${i}`);
              if (toReplace) {
                if (!expr.nodeType) {
                  expr.lemnRef = {...expr.lemnRef, lemnPrivateStart: {lemnPrivateDom: toReplace}, lemnPrivateEnd: {lemnPrivateDom: toReplace}};
                  content.lemnPrivateComponents = [...(content.lemnPrivateComponents || []), expr];
                } else {
                  replace({lemnPrivateStart: {lemnPrivateDom: toReplace}, lemnPrivateEnd: {lemnPrivateDom: toReplace}}, expr.cloneNode(true));
                }
              } else {
                Array.from(content.querySelectorAll('*')).some(el => {
                  return Array.from(el.attributes).some(attr => {
                    if (attr.value === `<link class=${BIND_PREFIX}${i}>`) {
                      const attrName = attr.name === 'class' ? 'className' : attr.name;
                      if (expr.render) {
                        expr.lemnRef = {lemnPrivateAttr: {lemnPrivateDom: el, lemnPrivateName: attrName}};
                        content.lemnPrivateComponents = [...(content.lemnPrivateComponents || []), expr];
                      } else {
                        replaceAttr({lemnPrivateAttr: {lemnPrivateDom: el, lemnPrivateName: attrName}}, expr);
                      }
                      return true;
                    }
                  });
                });
              }
            }
          });
        }

        return content;
      }
    });

    return exprs;
  }

  function toFragment (replaceWith) {
      if (replaceWith.nodeType) {
          return replaceWith;
      }
      return h`${replaceWith}`.content;
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

      if (expr.lemnRef.lemnPrivateAttr) {
        replaceAttr(expr.lemnRef, expr.render() || '');
      } else {
        const fragment = toFragment(expr.render() || ' ');
        if (!fragment.lemnRef) {
          (expr.lemnRef.lemnPrivateComponents || []).forEach(v => !(fragment.lemnPrivateComponents || []).includes(v) && willDetach(v));
          (fragment.lemnPrivateComponents || []).forEach(component => performRender(component));
          (fragment.lemnPrivateComponents || []).forEach(v => !(expr.lemnRef.lemnPrivateComponents || []).includes(v) && didAttach(v));
          expr.lemnRef.lemnPrivateComponents = (fragment.lemnPrivateComponents || []);

          replace(expr.lemnRef, fragment.cloneNode(true));
          fragment.lemnRef = expr.lemnRef;
        }
      }

      maybeCall(expr.didRender, expr);
  }

  /**
   * Queue to call a component's render method later and inject its returned
   * value into the dom.
   *
   * @param {Component} component - rerender this component soon
   */
  function rerender (expr) {
      return Promise.resolve(expr).then(performRender);
  }

  /**
   * Attach a component into some root node.
   *
   * @param {HTMLElement} root - html element to attach component under
   * @param {Component} component - component to render
   */
  function attach(root, expr) {
      root.appendChild(toFragment(expr));
      performRender(expr);
      didAttach(expr);
  }

  /**
   * Detach a component from the dom.
   *
   * @param {Component} component - component to detach from parent dom
   */
  function detach(expr) {
      willDetach(expr);
      removeRef(expr.lemnRef);
  }

  /**
   * A function bonded a Model or other Bond parent. Changes are pushed from
   * parent to child. Using a Bond in a `h` tagged template string will
   * automatically rerender when its function returns a new value from its parent
   * Model or Bond.
   */
  class Bond {
    constructor (parent, fn) {
      this.parent = parent;
      this.lemnPrivateFn = fn;
      this.data = this.lemnPrivateFn(this.parent.data, this.data);
    }

    unbind (child) {
      if ((this.lemnPrivateActiveChildren = (this.lemnPrivateActiveChildren || []).filter(c => c !== child)).length === 0) {
        this.parent.unbind(this);
      }
    }

    bind (child) {
      if ((this.lemnPrivateActiveChildren = [...(this.lemnPrivateActiveChildren || []), child]).length === 1) {
        this.parent.bind(this);
        this.data = this.lemnPrivateFn(this.parent.data, this.data);
      }
    }

    push () {
      if (this.data !== (this.data = this.lemnPrivateFn(this.parent.data, this.data))) {
        (this.lemnPrivateActiveChildren || []).forEach(child => child.push());
        if (this.lemnRef) {
          rerender(this);
        }
      }
    }

    as (fn) {
      return new Bond(this, fn);
    }

    willDetach () {
      this.parent.unbind(this);
    }

    didAttach () {
      this.parent.bind(this);
    }

    render () {
      return this.data;
    }
  }

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

  /** Some text. */

  exports.h = h;
  exports.attach = attach;
  exports.detach = detach;
  exports.rerender = rerender;
  exports.Bond = Bond;
  exports.Model = Model;
  exports.Store = Store;

  return exports;

}({}));
//# sourceMappingURL=lemn.js.map
