const test = require('tape');

const {setRefRange, removeRef, replace, flatten, h} = require('../src/tag');

test('setRefRange: updates all ranges referencing the previous nodes', t => {
    const original = document.createElement('span');
    original.ref = {dom: original};
    original.endRef = {dom: original};
    const refRange1 = {start: null, end: null};
    const refRange2 = {start: null, end: null};
    setRefRange(refRange1, original);
    setRefRange(refRange2, original);
    t.equals(refRange1.start.dom, original);
    t.equals(refRange1.end.dom, original);
    t.equals(refRange2.start.dom, original);
    t.equals(refRange2.end.dom, original);

    const updated1 = document.createElement('div');
    setRefRange(refRange1, updated1);
    t.equals(refRange2.start.dom, updated1);
    t.equals(refRange2.end.dom, updated1);

    const fragment1 = document.createRange().createContextualFragment('<div></div><div></div>');
    setRefRange(refRange1, fragment1);
    t.equals(refRange2.start.dom, fragment1.firstChild);
    t.equals(refRange2.end.dom, fragment1.lastChild);

    const fragment2 = document.createRange().createContextualFragment('<div></div><div></div>');
    setRefRange(refRange1, fragment2);
    t.equals(refRange2.start.dom, fragment2.firstChild);
    t.equals(refRange2.end.dom, fragment2.lastChild);

    const updated2 = document.createElement('div');
    setRefRange(refRange1, updated2);
    t.equals(refRange2.start.dom, updated2);
    t.equals(refRange2.end.dom, updated2);

    const fragment3 = document.createRange().createContextualFragment('<div></div><div></div>');
    fragment3.firstChild.ref = {dom: fragment3.firstChild};
    fragment3.lastChild.endRef = {dom: fragment3.lastChild};
    const refRange3 = {start: null, end: null};
    const refRange4 = {start: null, end: null};
    setRefRange(refRange3, fragment3);
    setRefRange(refRange4, fragment3);

    const fragment4 = document.createRange().createContextualFragment('<div></div><div></div>');
    setRefRange(refRange3, fragment4);
    t.equals(refRange4.start.dom, fragment4.firstChild);
    t.equals(refRange4.end.dom, fragment4.lastChild);

    const updated3 = document.createElement('div');
    setRefRange(refRange3, updated3);
    t.equals(refRange4.start.dom, updated3);
    t.equals(refRange4.end.dom, updated3);

    const fragment5 = document.createRange().createContextualFragment('<div></div><div></div>');
    setRefRange(refRange3, fragment5);
    t.equals(refRange4.start.dom, fragment5.firstChild);
    t.equals(refRange4.end.dom, fragment5.lastChild);

    t.end();
});

