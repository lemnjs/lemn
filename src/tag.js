const DOCUMENT_FRAGMENT_NODE = 11;

function startEndNodes (replaceWith) {
  if (replaceWith.nodeType === DOCUMENT_FRAGMENT_NODE) {
    return replaceWith;
  }
  return {firstChild: replaceWith, lastChild: replaceWith};
}

function setRefRange (refRange, replaceWith) {
  const {firstChild, lastChild} = startEndNodes(replaceWith);

  (firstChild.lemnRef = (refRange.start = (firstChild.lemnRef || refRange.start))).lemnDom = firstChild;
  (lastChild.lemnEndRef = (refRange.end = (lastChild.lemnEndRef || refRange.end))).lemnDom = lastChild;
}

function removeRef (refRange) {
  const range = document.createRange();
  range.setStartBefore(refRange.start.lemnDom);
  range.setEndAfter(refRange.end.lemnDom);
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
function replaceAttr ({lemnAttr: {lemnDom, lemnName}}, replaceWith) {
  lemnDom.removeAttribute(lemnName);
  if (Array.isArray(replaceWith)) {
    lemnDom[lemnName] = replaceWith.join(' ');
  } else if (typeof replaceWith === 'object') {
    lemnDom[lemnName] = Object.entries(replaceWith).map(entry => entry.join(':')).join(';');
  } else {
    lemnDom[lemnName] = replaceWith;
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
 * A template string tag that turns the strings and input objects into lemnDom
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
          expr.lemnRef = {...expr.lemnRef, start: {lemnDom: toReplace}, end: {lemnDom: toReplace}};
          fragment.lemnComponents = [...(fragment.lemnComponents || []), expr];
        } else {
          replace({start: {lemnDom: toReplace}, end: {lemnDom: toReplace}}, expr);
        }
      } else {
        Array.from(fragment.querySelectorAll('*')).some(el => {
          return Array.from(el.attributes).some(attr => {
            if (attr.value === `<link class=${BIND_PREFIX}${i}>`) {
              const attrName = attr.name === 'class' ? 'className' : attr.name;
              if (expr.render) {
                expr.lemnRef = {lemnAttr: {lemnDom: el, lemnName: attrName}};
                fragment.lemnComponents = [...(fragment.lemnComponents || []), expr];
              } else {
                replaceAttr({lemnAttr: {lemnDom: el, lemnName: attrName}}, expr);
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
