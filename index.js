!function([t]){const n={r(){},d(t,n,e){t[n]=e}},e={};t.call(e,null,e,n);for(const t in e)e[t]=e[t]()}([function(t,n,e){"use strict";e.r(n);const o=11;function r(t,n){const{firstChild:e,lastChild:r}=function(t){return t.nodeType===o?t:{firstChild:t,lastChild:t}}(n);(e.lemnRef=t.o=e.lemnRef||t.o).t=e,(r.lemnEndRef=t.i=r.lemnEndRef||t.i).t=r}function i(t){const n=document.createRange();return n.setStartBefore(t.o.t),n.setEndAfter(t.i.t),n.extractContents(),n}function s(t,n){const e=i(t);r(t,n),e.insertNode(n)}function c({s:{t,l:n}},e){t.removeAttribute(n),Array.isArray(e)?t[n]=e.join(" "):"object"==typeof e?Object.assign(t[n],e):t[n]=e}function l(t){return t.some(Array.isArray)?l([].concat(...t)):t}const a="lemn";function m(t,...n){const e=[t[0],...l(n.map((n,e)=>[n,t[e+1]]))];let o;return Object.defineProperty(e,"content",{get(){if(!o){const t=e.map((t,n)=>"object"==typeof t||"function"==typeof t?`<link class=${a}${n}>`:t).join("")||" ";o=document.createRange().createContextualFragment(t),e.forEach((t,n)=>{if("object"==typeof t||"function"==typeof t){const e=o.querySelector(`.${a}${n}`);e?t.nodeType?s({o:{t:e},i:{t:e}},t.cloneNode(!0)):(t.lemnRef={...t.lemnRef,o:{t:e},i:{t:e}},o.m=[...o.m||[],t]):Array.from(o.querySelectorAll("*")).some(e=>Array.from(e.attributes).some(r=>{if(r.value===`<link class=${a}${n}>`){const n="class"===r.name?"className":r.name;return t.render?(t.lemnRef={s:{t:e,l:n}},o.m=[...o.m||[],t]):c({s:{t:e,l:n}},t),!0}}))}})}return o}}),e}function u(t){return t.nodeType?t:m`${t}`.content}function d(t,n){t&&t.call(n)}function f(t){d(t.willDetach,t)}function v(t){d(t.didAttach,t)}function $(t){if(d(t.willRender,t),t.lemnRef.s)c(t.lemnRef,t.render()||"");else{const n=u(t.render()||" ");n.lemnRef||((t.lemnRef.m||[]).forEach(t=>!(n.m||[]).includes(t)&&f(t)),(n.m||[]).forEach(t=>$(t)),(n.m||[]).forEach(n=>!(t.lemnRef.m||[]).includes(n)&&v(n)),t.lemnRef.m=n.m||[],s(t.lemnRef,n.cloneNode(!0)),n.lemnRef=t.lemnRef)}d(t.didRender,t)}class h{constructor(t){this.items=t}render(){const{items:t}=this;return m`
      <table><tbody>
      ${t.map(t=>m`
        <tr><td style="padding-top: 0; padding-bottom: 0">
          ${t}
        </td></tr>
      `)}
      </tbody></table>
    `}}class P{constructor(t){this.items=t}render(){return new h(this.items.map(t=>m`<a href="${t.url}"><div style="padding: 1.2rem 0">
        ${t.text}
      </div></a>`))}}var y,p;y=document.querySelector(".root"),p=new class{render(){return m`
      <section class="container">
      <h1>lem(o)n</h1>
      </section>

      <section class="container">
      <h2>Documentation</h2>
      ${new P([{url:"docs",text:"API"}])}
      </section>

      <section class="container" style="margin-top: 2em">
      <h2>Examples</h2>
      ${new P(["clock","helloworld","index","mouse","todo"].filter(t=>"index"!==t).map(t=>({url:`examples/${t}.html`,text:t})))}
      </section>

      <section class="container" style="margin-top: 2em">
      <h2>Versions</h2>
      ${["0.4.0"].map(t=>m`
          <details>
          <summary>${t}</summary>
          ${new P(["lemn","lemn.lite","lemn.min","lemn.lite.min"].map(n=>({url:`${t}/${n}.js`,text:`${n}.js`})))}
          </details>
        `)}
      </section>
    `}},y.appendChild(u(p)),$(p),v(p)}]);
//# sourceMappingURL=index.js.map