import {rerender} from './lifecycle';

export class Store {
    constructor (data = {}) {
        this.data = {};
        for (const key in data) {
            this.data[key] = new Model(data[key]);
        }
    }

    get (id) {
        return id in this.data ? this.data[id].data : {};
    }

    set (id, data) {
        const model = this.data[id] = this.data[id] || new Model();
        model.set(data);
    }

    connect (id, fn) {
        const model = this.data[id] = this.data[id] || new Model();
        return new Connect(model, fn);
    }

    toJSON () {
        return this.data;
    }
}

class Model {
    constructor (data = {}) {
        this.activeChildren = [];
        this.data = data;
    }

    set (data) {
        this.data = data;
        this.activeChildren.forEach(child => child.update());
    }

    unbind (child) {
        this.activeChildren = this.activeChildren.filter(c => c !== child);
    }

    bind (child) {
        this.activeChildren = [...this.activeChildren, child];
    }

    maybeInit () {}

    toJSON () {
        return this.data;
    }
}

class Connect {
    constructor (parent, fn) {
        this.parent = parent;
        this.fn = fn;
        this.activeChildren = null;
        this.oldParentData = null;
        this.data = null;
        this.maybeInit();
    }

    willDetach () {
        if (this.attached) {
            this.parent.unbind(this);
            this.attached = false;
            this.oldParentData = null;
            this.data = null;
        }
    }

    didAttach () {
        if (!this.attached) {
            this.attached = true;
            this.parent.bind(this);
        }
    }

    connect (fn) {
        return new Connect(this, fn);
    }

    unbind (child) {
        this.activeChildren = this.activeChildren.filter(c => c !== child);
        this.parent.unbind(this);
    }

    bind (child) {
        this.parent.bind(this);
        this.activeChildren = [...(this.activeChildren || []), child];
    }

    maybeInit () {
        this.parent.maybeInit();
        if (this.oldParentData !== this.parent.data) {
            this.oldParentData = this.parent.data;
            this.data = this.fn(this.parent.data, this.data) || this.data;
        }
    }

    update () {
        if (this.oldParentData !== this.parent.data) {
            this.oldParentData = this.parent.data;
            const out = this.fn(this.parent.data, this.data);
            if (out !== null) {
                this.data = out;
                (this.activeChildren || []).forEach(child => child.update());
                if (this.attached) {
                    rerender(this);
                }
            }
        }
    }

    render () {
        return this.data;
    }
}
