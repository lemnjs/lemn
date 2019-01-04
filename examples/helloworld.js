import {Component, h, attach, Store} from '..';

const store = new Store({
    name: 'world',
});

function encode(s) {
    return s.toString().replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

class App extends Component {
    render () {
        return h`
            <input placeholder="world"
                onkeyup="${ev => store.set('name', ev.currentTarget.value || 'world')}" />
            <div>hello ${store.to('name', encode)}</div>
        `;
    }
}

attach(document.querySelector('.root'), new App);
