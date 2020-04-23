/**
 * WordPress dependencies
 */
const { RadioControl } = wp.components;

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
const NormalHoverControl = props => {
    const {
        selector,
        className,
        onChange
    } = props;

    let classes = classnames('gx-normalhover-control', className);

    return (
        <RadioControl
            className={classes}
            selected={selector}
            options={[
                { label: 'Normal', value: 'normal' },
                { label: 'Hover', value: 'hover' },
            ]}
            onChange={onChange}
        />
    )
}

export default NormalHoverControl;