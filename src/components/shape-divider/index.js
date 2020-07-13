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
    slantTop,
    slantBottom,
    slantTopOpacity,
    slantBottomOpacity,
    peakTop,
    peakBottom,
    mountainsTop,
    mountainsBottom,
    mountainsTopOpacity,
    mountainsBottomOpacity,
    curveTop,
    curveBottom,
    curveTopOpacity,
    curveBottomOpacity,
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
        if (value.shapeStyle === 'slant-top') result = slantTop;
        if (value.shapeStyle === 'slant-bottom') result = slantBottom;
        if (value.shapeStyle === 'slant-top-opacity') result = slantTopOpacity;
        if (value.shapeStyle === 'slant-bottom-opacity') result = slantBottomOpacity;
        if (value.shapeStyle === 'peak-top') result = peakTop;
        if (value.shapeStyle === 'peak-bottom') result = peakBottom;
        if (value.shapeStyle === 'mountains-top') result = mountainsTop;
        if (value.shapeStyle === 'mountains-bottom') result = mountainsBottom;
        if (value.shapeStyle === 'mountains-top-opacity') result = mountainsTopOpacity;
        if (value.shapeStyle === 'mountains-bottom-opacity') result = mountainsBottomOpacity;
        if (value.shapeStyle === 'curve-top') result = curveTop;
        if (value.shapeStyle === 'curve-bottom') result = curveBottom;
        if (value.shapeStyle === 'curve-top-opacity') result = curveTopOpacity;
        if (value.shapeStyle === 'curve-bottom-opacity') result = curveBottomOpacity;
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