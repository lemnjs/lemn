import {h, rerender, attach, Model, Store} from '..';

const store = new Store({
  'todos/index': [],
});

class ToDoItem {
  constructor (id) {
    this.id = id;
    this.model = store.model(id);
  }

  render () {
    const {model} = this;
    return h`<div>
    <input type="checkbox"
      checked="${model.as(({complete}) => complete)}"
      onchange="${ev => model.set({...model.data, complete: !model.data.complete})}">
      ${model.data.description}
    </div>`;
  }
}

class ToDoSet {
  constructor (id) {
    this.id = id;
    this.index = store.model(id);
  }

  render () {
    return h`${this.index.as(ids => ids.map(id => new ToDoItem(id)))}`;
  }
}

class TextInput {
  constructor (options = {name: 'name', model: new Model('')}) {
    this.options = options;
  }

  render () {
    const {name, model} = this.options;
    return h`<input type="text"
      name="${name}"
      value="${model.as(i => i)}"
      onkeyup="${ev => model.set(ev.currentTarget.value)}">`;
  }
}

class ToDoForm {
  constructor () {
    this.nextId = 0;
    this.submit = this.submit.bind(this);
    this.descriptionModel = new Model('');
  }

  submit (ev) {
    const id = this.nextId++;

    store.set(`todos/${id}`, {
      complete: false,
      description: this.descriptionModel.data,
    });
    this.descriptionModel.set('');

    store.set('todos/index', [
      ...(store.get('todos/index') || []),
      `todos/${id}`
    ]);

    ev.preventDefault();
    return false;
  }

  render () {
    return h`<form onsubmit="${this.submit}">
      ${new TextInput({name: 'description', model: this.descriptionModel})}
      <input type="button" value="add" onclick="${this.submit}">
    </form>`;
  }
}

class App {
  render () {
    const todosIndex = store.model('todos/index');
    const clearComplete = () => todosIndex.set(
      todosIndex.data.filter(id => !store.get(id).complete)
    );
    return h`
      <section class="container" style="margin-top: 2em">
      <input type="button" value="clear complete" onclick="${clearComplete}">
      ${new ToDoForm()}
      ${new ToDoSet('todos/index')}
      </section>
    `;
  }
}

attach(document.querySelector('.root'), new App);
