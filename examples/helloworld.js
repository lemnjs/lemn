import {Component, h, attach, Model} from '..';

function encode(s) {
  return s.toString().replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

class TextInput {
  constructor (options = {}) {
    this.options = options;
  }

  render () {
    const {name, placeholder, model} = this.options;
    return h`<input type="text"
      name="${name}"
      placeholder="${placeholder}"
      value="${model.data}"
      onkeyup="${ev => model.set(ev.currentTarget.value)}">`;
  }
}

class App {
  constructor () {
    this.name = new Model('');
  }

  render () {
    return h`
      ${new TextInput({placeholder: 'world', model: this.name})}
      <div>hello ${this.name.as(i => i || 'world').as(encode)}</div>
    `;
  }
}

attach(document.querySelector('.root'), new App);
