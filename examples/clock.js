import {Component, h, attach, Model} from '..';

const time = new Model(new Date());
setInterval(() => time.set(new Date()), 87);

class Clock extends Component {
  constructor (model) {
    super();

    this.model = model;
  }

  pad (n, fn) {
    return this.model.as(fn).as(d =>d.toString().padStart(n, '0'));
  }

  render () {
    return h`<div style="${{
      fontFamily: 'monospace',
    }}">${
      this.pad(2, d => d.getHours())}:${
      this.pad(2, d => d.getMinutes())}:${
      this.pad(2, d => d.getSeconds())}.${
      this.pad(3, d => d.getMilliseconds())}
    `;
  }
}

attach(document.querySelector('.root'), new Clock(time));
