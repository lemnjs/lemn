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
    maybeCall(expr.willRender, expr);

    if (expr.ref.attr) {
      replaceAttr(expr.ref, expr.render() || '');
    } else {
      const fragment = toFragment(expr.render() || ' ');
      if (!fragment.ref) {
        (expr.ref.components || []).forEach(v => !(fragment.components || []).includes(v) && willDetach(v));
        (fragment.components || []).forEach(component => performRender(component));
        (fragment.components || []).forEach(v => !(expr.ref.components || []).includes(v) && didAttach(v));
        expr.ref.components = (fragment.components || []);

        replace(expr.ref, fragment);
        fragment.ref = expr.ref;
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

/**
 * Detach a component from the dom.
 *
 * @param {Component} component - component to detach from parent dom
 */
function detach(expr) {
    willDetach(expr);
    removeRef(expr.ref);
}

export {
    toFragment,
    maybeCall,
    performRender,
    rerender,
    attach,
    detach,
};
