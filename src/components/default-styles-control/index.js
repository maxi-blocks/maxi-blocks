/**
 * WordPress dependencies
 */
const { Button } = wp.components;

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles and icons
 */
import './editor.scss';

/**
 * Component
 */
const DefaultStylesControl = props => {

    const {
        className,
        items,
    } = props;

    const classes = classnames(
        'maxi-defaultstyles-control',
        className
    )

    return (
        <div
            className={classes}
        >
            {
                items.map(item => {
                    const classesItem = classnames(
                        'maxi-defaultstyles-control__button',
                        item.className
                    );

                    return (
                        <Button
                            className={classesItem}
                            onClick={item.onChange}
                        >
                            {item.content}
                        </Button>
                    )
                })
            }
        </div>
    )
}

export default DefaultStylesControl;