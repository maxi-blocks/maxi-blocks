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
        attributes: {
            maxWidthUnit,
            maxWidth,
            widthUnit,
            blockWidth,
            minWidthUnit,
            minWidth,
            maxHeightUnit,
            maxHeight,
            heightUnit,
            blockHeight,
            minHeightUnit,
            minHeight
        },
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
                label="Max Width"
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
                label="Width"
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
                label="Min Width"
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
                label="Max Height"
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
                label="Height"
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
                label="Min Height"
                className={'gx-with-unit-control'}
                value={minHeight}
                onChange={(value) => setAttributes({ minHeight: value })}
                min={0}
                allowReset={true}
            />
        </Fragment>
    )
}