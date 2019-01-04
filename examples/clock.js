/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./clock.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../index.js":
/*!*******************!*\
  !*** ../index.js ***!
  \*******************/
/*! exports provided: h, attach, detach, rerender, Component, Store */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _src_tag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/tag.js */ \"../src/tag.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"h\", function() { return _src_tag_js__WEBPACK_IMPORTED_MODULE_0__[\"h\"]; });\n\n/* harmony import */ var _src_lifecycle_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src/lifecycle.js */ \"../src/lifecycle.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"attach\", function() { return _src_lifecycle_js__WEBPACK_IMPORTED_MODULE_1__[\"attach\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"detach\", function() { return _src_lifecycle_js__WEBPACK_IMPORTED_MODULE_1__[\"detach\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"rerender\", function() { return _src_lifecycle_js__WEBPACK_IMPORTED_MODULE_1__[\"rerender\"]; });\n\n/* harmony import */ var _src_component_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./src/component.js */ \"../src/component.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"Component\", function() { return _src_component_js__WEBPACK_IMPORTED_MODULE_2__[\"Component\"]; });\n\n/* harmony import */ var _src_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/store */ \"../src/store.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"Store\", function() { return _src_store__WEBPACK_IMPORTED_MODULE_3__[\"Store\"]; });\n\n\n\n\n\n\n\n//# sourceURL=webpack:///../index.js?");

/***/ }),

/***/ "../src/component.js":
/*!***************************!*\
  !*** ../src/component.js ***!
  \***************************/
/*! exports provided: Component */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Component\", function() { return Component; });\n/* harmony import */ var _lifecycle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lifecycle */ \"../src/lifecycle.js\");\n\n\nclass Component {\n    /* willRender () {} */\n\n    /* didRender () {} */\n\n    /* willDetach () {} */\n\n    /* didAttach () {} */\n\n    rerender () {\n        return Object(_lifecycle__WEBPACK_IMPORTED_MODULE_0__[\"rerender\"])(this);\n    }\n\n    render () {}\n}\n\n\n\n\n//# sourceURL=webpack:///../src/component.js?");

/***/ }),

/***/ "../src/lifecycle.js":
/*!***************************!*\
  !*** ../src/lifecycle.js ***!
  \***************************/
/*! exports provided: toFragment, maybeCall, rerender, attach, detach */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"toFragment\", function() { return toFragment; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"maybeCall\", function() { return maybeCall; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"rerender\", function() { return rerender; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"attach\", function() { return attach; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"detach\", function() { return detach; });\n/* harmony import */ var _tag__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tag */ \"../src/tag.js\");\n\n\nfunction toFragment (replaceWith) {\n    if (replaceWith.nodeType) {\n        return replaceWith;\n    }\n    return _tag__WEBPACK_IMPORTED_MODULE_0__[\"h\"]`${replaceWith}`;\n}\n\nfunction maybeCall (fn, _this) {\n    fn && fn.call(_this);\n}\n\nfunction willDetach (expr) {\n    maybeCall(expr.willDetach, expr);\n}\n\nfunction didAttach (expr) {\n    maybeCall(expr.didAttach, expr);\n}\n\nfunction performRender (expr) {\n    maybeCall(expr.willRender, expr);\n\n    const fragment = toFragment(expr.render() || '');\n    replace(expr.ref, fragment);\n\n    (expr.ref.components || []).forEach(v => !(fragment.components || []).includes(v) && willDetach(v));\n    (fragment.components || []).forEach(performRender);\n    (fragment.components || []).forEach(v => !(expr.ref.components || []).includes(v) && didAttach(v));\n    expr.ref.components = (fragment.components || []);\n\n    maybeCall(expr.didRender, expr);\n}\n\nfunction rerender (expr) {\n    return Promise.resolve(expr).then(performRender);\n}\n\nfunction attach(root, expr) {\n    root.appendChild(_tag__WEBPACK_IMPORTED_MODULE_0__[\"h\"]`${expr}`);\n    performRender(expr);\n    didAttach(expr);\n}\n\nfunction detach(expr) {\n    willDetach(expr);\n    removeRef(expr.ref);\n}\n\n\n\n\n//# sourceURL=webpack:///../src/lifecycle.js?");

