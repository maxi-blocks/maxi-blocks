/**
 * WordPress dependencies
 */
const {
    Button,
    Icon
} = wp.components;

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles and icons
 */
import './editor.scss';
import { toolbarReplaceImage } from '../../icons';

/**
 * Component
 */
const DefaultStylesControl = props => {

    const {
        className,
        onChangeDefault,
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
            <Button
                className='maxi-defaultstyles-control__button'
                onClick={onChangeDefault}
            >
                <Icon
                    className='maxi-defaultstyles-control__button__icon'
                    icon={toolbarReplaceImage}
                />
            </Button>
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