import {removeRef, replace, replaceAttr, h} from './tag';

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
  debugger;
    maybeCall(expr.willRender, expr);

    if (expr.ref.attr) {
      replaceAttr(expr.ref, expr.render() || '');
    } else {
      const fragment = toFragment(expr.render() || ' ');

      const {firstChild, lastChild} = fragment instanceof DocumentFragment ? fragment : {firstChild: fragment, lastChild: fragment};
      firstChild.ref = expr.ref.start;

      (expr.ref.components || []).forEach(v => !(fragment.components || []).includes(v) && willDetach(v));
      (fragment.components || []).forEach(performRender);
      (fragment.components || []).forEach(v => !(expr.ref.components || []).includes(v) && didAttach(v));
      expr.ref.components = (fragment.components || []);

      replace(expr.ref, fragment);
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

export {
    toFragment,
    maybeCall,
    rerender,
    attach,
    detach,
};
