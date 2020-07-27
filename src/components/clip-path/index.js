/**
 * External dependencies
 */
import classnames from 'classnames';
import { isObject } from 'lodash';

/**
 * Component
 */
const ClipPath = props => {
    const {
        clipPath,
        className,
        onChange,
        breakpoint
    } = props;

    const classes = classnames(
        'maxi-clip-path',
        className
    )

    return (
        <div
            className={classes}
        >

        </div>
    )
}