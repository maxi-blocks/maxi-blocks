/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const {	
    RadioControl, 
    RangeControl 
} = wp.components;

/**
 * External dependencies
 */
import MiniSizeControl from '../mini-size-control';

export const sizeControlAttributes = {
    maxWidthUnit: {
        type: 'string',
        default: 'px',
    },
    maxWidth: {
        type: 'number',
    },
    widthUnit: {
        type: 'string',
        default: 'px',
    },
    width: {
        type: 'number',
    },
    minWidthUnit: {
        type: 'string',
        default: 'px',
    },
    minWidth: {
        type: 'number',
    },
    maxHeightUnit: {
        type: 'string',
        default: 'px',
    },
    maxHeight: {
        type: 'number',
    },
    heightUnit: {
        type: 'string',
        default: '%',
    },
    height: {
        type: 'number',
    },
    minHeightUnit: {
        type: 'string',
        default: 'px',
    },
    minHeight: {
        type: 'number',
    },
}

export const SizeControl = ( props ) => {
    const {
        maxWidthUnit = props.attributes.maxWidthUnit,
        onChangeMaxWidthUnit = undefined,
        maxWidth = props.attributes.maxWidth,
        onChangeMaxWidth = undefined,
        widthUnit = props.attributes.widthUnit,
        onChangeWidthUnit = undefined,
        width = props.attributes.width,
        onChangeWidth = undefined,
        minWidthUnit = props.attributes.minWidthUnit,
        onChangeMinWidthUnit = undefined,
        minWidth = props.attributes.minWidth,
        onChangeMinWidth = undefined,
        maxHeightUnit = props.attributes.maxHeightUnit,
        onChangeMaxHeightUnit = undefined,
        maxHeight = props.attributes.maxHeight,
        onChangeMaxHeight = undefined,
        heightUnit = props.attributes.heightUnit,
        onChangeHeightUnit = undefined,
        height = props.attributes.height,
        onChangeHeight = undefined,
        minHeightUnit = props.attributes.minHeightUnit,
        onChangeMinHeightUnit = undefined,
        minHeight = props.attributes.minHeight,
        onChangeMinHeight = undefined,
        setAttributes,
    } = props;

    const onChangeValue = (target, value, callback) => {
        if (typeof callback != 'undefined' ) {
            callback(value);
        }
        else {
            setAttributes({[target]: value})
        }
    }

    return (
        <Fragment>
            <MiniSizeControl 
                label={__("Max Width", 'gutenberg-extra')}
                unit={maxWidthUnit}
                onChangeUnit={value => onChangeValue('maxWidthUnit', value, onChangeMaxWidthUnit)}
                value={maxWidth}
                onChangeValue={value => onChangeValue('maxWidth', value, onChangeMaxWidth)}
            />
            <MiniSizeControl 
                label={__("Width", 'gutenberg-extra')}
                unit={widthUnit}
                onChangeUnit={value => onChangeValue('widthUnit', value, onChangeWidthUnit)}
                value={width}
                onChangeValue={value => onChangeValue('width', value, onChangeWidth)}
            />
            <MiniSizeControl 
                label={__("Min Width", 'gutenberg-extra')}
                unit={minWidthUnit}
                onChangeUnit={value => onChangeValue('minWidthUnit', value, onChangeMinWidthUnit)}
                value={minWidth}
                onChangeValue={value => onChangeValue('minWidth', value, onChangeMinWidth)}
            />
            <MiniSizeControl 
                label={__("Max Height", 'gutenberg-extra')}
                unit={maxHeightUnit}
                onChangeUnit={value => onChangeValue('maxHeightUnit', value, onChangeMaxHeightUnit)}
                value={maxHeight}
                onChangeValue={value => onChangeValue('maxHeight', value, onChangeMaxHeight)}
            />
            <MiniSizeControl 
                label={__("Height", 'gutenberg-extra')}
                unit={heightUnit}
                onChangeUnit={value => onChangeValue('heightUnit', value, onChangeHeightUnit)}
                value={height}
                onChangeValue={value => onChangeValue('height', value, onChangeHeight)}
            />
            <MiniSizeControl 
                label={__("Min Height", 'gutenberg-extra')}
                unit={minHeightUnit}
                onChangeUnit={value => onChangeValue('minHeightUnit', value, onChangeMinHeightUnit)}
                value={minHeight}
                onChangeValue={value => onChangeValue('minHeight', value, onChangeMinHeight)}
            />
        </Fragment>
    )
}