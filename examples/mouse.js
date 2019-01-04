import {Component, h, attach, Store} from '..';

const store = new Store({
    hover: false,
});

class App extends Component {
    render () {
        return h`
            <span
              onmouseover="${ev => store.set('hover', true)}"
              onmouseout="${ev => store.set('hover', false)}"
              style="${store.to('hover', b => ({padding: '0.2em', background: b ? 'green' : 'red'}))}" />
            ${store.to('hover', b => b ? 'green' : 'red')}
            </span>
        `;
    }
}

attach(document.querySelector('.root'), new App);
