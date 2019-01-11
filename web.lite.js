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
            expr.lemnRef = {...expr.lemnRef, lemnPrivateStart: {lemnPrivateDom: toReplace}, lemnPrivateEnd: {lemnPrivateDom: toReplace}};
            fragment.lemnPrivateComponents = [...(fragment.lemnPrivateComponents || []), expr];
          } else {
            replace({lemnPrivateStart: {lemnPrivateDom: toReplace}, lemnPrivateEnd: {lemnPrivateDom: toReplace}}, expr);
          }
        } else {
          Array.from(fragment.querySelectorAll('*')).some(el => {
            return Array.from(el.attributes).some(attr => {
              if (attr.value === `<link class=${BIND_PREFIX}${i}>`) {
                const attrName = attr.name === 'class' ? 'className' : attr.name;
                if (expr.render) {
                  expr.lemnRef = {lemnPrivateAttr: {lemnPrivateDom: el, lemnPrivateName: attrName}};
                  fragment.lemnPrivateComponents = [...(fragment.lemnPrivateComponents || []), expr];
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

      if (expr.lemnRef.lemnPrivateAttr) {
        replaceAttr(expr.lemnRef, expr.render() || '');
      } else {
        const fragment = toFragment(expr.render() || ' ');
        if (!fragment.lemnRef) {
          (expr.lemnRef.lemnPrivateComponents || []).forEach(v => !(fragment.lemnPrivateComponents || []).includes(v) && willDetach(v));
          (fragment.lemnPrivateComponents || []).forEach(component => performRender(component));
          (fragment.lemnPrivateComponents || []).forEach(v => !(expr.lemnRef.lemnPrivateComponents || []).includes(v) && didAttach(v));
          expr.lemnRef.lemnPrivateComponents = (fragment.lemnPrivateComponents || []);

          replace(expr.lemnRef, fragment);
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
      root.appendChild(h`${expr}`);
      performRender(expr);
      didAttach(expr);
  }

  exports.h = h;
  exports.attach = attach;
  exports.rerender = rerender;

  return exports;

}({}));
//# sourceMappingURL=web.lite.js.map
