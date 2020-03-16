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
        maxWidth = props.attributes.maxWidth,
        widthUnit = props.attributes.widthUnit,
        blockWidth = props.attributes.blockWidth,
        minWidthUnit = props.attributes.minWidthUnit,
        minWidth = props.attributes.minWidth,
        maxHeightUnit = props.attributes.maxHeightUnit,
        maxHeight = props.attributes.maxHeight,
        heightUnit = props.attributes.heightUnit,
        blockHeight = props.attributes.blockHeight,
        minHeightUnit = props.attributes.minHeightUnit,
        minHeight = props.attributes.minHeight,
        setAttributes,
    } = props;

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
                onChange={(value) => setAttributes({ maxWidthUnit: value })}
            />
            <RangeControl
                label={__("Max Width", 'gutenberg-extra')}
                className={'gx-with-unit-control'}
                value={maxWidth}
                onChange={(value) => setAttributes({ maxWidth: value })}
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
                onChange={(value) => setAttributes({ widthUnit: value })}
            />
            <RangeControl
                label={__("Width", 'gutenberg-extra')}
                className={'gx-with-unit-control'}
                value={blockWidth}
                onChange={(value) => setAttributes({ blockWidth: value })}
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
                onChange={(value) => setAttributes({ minWidthUnit: value })}
            />
            <RangeControl
                label={__("Min Width", 'gutenberg-extra')}
                className={'gx-with-unit-control'}
                value={minWidth}
                onChange={(value) => setAttributes({ minWidth: value })}
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
                onChange={(value) => setAttributes({ maxHeightUnit: value })}
            />
            <RangeControl
                label={__("Max Height", 'gutenberg-extra')}
                className={'gx-with-unit-control'}
                value={maxHeight}
                onChange={(value) => setAttributes({ maxHeight: value })}
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
                onChange={(value) => setAttributes({ heightUnit: value })}
            />
            <RangeControl
                label={__("Height", 'gutenberg-extra')}
                className={'gx-with-unit-control'}
                value={blockHeight}
                onChange={(value) => setAttributes({ blockHeight: value })}
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
                onChange={(value) => setAttributes({ minHeightUnit: value })}
            />
            <RangeControl
                label={__("Min Height", 'gutenberg-extra')}
                className={'gx-with-unit-control'}
                value={minHeight}
                onChange={(value) => setAttributes({ minHeight: value })}
                min={0}
                allowReset={true}
            />
        </Fragment>
    )
}