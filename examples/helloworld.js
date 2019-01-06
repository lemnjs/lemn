import {Component, h, attach, Model} from '..';

function encode(s) {
  return s.toString().replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

class App extends Component {
  constructor () {
    super();

    this.name = new Model('world');
  }

  render () {
    return h`
      <input placeholder="world"
        onkeyup="${ev => this.name.set(ev.currentTarget.value || 'world')}" />
      <div>hello ${this.name.as(encode)}</div>
    `;
  }
}

attach(document.querySelector('.root'), new App);
