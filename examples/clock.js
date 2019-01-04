import {Component, h, attach, Store} from '..';

function compare (n, o) {
    return n === o ? null : n;
}

function pad (n) {
    return function (d) {
        return d.toString().padStart(n, '0');
    };
}

const store = new Store({
    time: new Date(),
});

setInterval(() => store.set('time', new Date()), 87);

class Clock extends Component {
    pad (n, fn) {
        return store.to('time', fn).to(compare).to(pad(n));
    }

    render () {
        const time = store.to('time', i => i);
        const pad2 = c => c.to(d => d.toString().padStart(2, '0'));
        const pad3 = c => c.to(d => d.toString().padStart(3, '0'));
        return h`<div style="font-family: monospace">${
            this.pad(2, d => d.getHours())}:${
            this.pad(2, d => d.getMinutes())}:${
            this.pad(2, d => d.getSeconds())}.${
            this.pad(3, d => d.getMilliseconds())}
        `;
    }
}

attach(document.querySelector('.root'), new Clock);
