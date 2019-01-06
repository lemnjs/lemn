import {h, rerender, attach, Model, Store} from '..';

const store = new Store({
  'todos/index': [],
});

class ToDoItem {
  constructor (id) {
    this.id = id;
    const model = store.model(this.id);
    this.dom = h`<div>
      <input type="checkbox"
        checked="${model.as(({complete}) => complete)}"
        onchange="${ev => model.set({...model.data, complete: !model.data.complete})}">
      ${model.data.description}
    </div>`;
    // this.dom = Object.assign(Array.from(this.dom.childNodes), {components: this.dom.components});
    this.dom = Object.assign(this.dom.firstChild, {components: this.dom.components});
  }

  render () {
    // if (this.once) {
    //   const range = document.createRange();
    //   range.setStartBefore(this.ref.start.dom);
    //   range.setEndAfter(this.ref.end.dom);
    //   debugger;
    //   // return range.extractContents();
    // }
    // this.once = true;
    const model = store.model(this.id);
    return h`<div>
      <input type="checkbox"
        checked="${model.as(({complete}) => complete)}"
        onchange="${ev => model.set({...model.data, complete: !model.data.complete})}">
      ${model.data.description}
    </div>`;
    return this.dom;
    // return Object.assign(this.dom.cloneNode(), {components: this.dom.components});
  }
}

class ToDoForm {
  constructor () {
    this.nextId = 0;
    this.submit = this.submit.bind(this);
    this.liveState = new Model({description: ''});
  }

  submit (ev) {
    const id = this.nextId++;
    store.set(`todos/${id}`, {
      complete: false,
      description: this.liveState.data.description,
    });
    this.liveState.set({description: ''});
    store.set('todos/index', [...(store.get('todos/index') || []), `todos/${id}`]);
    ev.preventDefault();
    return false;
  }

  render () {
    return h`<form onsubmit="${this.submit}">
      <input type="text" name="description"
        value="${this.liveState.as(({description}) => description)}"
        onkeyup="${ev => this.liveState.set({...this.liveState.data, description: ev.currentTarget.value})}">
      <input type="button" value="add" onclick="${this.submit}">
    </form>`;
  }
}

class ToDoSet {
  constructor (id) {
    this.id = id;
    this.index = store.model(id);
    this.data = [];
    this.push();
  }

  push () {
    this.data = this.index.data.map(id => this.data.find(item => item.id === id) || new ToDoItem(id));
    rerender(this);
  }

  willDetach () {
    this.index.unbind(this);
  }

  didAttach () {
    this.index.bind(this);
  }

  render () {
    return h`${this.data}`;
  }
}

class App {
  render () {
    return h`
      <input type="button" value="clear complete"
        onclick="${() => store.set('todos/index', store.get('todos/index').filter(id => !store.get(id).complete))}">
      ${new ToDoForm()}
      ${new ToDoSet('todos/index')}
    `;
  }
}

attach(document.querySelector('.root'), new App);