test('removeRef: remove old dom', t => {
    const root = document.createElement('div');

    const target1 = document.createRange().createContextualFragment('<div></div>').childNodes[0];
    const refRange1 = {start: {dom: target1}, end: {dom: target1}};
    root.appendChild(target1);
    t.equal(root.childNodes.length, 1);
    t.equal(root.firstChild, target1);
    removeRef(refRange1);
    t.equal(root.childNodes.length, 0);

    const target2 = document.createRange().createContextualFragment('<div></div><div></div>');
    const refRange2 = {start: {dom: target2.firstChild}, end: {dom: target2.lastChild}};
    root.appendChild(target2);
    t.equal(root.childNodes.length, 2);
    t.equal(root.firstChild, refRange2.start.dom);
    t.equal(root.lastChild, refRange2.end.dom);
    removeRef(refRange2);
    t.equal(root.childNodes.length, 0);

    const target3 = document.createRange().createContextualFragment('<div></div><div></div><div></div>');
    const refRange3 = {start: {dom: target3.firstChild}, end: {dom: target3.lastChild}};
    root.appendChild(target3);
    t.equal(root.childNodes.length, 3);
    t.equal(root.firstChild, refRange3.start.dom);
    t.equal(root.lastChild, refRange3.end.dom);
    removeRef(refRange3);
    t.equal(root.childNodes.length, 0);

    const firstEdge = root.appendChild(document.createElement('div'));
    const lastEdge = root.appendChild(document.createElement('div'));

    const target4 = document.createRange().createContextualFragment('<div></div>').childNodes[0];
    const refRange4 = {start: {dom: target4}, end: {dom: target4}};
    root.insertBefore(target4, root.lastChild);
    t.equal(root.childNodes.length, 3);
    t.equal(root.childNodes[1], target4);
    removeRef(refRange4);
    t.equal(root.childNodes.length, 2);
    t.equal(root.firstChild, firstEdge);
    t.equal(root.lastChild, lastEdge);

    const target5 = document.createRange().createContextualFragment('<div></div><div></div>');
    const refRange5 = {start: {dom: target5.firstChild}, end: {dom: target5.lastChild}};
    root.insertBefore(target5, root.lastChild);
    t.equal(root.childNodes.length, 4);
    t.equal(root.childNodes[1], refRange5.start.dom);
    t.equal(root.childNodes[2], refRange5.end.dom);
    removeRef(refRange5);
    t.equal(root.childNodes.length, 2);
    t.equal(root.firstChild, firstEdge);
    t.equal(root.lastChild, lastEdge);

    const target6 = document.createRange().createContextualFragment('<div></div><div></div><div></div>');
    const refRange6 = {start: {dom: target6.firstChild}, end: {dom: target6.lastChild}};
    root.insertBefore(target6, root.lastChild);
    t.equal(root.childNodes.length, 5);
    t.equal(root.childNodes[1], refRange6.start.dom);
    t.equal(root.childNodes[3], refRange6.end.dom);
    removeRef(refRange6);
    t.equal(root.childNodes.length, 2);
    t.equal(root.firstChild, firstEdge);
    t.equal(root.lastChild, lastEdge);

    t.end();
});

test('replace: replaces range with new element or fragment', t => {
    const root = document.createElement('div');

    const original = document.createElement('div');
    root.appendChild(original);

    const replaceWith1 = document.createRange().createContextualFragment('<div></div>').firstChild;
    const refRange = {start: {dom: original}, end: {dom: original}};
    replace(refRange, replaceWith1);
    t.equal(root.childNodes.length, 1);
    t.equal(root.firstChild, replaceWith1);

    const replaceWith2 = document.createRange().createContextualFragment('<div></div><div></div>');
    replace(refRange, replaceWith2);
    t.equal(root.childNodes.length, 2);
    t.equal(root.firstChild, refRange.start.dom);
    t.equal(root.lastChild, refRange.end.dom);

    const replaceWith3 = document.createRange().createContextualFragment('<div></div><div></div><div></div>');
    replace(refRange, replaceWith3);
    t.equal(root.childNodes.length, 3);
    t.equal(root.firstChild, refRange.start.dom);
    t.equal(root.lastChild, refRange.end.dom);

    const firstEdge = root.insertBefore(document.createElement('div'), root.firstChild);
    const lastEdge = root.appendChild(document.createElement('div'));

    const replaceWith4 = document.createRange().createContextualFragment('<div></div>').firstChild;
    replace(refRange, replaceWith4);
    t.equal(root.childNodes.length, 3);
    t.equal(root.childNodes[1], replaceWith4);

    const replaceWith5 = document.createRange().createContextualFragment('<div></div><div></div>');
    replace(refRange, replaceWith5);
    t.equal(root.childNodes.length, 4);
    t.equal(root.childNodes[1], refRange.start.dom);
    t.equal(root.childNodes[2], refRange.end.dom);

    const replaceWith6 = document.createRange().createContextualFragment('<div></div><div></div><div></div>');
    replace(refRange, replaceWith6);
    t.equal(root.childNodes.length, 5);
    t.equal(root.childNodes[1], refRange.start.dom);
    t.equal(root.childNodes[3], refRange.end.dom);

    t.end();
});

test('flatten', t => {
    t.same(flatten([]), []);
    t.same(flatten([[]]), []);
    t.same(flatten([[], []]), []);
    t.same(flatten([[[]]]), []);
    t.same(flatten([[[], []]]), []);
    t.same(flatten(['a', 'b']), ['a', 'b']);
    t.same(flatten(['a', ['b'], 'c']), ['a', 'b', 'c']);
    t.same(flatten(['a', ['b'], 'c', ['d'], 'e']), ['a', 'b', 'c', 'd', 'e']);
    t.same(flatten(['a', ['b', ['c'], 'd'], 'e']), ['a', 'b', 'c', 'd', 'e']);
    t.same(flatten(['a', ['b', ['c'], 'd', ['e'], 'f'], 'g']), ['a', 'b', 'c', 'd', 'e', 'f', 'g']);
    t.end();
});

