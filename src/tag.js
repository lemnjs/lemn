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
        if (typeof expr === 'object') {
            const toReplace = fragment.querySelector(`.${BIND_PREFIX}${i}`);
            if (!expr.nodeType) {
                expr.ref = {start: {dom: toReplace}, end: {dom: toReplace}};
                fragment.components = [...(fragment.components || []), expr];
            } else {
                replace({start: {dom: toReplace}, end: {dom: toReplace}}, expr);
            }
        } else if (typeof expr === 'function') {
            for (const attr of [].concat(...Array.from(fragment.querySelectorAll('*'), el => Array.from(el.attributes)))) {
                if (attr.value === `<link class=${BIND_PREFIX}${i}>`) {
                    toReplace.removeAttribute(attr.name);
                    toReplace[attr.name] = expr;
                    break;
                }
            }
        }
    });

    return fragment;
}

export {
    setRefRange,
    removeRef,
    replace,
    flatten,
    h,
};
