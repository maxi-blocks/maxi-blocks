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
    wavesTop,
} from '../../icons';

/**
 * Component
 */
const ShapeDivider = props => {

    const {
        position = 'top',
        shapeDividerOptions,
    } = props;

    let value = typeof shapeDividerOptions === 'object' ?
    shapeDividerOptions :
    JSON.parse(shapeDividerOptions);

    const showShapes = () => {
        let result;
        if (value.shapeStyle === '') result = '';
        if (value.shapeStyle === 'x1') result = wavesBottom;
        if (value.shapeStyle === 'x2') result = wavesTop;
        return result;
    }

    const classes = classnames(
        'maxi-shape-divider',
        `maxi-shape-divider__${position === 'top' ? 'top' : 'bottom'}`,
    );

    return (
        <div className={classes}>
            {showShapes()}
        </div>
    )
}

export default ShapeDivider;