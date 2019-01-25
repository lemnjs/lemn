import {h, attach} from '../index';

class List {
  constructor (items) {
    this.items = items;
  }

  render () {
    const {items} = this;
    return h`
      <table><tbody>
      ${items.map(item => h`
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
    return new List(this.items.map(item => (
      h`<a href="${item.url}"><div style="padding: 1.2rem 0">
        ${item.text}
      </div></a>`
    )));
  }
}

class App {
  render () {
    return h`
      <section class="container">
      <h1>lem(o)n</h1>
      </section>

      <section class="container">
      <h2>Documentation</h2>
      ${new LinkList([{url: 'docs', text: 'API'}])}
      </section>

      <section class="container" style="margin-top: 2em">
      <h2>Examples</h2>
      ${new LinkList(
        (typeof FILES === 'undefined' ? ['clock'] : FILES)
        .filter(file => file !== 'index')
        .map(file => ({url: `examples/${file}.html`, text: file}))
      )}
      </section>

      <section class="container" style="margin-top: 2em">
      <h2>Versions</h2>
      ${
        (typeof VERSIONS === 'undefined' ? ['0.3.1'] : VERSIONS)
        .map(version => h`
          <details>
          <summary>${version}</summary>
          ${new LinkList([
            'lemn', 'lemn.lite', 'lemn.min', 'lemn.lite.min'
          ].map(file => ({url: `${version}/${file}.js`, text: `${file}.js`})))}
          </details>
        `)
      }
      </section>
    `;
  }
}

attach(document.querySelector('.root'), new App());
