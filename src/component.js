import {rerender} from './lifecycle';

/**
 * A lemn component.
 *
 * A component in lemn is any object with a `render` method. A component does
 * not need to explicitly subclass this class.
 */
class Component {
    /**
     * @member willRender
     * @memberof Component#
     */

    /**
     * @method didRender
     * @memberof Component#
     */

    /**
     * @method willDetach
     * @memberof Component#
     */

    /**
     * @method didAttach
     * @memberof Component#
     */

    /** Render and inject the output of this component soon. */
    rerender () {
        return rerender(this);
    }

    /** render a visualization of this component with `h`. */
    render () {}
}

export {
    Component,
};
