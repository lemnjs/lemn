import {Component, h, attach, Store, Model} from '..';

class App extends Component {
  constructor () {
    super();
    this.hover = new Model(false);
  }

  render () {
    return h`
    <span
      onmouseover="${ev => this.hover.set(true)}"
      onmouseout="${ev => this.hover.set(false)}"
      style="${this.hover.as(b => ({
        padding: '0.2em',
        background: b ? 'green' : 'red'
      }))}" />
      ${this.hover.as(b => b ? 'green' : 'red')}
    </span>
    `;
  }
}

attach(document.querySelector('.root'), new App);
