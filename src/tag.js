const DOCUMENT_FRAGMENT_NODE = 11;

function startEndNodes (replaceWith) {
  if (replaceWith.nodeType === DOCUMENT_FRAGMENT_NODE) {
    return replaceWith;
  }
  return {firstChild: replaceWith, lastChild: replaceWith};
}

function setRefRange (refRange, replaceWith) {
  const {firstChild, lastChild} = startEndNodes(replaceWith);

  (firstChild.ref = (refRange.start = (firstChild.ref || refRange.start))).dom = firstChild;
  (lastChild.endRef = (refRange.end = (lastChild.endRef || refRange.end))).dom = lastChild;
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

/**
 * @private
 * @param {object|function|string|number|boolean} replaceWith
 */
function replaceAttr ({attr: {dom, name}}, replaceWith) {
  dom.removeAttribute(name);
  if (Array.isArray(replaceWith)) {
    dom[name] = replaceWith.join(' ');
  } else if (typeof replaceWith === 'object') {
    dom[name] = Object.entries(replaceWith).map(entry => entry.join(':')).join(';');
  } else {
    dom[name] = replaceWith;
  }
}

function flatten (array) {
  if (array.some(Array.isArray)) {
    return flatten([].concat(...array));
  }
  return array;
}

const BIND_PREFIX = 'BIND_PREFIX';

/**
 * A template string tag that turns the strings and input objects into dom
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
          expr.ref = {...expr.ref, start: {dom: toReplace}, end: {dom: toReplace}};
          fragment.components = [...(fragment.components || []), expr];
        } else {
          replace({start: {dom: toReplace}, end: {dom: toReplace}}, expr);
        }
      } else {
        Array.from(fragment.querySelectorAll('*')).some(el => {
          return Array.from(el.attributes).some(attr => {
            if (attr.value === `<link class=${BIND_PREFIX}${i}>`) {
              const attrName = attr.name === 'class' ? 'className' : attr.name;
              if (expr.render) {
                expr.ref = {attr: {dom: el, name: attrName}};
                fragment.components = [...(fragment.components || []), expr];
              } else {
                replaceAttr({attr: {dom: el, name: attrName}}, expr);
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

export {
  setRefRange,
  removeRef,
  replace,
  replaceAttr,
  flatten,
  h,
};
