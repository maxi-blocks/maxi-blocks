/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles and icons
 */
import './editor.scss';
import {
    wavesBottom,
} from '../../icons';

/**
 * Component
 */
const ShapeDivider = props => {

    const {
        position = 'top'
    } = props;

    const classes = classnames(
        'maxi-shape-divider',
        `maxi-shape-divider__${position === 'top' ? 'top' : 'bottom'}`,
    );

    // let value = typeof videoOptions === 'object' ?
    // videoOptions.videoOptions :
    // JSON.parse(videoOptions).videoOptions;

    return (
        <div className={classes}>
            {wavesBottom}
        </div>
    )
}

export default ShapeDivider;