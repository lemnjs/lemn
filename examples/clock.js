import {Component, h, attach, Model} from '..';

function pad (n) {
  return function (d) {
    return d.toString().padStart(n, '0');
  };
}

class Clock extends Component {
  constructor () {
    super();

    this.model = new Model(new Date());
  }

  willDetach () {
    clearInterval(this.intervalId);
  }

  didAttach () {
    this.intervalId = setInterval(() => this.model.set(new Date()), 87);
  }

  pad (n, fn) {
    return this.model.as(fn).as(pad(n));
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

attach(document.querySelector('.root'), new Clock);
