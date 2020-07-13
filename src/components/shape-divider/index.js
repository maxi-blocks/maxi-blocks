/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';

/**
 * Styles and icons
 */
import './editor.scss';
import {
    wavesTop,
    wavesBottom,
    wavesTopOpacity,
    wavesBottomOpacity,
    waveTop,
    waveBottom,
    waveTopOpacity,
    waveBottomOpacity,
    triangleTop,
    triangleBottom,
    swishTop,
    swishBottom,
    swishTopOpacity,
    swishBottomOpacity,
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
        if (value.shapeStyle === 'waves-top') result = wavesTop;
        if (value.shapeStyle === 'waves-bottom') result = wavesBottom;
        if (value.shapeStyle === 'waves-top-opacity') result = wavesTopOpacity;
        if (value.shapeStyle === 'waves-bottom-opacity') result = wavesBottomOpacity;
        if (value.shapeStyle === 'wave-top') result = waveTop;
        if (value.shapeStyle === 'wave-bottom') result = waveBottom;
        if (value.shapeStyle === 'wave-top-opacity') result = waveTopOpacity;
        if (value.shapeStyle === 'wave-bottom-opacity') result = waveBottomOpacity;
        if (value.shapeStyle === 'triangle-top') result = triangleTop;
        if (value.shapeStyle === 'triangle-bottom') result = triangleBottom;
        if (value.shapeStyle === 'swish-top') result = swishTop;
        if (value.shapeStyle === 'swish-bottom') result = swishBottom;
        if (value.shapeStyle === 'swish-top-opacity') result = swishTopOpacity;
        if (value.shapeStyle === 'swish-bottom-opacity') result = swishBottomOpacity;
        return result;
    }

    const classes = classnames(
        'maxi-shape-divider',
        `maxi-shape-divider__${position === 'top' ? 'top' : 'bottom'}`,
    );

    return (
        !isEmpty(showShapes()) &&
            <div className={classes}>
                {showShapes()}
            </div>
    )
}

export default ShapeDivider;