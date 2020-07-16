/**
 * Internal dependencies
 */
import __experimentalAxisControl from '../axis-control';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Component
 */
const MarginPaddingControl = props => {
    const {
        value,
        className,
        onChange,
        breakpoint = 'general'
    } = props;

    const classes = classnames(
        'maxi-block-margin',
        className
    )

    return (
        <__experimentalAxisControl
            className={classes}
            values={value}
            onChange={val => onChange(val)}
            breakpoint={breakpoint}
        />
    )
}

export default MarginPaddingControl;