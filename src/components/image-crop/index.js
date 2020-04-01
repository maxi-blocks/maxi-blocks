/**
 * Wordpress dependencies
 */
const { __ } = wp.i18n;
const {
    Component,
    Fragment
} = wp.element;
const {
    withSelect,
    dispatch,
    select
} = wp.data;
const {
    FocalPointPicker,
    Spinner,
} = wp.components;
const { MediaUpload } = wp.blockEditor;

/**
 * External dependencies
 */
import { BlockBorder } from '../block-border/index';
import AlignmentControl from '../alignment-control/index';
import MiniSizeControl from '../mini-size-control';
import { PopoverControl } from '../popover';
import { BoxShadow } from '../box-shadow';
import Typography from '../typography/';
import iconsSettings from '../icons/icons-settings.js';
import ColorControl from '../color-control/';
import {
    capitalize,
    isEmpty,
    isNil,
    isNumber,
} from 'lodash';

/**
 * Attributes
 */
const imageCropAttributes = {
    imageCrop: {
        type: 'string',
        default: '{"url":"","dimension":{"width":"","height":""},"focalPoint":{"x":"","y":""}}'
    }
}

/**
 * Block
 */
const ImageCrop = props => {

    const {
        imageOptions,
        onChange
    } = props;

    let value = typeof imageOptions === 'object' ? imageOptions : JSON.parse(imageOptions);

    return(
        <Fragment>
            <canvas width="200" height="100">
            
            </canvas>
            <label>
                Height
                <input type="number" id="height"/>
            </label>
            <label>
                Weight
                <input type="number" id="height"/>
            </label>
        </Fragment>
    )
}

export default ImageCrop;