/***/ }),

/***/ "../src/store.js":
/*!***********************!*\
  !*** ../src/store.js ***!
  \***********************/
/*! exports provided: Store */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Store\", function() { return Store; });\n/* harmony import */ var _lifecycle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lifecycle */ \"../src/lifecycle.js\");\n\n\nclass Store {\n    constructor (data = {}) {\n        this.data = {};\n        for (const key in data) {\n            this.data[key] = new Model(data[key]);\n        }\n    }\n\n    get (id) {\n        return id in this.data ? this.data[id].data : {};\n    }\n\n    set (id, data) {\n        const model = this.data[id] = this.data[id] || new Model();\n        model.set(data);\n    }\n\n    connect (id, fn) {\n        const model = this.data[id] = this.data[id] || new Model();\n        return new Connect(model, fn);\n    }\n\n    toJSON () {\n        return this.data;\n    }\n}\n\nclass Model {\n    constructor (data = {}) {\n        this.activeChildren = [];\n        this.data = data;\n    }\n\n    set (data) {\n        this.data = data;\n        this.activeChildren.forEach(child => child.update());\n    }\n\n    unbind (child) {\n        this.activeChildren = this.activeChildren.filter(c => c !== child);\n    }\n\n    bind (child) {\n        this.activeChildren = [...this.activeChildren, child];\n    }\n\n    maybeInit () {}\n\n    toJSON () {\n        return this.data;\n    }\n}\n\nclass Connect {\n    constructor (parent, fn) {\n        this.parent = parent;\n        this.fn = fn;\n        this.activeChildren = null;\n        this.oldParentData = null;\n        this.data = null;\n        this.maybeInit();\n    }\n\n    willDetach () {\n        if (this.attached) {\n            this.parent.unbind(this);\n            this.attached = false;\n            this.oldParentData = null;\n            this.data = null;\n        }\n    }\n\n    didAttach () {\n        if (!this.attached) {\n            this.attached = true;\n            this.parent.bind(this);\n        }\n    }\n\n    connect (fn) {\n        return new Connect(this, fn);\n    }\n\n    unbind (child) {\n        this.activeChildren = this.activeChildren.filter(c => c !== child);\n        this.parent.unbind(this);\n    }\n\n    bind (child) {\n        this.parent.bind(this);\n        this.activeChildren = [...(this.activeChildren || []), child];\n    }\n\n    maybeInit () {\n        this.parent.maybeInit();\n        if (this.oldParentData !== this.parent.data) {\n            this.oldParentData = this.parent.data;\n            this.data = this.fn(this.parent.data, this.data) || this.data;\n        }\n    }\n\n    update () {\n        if (this.oldParentData !== this.parent.data) {\n            this.oldParentData = this.parent.data;\n            const out = this.fn(this.parent.data, this.data);\n            if (out !== null) {\n                this.data = out;\n                (this.activeChildren || []).forEach(child => child.update());\n                if (this.attached) {\n                    Object(_lifecycle__WEBPACK_IMPORTED_MODULE_0__[\"rerender\"])(this);\n                }\n            }\n        }\n    }\n\n    render () {\n        return this.data;\n    }\n}\n\n\n//# sourceURL=webpack:///../src/store.js?");

/***/ }),

/***/ "../src/tag.js":
/*!*********************!*\
  !*** ../src/tag.js ***!
  \*********************/
