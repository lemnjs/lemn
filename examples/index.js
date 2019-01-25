import {h, attach} from '../index';

function a(strings, ...exprs) {
  return [].concat(...strings.map((s, i) => [s, exprs[i]])).filter(Boolean);
}

class List {
  constructor (items) {
    this.items = items;
  }

  render () {
    const {items} = this;
    return h`
      <table><tbody>
      ${items.map(item => a`
        <tr><td style="padding-top: 0; padding-bottom: 0">
          ${item}
        </td></tr>
      `)}
      </tbody></table>
    `;
  }
}

class LinkList {
  constructor (items) {
    this.items = items;
  }

  render () {
    return new List(this.items.map(item =>
      `<a href="${item.url}"><div style="padding: 1.2rem 0">
        ${item.text}
      </div></a>`
    ));
  }
}

class App {
  render () {
    return h`
      <section class="container">
      <h2>Documentation</h2>
      ${new LinkList([{url: 'docs', text: 'API'}])}
      </section>
      <section class="container" style="margin-top: 2em">
      <h2>Examples</h2>
      ${new LinkList(
        FILES
        .filter(file => file !== 'index')
        .map(file => ({url: `${file}.html`, text: file}))
      )}
      </section>
    `;
  }
}

attach(document.querySelector('.root'), new App());