test('h: turn template strings into dom', t => {
    const sameDom = (_actual, expect) => {
        let equivalent = true;
        let reason = '';
        const _sameDom = (actual, expect) => {
            if (
                (equivalent = equivalent && (reason = 'tag should exist') && actual && expect) &&
                (equivalent = equivalent && (reason = 'tagName should match') && actual.tagName === expect.tagName)
            ) {
                for (let i = 0; equivalent && i < actual.childNodes.length; i++) {
                    equivalent && _sameDom(actual.childNodes[i], expect.childNodes[i]);
                }
                for (let i = 0; equivalent && actual.style && i < expect.style.length; i++) {
                    const name = expect.style[i];
                    equivalent = equivalent && (reason = 'style item should match') && actual.style[name] === expect.style[name];
                }
                for (let i = 0; equivalent && actual.attributes && i < expect.attributes.length; i++) {
                    const name = expect.attributes[i].name;
                    if (name === 'style') continue;
                    equivalent = equivalent && (reason = 'attribute should match') && actual.attributes[name] === expect.attributes[name];
                }
            }
        };
        const actual = Array.from(_actual.childNodes);
        actual.some((a, i) => !(equivalent && _sameDom(a, expect[i])));
        if (equivalent) {
            reason = 'dom should match';
        }
        t.ok(equivalent, reason);
    };

    sameDom(h``, [document.createTextNode(' ')]);
    sameDom(h` `, [document.createTextNode(' ')]);

    const expect1 = [document.createElement('div')];
    sameDom(h`<div></div>`, expect1);
    const expect2 = [document.createElement('div'), document.createElement('div')];
    sameDom(h`<div></div><div></div>`, expect2);
    const expect1Nest1 = [document.createElement('div')];
    expect1Nest1[0].appendChild(document.createElement('div'));
    sameDom(h`<div><div></div></div>`, expect1Nest1);

    sameDom(h`${document.createElement('div')}`, expect1);
    sameDom(h`${document.createElement('div')}${document.createElement('div')}`, expect2);
    sameDom(h`${[document.createElement('div'), document.createElement('div')]}`, expect2);
    const _1nest1 = [document.createElement('div')];
    _1nest1[0].appendChild(document.createElement('div'));
    sameDom(h`${_1nest1}`, expect1Nest1);

    sameDom(h`${'<div></div>'}`, expect1);
    sameDom(h`${'<div></div><div></div>'}`, expect2);
    sameDom(h`${'<div><div></div></div>'}`, expect1Nest1);

    sameDom(h`${['<div></div>']}`, expect1);
    sameDom(h`${['<div></div>', ['<div></div>']]}`, expect2);
    sameDom(h`${['<div>', ['<div></div>'], '</div>']}`, expect1Nest1);

    sameDom(h`${h`<div></div>`}`, expect1);
    sameDom(h`${h`<div></div><div></div>`}`, expect2);
    sameDom(h`${h`<div><div></div></div>`}`, expect1Nest1);

    sameDom(h`${[h`<div></div>`]}`, expect1);
    sameDom(h`${[h`<div></div>`, h`<div></div>`]}`, expect2);
    sameDom(h`${[h`<div>${[h`<div></div>`]}</div>`]}`, expect1Nest1);

    class TestComponent {
        constructor (children = []) {
            this.children = children;
        }

        render () {
            return h`<div>${this.children}</div>`;
        }
    }

    function eachComponent({components}, fn) {
        components && components.forEach(fn);
    }

    function r(fragment) {
        eachComponent(fragment, v => replace(v.ref, r(v.render(v))));
        return fragment;
    }

    sameDom(r(h`${new TestComponent()}`), expect1);
    sameDom(r(h`${[new TestComponent(), new TestComponent()]}`), expect2);
    sameDom(r(h`${new TestComponent(new TestComponent())}`), expect1Nest1);

    t.end();
});