/*! exports provided: setRefRange, removeRef, replace, flatten, h */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"setRefRange\", function() { return setRefRange; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"removeRef\", function() { return removeRef; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"replace\", function() { return replace; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"flatten\", function() { return flatten; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"h\", function() { return h; });\nconst DOCUMENT_FRAGMENT_NODE = 11;\n\nfunction startEndNodes (replaceWith) {\n    if (replaceWith.nodeType === DOCUMENT_FRAGMENT_NODE) {\n        return replaceWith;\n    }\n    return {firstChild: replaceWith, lastChild: replaceWith};\n}\n\nfunction setRefRange (refRange, replaceWith) {\n    const {firstChild, lastChild} = startEndNodes(replaceWith);\n\n    (firstChild.ref = (refRange.start = firstChild.ref || refRange.start)).dom = firstChild;\n    (lastChild.endRef = (refRange.end = lastChild.endRef || refRange.end)).dom = lastChild;\n}\n\nfunction removeRef (refRange) {\n    const range = document.createRange();\n    range.setStartBefore(refRange.start.dom);\n    range.setEndAfter(refRange.end.dom);\n    range.extractContents();\n    return range;\n}\n\nfunction replace (refRange, replaceWith) {\n    const range = removeRef(refRange);\n    setRefRange(refRange, replaceWith);\n    range.insertNode(replaceWith);\n}\n\nfunction flatten (array) {\n    if (array.some(Array.isArray)) {\n        return flatten([].concat(...array));\n    }\n    return array;\n}\n\nconst BIND_PREFIX = 'BIND_PREFIX';\n\nfunction h (strings, ..._exprs) {\n    const exprs = [strings[0], ...flatten(_exprs.map((expr, i) => [expr, strings[i + 1]]))];\n\n    const out = exprs.map((expr, i) => (\n        (typeof expr === 'object' || typeof expr === 'function') ?\n            `<link class=${BIND_PREFIX}${i}>` :\n            expr\n    )).join('') || ' ';\n\n    const fragment = document.createRange().createContextualFragment(out);\n\n    exprs.forEach((expr, i) => {\n        if (typeof expr === 'object') {\n            const toReplace = fragment.querySelector(`.${BIND_PREFIX}${i}`);\n            if (!expr.nodeType) {\n                expr.ref = {start: {dom: toReplace}, end: {dom: toReplace}};\n                fragment.components = [...(fragment.components || []), expr];\n            } else {\n                replace({start: {dom: toReplace}, end: {dom: toReplace}}, expr);\n            }\n        } else if (typeof expr === 'function') {\n            for (const attr of [].concat(...Array.from(fragment.querySelectorAll('*'), el => Array.from(el.attributes)))) {\n                if (attr.value === `<link class=${BIND_PREFIX}${i}>`) {\n                    toReplace.removeAttribute(attr.name);\n                    toReplace[attr.name] = expr;\n                    break;\n                }\n            }\n        }\n    });\n\n    return fragment;\n}\n\n\n\n\n//# sourceURL=webpack:///../src/tag.js?");

/***/ }),

/***/ "./clock.js":
/*!******************!*\
  !*** ./clock.js ***!
  \******************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! .. */ \"../index.js\");\n\n\nfunction compare (n, o) {\n    return n === o ? null : n;\n}\n\nfunction pad (n) {\n    return function (d) {\n        return d.toString().padStart(n, '0');\n    };\n}\n\nconst store = new ___WEBPACK_IMPORTED_MODULE_0__[\"Store\"]({\n    time: new Date(),\n});\n\nsetInterval(() => store.set('time', new Date()), 87);\n\nclass Clock extends ___WEBPACK_IMPORTED_MODULE_0__[\"Component\"] {\n    pad (n, fn) {\n        return store.connect('time', fn).connect(compare).connect(pad(n));\n    }\n\n    render () {\n        const time = store.connect('time', i => i);\n        const pad2 = c => c.connect(d => d.toString().padStart(2, '0'));\n        const pad3 = c => c.connect(d => d.toString().padStart(3, '0'));\n        return ___WEBPACK_IMPORTED_MODULE_0__[\"h\"]`<div style=\"font-family: monospace\">${\n            this.pad(2, d => d.getHours())}:${\n            this.pad(2, d => d.getMinutes())}:${\n            this.pad(2, d => d.getSeconds())}.${\n            this.pad(3, d => d.getMilliseconds())}\n        `;\n    }\n}\n\nObject(___WEBPACK_IMPORTED_MODULE_0__[\"attach\"])(document.querySelector('.root'), new Clock);\n\n\n//# sourceURL=webpack:///./clock.js?");

/***/ })

/******/ });