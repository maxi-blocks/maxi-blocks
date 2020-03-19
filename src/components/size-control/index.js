const { __ } = wp.i18n;
const { Fragment } = wp.element;
const {	
    RadioControl, 
    RangeControl 
} = wp.components;

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
        default: '%',
    },
    blockWidth: {
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
    blockHeight: {
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
        blockWidth = props.attributes.blockWidth,
        onChangeBlockWidth = undefined,
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
        blockHeight = props.attributes.blockHeight,
        onChangeBlockHeight = undefined,
        minHeightUnit = props.attributes.minHeightUnit,
        onChangeMinHeightUnit = undefined,
        minHeight = props.attributes.minHeight,
        onChangeMinHeight = undefined,
        setAttributes,
    } = props;

    const onMaxWidthUnitChange = value => {
        console.log(value)
        if (typeof onChangeMaxWidthUnit != 'undefined' ) {
            onChangeMaxWidthUnit(value);
        }
        else {
            setAttributes({maxWidthUnit: value})
        }
    }

    const onMaxWidthChange = value => {
        if (typeof onChangeMaxWidth != 'undefined' ) {
            onChangeMaxWidth(value);
        }
        else {
            setAttributes({maxWidth: value})
        }
    }

    const onWidthUnitChange = value => {
        if (typeof onChangeWidthUnit != 'undefined' ) {
            onChangeWidthUnit(value);
        }
        else {
            setAttributes({widthUnit: value})
        }
    }

    const onWidthChange = value => {
        if (typeof onChangeWidth != 'undefined' ) {
            onChangeWidth(value);
        }
        else {
            setAttributes({width: value})
        }
    }

    const onBlockWidthChange = value => {
        if (typeof onChangeBlockWidth != 'undefined' ) {
            onChangeBlockWidth(value);
        }
        else {
            setAttributes({blockWidth: value})
        }
    }

    const onMinWidthUnitChange = value => {
        if (typeof onChangeMinWidthUnit != 'undefined' ) {
            onChangeMinWidthUnit(value);
        }
        else {
            setAttributes({minWidthUnit: value})
        }
    }


    const onMinWidthChange = value => {
        if (typeof onChangeMinWidth != 'undefined' ) {
            onChangeMinWidth(value);
        }
        else {
            setAttributes({minWidth: value})
        }
    }


    const onMaxHeightUnitChange = value => {
        if (typeof onChangeMaxHeightUnit != 'undefined' ) {
            onChangeMaxHeightUnit(value);
        }
        else {
            setAttributes({maxHeightUnit: value})
        }
    }


    const onMaxHeightChange = value => {
        if (typeof onChangeMaxHeight != 'undefined' ) {
            onChangeMaxHeight(value);
        }
        else {
            setAttributes({maxHeight: value})
        }
    }


    const onHeightUnitChange = value => {
        if (typeof onChangeHeightUnit != 'undefined' ) {
            onChangeHeightUnit(value);
        }
        else {
            setAttributes({heightUnit: value})
        }
    }


    const onBlockHeightChange = value => {
        if (typeof onChangeBlockHeight != 'undefined' ) {
            onChangeBlockHeight(value);
        }
        else {
            setAttributes({blockHeight: value})
        }
    }


    const onMinHeightUnitChange = value => {
        if (typeof onChangeMinHeightUnit != 'undefined' ) {
            onChangeMinHeightUnit(value);
        }
        else {
            setAttributes({minHeightUnit: value})
        }
    }


    const onMinHeightChange = value => {
        if (typeof onChangeMinHeight != 'undefined' ) {
            onChangeMinHeight(value);
        }
        else {
            setAttributes({minHeight: value})
        }
    }

    return (
        <Fragment>
            <RadioControl
                className={'gx-unit-control'}
                selected={maxWidthUnit}
                options={[
                    { label: 'PX', value: 'px' },
                    { label: 'EM', value: 'em' },
                    { label: 'VW', value: 'vw' },
                    { label: '%', value: '%' },
                ]}
                onChange={value => onMaxWidthUnitChange(value)}
            />
            <RangeControl
                label={__("Max Width", 'gutenberg-extra')}
                className={'gx-with-unit-control'}
                value={maxWidth}
                onChange={value => onMaxWidthChange(value)}
                min={0}
                allowReset={true}
                initialPosition={0}
            />
            <RadioControl
                className={'gx-unit-control'}
                selected={widthUnit}
                options={[
                    { label: 'PX', value: 'px' },
                    { label: 'EM', value: 'em' },
                    { label: 'VW', value: 'vw' },
                    { label: '%', value: '%' },
                ]}
                onChange={value => onWidthUnitChange(value)}
            />
            <RangeControl
                label={__("Width", 'gutenberg-extra')}
                className={'gx-with-unit-control'}
                value={blockWidth}
                onChange={value => onBlockWidthChange(value)}
                min={0}
                allowReset={true}
            />
            <RadioControl
                className={'gx-unit-control'}
                selected={minWidthUnit}
                options={[
                    { label: 'PX', value: 'px' },
                    { label: 'EM', value: 'em' },
                    { label: 'VW', value: 'vw' },
                    { label: '%', value: '%' },
                ]}
                onChange={value => onMinWidthUnitChange(value)}
            />
            <RangeControl
                label={__("Min Width", 'gutenberg-extra')}
                className={'gx-with-unit-control'}
                value={minWidth}
                onChange={value => onMinWidthChange(value)}
                min={0}
                allowReset={true}
            />
            <RadioControl
                className={'gx-unit-control'}
                selected={maxHeightUnit}
                options={[
                    { label: 'PX', value: 'px' },
                    { label: 'EM', value: 'em' },
                    { label: 'VH', value: 'vh' },
                    { label: '%', value: '%' },
                ]}
                onChange={value => onMaxHeightUnitChange(value)}
            />
            <RangeControl
                label={__("Max Height", 'gutenberg-extra')}
                className={'gx-with-unit-control'}
                value={maxHeight}
                onChange={value => onMaxHeightChange(value)}
                min={0}
                allowReset={true}
            />
            <RadioControl
                className={'gx-unit-control'}
                selected={heightUnit}
                options={[
                    { label: 'PX', value: 'px' },
                    { label: 'EM', value: 'em' },
                    { label: 'VH', value: 'vh' },
                    { label: '%', value: '%' },
                ]}
                onChange={value => onHeightUnitChange(value)}
            />
            <RangeControl
                label={__("Height", 'gutenberg-extra')}
                className={'gx-with-unit-control'}
                value={blockHeight}
                onChange={value => onBlockHeightChange(value)}
                allowReset={true}
            />
            <RadioControl
                className={'gx-unit-control'}
                selected={minHeightUnit}
                options={[
                    { label: 'PX', value: 'px' },
                    { label: 'EM', value: 'em' },
                    { label: 'VH', value: 'vh' },
                    { label: '%', value: '%' },
                ]}
                onChange={value => onMinHeightUnitChange(value)}
            />
            <RangeControl
                label={__("Min Height", 'gutenberg-extra')}
                className={'gx-with-unit-control'}
                value={minHeight}
                onChange={value => onMinHeightChange(value)}
                min={0}
                allowReset={true}
            />
        </Fragment>
    )
}