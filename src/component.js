import {rerender} from './lifecycle';

class Component {
    /* willRender () {} */

    /* didRender () {} */

    /* willDetach () {} */

    /* didAttach () {} */

    rerender () {
        return rerender(this);
    }

    render () {}
}

export {
    Component,
};
