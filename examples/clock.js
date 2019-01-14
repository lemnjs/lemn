import {h, attach, Model} from '..';

const time = new Model(new Date());
setInterval(() => time.set(new Date()), 87);

class Clock {
  constructor (model) {
    this.model = model;
  }

  pad (n, fn) {
    return this.model.as(fn).as(d => d.toString().padStart(n, '0'));
  }

  render () {
    return h`
    <section class="container" style="${{
      maxWidth: '20em',
      alignItems: 'center',
      display: 'flex',
      height: '100%',
    }}">
    <div style="${{
      fontSize: '2em',
      fontFamily: 'monospace',
      textAlign: 'center',
      width: '100%',
    }}">
      <div class="row">
        <div class="column">${this.pad(2, d => d.getHours())}</div>
        <div>:</div>
        <div class="column">${this.pad(2, d => d.getMinutes())}</div>
        <div>:</div>
        <div class="column">${this.pad(2, d => d.getSeconds())}</div>
        <div>.</div>
        <div class="column">${this.pad(3, d => d.getMilliseconds())}</div>
      </div>
    </div>
    </section>
    `;
  }
}

attach(document.querySelector('.root'), new Clock(time));
